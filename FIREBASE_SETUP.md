# Firebase Setup

1. Open Firebase Console.
2. Enable Authentication.
3. Enable Firestore.
4. Add your Firebase web config to `js/config.js` or `js/config.runtime.js`.
5. Copy `firestore.rules` into Firestore Database > Rules.
6. Publish the rules.

The app currently uses Firebase for:

- teacher/student user records
- teacher student profiles
- lesson template sync
- error logs

Booking, Google Calendar, and subscription collections are no longer used.
