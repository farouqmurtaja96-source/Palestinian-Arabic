# Palestinian Arabic Lab - Project Recreation Prompt

## Project Overview
Create a **teacher-focused Palestinian Arabic lesson dashboard** designed for interactive language learning. The app provides structured lessons across multiple proficiency levels with interactive tools including dialogue practice, vocabulary learning, grammar explanations, and practice exercises. **Important: This version has NO authentication/login system** – the app opens directly to the main interface.

## Core Requirements

### 1. Tech Stack
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Data Storage**: Firebase Firestore (optional—can use localStorage for development)
- **Features**: No authentication required; localStorage for student profiles and progress
- **PDF Export**: jsPDF library for exporting lessons and practice materials
- **Drawing Tools**: Canvas API for whiteboard functionality

### 2. Main Screens & Navigation

#### Home/Dashboard Screen
- Display hero section with app title: "Learn Palestinian Arabic Naturally"
- Navigation bar with links: Home, Student Profiles, Teacher Dashboard
- Direct access to main features (no login required)

#### Student Profile Manager
- List all student profiles stored locally
- Create new student profile with:
  - Student name (text input)
  - Learning goals (multi-select checkboxes: Travel, Study, Family, Visit Palestine, Work, For Fun)
  - Initial proficiency level (Beginner, Pre-Intermediate, Intermediate)
- Select a profile to begin learning
- Store profiles in localStorage or IndexedDB
- Display current student info and allow switching between profiles

#### Lesson & Unit Selection Screen
- Display lessons organized by:
  - **Proficiency Levels**: Beginner, Pre-Intermediate, Intermediate
  - **Units per Level**: 
    - Beginner: Greetings, Family, Food & Drink, Daily Routine
    - Pre-Intermediate: Shopping, Health, Work & Study, Apartment, Weather & Small Talk
    - Intermediate: Plans, Hobbies, Opinions, Feelings, Complaints
- Show unit cards with lesson counts
- Allow selection of specific lessons within each unit
- Include "Arabic Letters" screen as separate option
- Sync button to refresh lesson templates from Firestore (optional)

#### Interactive Lesson Screen
Structured lesson with tabs:
1. **Overview** – Lesson introduction and learning objectives
2. **Vocabulary** – Core and extra vocabulary with:
   - Arabic word (script)
   - English meaning
   - Phonetic transcription (Arabeezy)
   - Example sentences (Arabic + English)
   - Clickable for detailed modal view
3. **Dialogue** – Conversation examples with speaker roles
4. **Grammar** – Explanation of grammar rules with examples
5. **Translation** – Sentence translation exercises
6. **Practice** – Micro-check quizzes (multiple choice, fill-in, etc.)
7. **Homework** – Assignable exercises for students
8. **Quick Review** – Summary of key points
9. **Teacher Notes** (visible only in teacher mode) – Teaching tips

**Lesson Features:**
- Progress bar showing completion percentage
- Font size controls (A−, A+)
- Teacher mode toggle (shows teacher notes)
- Whiteboard tool for writing/drawing explanations
- "Save spot" to remember last viewed section
- Export lesson as PDF (with options for sections and versions)
- Hide/show English or Arabic text
- Back navigation to unit selection

#### Arabic Letters Screen
- Display all 28 Arabic letters in a grid
- Click any letter to see details modal showing:
  - Letter shape (isolated form)
  - Romanization (e.g., "Baa")
  - Sound description (e.g., "b")
  - Sun/Moon letter classification
  - Four letter forms: isolated, initial, medial, final
  - Example word using each form
  - Writing steps
- Navigation: Previous/Next through letters
- Letters tab and Exercises tab
- Export letters as PDF

#### Branching Dialogue (Decision-based Practice)
- Same units as regular lessons but dialogue-only format
- Student makes choices at dialogue branches
- Shows consequences based on choices
- Undo/Restart buttons
- Hide Arabic/English text toggles
- Font size controls

#### Teacher Dashboard
- **Lesson Management:**
  - List all lesson templates
  - Search lessons by name/level/unit
  - Edit lesson sections (vocabulary, dialogue, grammar, etc.)
  - Add new lesson templates
  - Delete lessons
  - Select lesson → select section → edit content
  
- **Student Account Management:**
  - Create student account (form with email/password—stores in local system)
  - Note: Teacher can manually set up student profiles
  
- **Backup & Data Safety:**
  - Export all data as JSON backup
  - Import JSON backup to restore data
  - Backup reminder options (daily, every 2 days, weekly)
  - Display last backup timestamp

### 3. Data Structure

#### Lesson Object
```javascript
{
  id: "unique-id",
  level: "Beginner|Pre-Intermediate|Intermediate",
  unit: "Unit Name",
  lessonNumber: 1,
  title: "Lesson Title",
  overview: { ar: "...", en: "..." },
  vocabulary: [
    {
      ar: "كلمة",
      en: "word",
      arabeezy: "kalima",
      hint: "...",
      examples: [
        { ar: "...", en: "..." }
      ]
    }
  ],
  dialogue: [
    { speaker: "Person A", ar: "...", en: "..." }
  ],
  grammar: [
    { title: "Rule", explanation: "...", examples: [...] }
  ],
  translation: [
    { ar: "...", en: "...", type: "sentence|phrase" }
  ],
  practice: [
    { type: "multiple-choice|fill-in", question: "...", options: [...], answer: "..." }
  ],
  homework: [...],
  teacherNotes: "..."
}
```

