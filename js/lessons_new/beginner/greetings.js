export const lessonId = "NEW-Beginner-Greetings-FirstContact-L1";

export const lesson = {
    meta: {
        level: "Beginner",
        unit: "Greetings & First Contact",
        lessonTitle: "Beginner 1 - Greetings & First Contact",
        dialect: "Palestinian Arabic - Gaza-friendly",
        status: "draft",
    },

    review: {
        title: "Review From Previous Unit",
        note: "For the first lesson, use this as a warmup and confidence check.",
        oldWords: [
            { ar: "مرحبا", en: "hello", arabeezy: "marhaba" },
            { ar: "تمام", en: "okay / good", arabeezy: "tamaam" },
            { ar: "شكراً", en: "thank you", arabeezy: "shukran" },
        ],
        oldQuestions: [
            { ar: "بتعرف أي كلمة عربي؟", en: "Do you know any Arabic word?", arabeezy: "bti3raf ay kilme 3arabi?" },
            { ar: "سمعت كلمة مرحبا قبل هيك؟", en: "Have you heard the word marhaba before?", arabeezy: "smi3t kilmet marhaba abl heik?" },
            { ar: "بدك نحكي شوي شوي؟", en: "Do you want us to speak slowly?", arabeezy: "biddak ni7ki shway shway?" },
        ],
        quickSpeakingWarmup: [
            "Teacher says: مرحبا. Student repeats.",
            "Teacher says: مرحبا، كيفك؟ Student only answers: تمام.",
            "Student practices asking the teacher to repeat: ممكن تعيد؟",
        ],
    },

    goal: {
        title: "Lesson Goal",
        canDo: [
            "Greet someone naturally in Palestinian Arabic.",
            "Ask and answer 'How are you?' in a simple way.",
            "Say thank you, goodbye, and one warm reply.",
            "Use a short first-contact conversation without reading a script.",
        ],
        teacherGoal:
            "By the end, the student should handle a 30-60 second first meeting using greetings, feelings, and a polite closing.",
    },

    coreVocabulary: [
        {
            id: "marhaba",
            ar: "مرحبا",
            en: "hello",
            arabeezy: "marhaba",
            hint: "Safe any time of day. Works with friends, teacher, and strangers.",
            exampleAr: "مرحبا، كيفك؟",
            exampleArabeezy: "marhaba, keefak?",
            exampleEn: "Hello, how are you?",
        },
        {
            id: "ahlan",
            ar: "أهلاً",
            en: "hi / welcome",
            arabeezy: "ahlan",
            hint: "Can be a greeting or a warm reply. Often used with a name.",
            exampleAr: "أهلاً يا سامر.",
            exampleArabeezy: "ahlan ya Samer.",
            exampleEn: "Hi, Samer.",
        },
        {
            id: "sabah_el_kheir",
            ar: "صباح الخير",
            en: "good morning",
            arabeezy: "saba7 el-kheir",
            hint: "Morning greeting. Natural reply: صباح النور.",
            exampleAr: "صباح الخير يا أستاذ.",
            exampleArabeezy: "saba7 el-kheir ya ustaz.",
            exampleEn: "Good morning, teacher.",
        },
        {
            id: "sabah_el_noor",
            ar: "صباح النور",
            en: "good morning reply",
            arabeezy: "saba7 el-noor",
            hint: "Reply to صباح الخير. Literally 'morning of light'.",
            exampleAr: "صباح الخير. - صباح النور.",
            exampleArabeezy: "saba7 el-kheir. - saba7 el-noor.",
            exampleEn: "Good morning. - Good morning.",
        },
        {
            id: "masa_el_kheir",
            ar: "مسا الخير",
            en: "good evening",
            arabeezy: "masa el-kheir",
            hint: "Evening greeting. Natural reply: مسا النور.",
            exampleAr: "مسا الخير، كيفكم؟",
            exampleArabeezy: "masa el-kheir, keefkom?",
            exampleEn: "Good evening, how are you all?",
        },
        {
            id: "keefak",
            ar: "كيفك؟",
            en: "how are you?",
            arabeezy: "keefak?",
            hint: "To a man: كيفك؟ keefak. To a woman: كيفك؟ keefik by pronunciation. Plural: كيفكم؟ keefkom.",
            exampleAr: "مرحبا، كيفك اليوم؟",
            exampleArabeezy: "marhaba, keefak el-yom?",
            exampleEn: "Hello, how are you today?",
        },
        {
            id: "tamam",
            ar: "تمام",
            en: "okay / good",
            arabeezy: "tamaam",
            hint: "Very common answer. Can mean okay, good, understood, or all right.",
            exampleAr: "أنا تمام، شكراً.",
            exampleArabeezy: "ana tamaam, shukran.",
            exampleEn: "I am good, thank you.",
        },
        {
            id: "mnee7",
            ar: "منيح / منيحة",
            en: "good / fine",
            arabeezy: "mnee7 / mnee7a",
            hint: "Male speaker: منيح. Female speaker: منيحة. Plural: مناح.",
            exampleAr: "أنا منيحة الحمد لله.",
            exampleArabeezy: "ana mnee7a el-7amdillah.",
            exampleEn: "I am good, thank God.",
        },
        {
            id: "mashi_el_7al",
            ar: "ماشي الحال",
            en: "so-so / okay",
            arabeezy: "mashi el-7al",
            hint: "Natural answer when things are not great but okay.",
            exampleAr: "ماشي الحال، مش بطال.",
            exampleArabeezy: "mashi el-7al, mish baTTal.",
            exampleEn: "So-so, not bad.",
        },
        {
            id: "ta3ban",
            ar: "تعبان / تعبانة",
            en: "tired",
            arabeezy: "ta3ban / ta3baneh",
            hint: "Male: تعبان. Female: تعبانة. Plural: تعبانين.",
            exampleAr: "أنا تعبان شوي اليوم.",
            exampleArabeezy: "ana ta3ban shway el-yom.",
            exampleEn: "I am a little tired today.",
        },
        {
            id: "mabsut",
            ar: "مبسوط / مبسوطة",
            en: "happy / pleased",
            arabeezy: "mabsuT / mabsuTa",
            hint: "Male: مبسوط. Female: مبسوطة. Plural: مبسوطين.",
            exampleAr: "أنا مبسوط إني بتعلم عربي.",
            exampleArabeezy: "ana mabsuT inni bat3allam 3arabi.",
            exampleEn: "I am happy that I am learning Arabic.",
        },
        {
            id: "shukran",
            ar: "شكراً",
            en: "thank you",
            arabeezy: "shukran",
            hint: "Stronger: شكراً كتير. Natural replies: عفواً، ولا يهمك، على راسي.",
            exampleAr: "شكراً كتير على الدرس.",
            exampleArabeezy: "shukran kteer 3ala ed-dars.",
            exampleEn: "Thank you very much for the lesson.",
        },
        {
            id: "3afwan",
            ar: "عفواً",
            en: "you are welcome",
            arabeezy: "3afwan",
            hint: "Standard reply to شكراً. Can also mean excuse me in some contexts.",
            exampleAr: "شكراً. - عفواً.",
            exampleArabeezy: "shukran. - 3afwan.",
            exampleEn: "Thank you. - You are welcome.",
        },
        {
            id: "ma3_el_salama",
            ar: "مع السلامة",
            en: "goodbye",
            arabeezy: "ma3 el-salameh",
            hint: "Polite goodbye. Common at the end of class, calls, and visits.",
            exampleAr: "مع السلامة، بشوفك بكرا.",
            exampleArabeezy: "ma3 el-salameh, bshoofak bukra.",
            exampleEn: "Goodbye, I will see you tomorrow.",
        },
        {
            id: "yalla",
            ar: "يلا",
            en: "let's go / okay then",
            arabeezy: "yalla",
            hint: "Natural transition word. Use it to start or end: يلا نبلش، يلا مع السلامة.",
            exampleAr: "يلا نبلش.",
            exampleArabeezy: "yalla nballesh.",
            exampleEn: "Let's start.",
        },
    ],

    formsAndVariations: [
        {
            item: "كيفك؟",
            forms: [
                { ar: "كيفك؟", arabeezy: "keefak?", en: "How are you? to a man" },
                { ar: "كيفك؟", arabeezy: "keefik?", en: "How are you? to a woman" },
                { ar: "كيفكم؟", arabeezy: "keefkom?", en: "How are you? to a group" },
            ],
            teacherNote: "Arabic spelling can look the same for masculine/feminine كيفك, but pronunciation changes.",
        },
        {
            item: "منيح",
            forms: [
                { ar: "منيح", arabeezy: "mnee7", en: "good - masculine" },
                { ar: "منيحة", arabeezy: "mnee7a", en: "good - feminine" },
                { ar: "مناح", arabeezy: "mna7", en: "good - plural" },
            ],
        },
        {
            item: "تعبان",
            forms: [
                { ar: "تعبان", arabeezy: "ta3ban", en: "tired - masculine" },
                { ar: "تعبانة", arabeezy: "ta3baneh", en: "tired - feminine" },
                { ar: "تعبانين", arabeezy: "ta3baneen", en: "tired - plural" },
            ],
        },
        {
            item: "شكر / يشكر",
            forms: [
                { ar: "شكرتك", arabeezy: "shakartak", en: "I thanked you - past" },
                { ar: "بشكرك", arabeezy: "bashkurak", en: "I thank you - present" },
                { ar: "رح أشكرك", arabeezy: "ra7 ashkurak", en: "I will thank you - future" },
                { ar: "اشكر", arabeezy: "ishkur", en: "thank - command" },
            ],
            teacherNote: "Do not teach this as full verb conjugation unless the student asks. It is here as teacher expansion.",
        },
    ],

    palestinianExpressions: [
        {
            ar: "الحمد لله",
            en: "thank God / I am okay",
            arabeezy: "el-7amdillah",
            usage: "Very common answer after كيفك؟",
        },
        {
            ar: "كله تمام",
            en: "everything is good",
            arabeezy: "killo tamaam",
            usage: "Casual and positive.",
        },
        {
            ar: "مش بطال",
            en: "not bad",
            arabeezy: "mish baTTal",
            usage: "Natural after ماشي الحال.",
        },
        {
            ar: "الله يسلمك",
            en: "may God keep you safe / thanks",
            arabeezy: "allah ysallmak",
            usage: "Reply to سلامتك or a kind comment.",
        },
        {
            ar: "يعطيك العافية",
            en: "thank you / may God give you health",
            arabeezy: "ya3Teek el-3afyeh",
            usage: "Very useful Palestinian politeness phrase. Say it to someone who helped or worked.",
        },
        {
            ar: "ولا يهمك",
            en: "do not worry",
            arabeezy: "wala yhemmak",
            usage: "Warm informal support.",
        },
        {
            ar: "على راسي",
            en: "with pleasure / of course",
            arabeezy: "3ala rasi",
            usage: "Warm, friendly Palestinian expression. Casual, not formal.",
        },
        {
            ar: "تشرفنا",
            en: "nice to meet you",
            arabeezy: "tsharrafna",
            usage: "Good first-contact phrase.",
        },
    ],

    miniDialogue: {
        title: "First Contact After Class",
        lines: [
            { speaker: "Teacher", ar: "مرحبا، كيفك اليوم؟", arabeezy: "marhaba, keefak el-yom?", en: "Hello, how are you today?" },
            { speaker: "Student", ar: "مرحبا أستاذ، أنا تمام الحمد لله.", arabeezy: "marhaba ustaz, ana tamaam el-7amdillah.", en: "Hello teacher, I am good, thank God." },
            { speaker: "Teacher", ar: "ممتاز. تعبان ولا مبسوط؟", arabeezy: "mumtaz. ta3ban wala mabsuT?", en: "Great. Tired or happy?" },
            { speaker: "Student", ar: "مبسوط، بس تعبان شوي.", arabeezy: "mabsuT, bas ta3ban shway.", en: "Happy, but a little tired." },
            { speaker: "Teacher", ar: "عادي، شوي شوي. العربي بصير أسهل.", arabeezy: "3adi, shway shway. el-3arabi biseer ashal.", en: "It is okay, little by little. Arabic gets easier." },
            { speaker: "Student", ar: "شكراً كتير، يعطيك العافية.", arabeezy: "shukran kteer, ya3Teek el-3afyeh.", en: "Thank you very much, may God give you health." },
            { speaker: "Teacher", ar: "الله يعافيك. يلا، مع السلامة.", arabeezy: "allah y3afeek. yalla, ma3 el-salameh.", en: "May God keep you well. Okay, goodbye." },
            { speaker: "Student", ar: "مع السلامة، بشوفك بكرا.", arabeezy: "ma3 el-salameh, bshoofak bukra.", en: "Goodbye, I will see you tomorrow." },
        ],
    },

    grammarPattern: [
        {
            title: "No Present 'To Be'",
            explanation:
                "In spoken Palestinian Arabic, do not use am/is/are in simple present sentences. Put the subject directly before the adjective.",
            pattern: "Subject + adjective",
            examples: [
                { ar: "أنا تمام.", arabeezy: "ana tamaam.", en: "I am good." },
                { ar: "أنا تعبان.", arabeezy: "ana ta3ban.", en: "I am tired. male speaker" },
                { ar: "أنا تعبانة.", arabeezy: "ana ta3baneh.", en: "I am tired. female speaker" },
                { ar: "إنت منيح؟", arabeezy: "inta mnee7?", en: "Are you good? to a man" },
                { ar: "إنتِ منيحة؟", arabeezy: "inti mnee7a?", en: "Are you good? to a woman" },
            ],
            commonMistakes: [
                "Do not say: أنا أكون تعبان.",
                "Do not force MSA: أنا بخير is okay, but منيح / تمام sounds more spoken.",
            ],
        },
        {
            title: "Question + Short Answer",
            explanation:
                "For first lessons, students can answer with one word first, then upgrade to a full sentence.",
            pattern: "كيفك؟ -> تمام / أنا تمام",
            examples: [
                { ar: "كيفك؟ - تمام.", arabeezy: "keefak? - tamaam.", en: "How are you? - Good." },
                { ar: "كيفك اليوم؟ - أنا منيح.", arabeezy: "keefak el-yom? - ana mnee7.", en: "How are you today? - I am good." },
                { ar: "كيفك؟ - ماشي الحال.", arabeezy: "keefak? - mashi el-7al.", en: "How are you? - So-so." },
            ],
        },
    ],

    personalQuestions: [
        { ar: "كيفك اليوم؟", arabeezy: "keefak el-yom?", en: "How are you today?" },
        { ar: "إنت تعبان اليوم؟", arabeezy: "inta ta3ban el-yom?", en: "Are you tired today?" },
        { ar: "إنت مبسوط إنك بتتعلم عربي؟", arabeezy: "inta mabsuT innak bat3allam 3arabi?", en: "Are you happy that you are learning Arabic?" },
        { ar: "بتحب تحكي بسرعة ولا شوي شوي؟", arabeezy: "bti7ibb ti7ki bsur3a wala shway shway?", en: "Do you like speaking fast or slowly?" },
        { ar: "أي كلمة سهلة؟", arabeezy: "ay kilme sahle?", en: "Which word is easy?" },
        { ar: "أي كلمة صعبة؟", arabeezy: "ay kilme sa3be?", en: "Which word is difficult?" },
        { ar: "لما تكون تعبان، شو بتحكي؟", arabeezy: "lamma tkoon ta3ban, shu bti7ki?", en: "When you are tired, what do you say?" },
        { ar: "كيف بتقول goodbye بالعربي؟", arabeezy: "keef bt2ool goodbye bel-3arabi?", en: "How do you say goodbye in Arabic?" },
    ],

    controlledPractice: {
        matching: [
            { ar: "مرحبا", en: "hello" },
            { ar: "كيفك؟", en: "how are you?" },
            { ar: "تعبان", en: "tired" },
            { ar: "مع السلامة", en: "goodbye" },
        ],
        fillBlank: [
            {
                prompt: "Complete: أنا ___ الحمد لله.",
                options: ["تمام", "كيفك", "مع السلامة"],
                correct: "تمام",
            },
            {
                prompt: "Complete: صباح الخير. - صباح ___.",
                options: ["النور", "الحال", "السلامة"],
                correct: "النور",
            },
            {
                prompt: "Female speaker: أنا ___ شوي.",
                options: ["تعبانة", "تعبان", "تعبانين"],
                correct: "تعبانة",
            },
        ],
        choose: [
            {
                prompt: "Which phrase means 'not bad'?",
                options: ["مش بطال", "على راسي", "مع السلامة"],
                correct: "مش بطال",
            },
            {
                prompt: "Which phrase is a natural polite thank-you expression?",
                options: ["يعطيك العافية", "كيفكم؟", "صباح النور"],
                correct: "يعطيك العافية",
            },
        ],
        reorder: [
            {
                prompt: "Reorder: I am a little tired today.",
                words: ["أنا", "تعبان", "شوي", "اليوم"],
                correct: ["أنا", "تعبان", "شوي", "اليوم"],
            },
            {
                prompt: "Reorder: Hello, how are you?",
                words: ["مرحبا", "كيفك؟"],
                correct: ["مرحبا", "كيفك؟"],
            },
        ],
        translation: [
            { type: "enToAr", en: "Hello, how are you?", ar: "مرحبا، كيفك؟" },
            { type: "arToEn", ar: "أنا منيح الحمد لله.", en: "I am good, thank God." },
            { type: "enToAr", en: "I am a little tired.", ar: "أنا تعبان شوي." },
            { type: "arToEn", ar: "مع السلامة، بشوفك بكرا.", en: "Goodbye, I will see you tomorrow." },
        ],
    },

    freeSpeaking: [
        {
            title: "30-Second Greeting",
            instructions:
                "Student greets the teacher, answers how they are, adds one feeling, says thank you, and closes with goodbye.",
            requiredLanguage: ["مرحبا", "كيفك", "أنا", "تمام / منيح / تعبان / مبسوط", "شكراً", "مع السلامة"],
        },
        {
            title: "Upgrade Your Answer",
            instructions:
                "Student starts with one-word answers, then upgrades each answer into a full sentence.",
            example:
                "تمام -> أنا تمام -> أنا تمام الحمد لله -> أنا تمام الحمد لله، بس تعبان شوي.",
        },
    ],

    rolePlay: [
        {
            title: "First Online Lesson",
            setup:
                "Teacher and student meet online for the first time. Student greets, says how they feel, and asks to speak slowly if needed.",
            roles: ["Teacher", "Student"],
            requiredPhrases: ["مرحبا", "كيفك", "تمام", "تعبان شوي", "شكراً", "مع السلامة"],
        },
        {
            title: "Meeting A Palestinian Friend",
            setup:
                "Student meets a Palestinian friend in the morning. Use صباح الخير / صباح النور, then ask كيفك؟ and close naturally.",
            roles: ["Friend A", "Friend B"],
            requiredPhrases: ["صباح الخير", "صباح النور", "الحمد لله", "مش بطال", "تشرفنا"],
        },
        {
            title: "End Of Class",
            setup:
                "The lesson is ending. Student thanks the teacher, teacher replies warmly, both say goodbye.",
            roles: ["Teacher", "Student"],
            requiredPhrases: ["شكراً كتير", "يعطيك العافية", "الله يعافيك", "مع السلامة"],
        },
    ],

    homework: {
        writing:
            "Write a short 6-8 line conversation in Palestinian Arabic. Include: a greeting, كيفك؟, one feeling, thank you, and goodbye. Use Arabeezy under each Arabic line if you need it.",
        optionalChallenge:
            "Add two Palestinian expressions from the lesson, such as الحمد لله، مش بطال، يعطيك العافية، or ولا يهمك.",
    },

    teacherNotes: {
        pacing: [
            "Do not teach every word as a separate list. Teach one phrase, ask a personal question, then use it in a mini-dialogue.",
            "Use vocabulary in layers: one-word answer, full sentence, natural Palestinian answer.",
            "If the student already knows basic greetings, spend more time on expressions and personal questions.",
        ],
        classFillerIdeas: [
            "Ask the student to answer كيفك؟ in 5 different ways.",
            "Switch masculine/feminine forms: تعبان، تعبانة، منيح، منيحة.",
            "Teacher says English, student answers Arabic quickly.",
            "Student creates a mini-dialogue with their real name and real feeling.",
            "Practice natural reaction phrases: الحمد لله، مش بطال، ولا يهمك، على راسي.",
        ],
        correctionFocus: [
            "Correct only target forms: منيح/منيحة, تعبان/تعبانة, كيفك pronunciation.",
            "Avoid overexplaining MSA versus dialect unless the student asks.",
            "Repeat the student's sentence naturally instead of stopping too much.",
        ],
    },
};
