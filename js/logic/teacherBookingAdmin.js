export async function renderTeacherBookings({
    db,
    teacherBookingList,
    bookingCache,
    escapeHtml,
    formatSlotTime,
}) {
    if (!teacherBookingList) return bookingCache;
    teacherBookingList.innerHTML = "<div class=\"small-note\">Loading bookings...</div>";
    bookingCache.clear();
    try {
        const now = Date.now() - 3600000;
        let snap;
        try {
            snap = await db
                .collection("bookings")
                .where("slot", ">=", now)
                .orderBy("slot")
                .limit(100)
                .get();
        } catch {
            snap = await db
                .collection("bookings")
                .orderBy("slot")
                .limit(200)
                .get();
        }
        const items = [];
        snap.forEach((doc) => {
            const data = doc.data();
            if (!data || !data.slot) return;
            if (data.slot < now) return;
            items.push({ id: doc.id, ...data });
        });
        if (!items.length) {
            teacherBookingList.innerHTML = "<div class=\"small-note\">No upcoming bookings.</div>";
            return bookingCache;
        }
        teacherBookingList.innerHTML = items
            .map((b) => {
                bookingCache.set(b.id, b);
                b = {
                    ...b,
                    name: escapeHtml(b.name || "Student"),
                    email: escapeHtml(b.email || ""),
                    phone: escapeHtml(b.phone || ""),
                };
                const status = b.status || "booked";
                const statusClass =
                    status === "canceled"
                        ? "booking-item__status booking-item__status--canceled"
                        : status === "rescheduled"
                            ? "booking-item__status booking-item__status--rescheduled"
                            : "booking-item__status";
                const statusLabel = status === "canceled"
                    ? "canceled"
                    : status === "rescheduled"
                        ? "rescheduled"
                        : "booked";
                const rescheduledFrom = b.rescheduledFrom
                    ? `<div class="booking-item__meta">From: ${escapeHtml(formatSlotTime(b.rescheduledFrom))}</div>`
                    : "";
                return `
                    <div class="booking-item" data-booking-id="${b.id}">
                        <div class="booking-item__main">
                            <div class="booking-item__title">${escapeHtml(b.name || "Student")}</div>
                            <div class="booking-item__meta">${b.email || ""} ${b.phone ? " | " + b.phone : ""}</div>
                            <div class="booking-item__time">${escapeHtml(formatSlotTime(b.slot))}</div>
                            ${rescheduledFrom}
                            <div class="${statusClass}">${escapeHtml(statusLabel)}</div>
                        </div>
                        <div class="booking-item__actions">
                            <button class="btn btn--ghost btn--sm" data-action="cancel" ${status === "canceled" ? "disabled" : ""}>Cancel</button>
                            <button class="btn btn--outline btn--sm" data-action="reschedule" ${status === "canceled" ? "disabled" : ""}>Reschedule</button>
                        </div>
                        <div class="booking-item__resched"></div>
                    </div>
                `;
            })
            .join("");
        return bookingCache;
    } catch {
        teacherBookingList.innerHTML = "<div class=\"small-note\">Unable to load bookings.</div>";
        return bookingCache;
    }
}

export async function openReschedulePanel({
    itemEl,
    booking,
    getAvailableSlots,
    escapeHtml,
}) {
    const resched = itemEl.querySelector(".booking-item__resched");
    if (!resched) return;
    if (resched.classList.contains("is-open")) {
        resched.classList.remove("is-open");
        resched.innerHTML = "";
        return;
    }
    resched.classList.add("is-open");
    resched.innerHTML = "<div class=\"small-note\">Loading slots...</div>";
    const slots = await getAvailableSlots(30, { excludeBookingId: booking.id });
    const options = slots.slice(0, 80).map((s) => {
        const ts = s.getTime();
        return `<option value="${ts}">${escapeHtml(s.toLocaleString())}</option>`;
    });
    if (!options.length) {
        resched.innerHTML = "<div class=\"small-note\">No available slots.</div>";
        return;
    }
    resched.innerHTML = `
        <select class="booking-resched-select">${options.join("")}</select>
        <button class="btn btn--primary btn--sm" data-action="confirm-reschedule">Confirm</button>
        <button class="btn btn--ghost btn--sm" data-action="close-reschedule">Close</button>
    `;
}

