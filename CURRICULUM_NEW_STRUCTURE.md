# Palestinian Arabic Curriculum Restructure Plan

This file is a planning draft only. It does not replace the current lesson files.

## Goal

Convert the current large lesson units into more teachable, complete class lessons. Each lesson should feel full enough for a live class without becoming a random vocabulary dump.

## Standard Lesson Sections

Every new lesson should follow this order:

1. Review From Previous Unit
   - Old words
   - Old questions
   - Quick speaking warmup

2. Lesson Goal
   - What the student can do by the end of class

3. Core Vocabulary
   - Main required words
   - Start smaller in Beginner, increase gradually in later levels

4. Forms and Variations
   - Masculine / feminine / plural
   - Verb forms when relevant: past, present, future, command
   - Common spoken variants

5. Palestinian / Gaza Expressions
   - Natural phrases connected to the topic
   - Label expressions as casual, polite, strong, or very local when needed

6. Mini-Dialogue
   - Short real-life conversation
   - Beginner: simple and controlled
   - Later levels: longer, more natural, more emotional/contextual

7. Grammar Pattern
   - One or two practical patterns only
   - Teach through examples first, then explain the rule

8. Personal Questions
   - Questions the teacher asks the student
   - These should help fill class time naturally

9. Controlled Practice
   - Matching
   - Fill in the blank
   - Choose the correct form
   - Reorder
   - Short translation

10. Free Speaking
   - Open speaking task using the lesson language

11. Role-Play
   - Real-life simulation
   - Student should use vocabulary, expressions, and grammar together

12. Homework
   - Writing task
   - Optional recording can be added later if desired

## Difficulty Growth

Beginner:
- 10-18 core words
- 5-8 expressions
- 6-10 dialogue lines
- 5-8 personal questions
- one grammar pattern
- highly controlled role-play

Pre-Intermediate:
- 18-30 core words
- 8-12 expressions
- 12-18 dialogue lines
- 10-15 personal questions
- one or two grammar patterns
- role-play with choices and reasons

Intermediate:
- 30-45 core words
- 12-18 expressions
- 18-30 dialogue lines
- 15-25 personal questions
- more nuance, opinions, past/future, conditions
- role-play with problem solving

## AI Feature Idea

Add a teacher-only AI expansion button for each unit.

Example button:
"Generate More Vocabulary"

Possible teacher controls:
- Number of new words: 5 / 10 / 15
- Type: vocabulary, expressions, questions, role-play, homework, mini-dialogue
- Difficulty: easier, same level, harder
- Dialect focus: Gaza-friendly Palestinian
- Keep topic: yes

Example prompt behavior:
"Generate 15 more Gaza-friendly Palestinian Arabic vocabulary items for this lesson topic. Include Arabic, English, Arabeezy, hint, example sentence, masculine/feminine/plural or verb forms where relevant."

Recommended AI outputs:
- extra vocabulary
- extra Palestinian expressions
- extra personal questions
- longer mini-dialogue
- emergency backup activity for filling class time
- easier version for weak students
- harder version for review students

Important:
The AI should not auto-save directly into the lesson. It should generate a preview first, then the teacher can choose:
- Add all
- Add selected
- Copy only
- Regenerate

This keeps the curriculum controlled and avoids messy AI content entering the official lesson by accident.

## Blueprint File

The structured version of this plan lives in:

`js/data/curriculumBlueprint.js`

It contains:
- the standard lesson section order
- Beginner, Pre-Intermediate, and Intermediate unit names
- difficulty targets for each level
- AI generation actions
- a prompt builder for future AI buttons
- two optional source-book slots

## Two Source Books

The AI can support two source books, but the books must be provided by the teacher first.

Recommended source setup:
- Source Book 1: main curriculum reference
- Source Book 2: extra vocabulary, expressions, or grammar reference

Important:
- Do not make the AI copy long text from books.
- Use books as references for progression, topic ideas, vocabulary scope, and teacher notes.
- If the books are copyrighted, only use them if you have permission or provide short allowed extracts.
- The safest design is: teacher uploads or pastes allowed source notes, AI generates original lesson material from those notes plus the unit blueprint.

## Future AI Button Behavior

Each unit can have a teacher-only button:

`Generate`

Then the teacher chooses what to generate:
- More vocabulary
- Palestinian / Gaza expressions
- Personal questions
- Mini-dialogue
- Controlled practice
- Role-play
- Homework
- Class filler activity

The output should appear as a preview with:
- Add selected
- Add all
- Copy
- Regenerate
- Cancel
