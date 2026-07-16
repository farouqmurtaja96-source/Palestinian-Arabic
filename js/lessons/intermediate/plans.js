import { LESSON_ID_PLANS_FUTURE } from '../../core/constants.js';

export const lessonId = LESSON_ID_PLANS_FUTURE;
export const lesson = {
    meta: {
        level: "Intermediate",
        unit: "Plans & Future",
        lessonTitle: "Unit 13 - Plans & Future",
    },

    overview: {
        title: "Unit 13 - Plans & Future",
        description:
            "In this unit, students learn how to talk naturally about plans, intentions, schedules, goals, and future dreams in everyday Palestinian spoken Arabic. The focus is on real conversation patterns like بدي, رح, ناوي, حابب, and مخطط, with useful time expressions and supportive everyday phrases.",
        goals: [
            "Use بدي + verb to talk about wants and near intentions.",
            "Use رح + verb to talk about future plans and expected actions.",
            "Compare ناوي، حابب، مخطط and choose the right strength of intention.",
            "Talk about study, work, travel, goals, and future projects.",
            "Ask about other people's plans and react with natural Palestinian expressions.",
        ],
    },

    // ====================================
    // VOCABULARY
    // ====================================
    vocabulary: {
        core: [
            {
                id: "baddi",
                ar: "بدي",
                en: "I want / I am going to",
                enArabeezy: "baddi",
                hint: "The most common spoken pattern for wants and personal plans. Forms: بدك baddak to a man, بدك baddik to a woman, بدو baddo, بدها baddha, بدنا baddna.",
                exampleAr: "بدي أبلش أدرس من بكرا.",
                exampleArabeezy: "baddi aballesh adros min bukra.",
                exampleEn: "I want to start studying from tomorrow.",
            },
            {
                id: "ra7",
                ar: "رح",
                en: "will / going to",
                enArabeezy: "ra7",
                hint: "Future marker before a present verb. It sounds more like a plan or expectation than a wish.",
                exampleAr: "الأسبوع الجاي رح نبلش وحدة جديدة.",
                exampleArabeezy: "il-usbu3 il-jay ra7 niballesh wa7de jdide.",
                exampleEn: "Next week we will start a new unit.",
            },
            {
                id: "nawi",
                ar: "ناوي",
                en: "intending / planning in my mind",
                enArabeezy: "nawi",
                hint: "Use for an intention you have decided inside yourself. Feminine: ناوية nawyeh. Plural: ناويين nawyin. Often followed directly by a verb: ناوي أبلش.",
                exampleAr: "أنا ناوي أتعلم عربي بشكل جدي.",
                exampleArabeezy: "ana nawi at3allam 3arabi bshakel jeddi.",
                exampleEn: "I intend to learn Arabic seriously.",
            },
            {
                id: "nawyeh",
                ar: "ناوية",
                en: "intending (female speaker)",
                enArabeezy: "nawyeh",
                hint: "Female form of ناوي. Teach it early because students constantly talk about themselves.",
                exampleAr: "أنا ناوية أكتب أهدافي اليوم.",
                exampleArabeezy: "ana nawyeh aktob ahdafi il-yom.",
                exampleEn: "I intend to write my goals today.",
            },
            {
                id: "7abeb",
                ar: "حابب",
                en: "I would like / I feel like",
                enArabeezy: "7abeb",
                hint: "Softer than بدي. Feminine: حابة 7abbeh. Use it for hopes, preferences, and dreams without sounding too forceful.",
                exampleAr: "حابب أجرب شغل جديد هالسنة.",
                exampleArabeezy: "7abeb ajarreb shoghol jdid hal-sane.",
                exampleEn: "I would like to try a new job this year.",
            },
            {
                id: "mkhattet",
                ar: "مخطط",
                en: "planning / have a plan",
                enArabeezy: "mkhattet",
                hint: "Stronger and more organized than ناوي. Feminine: مخططة mkhatteTa. Use it when there is an actual plan, not just a wish.",
                exampleAr: "مخطط أسافر شهر صغير بالصيف.",
                exampleArabeezy: "mkhattet asafar shahr zghir bis-seif.",
                exampleEn: "I am planning to travel for a short month in the summer.",
            },
            {
                id: "lazem",
                ar: "لازم",
                en: "must / have to",
                enArabeezy: "lazem",
                hint: "Use for obligations and non-negotiable plans. It comes before a verb: لازم أخلص، لازم أروح.",
                exampleAr: "لازم أخلص الشغل قبل الجمعة.",
                exampleArabeezy: "lazem akhalles ish-shoghol qabel il-jum3a.",
                exampleEn: "I have to finish the work before Friday.",
            },
            {
                id: "fakker",
                ar: "بفكر",
                en: "I am thinking of",
                enArabeezy: "bafakker",
                hint: "Useful when the plan is not final yet. To ask: بتفكر تعمل شو؟ btifakker ta3mel shu?",
                exampleAr: "بفكر أفتح مشروع صغير.",
                exampleArabeezy: "bafakker afta7 mashru3 zghir.",
                exampleEn: "I am thinking of opening a small project.",
            },
            {
                id: "ablash",
                ar: "أبلش",
                en: "to start",
                enArabeezy: "aballesh",
                hint: "Very common spoken verb. Present: ببلش baballesh. Command: بلش ballesh.",
                exampleAr: "رح أبلش التدريب الأسبوع الجاي.",
                exampleArabeezy: "ra7 aballesh it-tadrib il-usbu3 il-jay.",
                exampleEn: "I will start the training next week.",
            },
            {
                id: "akammel",
                ar: "أكمل",
                en: "to continue / complete",
                enArabeezy: "akammel",
                hint: "Use for studies, levels, projects, or goals. Present: بكمل bakammel.",
                exampleAr: "بدي أكمل مستوى أعلى بالعربي.",
                exampleArabeezy: "baddi akammel mustawa a3la bil-3arabi.",
                exampleEn: "I want to complete a higher level in Arabic.",
            },
            {
                id: "akhtet",
                ar: "أخطط",
                en: "to plan",
                enArabeezy: "akhattet",
                hint: "The verb behind مخطط. Use it for practical planning: وقت، سفر، مشروع.",
                exampleAr: "لازم أخطط وقتي أحسن.",
                exampleArabeezy: "lazem akhattet wa2ti a7san.",
                exampleEn: "I have to plan my time better.",
            },
            {
                id: "elyom",
                ar: "اليوم",
                en: "today",
                enArabeezy: "il-yom",
                hint: "Very common time word. In speech it often sounds like il-yom.",
                exampleAr: "اليوم بدي أرتب أفكاري.",
                exampleArabeezy: "il-yom baddi aratteb afkari.",
                exampleEn: "Today I want to organize my thoughts.",
            },
            {
                id: "bukra",
                ar: "بكرا",
                en: "tomorrow",
                enArabeezy: "bukra",
                hint: "Use with بدي or رح for near plans. بكرا الصبح = tomorrow morning.",
                exampleAr: "بكرا رح أحكي مع الأستاذ.",
                exampleArabeezy: "bukra ra7 a7ki ma3 il-ustaz.",
                exampleEn: "Tomorrow I will talk with the teacher.",
            },
            {
                id: "ba3d_bukra",
                ar: "بعد بكرا",
                en: "the day after tomorrow",
                enArabeezy: "ba3d bukra",
                hint: "A fixed spoken time expression. Put it at the start or end of the sentence.",
                exampleAr: "بعد بكرا عندي مقابلة.",
                exampleArabeezy: "ba3d bukra 3andi muqable.",
                exampleEn: "The day after tomorrow I have an interview.",
            },
            {
                id: "hal_usbu3",
                ar: "هالأسبوع",
                en: "this week",
                enArabeezy: "hal-usbu3",
                hint: "هال means this. Also: هالشهر hal-shahr, هالسنة hal-sane.",
                exampleAr: "هالأسبوع لازم أركز عالدراسة.",
                exampleArabeezy: "hal-usbu3 lazim arakkez 3ad-drase.",
                exampleEn: "This week I have to focus on studying.",
            },
            {
                id: "il_usbu3_il_jay",
                ar: "الأسبوع الجاي",
                en: "next week",
                enArabeezy: "il-usbu3 il-jay",
                hint: "Common future time phrase. In everyday speech الجاي is enough; feminine agreement is not strict here.",
                exampleAr: "الأسبوع الجاي رح أقعد مع صاحبي.",
                exampleArabeezy: "il-usbu3 il-jay ra7 a23od ma3 sa7bi.",
                exampleEn: "Next week I will sit with my friend.",
            },
            {
                id: "ish_shahr_il_jay",
                ar: "الشهر الجاي",
                en: "next month",
                enArabeezy: "ish-shahr il-jay",
                hint: "Use for plans that feel close but not immediate.",
                exampleAr: "الشهر الجاي ناوي أبلش رياضة.",
                exampleArabeezy: "ish-shahr il-jay nawi aballesh riyada.",
                exampleEn: "Next month I intend to start exercising.",
            },
            {
                id: "hal_sane",
                ar: "هالسنة",
                en: "this year",
                enArabeezy: "hal-sane",
                hint: "Great for goals and resolutions. Also heard as السنة هاي is-sane hay.",
                exampleAr: "هالسنة حابة أتعلم شغلة جديدة.",
                exampleArabeezy: "hal-sane 7abbeh at3allam shaghle jdide.",
                exampleEn: "This year I would like to learn something new.",
            },
            {
                id: "is_sane_il_jayye",
                ar: "السنة الجاي",
                en: "next year",
                enArabeezy: "is-sane il-jayye",
                hint: "Many speakers say السنة الجاي in casual speech; السنة الجاية is also common.",
                exampleAr: "السنة الجاي مخطط أغير شغلي.",
                exampleArabeezy: "is-sane il-jayye mkhattet aghayyer shoghli.",
                exampleEn: "Next year I am planning to change my job.",
            },
            {
                id: "ba3den",
                ar: "بعدين",
                en: "later / then",
                enArabeezy: "ba3den",
                hint: "Use it to connect steps in a plan: first this, then that.",
                exampleAr: "بدي أدرس شوي، بعدين أطلع أتمشى.",
                exampleArabeezy: "baddi adros shway, ba3den aTla3 atmasha.",
                exampleEn: "I want to study a bit, then go out for a walk.",
            },
            {
                id: "mashru3",
                ar: "مشروع",
                en: "project / business project",
                enArabeezy: "mashru3",
                hint: "Can mean a study project, work project, or small business idea. Plural: مشاريع mashari3.",
                exampleAr: "عمر بده يفتح مشروع صغير.",
                exampleArabeezy: "omar baddo yifta7 mashru3 zghir.",
                exampleEn: "Omar wants to open a small project.",
            },
            {
                id: "tadrib",
                ar: "تدريب",
                en: "training / internship",
                enArabeezy: "tadrib",
                hint: "Useful for work and study plans. تدريب بشركة = internship/training at a company.",
                exampleAr: "مالك رح يبلش تدريب بشركة سوفتوير.",
                exampleArabeezy: "malek ra7 yiballesh tadrib bshirket software.",
                exampleEn: "Malek will start an internship at a software company.",
            },
            {
                id: "shirket_software",
                ar: "شركة سوفتوير",
                en: "software company",
                enArabeezy: "shirket software",
                hint: "A natural modern phrase; many Palestinians say سوفتوير in tech contexts.",
                exampleAr: "حلمي أشتغل بشركة سوفتوير محترمة.",
                exampleArabeezy: "7ilmi ashtaghel bshirket software mu7tarame.",
                exampleEn: "My dream is to work at a good software company.",
            },
            {
                id: "7ilm",
                ar: "حلم",
                en: "dream",
                enArabeezy: "7ilm",
                hint: "Plural: أحلام a7lam. Use for life dreams or career goals.",
                exampleAr: "هاد الحلم صار له سنين ببالي.",
                exampleArabeezy: "had il-7ilm sar lo snin bbali.",
                exampleEn: "This dream has been on my mind for years.",
            },
            {
                id: "hadaf",
                ar: "هدف",
                en: "goal",
                enArabeezy: "hadaf",
                hint: "Plural: أهداف ahdaf. Very useful for plans and self-improvement.",
                exampleAr: "اليوم رح أكتب ثلاث أهداف.",
                exampleArabeezy: "il-yom ra7 aktob talat ahdaf.",
                exampleEn: "Today I will write three goals.",
            },
            {
                id: "wa2t",
                ar: "وقت",
                en: "time",
                enArabeezy: "wa2t",
                hint: "Key word for planning. تنظيم الوقت = time management.",
                exampleAr: "مشكلتي إني بضيع وقت عالتلفون.",
                exampleArabeezy: "moshkelti inni baDayye3 wa2t 3at-telefon.",
                exampleEn: "My problem is that I waste time on the phone.",
            },
            {
                id: "anzem_wa2tak",
                ar: "نظم وقتك",
                en: "organize your time",
                enArabeezy: "nazzem wa2tak",
                hint: "Practical advice. To a woman: نظمي وقتك nazzmi wa2tik. To a group: نظموا وقتكم nazzmu wa2tkum.",
                exampleAr: "إذا بدك تنجح، نظم وقتك شوي شوي.",
                exampleArabeezy: "iza baddak tinja7, nazzem wa2tak shway shway.",
                exampleEn: "If you want to succeed, organize your time step by step.",
            },
            {
                id: "awazen",
                ar: "أوازن",
                en: "to balance",
                enArabeezy: "awazen",
                hint: "Use for balancing work, family, study, and rest.",
                exampleAr: "بدي أتعلم أوازن بين الشغل والبيت.",
                exampleArabeezy: "baddi at3allam awazen ben ish-shoghol wil-bet.",
                exampleEn: "I want to learn to balance work and home.",
            },
            {
                id: "iltizamat",
                ar: "التزامات",
                en: "commitments",
                enArabeezy: "iltizamat",
                hint: "Usually plural. Sounds natural for work, family, money, and study responsibilities.",
                exampleAr: "عندي التزامات عائلية هالأسبوع.",
                exampleArabeezy: "3andi iltizamat 3a2iliye hal-usbu3.",
                exampleEn: "I have family commitments this week.",
            },
            {
                id: "tashattot",
                ar: "تشتت",
                en: "distraction",
                enArabeezy: "tashattot",
                hint: "Useful modern word for phones, social media, and focus.",
                exampleAr: "التشتت بخرب التخطيط.",
                exampleArabeezy: "it-tashattot bikharreb it-takhTit.",
                exampleEn: "Distraction ruins planning.",
            },
            {
                id: "rutin",
                ar: "روتين",
                en: "routine",
                enArabeezy: "routine",
                hint: "A borrowed word used naturally in speech. روتين الخوف = a pattern of fear.",
                exampleAr: "بدي أطلع من روتين الخوف.",
                exampleArabeezy: "baddi aTla3 min routine il-khof.",
                exampleEn: "I want to get out of the routine of fear.",
            },
            {
                id: "mukhattatatak",
                ar: "مخططاتك",
                en: "your plans",
                enArabeezy: "mukhattatatak",
                hint: "To a man: مخططاتك mukhattatatak. To a woman, often same pronunciation in fast speech; careful form: مخططاتِك mukhattatatik.",
                exampleAr: "شو مخططاتك لهالسنة؟",
                exampleArabeezy: "shu mukhattatatak la-hal-sane?",
                exampleEn: "What are your plans for this year?",
            },
            {
                id: "sho_baddak_ta3mel",
                ar: "شو بدك تعمل؟",
                en: "What do you want to do?",
                enArabeezy: "shu baddak ta3mel?",
                hint: "To a woman: شو بدك تعملي؟ shu baddik ta3mali? A must-have question for planning conversations.",
                exampleAr: "شو بدك تعمل بعد التخرج؟",
                exampleArabeezy: "shu baddak ta3mel ba3d it-takharruj?",
                exampleEn: "What do you want to do after graduation?",
            },
            {
                id: "3indak_khotta",
                ar: "عندك خطة؟",
                en: "Do you have a plan?",
                enArabeezy: "3indak khoTta?",
                hint: "To a woman: عندِك خطة؟ 3indik khoTta? Plural: عندكم خطة؟ 3indkum khoTta?",
                exampleAr: "للویکند، عندك خطة ولا لسه؟",
                exampleArabeezy: "lal-weekend, 3indak khoTta wala lissa?",
                exampleEn: "For the weekend, do you have a plan or not yet?",
            },
            {
                id: "takharruj",
                ar: "تخرج",
                en: "graduation",
                enArabeezy: "takharruj",
                hint: "Often used with بعد: بعد التخرج = after graduation.",
                exampleAr: "بعد التخرج حابب أشتغل بمجالي.",
                exampleArabeezy: "ba3d it-takharruj 7abeb ashtaghel bmajali.",
                exampleEn: "After graduation I would like to work in my field.",
            },
            {
                id: "majali",
                ar: "مجالي",
                en: "my field",
                enArabeezy: "majali",
                hint: "Useful for career talk. مجالك majalak/majalik = your field.",
                exampleAr: "بدي أشتغل بمجالي مش بأي شغل.",
                exampleArabeezy: "baddi ashtaghel bmajali mish b-ay shoghol.",
                exampleEn: "I want to work in my field, not in just any job.",
            },
            {
                id: "tahweeshet_il_3omr",
                ar: "تحويشة العمر",
                en: "life savings",
                enArabeezy: "ta7wishet il-3omor",
                hint: "A strong emotional phrase. تحويشة means saved-up money.",
                exampleAr: "مش سهل الواحد يخاطر بتحويشة العمر.",
                exampleArabeezy: "mish sahel il-wa7ad ykhaTer bta7wishet il-3omor.",
                exampleEn: "It is not easy for someone to risk their life savings.",
            },
            {
                id: "ila_iza",
                ar: "إلا إذا",
                en: "unless / except if",
                enArabeezy: "illa iza",
                hint: "Use when a plan might change because of one condition.",
                exampleAr: "رح أجي عالدرس إلا إذا صار إشي طارئ.",
                exampleArabeezy: "ra7 aji 3ad-dars illa iza sar ishi Tare2.",
                exampleEn: "I will come to the lesson unless something urgent happens.",
            },
        ],

        extra: [
            {
                id: "tadriji",
                ar: "تدريجي",
                en: "gradual",
                enArabeezy: "tadriji",
                hint: "Use it with improvement: بشكل تدريجي = gradually. Spoken alternative: شوي شوي.",
                exampleAr: "بدي أتقدم بشكل تدريجي، شوي شوي.",
                exampleArabeezy: "baddi atqaddam bshakel tadriji, shway shway.",
                exampleEn: "I want to improve gradually, step by step.",
            },
            {
                id: "maroone",
                ar: "مرونة",
                en: "flexibility",
                enArabeezy: "maroone",
                hint: "Useful when talking about plans that may need to change.",
                exampleAr: "التخطيط بده مرونة، مش بس جدول.",
                exampleArabeezy: "it-takhTit baddo maroone, mish bas jadwal.",
                exampleEn: "Planning needs flexibility, not just a schedule.",
            },
            {
                id: "Tare2",
                ar: "طارئ",
                en: "urgent / emergency",
                enArabeezy: "Tare2",
                hint: "Used in the expression إشي طارئ = something urgent came up.",
                exampleAr: "ممكن أتأخر إذا صار إشي طارئ.",
                exampleArabeezy: "mumken at2akhar iza sar ishi Tare2.",
                exampleEn: "I might be late if something urgent happens.",
            },
        ],
    },

    // ====================================
    // EXPRESSIONS
    // ====================================
    expressions: [
        {
            ar: "الله يعينك",
            en: "May God help you / hang in there",
            explanation: "A warm response when someone is tired, busy, or under pressure.",
        },
        {
            ar: "شد حيلك",
            en: "Put in effort / keep going",
            explanation: "Supportive encouragement before study, work, training, or a challenge. To a woman: شدي حيلك.",
        },
        {
            ar: "معك حق",
            en: "You are right",
            explanation: "Natural agreement in conversation; softer and more spoken than أنت على حق.",
        },
        {
            ar: "هيك بدي أشوفك",
            en: "That is how I want to see you",
            explanation: "Friendly encouragement when someone sounds motivated or confident.",
        },
        {
            ar: "على بركة الله",
            en: "With God's blessing / let's begin",
            explanation: "Said when starting something with hope and seriousness.",
        },
        {
            ar: "الله يوفقك",
            en: "May God give you success",
            explanation: "Very common wish before exams, work, travel, or a new plan. For a group: الله يوفقكم.",
        },
        {
            ar: "إحنا لبعض",
            en: "We are here for each other",
            explanation: "Warm phrase between friends or family when offering support.",
        },
        {
            ar: "الدنيا بدها صبر",
            en: "Life needs patience",
            explanation: "Used when life feels heavy or plans are taking time.",
        },
        {
            ar: "أول خطوة أصعب خطوة",
            en: "The first step is the hardest",
            explanation: "Encouragement when someone is about to start a plan or change.",
        },
        {
            ar: "كل إشي بوقته",
            en: "Everything in its time",
            explanation: "Used to calm someone who is rushing or worried about timing.",
        },
    ],

    // ====================================
    // DIALOGUE - LONG SCENE
    // ====================================
    dialogue: {
        lines: [
            { speaker: "Omar", ar: "يا هلا يا مالك! كيفك يا زلمة؟ من زمان ما قعدنا قعدة رايقة.", arArabeezy: "ya hala ya malek! keefak ya zalame? min zaman ma q3adna qa3de ray2a.", en: "Hey Malek! How are you, man? We haven’t had a relaxed sit-down in a long time." },
            { speaker: "Malek", ar: "والله يا عمر الشغل ماكل وقتي، بس بنفس الوقت مبسوط عشان الأسبوع الجاي عندي إشي مهم.", arArabeezy: "wallah ya omar ish-shoghol makel wa2ti, bas bnafs il-wa2t mabsuT 3ashan il-usbu3 il-jay 3andi ishi muhim.", en: "Honestly Omar, work is eating up my time, but at the same time I’m happy because next week I have something important." },
            { speaker: "Omar", ar: "الله يعينك. الدنيا بدها صبر ونفس طويل. شو الإشي المهم؟", arArabeezy: "allah y3inak. id-dinya biddha Sabr w nafas Tawil. shu il-ishi il-muhim?", en: "May God help you. Life needs patience and stamina. What’s the important thing?" },
            { speaker: "Malek", ar: "ناوي أبلش تدريب بشركة سوفتوير. حاسس إنه هاد الباب اللي كنت مستنيه.", arArabeezy: "nawi aballesh tadrib bshirket software. 7ases inno had il-bab illi kunt mistannih.", en: "I’m planning to start an internship at a software company. I feel like this is the door I was waiting for." },
            { speaker: "Omar", ar: "ممتاز. بس دير بالك، التخطيط مش بس ورقة وقلم؛ بده مرونة كمان.", arArabeezy: "mumtaz. bas dir balak, it-takhTit mish bas wara2a w 2alam; baddo maroone kaman.", en: "Excellent. But pay attention, planning isn’t just paper and pen; it needs flexibility too." },
            { speaker: "Malek", ar: "عارف، بس مرات بخاف أضيع وقتي وتعدي السنين وأنا مكاني.", arArabeezy: "3aref, bas marrat bakhaf aDayye3 wa2ti w te3addi is-snin w ana makani.", en: "I know, but sometimes I’m afraid of wasting my time and the years passing while I stay in the same place." },
            { speaker: "Omar", ar: "الخوف طبيعي، بس إذا ضليت تستنى الوقت المناسب، ما رح تبلش.", arArabeezy: "il-khof Tabi3i, bas iza Dallit tistanna il-wa2t il-munasib, ma ra7 tiballesh.", en: "Fear is normal, but if you keep waiting for the perfect time, you won’t start." },
            { speaker: "Malek", ar: "معك حق. يمكن أنا مستعجل شوي. وإنت؟ شو بدك تعمل بعد التخرج؟", arArabeezy: "ma3ak 7a2. yimken ana mista3jel shway. w inta? shu baddak ta3mel ba3d it-takharruj?", en: "You’re right. Maybe I’m rushing a bit. And you? What do you want to do after graduation?" },
            { speaker: "Omar", ar: "بفكر أفتح مشروع صغير. مش إشي كبير بالبداية، بس خطوة عملية.", arArabeezy: "bafakker afta7 mashru3 zghir. mish ishi kbir bil-bidaye, bas khaTwe 3amaliye.", en: "I’m thinking of opening a small project. Nothing big at the beginning, just a practical step." },
            { speaker: "Malek", ar: "مشروع؟ هاي مخاطرة يا عمر. ما بتخاف تخسر تحويشة العمر؟", arArabeezy: "mashru3? hay mukhatara ya omar. ma bitkhaf tikhsar ta7wishet il-3omor?", en: "A project? That’s a risk, Omar. Aren’t you afraid of losing your life savings?" },
            { speaker: "Omar", ar: "بخاف أكيد، بس القعدة بالراحة بتقتل الطموح شوي شوي.", arArabeezy: "bakhaf akid, bas il-qa3de bir-ra7a bit2tol it-Tumu7 shway shway.", en: "Of course I’m afraid, but staying comfortable kills ambition little by little." },
            { speaker: "Malek", ar: "كلامك بيوجع شوي، بس صح. يمكن التدريب يساعدني أطلع من روتين الخوف.", arArabeezy: "kalamak biwja3 shway, bas Sa7. yimken it-tadrib ysa3edni aTla3 min routine il-khof.", en: "Your words sting a bit, but they’re true. Maybe the internship will help me get out of the routine of fear." },
            { speaker: "Omar", ar: "هاد هو. أول خطوة أصعب خطوة، وبعدها الطريق بيوضح.", arArabeezy: "had huwe. awwal khaTwe aS3ab khaTwe, w ba3dha iT-Tari2 biywaDHa7.", en: "That’s it. The first step is the hardest, and after it the path becomes clearer." },
            { speaker: "Malek", ar: "بس كيف بقدر أوازن بين التدريب والشغل والالتزامات العائلية؟", arArabeezy: "bas keef ba2dar awazen ben it-tadrib wish-shoghol wil-iltizamat il-3a2iliye?", en: "But how can I balance the internship, work, and family commitments?" },
            { speaker: "Omar", ar: "نظم وقتك. قلل قعدة التلفون، وخلي كل يوم فيه شغلة واضحة.", arArabeezy: "nazzem wa2tak. qallel qa3det it-telefon, w khalli kull yom fih shaghle waD7a.", en: "Organize your time. Reduce sitting on the phone, and make every day have one clear task." },
            { speaker: "Malek", ar: "صح، التشتت هو اللي بخرب كل خطة عندي.", arArabeezy: "Sa7, it-tashattot huwe illi bikharreb kull khoTta 3andi.", en: "True, distraction is what ruins every plan I have." },
            { speaker: "Omar", ar: "شو رأيك نتابع مع بعض؟ أنا برتب مشروعي، وإنت بتشد حيلك بالتدريب.", arArabeezy: "shu ra2yak ntabe3 ma3 ba3D? ana baratteb mashru3i, w inta bitshidd 7elak bit-tadrib.", en: "What do you think about following up together? I organize my project, and you put effort into your internship." },
            { speaker: "Malek", ar: "فكرة بتجنن. هيك بنشجع بعض وبنضل صاحيين عحالنا.", arArabeezy: "fikra bitjannen. hek bnshajje3 ba3D w bnDall Sa7yin 3a7alna.", en: "That’s an awesome idea. This way we encourage each other and stay alert with ourselves." },
            { speaker: "Omar", ar: "تمام. كل أسبوع بنقعد نص ساعة وبنشوف وين وصلنا.", arArabeezy: "tamam. kull usbu3 bnq3od nuSS sa3a w bnshuf wen wiSilna.", en: "Great. Every week we sit for half an hour and see where we’ve reached." },
            { speaker: "Malek", ar: "هيك تحمست زيادة. رح أبلش من بكرا، جد مش حكي.", arArabeezy: "hek t7ammast ziyade. ra7 aballesh min bukra, jad mish 7aki.", en: "Now I’m even more excited. I’ll start from tomorrow, seriously, not just talk." },
            { speaker: "Omar", ar: "هيك بدي أشوفك. الهمة العالية نص الطريق.", arArabeezy: "hek baddi ashufak. il-himme il-3alye nuSS iT-Tari2.", en: "That’s how I want to see you. High motivation is half the road." },
            { speaker: "Malek", ar: "الله يسعدك يا عمر، دايما بتعطيني دفعة لقدام.", arArabeezy: "allah yis3edak ya omar, dayman bti3Tini daf3a la-2oddam.", en: "May God make you happy, Omar. You always give me a push forward." },
            { speaker: "Omar", ar: "إحنا لبعض يا زلمة. يلا هلقيت خلينا نطلب غدا ونكمل حكي.", arArabeezy: "i7na la-ba3D ya zalame. yalla halla2 khallina noTlob ghada w nkammel 7aki.", en: "We’re here for each other, man. Come on, now let’s order lunch and keep talking." },
            { speaker: "Malek", ar: "يلا، أنا جوعان كتير. بعد الغدا بحكي لك عن تفاصيل التدريب.", arArabeezy: "yalla, ana ju3an ktir. ba3d il-ghada ba7ki lak 3an tafasil it-tadrib.", en: "Let’s go, I’m really hungry. After lunch I’ll tell you the internship details." },
            { speaker: "Omar", ar: "اتفقنا. بكرا بداية جديدة لإلنا إحنا الاثنين.", arArabeezy: "ittafa2na. bukra bidaye jdide ilna i7na it-tnen.", en: "Agreed. Tomorrow is a new beginning for both of us." },
            { speaker: "Malek", ar: "على بركة الله. نتوكل ونبلش.", arArabeezy: "3ala baraket allah. nitwakkal w niballesh.", en: "With God’s blessing. We trust and begin." },
            { speaker: "Omar", ar: "المستقبل للناس اللي بتتحرك، مش للناس اللي بتضل تستنى.", arArabeezy: "il-mustaqbal lin-nas illi btit7arrak, mish lin-nas illi btDall tistanna.", en: "The future is for people who move, not for people who keep waiting." },
            { speaker: "Malek", ar: "خلص، اليوم رح أكتب أهدافي وأقسمهم خطوات صغيرة.", arArabeezy: "khalaS, il-yom ra7 aktob ahdafi w a2assemhom khaTawat zghire.", en: "That’s it, today I’ll write my goals and divide them into small steps." },
            { speaker: "Omar", ar: "ممتاز. الكتابة بتخلي الهدف أوضح، وبترجعك للطريق إذا تلخبطت.", arArabeezy: "mumtaz. il-kitabe bitkhalli il-hadaf awDa7, w bitraj3ak laT-Tari2 iza tlakhbaTt.", en: "Excellent. Writing makes the goal clearer, and brings you back to the path if you get mixed up." },
            { speaker: "Malek", ar: "صح، وبدي أحط وقت محدد لكل خطوة عشان ما أضل أجل.", arArabeezy: "Sa7, w baddi a7oT wa2t m7addad la-kull khaTwe 3ashan ma aDall ajjel.", en: "True, and I want to set a specific time for each step so I don’t keep postponing." },
            { speaker: "Omar", ar: "بالزبط. الخطة البسيطة اللي بتتنفذ أحسن من خطة كبيرة عالورق.", arArabeezy: "biz-zabT. il-khoTta il-basiTa illi btitnaffaz a7san min khoTta kbire 3al-wara2.", en: "Exactly. A simple plan that gets done is better than a big plan on paper." },
            { speaker: "Malek", ar: "شكرا يا عمر. حسيت الأمور صارت أخف بعقلي.", arArabeezy: "shukran ya omar. 7asset il-omor Sarat akhaff b3a2li.", en: "Thanks, Omar. I feel like things became lighter in my mind." },
            { speaker: "Omar", ar: "العفو يا صاحبي. الله يوفقك بالتدريب، وشد حيلك.", arArabeezy: "il-3afw ya Sa7bi. allah ywaf2ak bit-tadrib, w shidd 7elak.", en: "You’re welcome, my friend. May God give you success in the internship, and keep going." },
            { speaker: "Malek", ar: "وإنت كمان الله يوفقك بمشروعك. الأسبوع الجاي بنشوف وين وصلنا.", arArabeezy: "w inta kaman allah ywaf2ak bmashru3ak. il-usbu3 il-jay bnshuf wen wiSilna.", en: "And may God give you success with your project too. Next week we’ll see where we’ve reached." },
        ]
    },

    // ====================================
    // GRAMMAR
    // ====================================
    grammar: [
        {
            id: "baddi_verb",
            title: "بدي + Verb (intentions and wants)",
            short: "Use بدي before a verb for wants and near personal plans.",
            description:
                `In Palestinian Arabic, بدي is one of the most useful ways to talk about what you want or what you are going to do.
It can mean "I want to" or "I am going to" depending on context.

Pattern:
بدي + present verb.`,
            table: {
                title: "بدي Forms",
                headers: ["Arabic", "Arabeezy", "English", "Use"],
                rows: [
                    ["بدي أبلش", "baddi aballesh", "I want to start", "Speaker"],
                    ["بدك تبلش؟", "baddak tiballesh?", "Do you want to start? (m)", "Male listener"],
                    ["بدك تبلشي؟", "baddik tiballshi?", "Do you want to start? (f)", "Female listener"],
                    ["بدو يفتح مشروع", "baddo yifta7 mashru3", "He wants to open a project", "Male"],
                    ["بدنا نتابع", "baddna ntabe3", "We want to follow up", "Group"],
                ]
            },
            examples: [
                { ar: "بدي أكتب أهدافي اليوم.", arabeezy: "baddi aktob ahdafi il-yom.", en: "I want to write my goals today." },
                { ar: "بدك تعمل شو بعد التخرج؟", arabeezy: "baddak ta3mel shu ba3d it-takharruj?", en: "What do you want to do after graduation?" },
                { ar: "بدها تبلش تدريب الأسبوع الجاي.", arabeezy: "baddha tiballesh tadrib il-usbu3 il-jay.", en: "She wants to start training next week." },
                { ar: "بدنا نقعد كل أسبوع.", arabeezy: "baddna nq3od kull usbu3.", en: "We want to sit together every week." },
                { ar: "بدي أوازن بين الشغل والدراسة.", arabeezy: "baddi awazen ben ish-shoghol wid-drase.", en: "I want to balance work and study." },
            ],
            teacherNotes:
                `Keep بدي very practical. It is more useful for beginners and intermediate students than abstract future grammar.
Students should hear that بدي can be a want or an intention depending on context.
Practice fast connected speech: بدك baddak/baddik, بدو baddo, بدها baddha.`,
            commonMistakes: [
                "Using أنا أريد in spoken conversation instead of بدي.",
                "Using the wrong listener form: بدك for masculine and بدك/بدِك pronunciation for feminine.",
                "Adding إن after بدي in simple beginner sentences.",
            ],
            functionalUse: "Use this to say what you want to do today, tomorrow, or soon.",
        },
        {
            id: "ra7_verb",
            title: "رح + Verb (future plans)",
            short: "رح before a verb marks future action.",
            description:
                `رح is the everyday Palestinian future marker.
It comes before the present verb and usually means "will" or "going to".

Pattern:
رح + present verb.`,
            table: {
                title: "Future with رح",
                headers: ["Arabic", "Arabeezy", "English", "Use"],
                rows: [
                    ["رح أبلش", "ra7 aballesh", "I will start", "Speaker"],
                    ["رح تبلش", "ra7 tiballesh", "You/he will start", "Depends on context"],
                    ["رح تبلشي", "ra7 tiballshi", "You/she will start (f)", "Female"],
                    ["رح نتابع", "ra7 ntabe3", "We will follow up", "Group"],
                    ["رح يفتح مشروع", "ra7 yifta7 mashru3", "He will open a project", "Male"],
                ]
            },
            examples: [
                { ar: "بكرا رح أبلش من جديد.", arabeezy: "bukra ra7 aballesh min jdid.", en: "Tomorrow I will start again." },
                { ar: "الأسبوع الجاي رح نشوف وين وصلنا.", arabeezy: "il-usbu3 il-jay ra7 nshuf wen wiSilna.", en: "Next week we will see where we have reached." },
                { ar: "رح أجي عالدرس إلا إذا صار إشي طارئ.", arabeezy: "ra7 aji 3ad-dars illa iza sar ishi Tare2.", en: "I will come to class unless something urgent happens." },
                { ar: "رح أكتب كل خطوة بوقت محدد.", arabeezy: "ra7 aktob kull khaTwe bwa2t m7addad.", en: "I will write each step with a specific time." },
                { ar: "رح يبلش التدريب بشركة سوفتوير.", arabeezy: "ra7 yiballesh it-tadrib bshirket software.", en: "He will start the internship at a software company." },
            ],
            teacherNotes:
                `Contrast رح with بدي:
بدي often expresses desire/intention.
رح focuses more on the future action itself.
Do not introduce سوف here; it sounds formal and MSA-like for this lesson.`,
            commonMistakes: [
                "Using سوف in normal youth conversation.",
                "Putting رح after the verb instead of before it.",
                "Using رح for a past event.",
            ],
            functionalUse: "Use this to talk about concrete future actions and expected plans.",
        },
        {
            id: "intention_strength",
            title: "ناوي / حابب / مخطط",
            short: "These words show how strong or organized your intention is.",
            description:
                `Palestinian Arabic has several natural ways to talk about intention.
حابب is soft: I would like.
ناوي is stronger: I intend.
مخطط is organized: I have a plan.

Pattern:
حابب/ناوي/مخطط + verb.`,
            table: {
                title: "Intention Strength",
                headers: ["Arabic", "Arabeezy", "English", "Feeling"],
                rows: [
                    ["حابب أتعلم", "7abeb at3allam", "I would like to learn", "Soft wish"],
                    ["حابة أتعلم", "7abbeh at3allam", "I would like to learn (f)", "Soft wish"],
                    ["ناوي أبلش", "nawi aballesh", "I intend to start", "Personal decision"],
                    ["ناوية أبلش", "nawyeh aballesh", "I intend to start (f)", "Personal decision"],
                    ["مخطط أسافر", "mkhattet asafar", "I am planning to travel", "Organized plan"],
                ]
            },
            examples: [
                { ar: "حابب أجرب شغل جديد هالسنة.", arabeezy: "7abeb ajarreb shoghol jdid hal-sane.", en: "I would like to try a new job this year." },
                { ar: "ناوي أبلش تدريب الأسبوع الجاي.", arabeezy: "nawi aballesh tadrib il-usbu3 il-jay.", en: "I intend to start training next week." },
                { ar: "مخطط أفتح مشروع صغير.", arabeezy: "mkhattet afta7 mashru3 zghir.", en: "I am planning to open a small project." },
                { ar: "حابة أحسن عربي بشكل تدريجي.", arabeezy: "7abbeh a7assen 3arabi bshakel tadriji.", en: "I would like to improve my Arabic gradually." },
                { ar: "ناوي أرتب وقتي وأخفف تلفون.", arabeezy: "nawi aratteb wa2ti w akhaffef telefon.", en: "I intend to organize my time and reduce phone use." },
            ],
            teacherNotes:
                `Use a scale on the board:
حابب = soft desire
ناوي = inner decision
مخطط = organized plan
Ask students to upgrade a sentence from حابب to ناوي to مخطط and notice how the meaning changes.`,
            commonMistakes: [
                "Using مخطط for a vague dream with no plan.",
                "Forgetting feminine forms: حابة، ناوية، مخططة.",
                "Overusing ناوي where حابب sounds more polite or realistic.",
            ],
            functionalUse: "Use these words to talk about dreams, goals, and plans with different levels of certainty.",
        }
    ],

    // ====================================
    // PRACTICE
    // ====================================
    microChecks: {
        enabled: true,
        every: 5,
        items: [
            {
                id: "mc_match_1",
                type: "match",
                prompt: "Match the English to Arabic: I want / I am going to",
                options: ["بدي", "رح", "ناوي", "مخطط", "حابب"],
                correct: "بدي",
            },
            {
                id: "mc_complete_2",
                type: "complete",
                prompt: "Complete: I have to finish the work before Friday.\n___ أخلص الشغل قبل الجمعة.",
                options: ["لازم", "اليوم", "بكرا", "بعد بكرا", "هالأسبوع"],
                correct: "لازم",
            },
            {
                id: "mc_reorder_3",
                type: "reorder",
                prompt: "Reorder to match: Next week we will start a new unit.",
                options: ["الأسبوع", "الجاي", "رح", "نبلش", "وحدة", "جديدة"],
                correct: ["الأسبوع", "الجاي", "رح", "نبلش", "وحدة", "جديدة"],
            },
            {
                id: "mc_choose_4",
                type: "choose",
                prompt: "Choose the Arabic word for: project",
                options: ["مشروع", "تدريب", "وقت", "تشتت", "هدف"],
                correct: "مشروع",
            },
            {
                id: "mc_match_5",
                type: "match",
                prompt: "Match the English to Arabic: Do you have a plan?",
                options: ["عندك خطة؟", "شو بدك تعمل؟", "الله يوفقك", "إحنا لبعض", "على بركة الله"],
                correct: "عندك خطة؟",
            },
        ],
    },

    practice: {
        quiz: [
            {
                id: "plans_q1",
                questionAr: "أي جملة بتحكي عن خطة للمستقبل؟",
                optionsEn: [
                    "أنا تعبان اليوم.",
                    "رح أبلش بكرا.",
                    "اسمي مالك.",
                ],
                correctIndex: 1,
            },
            {
                id: "plans_q2",
                questionAr: "«ناوي أبلش تدريب» معناها:",
                optionsEn: [
                    "I finished training.",
                    "I intend to start training.",
                    "I hate training.",
                ],
                correctIndex: 1,
            },
            {
                id: "plans_q3",
                questionAr: "«الأسبوع الجاي» معناها:",
                optionsEn: [
                    "this week",
                    "next week",
                    "last week",
                ],
                correctIndex: 1,
            },
            {
                id: "plans_q4",
                questionAr: "أي تعبير مناسب لتشجيع صاحبك؟",
                optionsEn: [
                    "شد حيلك",
                    "بعد بكرا",
                    "تشتت",
                ],
                correctIndex: 0,
            },
            {
                id: "plans_q5",
                questionAr: "«مخطط أفتح مشروع» بتحس إنه:",
                optionsEn: [
                    "a vague wish",
                    "an organized plan",
                    "a past habit",
                ],
                correctIndex: 1,
            },
        ],

        speakingTasks: [
            {
                id: "plans_speaking_personal_time",
                title: "Personal plans: today, tomorrow, next week, next year",
                instructions: "Answer in 8-10 sentences. You must use بدي, رح, ناوي/ناوية, حابب/حابة, and مخطط/مخططة at least once. Talk about اليوم، بكرا، الأسبوع الجاي، والسنة الجاي.",
                prompts: [
                    "اليوم شو بدك تعمل؟",
                    "بكرا شو رح تعمل؟",
                    "الأسبوع الجاي عندك خطة؟",
                    "السنة الجاي شو ناوي/ناوية تغير؟",
                ],
            },
            {
                id: "plans_speaking_goals",
                title: "Goals and time management",
                instructions: "Talk for one minute about three goals. Use لازم, بدي, رح, and إلا إذا. Mention one problem like تشتت, وقت, or التزامات.",
                prompts: [
                    "شو أهم هدف عندك هالسنة؟",
                    "كيف بدك تنظم وقتك؟",
                    "شو ممكن يخرب الخطة؟",
                ],
            },
            {
                id: "plans_speaking_dream_job",
                title: "Dream job or future project",
                instructions: "Describe a dream job or project. Use حابب/حابة for the dream, ناوي/ناوية for the decision, and مخطط/مخططة for the practical plan.",
                prompts: [
                    "شو الشغل أو المشروع اللي حابب توصله؟",
                    "شو أول خطوة رح تعملها؟",
                    "مين ممكن يساعدك أو يشجعك؟",
                ],
            },
        ],

        rolePlays: [
            "Role-play 1: Two friends meet after a busy week. Ask each other: شو مخططاتك؟ شو بدك تعمل بكرا؟ Use بدي، رح، بعدين، الأسبوع الجاي. One friend is practical and gives advice; the other is excited but worried.",
            "Role-play 2: Student and teacher make an Arabic study plan. The student explains goals and limits using بدي، لازم، ناوي/ناوية، إلا إذا. The teacher helps make the plan smaller and more realistic.",
            "Role-play 3: Two friends talk about future dreams after graduation. One wants a job or internship, the other wants a small project. Use حابب، ناوي، مخطط، الله يوفقك، شد حيلك، أول خطوة أصعب خطوة.",
        ],
        translation: [
            { id: "plan_t1", type: "enToAr", textEn: "I will travel next month.", textAr: "رح أسافر الشهر الجاي." },
            { id: "plan_t2", type: "arToEn", textEn: "We are going to meet tomorrow.", textAr: "رح نتقابل بكرا." },
            { id: "plan_t3", type: "enToAr", textEn: "Do you have plans this weekend?", textAr: "عندك خطط للويكند؟" },
            { id: "plan_t4", type: "arToEn", textEn: "I will call you later.", textAr: "رح أرن عليك بعدين." },
            { id: "plan_t5", type: "enToAr", textEn: "I want to organize my time.", textAr: "بدي أنظم وقتي." },
            { id: "plan_t6", type: "arToEn", textEn: "I intend to start training next week.", textAr: "ناوي أبلش تدريب الأسبوع الجاي." },
        ],
    },

    // ====================================
    // HOMEWORK
    // ====================================
    homework: {
        instructions:
            "Record a 60-90 second audio in Palestinian Arabic about your future plans.\n" +
            "- Start with 2-3 sentences about today and tomorrow using بدي and رح.\n" +
            "- Talk about next week and next year using ناوي/ناوية and مخطط/مخططة.\n" +
            "- Mention one study goal, one work or dream-job goal, and one personal/free-time plan.\n" +
            "- Use حابب/حابة for one dream or hope.\n" +
            "- Use لازم for one obligation.\n" +
            "- Use one expression from the lesson, like الله يوفقك، على بركة الله، or أول خطوة أصعب خطوة.\n" +
            "- Add one sentence with إلا إذا to show what could change your plan.",
    },

    // ====================================
    // TEACHER NOTES
    // ====================================
    teacherNotes: {
        warmup: [
            "Ask the student in English what they are planning today, tomorrow, and next week. Then map the answers into short Arabic chunks with بدي and رح.",
            "Draw a simple timeline: اليوم -> بكرا -> الأسبوع الجاي -> هالسنة -> السنة الجاي. Add one student plan under each point.",
        ],
        vocabularySteps: [
            "Teach the intention scale early: حابب = soft wish, ناوي = decision, مخطط = organized plan.",
            "Group time expressions together and recycle them with the same verbs: أبلش، أكمل، أشتغل، أسافر.",
            "Pull vocabulary from the dialogue after listening, especially تدريب، مشروع، هدف، وقت، تشتت، التزامات.",
        ],
        dialogueSteps: [
            "Read Omar with a practical, grounded tone and Malek with a more emotional, reflective tone.",
            "After every 5-6 lines, pause and ask: What is the plan? What is the worry? What advice did Omar give?",
            "Have the student personalize the dialogue by replacing training/project with their real study, work, or travel goal.",
        ],
        practiceTips: [
            "Do not overcorrect during speaking. Reformulate the student's answer naturally with the target structure.",
            "Force contrast: ask the same idea three ways with حابب، ناوي، مخطط so the student feels the difference.",
            "Use expressions as reactions, not vocabulary lists: الله يعينك after pressure, شد حيلك before a challenge, الله يوفقك before a new plan.",
        ],
        wrapup: [
            "End by asking for one concrete plan for tonight, tomorrow, next week, and next year.",
            "Ask the student to choose one expression they want to use naturally in the next lesson.",
            "Remind the student that the homework audio should sound like real speech, not a written essay.",
        ],
        myNotes: "",
    },
};
