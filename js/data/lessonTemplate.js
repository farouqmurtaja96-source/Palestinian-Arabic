import { CURRICULUM_STANDARD_VERSION } from "./curriculumStandards.js";

// Copy this shape when rebuilding a lesson. Empty arrays are deliberate: a
// lesson is not approved merely because a property exists.
export function createLessonTemplate({ id, level, unit, lessonTitle, canDo }) {
    return {
        schemaVersion: CURRICULUM_STANDARD_VERSION,
        id,
        meta: { level, unit, lessonTitle, status: "draft" },
        objective: { canDo },
        prerequisites: {
            lessonIds: [],
            allowedLexemeIds: [],
            allowedClassroomLanguageIds: [],
        },
        review: [],
        vocabulary: {
            productive: [],
            receptive: [],
            cultural: [],
            optional: [],
        },
        formsAndVariations: [],
        coreDialogue: { previewVocabulary: [], lines: [], questions: [] },
        expandedListening: { previewVocabulary: [], lines: [], questions: [] },
        grammar: [],
        controlledPractice: [],
        personalQuestions: [],
        freeSpeaking: [],
        rolePlay: [],
        homework: [],
        approval: {
            dialect: false,
            sequence: false,
            morphology: false,
            assessment: false,
            cognitiveLoad: false,
            teacherReview: false,
        },
    };
}

export function createVocabularyItem({
    id,
    ar,
    arabeezy,
    en,
    exampleAr,
    exampleArabeezy,
    exampleEn,
    hint = "",
    formHint,
    recognitionVariants = [],
}) {
    return {
        id,
        ar,
        arabeezy,
        en,
        status: "productive",
        exampleType: "controlled",
        exampleAr,
        exampleArabeezy,
        exampleEn,
        hint,
        // Ordered lexical IDs used by the controlled Arabic example. The
        // curriculum audit compares these with prerequisites and earlier items.
        exampleLexemeIds: [],
        ...(formHint ? { formHint } : {}),
        recognitionVariants,
    };
}
