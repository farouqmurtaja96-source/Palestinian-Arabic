export async function loadBookingStatusByEmail({
    db,
    email,
    bookingStatusList,
    bookingStatusMsg,
    hashEmail,
    escapeHtml,
    formatSlotTime,
}) {
    if (!bookingStatusList) return;
    bookingStatusList.innerHTML = "";
    if (!email) {
        if (bookingStatusMsg) bookingStatusMsg.textContent = "Please enter your email.";
        return;
    }
    try {
        const emailHash = await hashEmail(email);
        let snap;
        try {
            snap = await db
                .collection("publicBookings")
                .where("emailHash", "==", emailHash)
                .orderBy("slot", "desc")
                .limit(10)
                .get();
        } catch {
            snap = await db.collection("publicBookings").where("emailHash", "==", emailHash).get();
        }
        const rows = [];
        snap.forEach((doc) => {
            const data = doc.data();
            if (!data || !data.slot) return;
            rows.push({ id: doc.id, ...data });
        });
        rows.sort((a, b) => (b.slot || 0) - (a.slot || 0));
        if (!rows.length) {
            bookingStatusList.innerHTML = "<div class=\"small-note\">No bookings found for this email.</div>";
            return;
        }
        bookingStatusList.innerHTML = rows
            .slice(0, 10)
            .map((b) => {
                const status = (b.status || "pending").toLowerCase();
                const label = status === "canceled" ? "Canceled" : status === "rescheduled" ? "Rescheduled" : status === "pending" ? "Pending" : "Booked";
                const isActive = status === "booked" || status === "rescheduled";
                const canReschedule = isActive && Number(b.slot || 0) - Date.now() > 12 * 60 * 60 * 1000;
                const rescheduleTitle = canReschedule ? "Choose a new time for this booking" : "Rescheduling closes 12 hours before the lesson";
                return `
                    <div class="booking-status-item">
                        <div>Booking ID: <code>${escapeHtml(b.id)}</code></div>
                        <div><strong>${escapeHtml(formatSlotTime(b.slot))}</strong></div>
                        <div>Status: ${escapeHtml(label)}</div>
                        ${isActive ? `
                            <div class="booking-status-actions">
                                <button class="btn btn--ghost btn--sm" type="button" data-booking-action="cancel" data-booking-id="${escapeHtml(b.id)}" data-cancel-token-hash="${escapeHtml(b.cancelTokenHash || "")}">Cancel Lesson</button>
                                <button class="btn btn--outline btn--sm" type="button" data-booking-action="reschedule" data-booking-id="${escapeHtml(b.id)}" data-cancel-token-hash="${escapeHtml(b.cancelTokenHash || "")}" data-booking-slot="${escapeHtml(String(b.slot || ""))}" ${canReschedule ? "" : "disabled"} title="${escapeHtml(rescheduleTitle)}">Reschedule</button>
                            </div>
                            ${canReschedule ? "" : "<div class=\"small-note\">Rescheduling is available until 12 hours before the lesson.</div>"}
                        ` : ""}
                    </div>
                `;
            })
            .join("");
    } catch {
        if (bookingStatusMsg) bookingStatusMsg.textContent = "Unable to load booking status right now.";
    }
}

const DEFAULT_TEACHER_EMAIL = "farouqmurtaja96@gmail.com";

function resolveTeacherEmail(contactSettings, bookingSettings) {
    return (contactSettings?.email || bookingSettings?.contactEmail || DEFAULT_TEACHER_EMAIL).trim();
}

function buildBookingLockSegments(slotMs, occupiedMinutes) {
    const stepMs = 30 * 60 * 1000;
    const totalMs = Math.max(30, Number(occupiedMinutes) || 50) * 60 * 1000;
    const segments = [];
    for (let segment = slotMs; segment < slotMs + totalMs; segment += stepMs) {
        segments.push(segment);
    }
    return segments;
}

async function reserveGuestBooking({
    db,
    bookingRef,
    bookingData,
    occupiedMinutes,
}) {
    const segments = buildBookingLockSegments(bookingData.slot, occupiedMinutes);
    const lockRefs = segments.map((segment) => ({
        segment,
        ref: db.collection("bookingLocks").doc(String(segment)),
    }));
    const lockIds = lockRefs.map((item) => item.ref.id);

    await db.runTransaction(async (tx) => {
        for (const item of lockRefs) {
            const snap = await tx.get(item.ref);
            const lockData = snap.exists ? (snap.data() || {}) : {};
            if (snap.exists && lockData.status !== "canceled") {
                throw new Error("booking-slot-taken");
            }
        }

        const dataWithLocks = {
            ...bookingData,
            lockIds,
        };

        tx.set(bookingRef, dataWithLocks);
        lockRefs.forEach((item) => {
            tx.set(item.ref, {
                bookingId: bookingRef.id,
                slot: bookingData.slot,
                segment: item.segment,
                status: "booked",
                source: "guest",
                createdAt: bookingData.createdAt,
                cancelTokenHash: bookingData.cancelTokenHash,
            });
        });
    });

    return { lockIds };
}

