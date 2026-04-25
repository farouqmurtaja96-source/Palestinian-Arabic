function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getConfig_() {
  const props = PropertiesService.getScriptProperties();
  const preplyRaw = props.getProperty('PREPLY_CALENDAR_ID') || '';
  return {
    primaryCalendarId: props.getProperty('PRIMARY_CALENDAR_ID') || 'primary',
    preplyCalendarId: normalizeCalendarId_(preplyRaw),
    defaultTimeZone: props.getProperty('DEFAULT_TIMEZONE') || Session.getScriptTimeZone() || 'Africa/Cairo',
    notificationEmail: props.getProperty('NOTIFICATION_EMAIL') || '',
  };
}

function normalizeEmail_(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidEmail_(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail_(value));
}

function sendPlainEmail_(recipient, subject, body) {
  const email = normalizeEmail_(recipient);
  if (!email) return false;
  MailApp.sendEmail(email, subject, body);
  return true;
}

function sendBookingNotificationEmail_(recipient, details) {
  const subject = 'New lesson booking: ' + (details.name || 'Student');
  const body = [
    'A new lesson booking was created.',
    '',
    'Student: ' + (details.name || ''),
    'Email: ' + (details.email || ''),
    'Phone: ' + (details.phone || ''),
    'Slot: ' + (details.slotLabel || ''),
    'Timezone: ' + (details.timeZone || ''),
    'Booking ID: ' + (details.bookingId || ''),
    '',
    'Notes:',
    details.notes || 'None'
  ].join('\n');
  return sendPlainEmail_(recipient, subject, body);
}

function sendStudentConfirmationEmail_(recipient, details) {
  const subject = 'Your lesson booking is confirmed';
  const body = [
    'Hello ' + (details.name || 'Student') + ',',
    '',
    'Your lesson has been booked successfully.',
    '',
    'Date & time: ' + (details.slotLabel || ''),
    'Teacher timezone: ' + (details.timeZone || ''),
    'Booking ID: ' + (details.bookingId || ''),
    'Cancellation code: ' + (details.cancellationToken || ''),
    '',
    'If you need to cancel, use the booking ID and cancellation code on the booking page.',
    'If you need to change the booking, please reply to this email or contact us on WhatsApp.',
    '',
    'Thank you.'
  ].join('\n');
  return sendPlainEmail_(recipient, subject, body);
}

function sendCancellationNotificationEmail_(recipient, details) {
  const isReschedule = details.reason === 'reschedule';
  const subject = (isReschedule ? 'Lesson booking rescheduled: ' : 'Lesson booking canceled: ') + (details.bookingId || '');
  const body = [
    isReschedule ? 'A student started a reschedule. The old lesson booking was canceled.' : 'A lesson booking was canceled.',
    '',
    'Booking ID: ' + (details.bookingId || ''),
    'Student: ' + (details.name || ''),
    'Email: ' + (details.email || ''),
    'Phone: ' + (details.phone || ''),
    'Slot: ' + (details.slotLabel || ''),
    'Timezone: ' + (details.timeZone || ''),
    '',
    'Calendar event deleted: ' + (details.calendarDeleted ? 'yes' : 'no')
  ].join('\n');
  return sendPlainEmail_(recipient, subject, body);
}

function normalizeCalendarId_(value) {
  const raw = (value || '').trim();
  if (!raw) return '';
  if (raw.indexOf('calendar.google.com') === -1) return raw;
  const srcMatch = raw.match(/[?&]src=([^&]+)/i);
  return srcMatch && srcMatch[1] ? decodeURIComponent(srcMatch[1]) : raw;
}

function parseRequest_(e) {
  let body = {};
  try {
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    }
  } catch (err) {}
  const params = (e && e.parameter) || {};
  return Object.assign({}, params, body);
}

function listEvents_(calendarId, start, end) {
  const cal = CalendarApp.getCalendarById(calendarId);
  if (!cal) return [];
  return cal.getEvents(start, end).map(function (event) {
    return {
      id: event.getId(),
      title: event.getTitle(),
      start: event.getStartTime().getTime(),
      end: event.getEndTime().getTime(),
    };
  });
}

