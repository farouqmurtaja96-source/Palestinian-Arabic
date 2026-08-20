// Canonical lexical registry. Rebuilt lessons reference these IDs instead of
// silently redefining spelling, Arabizi, or dialect choices.
export const curriculumLexicon = {
    ana: { ar: "أَنَا", arabeezy: "ana", en: "I", introducedIn: "B01" },
    inta: { ar: "إِنْتَ", arabeezy: "inta", en: "you (m.)", introducedIn: "B01" },
    inti: { ar: "إِنْتِ", arabeezy: "inti", en: "you (f.)", introducedIn: "B01" },
    ma3: { ar: "مَع", arabeezy: "ma3", en: "with", introducedIn: "B05" },
    ahli: { ar: "أَهْلِي", arabeezy: "ahli", en: "my family", introducedIn: "B05" },

    kul_yom: { ar: "كُلّ يَوم", arabeezy: "kul yom", en: "every day", introducedIn: "B07" },
    es_soboh: { ar: "الصُّبُح", arabeezy: "eS-Subu7", en: "in the morning", introducedIn: "B07", recognitionVariants: ["في الصبح"] },
    ay_sa3a: { ar: "أَيّ سَاعَة؟", arabeezy: "ay sa3a?", en: "what time?", introducedIn: "B07" },
    badri: { ar: "بَدْرِي", arabeezy: "badri", en: "early", introducedIn: "B07", recognitionVariants: ["بكّير"] },
    baS7a: { ar: "بَصْحَى", arabeezy: "baS7a", en: "I wake up", introducedIn: "B07", lemmaId: "S7i" },
    bafTar: { ar: "بَفْطَر", arabeezy: "bafTar", en: "I have breakfast", introducedIn: "B07", lemmaId: "fiTir" },
    bashrab: { ar: "بَشْرَب", arabeezy: "bashrab", en: "I drink", introducedIn: "B07", lemmaId: "shirib" },
    baroo7: { ar: "بَرُوح", arabeezy: "baroo7", en: "I go", introducedIn: "B07", lemmaId: "raa7" },
    binzel: { ar: "بَنْزِل", arabeezy: "banzel", en: "I leave / go out", introducedIn: "B07", lemmaId: "nizil" },
    barja3: { ar: "بَرْجَع", arabeezy: "barja3", en: "I return", introducedIn: "B07", lemmaId: "riji3" },
    barta7: { ar: "بَرْتَاح", arabeezy: "barta7", en: "I rest", introducedIn: "B07", lemmaId: "irtaa7" },
    badros: { ar: "بَدْرُس", arabeezy: "badros", en: "I study", introducedIn: "B07", lemmaId: "daras" },
    banaam: { ar: "بَنَام", arabeezy: "banaam", en: "I sleep", introducedIn: "B07", lemmaId: "naam" },
    ba3deen: { ar: "بَعْدِين", arabeezy: "ba3deen", en: "then", introducedIn: "B07" },
};

export function getLexeme(id) {
    return curriculumLexicon[id] || null;
}