function generateCancellationToken() {
    const bytes = new Uint8Array(18);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
        .map((b) => b.toString(36).padStart(2, "0"))
        .join("")
        .slice(0, 24)
        .toUpperCase();
}

async function releaseReservedLocks({ db, lockIds, cancelTokenHash }) {
    if (!Array.isArray(lockIds) || !lockIds.length) return;
    const batch = db.batch();
    lockIds.forEach((lockId) => {
        if (!lockId) return;
        batch.set(
            db.collection("bookingLocks").doc(String(lockId)),
            {
                status: "canceled",
                canceledAt: Date.now(),
                cancelTokenHash,
            },
            { merge: true }
        );
    });
    await batch.commit();
}

export async function submitGuestBooking({
    db,
    firebase,
    bookingSettings,
    contactSettings,
    getLocalTimezone,
    selectedDate,
    selectedTime,
    formValues,
    bookingSubmit,
    bookingSubmitLabel,
    bookingMsg,
    bookingSuccessModal,
    bookingSuccessText,
    bookingStatusEmail,
    findBookingConflict,
    buildBookingSelects,
    hashEmail,
    createBookingViaAppsScript,
    cancelBookingViaAppsScript,
    loadBookingStatus,
    isLocalDevHost,
    rescheduleTarget,
}) {
    function withDefinedValues(obj) {
        return Object.fromEntries(
            Object.entries(obj).filter(([, value]) => value !== undefined)
        );
    }

    const {
        name,
        email,
        phone,
        notes,
        reasonLabels,
        reason,
        level,
        lessonsPerMonth,
        honeypot,
        studentTimeZone,
        studentLocale,
        countryHint,
        recaptchaReady,
    } = formValues;

    if (!selectedDate || !selectedTime) {
        if (bookingMsg) bookingMsg.textContent = "Please select a date and time.";
        return;
    }

    if (honeypot) {
        if (bookingMsg) bookingMsg.textContent = "Please clear the hidden field.";
        return;
    }

    const lastTs = Number(localStorage.getItem("pal_arabic_last_booking_ts") || "0");
    if (lastTs && Date.now() - lastTs < 30000) {
        if (bookingMsg) bookingMsg.textContent = "Please wait 30 seconds before booking again.";
        return;
    }

    if (!name || !email || !phone) {
        if (bookingMsg) bookingMsg.textContent = "Please fill name, email, and phone.";
        return;
    }

    if (name.length < 2) {
        if (bookingMsg) bookingMsg.textContent = "Please enter your full name.";
        return;
    }

    if (!recaptchaReady) {
        if (bookingMsg) bookingMsg.textContent = "Please complete the reCAPTCHA.";
        return;
    }

    const [hours, minutes] = selectedTime.split(':').map(Number);
    const slotDate = new Date(selectedDate);
    slotDate.setHours(hours, minutes, 0, 0);
    const selectedSlot = slotDate.getTime();
    if (!Number.isFinite(selectedSlot) || selectedSlot <= Date.now() + (6 * 60 * 60 * 1000)) {
        if (bookingMsg) bookingMsg.textContent = "Please choose a time at least 6 hours from now.";
        return;
    }

    try {
        if (bookingSubmit) {
            bookingSubmit.disabled = true;
            bookingSubmit.classList.add("is-loading");
        }
        if (bookingSubmitLabel) bookingSubmitLabel.textContent = "Booking...";
        if (bookingMsg) bookingMsg.textContent = "Booking your lesson...";

        const slot = slotDate.toLocaleString();
        await buildBookingSelects({ forceRefresh: true });
        const conflict = await findBookingConflict(selectedSlot);
        if (conflict) {
            if (bookingMsg) bookingMsg.textContent = "That time was just taken. Please choose another slot.";
            await buildBookingSelects({ forceRefresh: true });
            return;
        }

        const tzLabel = bookingSettings.timezone || getLocalTimezone() || "Local time";
        const combinedNotes = [
            notes,
            reason ? `Reasons: ${reason}` : "",
            level ? `Level: ${level}` : "",
            lessonsPerMonth ? `Lessons per month: ${lessonsPerMonth}` : "",
            `Timezone: ${tzLabel}`,
            studentTimeZone ? `Student timezone: ${studentTimeZone}` : "",
            studentLocale ? `Student locale: ${studentLocale}` : "",
        ].filter(Boolean).join("\n");

        const bookingRef = db.collection("bookings").doc();
        let calendarSynced = false;
        let googleCalendarEventId = null;
        let teacherEmailSent = false;
        let studentEmailSent = false;
        let studentCalendarInviteSent = false;
        let appsScriptMessage = "";
        let appsScriptSucceeded = false;
        let teacherEmailError = "";
        let studentEmailError = "";
        let studentCalendarInviteError = "";
        const now = Date.now();
        const occupiedMinutes = bookingSettings.totalSlotMinutes || bookingSettings.slotMinutes || 50;
        const cancellationToken = generateCancellationToken();
        const cancelTokenHash = await hashEmail(cancellationToken);
        const bookingData = withDefinedValues({
            name,
            email,
            phone,
            notes: combinedNotes,
            source: "guest",
            reason,
            reasonLabels,
            level,
            lessonsPerMonth,
            studentTimeZone,
            studentLocale,
            countryHint,
            slot: selectedSlot,
            status: "booked",
            calendarSynced: false,
            googleCalendarEventId: null,
            cancelTokenHash,
            timezone: bookingSettings.timezone || getLocalTimezone(),
            createdAt: now,
            updatedAt: now,
            history: [
                {
                    at: now,
                    action: "created",
                    by: "student",
                },
            ],
        });
        let lockIds = [];

        try {
            const reservation = await reserveGuestBooking({
                db,
                bookingRef,
                bookingData,
                occupiedMinutes,
            });
            lockIds = reservation.lockIds || [];
        } catch (reserveErr) {
            if (reserveErr?.message === "booking-slot-taken") {
                if (bookingMsg) bookingMsg.textContent = "That time was just taken. Please choose another slot.";
                await buildBookingSelects({ forceRefresh: true });
                return;
            }
            throw reserveErr;
        }

        const teacherEmail = resolveTeacherEmail(contactSettings, bookingSettings);
        const appsScriptSync = await createBookingViaAppsScript?.({
            bookingId: bookingRef.id,
            slot: selectedSlot,
            durationMinutes: bookingSettings.slotMinutes || 50,
            timeZone: bookingSettings.timezone || getLocalTimezone() || "Africa/Cairo",
            teacherEmail,
            name,
            email,
            phone,
            notes: combinedNotes,
            studentTimeZone,
            studentLocale,
            cancellationToken,
        });
        if (appsScriptSync?.success) {
            appsScriptSucceeded = true;
            calendarSynced = true;
            googleCalendarEventId = appsScriptSync.eventId || null;
            teacherEmailSent = !!appsScriptSync.notificationSent;
            studentEmailSent = !!appsScriptSync.studentConfirmationSent;
            studentCalendarInviteSent = !!appsScriptSync.calendarInviteSent;
            teacherEmailError = appsScriptSync.notificationError || "";
            studentEmailError = appsScriptSync.studentConfirmationError || "";
            studentCalendarInviteError = appsScriptSync.calendarInviteError || "";
            appsScriptMessage = appsScriptSync.message || "";
        } else if (appsScriptSync?.code === "calendar-conflict") {
            await releaseReservedLocks({ db, lockIds, cancelTokenHash });
            await bookingRef.set({
                status: "canceled",
                canceledAt: Date.now(),
                updatedAt: Date.now(),
                history: [
                    ...bookingData.history,
                    {
                        at: Date.now(),
                        action: "calendar_conflict_after_reservation",
                        by: "system",
                    },
                ],
            }, { merge: true });
            if (bookingMsg) bookingMsg.textContent = "That time was just taken. Please choose another slot.";
            await buildBookingSelects({ forceRefresh: true });
            return;
        } else {
            appsScriptMessage = appsScriptSync?.message || "";
        }

        await bookingRef.set({
            calendarSynced,
            googleCalendarEventId,
            notificationSent: teacherEmailSent,
            studentConfirmationSent: studentEmailSent,
            calendarInviteSent: studentCalendarInviteSent,
            notificationError: teacherEmailError,
            studentConfirmationError: studentEmailError,
            calendarInviteError: studentCalendarInviteError,
            updatedAt: Date.now(),
        }, { merge: true });

        const emailHash = await hashEmail(email);
        await db.collection("publicBookings").doc(bookingRef.id).set({
            slot: selectedSlot,
            status: "booked",
            emailHash,
            createdAt: now,
            updatedAt: Date.now(),
            calendarSynced,
            googleCalendarEventId,
            notificationSent: teacherEmailSent,
            studentConfirmationSent: studentEmailSent,
            calendarInviteSent: studentCalendarInviteSent,
            notificationError: teacherEmailError,
            studentConfirmationError: studentEmailError,
            calendarInviteError: studentCalendarInviteError,
            lockIds,
            cancelTokenHash,
            source: "guest",
        });

        if (!teacherEmailSent && !teacherEmailError) {
            teacherEmailError = appsScriptSucceeded
                ? "Teacher email was not sent by Apps Script."
                : "Teacher email could not be sent.";
        }
        if (!studentEmailSent && !studentEmailError && !studentCalendarInviteSent) {
            studentEmailError = appsScriptSucceeded
                ? "Student confirmation email was not sent by Apps Script."
                : "Student confirmation email could not be sent.";
        }

        if (bookingMsg) {
            if (teacherEmailSent && (studentEmailSent || studentCalendarInviteSent)) {
                bookingMsg.textContent = studentEmailSent
                    ? "Booked! Teacher and student emails were sent."
                    : "Booked! The teacher email was sent and the student got a calendar invite.";
            } else if (teacherEmailSent) {
                bookingMsg.textContent = "Booked! The teacher email was sent.";
            } else if (studentEmailSent || studentCalendarInviteSent) {
                bookingMsg.textContent = studentEmailSent
                    ? "Booked! A confirmation email was sent."
                    : "Booked! A calendar invite was sent to the student.";
            } else if (appsScriptMessage) {
                const details = [teacherEmailError, studentEmailError, studentCalendarInviteError, appsScriptMessage].filter(Boolean).join(" | ");
                bookingMsg.textContent = `Booked successfully, but email sending did not complete: ${details}`;
            } else {
                bookingMsg.textContent = "Booked successfully, but no email confirmation was sent.";
            }
        }
        if (bookingSuccessModal && bookingSuccessText) {
            const tz = bookingSettings.timezone || getLocalTimezone() || "Local time";
            const emailStatus = teacherEmailSent && (studentEmailSent || studentCalendarInviteSent)
                ? studentEmailSent
                    ? " Teacher and student emails were sent."
                    : " The teacher email was sent and the student got a calendar invite."
                : teacherEmailSent
                    ? " The teacher email was sent."
                    : (studentEmailSent || studentCalendarInviteSent)
                        ? " A confirmation email was sent to your inbox."
                        : appsScriptMessage
                            ? ` Email sending did not complete: ${[teacherEmailError, studentEmailError, studentCalendarInviteError, appsScriptMessage].filter(Boolean).join(" | ")}`
                            : " No email was sent.";
            bookingSuccessText.textContent = `Your lesson is confirmed for ${slot}. Timezone: ${tz}.${emailStatus}`;
            bookingSuccessModal.classList.add("modal--open");
        }
        localStorage.setItem("pal_arabic_last_booking_ts", String(Date.now()));
        localStorage.setItem("pal_arabic_last_booking_email", email);
        if (bookingStatusEmail) bookingStatusEmail.value = email;
        if (rescheduleTarget?.bookingId && rescheduleTarget?.cancellationTokenHash) {
            try {
                await cancelGuestBooking({
                    db,
                    firebase,
                    bookingId: rescheduleTarget.bookingId,
                    cancellationTokenHash: rescheduleTarget.cancellationTokenHash,
                    teacherEmail: resolveTeacherEmail(contactSettings, bookingSettings),
                    cancelReason: "reschedule",
                    bookingCancelMsg: null,
                    hashEmail,
                    cancelBookingViaAppsScript,
                    buildBookingSelects: null,
                    loadBookingStatus: null,
                    bookingStatusEmail,
                });
                if (bookingMsg) bookingMsg.textContent = "Rescheduled successfully. Your old lesson was canceled and the new lesson is booked.";
            } catch (rescheduleErr) {
                console.error("Old booking cancellation after reschedule failed:", rescheduleErr);
                if (bookingMsg) bookingMsg.textContent = "The new lesson was booked, but the old lesson could not be canceled automatically. Please contact the teacher.";
            }
        }
        await loadBookingStatus(email);
        if (!isLocalDevHost() && window.grecaptcha && typeof window.grecaptcha.reset === "function") {
            window.grecaptcha.reset();
        }
        await buildBookingSelects({ forceRefresh: true });
        return true;
    } catch (err) {
        console.error("Booking failed with error:", err);
        const isPermissionError = err?.code === "permission-denied" ||
            String(err?.message || "").toLowerCase().includes("missing or insufficient permissions");
        if (bookingMsg) {
            bookingMsg.textContent = isPermissionError
                ? "Booking failed because Firestore permissions are not updated yet. Please publish the latest Firestore rules and try again."
                : "Booking failed. Please try again.";
        }
    } finally {
        if (bookingSubmit) bookingSubmit.classList.remove("is-loading");
        if (bookingSubmitLabel) bookingSubmitLabel.textContent = "Book Now";
        if (bookingSubmit && window.selectedDate && window.selectedTime) bookingSubmit.disabled = false;
    }
}