function buildBusyBlocks_(events, timeZone) {
  return events.map(function (event) {
    const start = new Date(event.start);
    const end = new Date(event.end);
    return {
      date: Utilities.formatDate(start, timeZone, 'yyyy-MM-dd'),
      start: Utilities.formatDate(start, timeZone, 'HH:mm'),
      end: Utilities.formatDate(end, timeZone, 'HH:mm'),
      note: event.title || 'Busy',
      sourceEventId: event.id || '',
    };
  });
}

function doGet(e) {
  return handleRequest_(e);
}

function doPost(e) {
  return handleRequest_(e);
}

function handleRequest_(e) {
  try {
    const req = parseRequest_(e);
    const action = req.action || 'test';
    const config = getConfig_();

    if (action === 'test') {
      const primary = CalendarApp.getCalendarById(config.primaryCalendarId);
        return jsonOut({
          success: !!primary,
          message: primary ? 'Apps Script backend is reachable.' : 'Primary calendar not found.',
          timeZone: config.defaultTimeZone,
          preplyCalendarId: config.preplyCalendarId || '',
          notificationEmailConfigured: !!config.notificationEmail,
        });
    }

    if (action === 'getBusy') {
      const days = Math.max(1, Math.min(90, Number(req.days || 30)));
      const timeZone = req.timeZone || config.defaultTimeZone;
      const start = new Date();
      const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
      let events = listEvents_(config.primaryCalendarId, start, end);
      if (config.preplyCalendarId) {
        events = events.concat(listEvents_(config.preplyCalendarId, start, end));
      }
      return jsonOut({
        success: true,
        message: 'Busy times loaded.',
        busyBlocks: buildBusyBlocks_(events, timeZone),
        counts: {
          total: events.length,
          preplyEnabled: !!config.preplyCalendarId,
        }
      });
    }

    if (action === 'deleteEvent') {
      const eventId = req.eventId || '';
      if (!eventId) {
        return jsonOut({ success: false, message: 'Missing event ID.' });
      }
      const cal = CalendarApp.getCalendarById(config.primaryCalendarId);
      if (!cal) {
        return jsonOut({ success: false, message: 'Primary calendar not found.' });
      }
      const event = cal.getEventById(eventId);
      if (!event) {
        return jsonOut({ success: true, message: 'Calendar event was already gone.' });
      }
      event.deleteEvent();
      return jsonOut({ success: true, message: 'Calendar event deleted.' });
    }

    if (action === 'cancelBooking') {
      const eventId = req.eventId || '';
      const bookingId = req.bookingId || '';
      const timeZone = req.timeZone || config.defaultTimeZone;
      const teacherEmail = normalizeEmail_(req.teacherEmail || config.notificationEmail);
      const cancelReason = req.cancelReason || '';
      const slot = Number(req.slot || 0);
      const slotLabel = slot ? Utilities.formatDate(new Date(slot), timeZone, 'yyyy-MM-dd HH:mm') : '';
      var calendarDeleted = false;
      var calendarDeleteError = '';
      if (eventId) {
        try {
          const cal = CalendarApp.getCalendarById(config.primaryCalendarId);
          if (!cal) {
            calendarDeleteError = 'Primary calendar not found.';
          } else {
            const event = cal.getEventById(eventId);
            if (event) {
              event.deleteEvent();
              calendarDeleted = true;
            } else {
              calendarDeleted = true;
            }
          }
        } catch (deleteErr) {
          calendarDeleteError = deleteErr && deleteErr.message ? deleteErr.message : String(deleteErr);
        }
      } else {
        calendarDeleted = true;
      }

      var cancellationNotificationSent = false;
      var cancellationNotificationError = '';
      try {
        cancellationNotificationSent = sendCancellationNotificationEmail_(teacherEmail, {
          bookingId: bookingId,
          name: req.name || 'Guest',
          email: req.email || '',
          phone: req.phone || '',
          timeZone: timeZone,
          slotLabel: slotLabel,
          calendarDeleted: calendarDeleted,
          reason: cancelReason
        });
        if (!cancellationNotificationSent) {
          cancellationNotificationError = teacherEmail ? 'Teacher cancellation email was not accepted.' : 'Teacher email is missing.';
        }
      } catch (mailErr) {
        cancellationNotificationError = mailErr && mailErr.message ? mailErr.message : String(mailErr);
      }

      return jsonOut({
        success: true,
        message: 'Cancellation processed.',
        calendarDeleted: calendarDeleted,
        calendarDeleteError: calendarDeleteError,
        cancellationNotificationSent: cancellationNotificationSent,
        cancellationNotificationError: cancellationNotificationError
      });
    }

    if (action === 'createBooking') {
      const slot = Number(req.slot || 0);
      const durationMinutes = Math.max(30, Math.min(180, Number(req.durationMinutes || 50)));
      const timeZone = req.timeZone || config.defaultTimeZone;
      const name = req.name || 'Student';
      const email = req.email || '';
      const phone = req.phone || '';
      const notes = req.notes || '';
      const bookingId = req.bookingId || '';
      const cancellationToken = req.cancellationToken || '';
      const teacherEmail = normalizeEmail_(req.teacherEmail || config.notificationEmail);
      if (!slot) {
        return jsonOut({ success: false, message: 'Missing slot timestamp.' });
      }
      const start = new Date(slot);
      const end = new Date(slot + durationMinutes * 60 * 1000);
      const cal = CalendarApp.getCalendarById(config.primaryCalendarId);
      if (!cal) {
        return jsonOut({ success: false, message: 'Primary calendar not found.' });
      }
      const lock = LockService.getScriptLock();
      try {
        lock.waitLock(10000);
      } catch (lockErr) {
        return jsonOut({ success: false, message: 'Booking system is busy. Please try again.' });
      }
      var event = null;
      var calendarInviteSent = false;
      var calendarInviteError = '';
      try {
        var conflicts = cal.getEvents(start, end);
        if (config.preplyCalendarId) {
          var preplyCal = CalendarApp.getCalendarById(config.preplyCalendarId);
          if (preplyCal) {
            conflicts = conflicts.concat(preplyCal.getEvents(start, end));
          }
        }
        if (conflicts.length) {
          return jsonOut({ success: false, code: 'calendar-conflict', message: 'This time is no longer available.' });
        }
        const description = [
          'Booked from Palestinian Arabic Lab',
          'Booking ID: ' + bookingId,
          'Student: ' + name,
          'Email: ' + email,
          'Phone: ' + phone,
          'Notes: ' + notes,
          'Timezone: ' + timeZone
        ].join('\n');
        event = cal.createEvent('Lesson with ' + name, start, end, { description: description });
        try {
          if (isValidEmail_(email)) {
            event.addGuest(normalizeEmail_(email));
            calendarInviteSent = true;
          } else {
            calendarInviteError = 'Student email is invalid for calendar invite.';
          }
        } catch (guestErr) {
          calendarInviteError = guestErr && guestErr.message ? guestErr.message : String(guestErr);
        }
      } finally {
        lock.releaseLock();
      }
      var notificationSent = false;
      var studentConfirmationSent = false;
      var notificationError = '';
      var studentConfirmationError = '';
      var slotLabel = Utilities.formatDate(start, timeZone, 'yyyy-MM-dd HH:mm');
      try {
        notificationSent = sendBookingNotificationEmail_(teacherEmail, {
          name: name,
          email: email,
          phone: phone,
          notes: notes,
          bookingId: bookingId,
          timeZone: timeZone,
          slotLabel: slotLabel
        });
        if (!notificationSent) {
          notificationError = teacherEmail ? 'Teacher notification email was not accepted.' : 'Teacher email is missing.';
        }
      } catch (mailErr) {
        notificationError = mailErr && mailErr.message ? mailErr.message : String(mailErr);
      }
      try {
        studentConfirmationSent = sendStudentConfirmationEmail_(email, {
          name: name,
          bookingId: bookingId,
          timeZone: timeZone,
          slotLabel: slotLabel,
          cancellationToken: cancellationToken
        });
        if (!studentConfirmationSent) {
          studentConfirmationError = email ? 'Student confirmation email was not accepted.' : 'Student email is missing.';
        }
      } catch (mailErr) {
        studentConfirmationError = mailErr && mailErr.message ? mailErr.message : String(mailErr);
      }
      return jsonOut({
        success: true,
        message: 'Booking added to Google Calendar.',
        eventId: event.getId(),
        calendarInviteSent: calendarInviteSent,
        calendarInviteError: calendarInviteError,
        notificationSent: notificationSent,
        studentConfirmationSent: studentConfirmationSent,
        notificationError: notificationError,
        studentConfirmationError: studentConfirmationError,
      });
    }

    return jsonOut({ success: false, message: 'Unknown action.' });
  } catch (err) {
    return jsonOut({ success: false, message: err.message || String(err) });
  }
}
