import { defaultLessons as rawInteractiveLessons } from './lessons/index.js';

export const INTERACTIVE_CURRICULUM_ID = 'interactive';
export const INTERACTIVE_LESSON_PREFIX = 'interactive::';

export const interactiveLessons = Object.fromEntries(
  Object.entries(rawInteractiveLessons).map(([lessonId, lesson]) => {
    const scopedId = `${INTERACTIVE_LESSON_PREFIX}${lessonId}`;
    return [scopedId, {
      ...lesson,
      meta: {
        ...(lesson.meta || {}),
        curriculumId: INTERACTIVE_CURRICULUM_ID,
        curriculumLabel: 'Interactive Palestinian Arabic Course',
        sourceLessonId: lessonId,
      },
    }];
  })
);