export async function cancelBooking({ db, firebase, bookingId }) {
    const bookingSnap = await db.collection("bookings").doc(bookingId).get();
    const bookingData = bookingSnap.exists ? (bookingSnap.data() || {}) : {};
    await db.collection("bookings").doc(bookingId).set(
        {
            status: "canceled",
            canceledAt: Date.now(),
            history: firebase.firestore.FieldValue.arrayUnion({
                at: Date.now(),
                action: "canceled",
                by: "teacher",
            }),
        },
        { merge: true }
    );
    await db.collection("publicBookings").doc(bookingId).set(
        {
            status: "canceled",
            updatedAt: Date.now(),
        },
        { merge: true }
    );
    await releaseBookingLocks({ db, lockIds: bookingData.lockIds });
}

export async function rescheduleBooking({
    db,
    firebase,
    bookingId,
    booking,
    newSlot,
    occupiedMinutes = 60,
}) {
    const newLockIds = await reserveBookingLocks({
        db,
        bookingId,
        slot: newSlot,
        occupiedMinutes,
    });
    try {
        await db.collection("bookings").doc(bookingId).set(
            {
                slot: newSlot,
                status: "rescheduled",
                rescheduledFrom: booking.slot,
                rescheduledAt: Date.now(),
                updatedAt: Date.now(),
                calendarSynced: false,
                lockIds: newLockIds,
                history: firebase.firestore.FieldValue.arrayUnion({
                    at: Date.now(),
                    action: "rescheduled",
                    by: "teacher",
                    from: booking.slot,
                    to: newSlot,
                }),
            },
            { merge: true }
        );
        await db.collection("publicBookings").doc(bookingId).set(
            {
                slot: newSlot,
                status: "rescheduled",
                updatedAt: Date.now(),
                calendarSynced: false,
            },
            { merge: true }
        );
        await releaseBookingLocks({ db, lockIds: booking.lockIds });
    } catch (err) {
        await releaseBookingLocks({ db, lockIds: newLockIds });
        throw err;
    }
}

export async function clearAllBookings({ db }) {
    let bookingSnap;
    do {
        bookingSnap = await db.collection("bookings").limit(300).get();
        for (const doc of bookingSnap.docs) {
            await db.collection("bookings").doc(doc.id).delete();
        }
    } while (!bookingSnap.empty);

    let publicSnap;
    do {
        publicSnap = await db.collection("publicBookings").limit(300).get();
        for (const doc of publicSnap.docs) {
            await db.collection("publicBookings").doc(doc.id).delete();
        }
    } while (!publicSnap.empty);

    let lockSnap;
    do {
        lockSnap = await db.collection("bookingLocks").limit(300).get();
        for (const doc of lockSnap.docs) {
            await db.collection("bookingLocks").doc(doc.id).delete();
        }
    } while (!lockSnap.empty);
}

function buildBookingLockSegments(slotMs, occupiedMinutes) {
    const stepMs = 30 * 60 * 1000;
    const totalMs = Math.max(30, Number(occupiedMinutes) || 60) * 60 * 1000;
    const segments = [];
    for (let segment = slotMs; segment < slotMs + totalMs; segment += stepMs) {
        segments.push(segment);
    }
    return segments;
}

async function reserveBookingLocks({ db, bookingId, slot, occupiedMinutes }) {
    const segments = buildBookingLockSegments(slot, occupiedMinutes);
    const lockRefs = segments.map((segment) => ({
        segment,
        ref: db.collection("bookingLocks").doc(String(segment)),
    }));
    const lockIds = lockRefs.map((item) => item.ref.id);
    await db.runTransaction(async (tx) => {
        for (const item of lockRefs) {
            const snap = await tx.get(item.ref);
            if (snap.exists) {
                throw new Error("booking-slot-taken");
            }
        }
        lockRefs.forEach((item) => {
            tx.set(item.ref, {
                bookingId,
                slot,
                segment: item.segment,
                status: "booked",
                source: "guest",
                createdAt: Date.now(),
            });
        });
    });
    return lockIds;
}

async function releaseBookingLocks({ db, lockIds }) {
    if (!Array.isArray(lockIds) || !lockIds.length) return;
    const batch = db.batch();
    lockIds.forEach((lockId) => {
        if (!lockId) return;
        batch.delete(db.collection("bookingLocks").doc(String(lockId)));
    });
    await batch.commit();
}
