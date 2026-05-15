# Palestinian Arabic Lab

Teacher-focused Palestinian Arabic lesson dashboard.

## What This App Does

- Manage lesson templates from the Teacher Dashboard.
- Sync lesson content to Firebase Firestore.
- Create and manage student profiles.
- Teach from interactive lesson screens.
- Use dialogue, vocabulary, grammar, practice, homework, PDFs, and whiteboard tools.
- Keep local JSON backups.

Booking, subscriptions, Google Calendar, Google Apps Script, reCAPTCHA, and WhatsApp upgrade flows have been removed.

## Main Files

- `index.html` - app shell
- `styles.css` - app styles
- `js/app.js` - module bootstrap
- `js/logic/interactions.js` - main app interactions
- `js/cloud/lessonsCloud.js` - Firestore lesson template sync
- `js/logic/teacherPracticeEditor.js` - teacher content editor helpers
- `firestore.rules` - Firestore rules for users, teachers, students, lessons, and errors

## Setup

1. Configure Firebase in `js/config.js` or `js/config.runtime.js`.
2. Enable Firebase Authentication and Firestore.
3. Publish `firestore.rules` in Firebase Console.
4. Open `index.html` or serve the folder locally.

No Google Calendar or booking setup is required.