#### Student Profile Object
```javascript
{
  id: "unique-id",
  name: "Student Name",
  goals: ["Travel", "Study"],
  initialLevel: "Beginner",
  progress: {
    "lessonId": {
      completedSections: ["overview", "vocabulary"],
      lastViewed: "2024-01-15",
      savedSpot: "vocabulary"
    }
  },
  whiteboardData: {
    "lessonId": "canvas-data-url"
  }
}
```

### 4. Key Features

✅ **Vocabulary Learning**
- Modal popup for detailed word study
- Progress tracking for word mastery
- Hide/show meanings, examples, romanization
- Navigation between words

✅ **Interactive Practice**
- Micro-check quizzes embedded in lessons
- Multiple question types: multiple-choice, fill-in-the-blank, matching
- Immediate feedback (correct/incorrect)
- Progress tracking

✅ **Whiteboard/Drawing Tool**
- Canvas-based drawing for lesson explanations
- Color and brush size controls
- Clear and Download PNG buttons
- Per-lesson persistence (stored in localStorage)

✅ **PDF Export**
- Export lessons with customizable sections
- Student or teacher version (teacher version shows notes)
- Export Arabic letters reference
- jsPDF + HTML2Canvas for rendering

✅ **Local Data Persistence**
- Store student profiles in localStorage/IndexedDB
- Save lesson progress per student
- Backup/restore entire dataset as JSON
- Whiteboard drawings saved per lesson

✅ **Dialogue Practice with Branching**
- Same content as regular lessons in dialogue-only format
- Multiple-choice branches that affect dialogue flow
- Undo/Restart functionality
- Track which path student chose

### 5. File Structure
```
root/
├── index.html                          # Main app shell
├── styles.css                          # Global styles
├── js/
│   ├── app.js                          # Module bootstrap
│   ├── config.js                       # Firebase/app config
│   ├── config.runtime.js               # Runtime config
│   ├── core/
│   │   ├── state.js                    # Global app state
│   │   ├── constants.js                # App constants
│   │   ├── errorHandler.js             # Error handling
│   │   ├── validation.js               # Input validation
│   │   ├── performance.js              # Performance tracking
│   │   └── lazyLoader.js               # Module lazy loading
│   ├── logic/
│   │   ├── interactions.js             # Main UI interactions
│   │   ├── navigation.js               # Screen routing
│   │   ├── progress.js                 # Student progress tracking
│   │   ├── studentManager.js           # Profile CRUD
│   │   ├── teacherPracticeEditor.js    # Lesson editor
│   │   ├── branchingDialogue.js        # Dialogue with choices
│   │   └── teacherAccess.js            # Teacher permissions (simplified)
│   ├── render/
│   │   ├── renderLesson.js             # Lesson tab rendering
│   │   ├── renderDialogue.js           # Dialogue rendering
│   │   ├── renderVocabulary.js         # Vocabulary modal
│   │   └── renderPractice.js           # Practice quiz rendering
│   ├── lessons/
│   │   ├── index.js                    # Lesson template loader
│   │   ├── beginner/
│   │   │   ├── greetings.js
│   │   │   ├── family.js
│   │   │   ├── fooddrink.js
│   │   │   └── dailyRoutine.js
│   │   ├── preIntermediate/
│   │   │   ├── shopping.js
│   │   │   ├── health.js
│   │   │   ├── workstudy.js
│   │   │   ├── apartment.js
│   │   │   └── weathersmalltalk.js
│   │   └── intermediate/
│   │       ├── plans.js
│   │       ├── hobbies.js
│   │       ├── opinions.js
│   │       ├── feelings.js
│   │       └── complaints.js
│   ├── branching/
│   │   ├── index.js
│   │   ├── beginner/
│   │   ├── preIntermediate/
│   │   └── intermediate/
│   ├── data/
│   │   └── arabicLettersData.js        # All Arabic letters + details
│   ├── cloud/
│   │   └── lessonsCloud.js             # Firestore sync (optional)
│   └── drawingLayer.js                 # Whiteboard implementation
├── firestore.rules                      # Firestore security rules (optional)
└── README.md                            # Project documentation
```

### 6. Removed Features (No Authentication)
❌ Firebase Authentication (email/password login)
❌ Modal auth form
❌ User role management (teacher/student separation at auth level)
❌ Account creation by teacher with credentials
❌ Logout functionality
❌ Session management
❌ Permission checks based on Firebase roles

**Instead:** Use simple localStorage flags or teacher mode toggle for access

### 7. Setup Instructions
1. Clone/create project folder
2. Create Firebase project (optional for Firestore syncing)
3. Configure Firebase in `js/config.js`
4. Add lesson content to `js/lessons/*/` files
5. Add Arabic letters data to `js/data/arabicLettersData.js`
6. Run locally with a simple HTTP server
7. Create initial student profiles through the Profile Manager UI

### 8. Optional Enhancements
- Firestore integration for cloud lesson syncing
- Student progress dashboard
- Teacher analytics (not implemented in base version)
- Audio pronunciation guide
- Spaced repetition algorithm for vocabulary
- Gamification (points, badges, streaks)

## Success Criteria
✅ App opens without login screen
✅ Can create and manage student profiles
✅ Lessons display with all 8 tabs
✅ Vocabulary modal works
✅ Practice quizzes function correctly
✅ Whiteboard allows drawing and saving
✅ PDF export generates correctly
✅ Student progress tracked locally
✅ Data persists across sessions (localStorage)
✅ Teacher Dashboard allows lesson editing
✅ Arabic Letters screen displays all 28 letters with details
✅ Branching dialogue shows choices and consequences
