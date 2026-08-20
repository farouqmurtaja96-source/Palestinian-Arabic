export const CURRICULUM_STANDARD_VERSION = "1.0.0";

export const dialectStandard = {
    target: "Contemporary Gaza Palestinian Arabic with broad Palestinian intelligibility",
    productiveChoices: {
        morning: { ar: "الصُّبُح", arabeezy: "eS-Subu7", recognitionVariants: ["في الصبح"] },
        evening: { ar: "بِالمَسَا", arabeezy: "bil-masa", recognitionVariants: ["بالعشي"] },
        night: { ar: "بِاللِّيل", arabeezy: "bil-leel", recognitionVariants: [] },
        early: { ar: "بَدْرِي", arabeezy: "badri", recognitionVariants: ["بكّير"] },
        toWork: { ar: "عَالشُّغُل", arabeezy: "3ash-shughul", recognitionVariants: ["على الشغل"] },
        home: { ar: "عَالبِيت", arabeezy: "3al-beit", recognitionVariants: ["على البيت"] },
        myMother: { ar: "إِمِّي", arabeezy: "immi", recognitionVariants: ["أمي"] },
    },
};

export const languageStatuses = Object.freeze({
    PRODUCTIVE: "productive",
    RECEPTIVE: "receptive",
    CULTURAL: "cultural",
    OPTIONAL: "optional",
});

export const exampleTypes = Object.freeze({
    CONTROLLED: "controlled",
    EXPANSION: "expansion",
    NATURAL_LISTENING: "natural-listening",
});

export const levelLimits = {
    Beginner: { productiveVocabulary: [10, 16], expressions: [4, 6], coreDialogueLines: [6, 10], mainGrammarPatterns: 1 },
    "Pre-Intermediate": { productiveVocabulary: [18, 30], expressions: [8, 12], coreDialogueLines: [12, 18], mainGrammarPatterns: 2 },
    Intermediate: { productiveVocabulary: [30, 45], expressions: [12, 18], coreDialogueLines: [18, 30], mainGrammarPatterns: 2 },
};

export const requiredFormHintFields = [
    "baseForm",
    "usedForm",
    "person",
    "meaning",
    "explanationAr",
    "explanationEn",
];

export function hasCompleteFormHint(item) {
    return requiredFormHintFields.every((field) =>
        typeof item?.formHint?.[field] === "string" && item.formHint[field].trim().length > 0
    );
}

export const lessonApprovalGates = [
    "dialect",
    "sequence",
    "morphology",
    "assessment",
    "cognitiveLoad",
    "teacherReview",
];
