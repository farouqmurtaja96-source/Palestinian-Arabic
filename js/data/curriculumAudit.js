import {
    hasCompleteFormHint,
    lessonApprovalGates,
    levelLimits,
} from "./curriculumStandards.js";

const issue = (severity, code, path, message) => ({ severity, code, path, message });

export function auditLesson(lesson) {
    const issues = [];
    const known = new Set([
        ...(lesson?.prerequisites?.allowedLexemeIds || []),
        ...(lesson?.prerequisites?.allowedClassroomLanguageIds || []),
    ]);
    const productive = lesson?.vocabulary?.productive || [];

    productive.forEach((item, index) => {
        const path = `vocabulary.productive[${index}]`;
        const usedIds = item.exampleLexemeIds || [];

        if (item.exampleType === "controlled" && !usedIds.length) {
            issues.push(issue(
                "error",
                "MISSING_EXAMPLE_LEXEMES",
                path,
                "Controlled examples must declare exampleLexemeIds so sequence can be audited."
            ));
        }

        usedIds.forEach((lexemeId) => {
            if (lexemeId !== item.id && !known.has(lexemeId)) {
                issues.push(issue(
                    "error",
                    "LEXEME_USED_BEFORE_TAUGHT",
                    path,
                    `${lexemeId} is used before it is taught.`
                ));
            }
        });

        if (item.introducesNewConjugation && !hasCompleteFormHint(item)) {
            issues.push(issue(
                "error",
                "INCOMPLETE_FORM_HINT",
                path,
                "A new conjugation requires a complete formHint."
            ));
        }

        known.add(item.id);
        (item.introducedFormIds || []).forEach((formId) => known.add(formId));
    });

    const limit = levelLimits[lesson?.meta?.level];
    if (limit) {
        const [min, max] = limit.productiveVocabulary;
        if (productive.length < min || productive.length > max) {
            issues.push(issue(
                "warning",
                "VOCABULARY_LOAD",
                "vocabulary.productive",
                `${lesson.meta.level} lessons should normally contain ${min}-${max} productive items; found ${productive.length}.`
            ));
        }
    }

    lessonApprovalGates.forEach((gate) => {
        if (lesson?.approval?.[gate] !== true) {
            issues.push(issue("info", "APPROVAL_PENDING", `approval.${gate}`, `${gate} approval is pending.`));
        }
    });

    return {
        passed: !issues.some(({ severity }) => severity === "error"),
        errors: issues.filter(({ severity }) => severity === "error"),
        warnings: issues.filter(({ severity }) => severity === "warning"),
        info: issues.filter(({ severity }) => severity === "info"),
        issues,
    };
}