export async function cancelGuestBooking({
    db,
    firebase,
    bookingId,
    cancellationToken,
    cancellationTokenHash,
    teacherEmail,
    cancelReason,
    bookingCancelMsg,
    hashEmail,
    cancelBookingViaAppsScript,
    buildBookingSelects,
    loadBookingStatus,
    bookingStatusEmail,
}) {
    const cleanId = (bookingId || "").trim();
    const cleanToken = (cancellationToken || "").trim();
    const providedTokenHash = (cancellationTokenHash || "").trim();
    if (!cleanId || (!cleanToken && !providedTokenHash)) {
        if (bookingCancelMsg) bookingCancelMsg.textContent = "Select a booking to cancel.";
        return;
    }

    if (bookingCancelMsg) bookingCancelMsg.textContent = "Canceling booking...";
    const cancelTokenHash = providedTokenHash || await hashEmail(cleanToken);
    const bookingRef = db.collection("bookings").doc(cleanId);
    const publicRef = db.collection("publicBookings").doc(cleanId);
    const publicSnap = await publicRef.get();
    if (!publicSnap.exists) {
        if (bookingCancelMsg) bookingCancelMsg.textContent = "Booking not found.";
        return;
    }
    const booking = publicSnap.data() || {};
    if (booking.cancelTokenHash !== cancelTokenHash) {
        if (bookingCancelMsg) bookingCancelMsg.textContent = "Cancellation code does not match.";
        return;
    }
    if ((booking.status || "").toLowerCase() === "canceled") {
        if (bookingCancelMsg) bookingCancelMsg.textContent = "This booking is already canceled.";
        return;
    }

    const appsScriptResult = await cancelBookingViaAppsScript?.({
        bookingId: cleanId,
        eventId: booking.googleCalendarEventId || "",
        teacherEmail: (teacherEmail || DEFAULT_TEACHER_EMAIL).trim(),
        cancelReason: cancelReason || "",
        name: "Guest",
        email: (bookingStatusEmail?.value || "").trim(),
        phone: "",
        slot: booking.slot,
        timeZone: booking.timezone || "",
    });
    const calendarDeleted = !!appsScriptResult?.calendarDeleted;
    const cancellationNotificationSent = !!appsScriptResult?.cancellationNotificationSent;
    const cancellationNotificationError = appsScriptResult?.cancellationNotificationError || appsScriptResult?.message || "";
    const now = Date.now();

    const lockIds = Array.isArray(booking.lockIds) ? booking.lockIds : [];
    await db.runTransaction(async (tx) => {
        const latestPublicSnap = await tx.get(publicRef);
        const latestPublic = latestPublicSnap.exists ? (latestPublicSnap.data() || {}) : {};
        if (latestPublic.cancelTokenHash !== cancelTokenHash) {
            throw new Error("cancel-token-mismatch");
        }
        tx.set(bookingRef, {
            status: "canceled",
            canceledAt: now,
            updatedAt: now,
            cancelTokenHash,
            calendarDeleted,
            cancellationNotificationSent,
            cancellationNotificationError,
            history: firebase.firestore.FieldValue.arrayUnion({
                at: now,
                action: "canceled",
                by: "guest",
            }),
        }, { merge: true });
        tx.set(publicRef, {
            status: "canceled",
            updatedAt: now,
            canceledAt: now,
            cancelTokenHash,
        }, { merge: true });
        lockIds.forEach((lockId) => {
            if (!lockId) return;
            tx.set(db.collection("bookingLocks").doc(String(lockId)), {
                status: "canceled",
                canceledAt: now,
                cancelTokenHash,
            }, { merge: true });
        });
    });

    if (bookingCancelMsg) {
        bookingCancelMsg.textContent = cancellationNotificationSent
            ? "Booking canceled. The teacher was notified."
            : "Booking canceled. Teacher notification may need manual follow-up.";
    }
    await buildBookingSelects?.({ forceRefresh: true });
    const email = (bookingStatusEmail?.value || booking.email || "").trim();
    if (email) await loadBookingStatus?.(email);
}
