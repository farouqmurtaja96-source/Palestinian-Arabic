import { LESSON_ID_GREETING } from '../../core/constants.js';

export const lessonId = LESSON_ID_GREETING;

export const lesson = {
    meta: {
        level: 'Beginner',
        unit: 'Greetings',
        lessonTitle: 'Unit 1 - Greetings & Introductions (Palestinian Arabic)'
    },

    overview: {
        title: 'Unit 1 - Greetings & Introductions',
        description:
            'A practical communication-first unit for foreign learners. Students learn to greet, introduce themselves, ask basic personal questions, and close conversations naturally in spoken Palestinian Arabic.',
        goals: [
            'Greet naturally by time and context (morning/evening/casual/religious).',
            'Introduce yourself with name, origin, and where you live now.',
            'Ask and answer simple personal questions politely.',
            'Use short follow-up questions to keep conversation going.',
            'Perform a full 6-10 line introduction conversation without English support.'
        ],
        canDo: [
            'I can start a conversation with an appropriate greeting.',
            'I can ask: شو اسمك؟ / من وين إنت؟ / وين ساكن؟',
            'I can respond naturally and ask back.',
            'I can end a short conversation politely.'
        ],
        tracks: {
            coreBeginner: 'Memorize and produce short high-frequency chunks.',
            stretchAdvanced: 'Vary register, react naturally, and extend small talk by 2-3 turns.'
        }
    },

    useInLife: [
        { ar: 'شو اسمك؟', en: 'What is your name?' },
        { ar: 'من وين إنت؟', en: 'Where are you from?' },
        { ar: 'وين ساكن/ة؟', en: 'Where do you live?' },
        { ar: 'تشرفنا.', en: 'Nice to meet you.' }
    ],

    vocabulary: {
        core: [
            {
                id: 'marhaba',
                ar: 'مرحبا',
                en: 'hello',
                enArabeezy: 'marhaba',
                hint: 'Neutral and very common.',
                exampleAr: 'مرحبا، كيفك؟',
                exampleArabeezy: 'marhaba, keefak?',
                exampleEn: 'Hello, how are you?'
            },
            {
                id: 'ahleen',
                ar: 'أهلين',
                en: 'hi / welcome',
                enArabeezy: 'ahleen',
                hint: 'Warm informal greeting.',
                exampleAr: 'أهلين يا أحمد.',
                exampleArabeezy: 'ahleen ya Ahmad.',
                exampleEn: 'Hi Ahmad.'
            },
            {
                id: 'sabah_el_kheir',
                ar: 'صباح الخير',
                en: 'good morning',
                enArabeezy: 'sabah el-kheir',
                hint: 'Morning greeting.',
                exampleAr: 'صباح الخير أستاذ.',
                exampleArabeezy: 'sabah el-kheir ustaz.',
                exampleEn: 'Good morning, teacher.'
            },
            {
                id: 'sabah_el_noor',
                ar: 'صباح النور',
                en: 'morning of light (reply)',
                enArabeezy: 'sabah en-noor',
                hint: 'Common reply to صباح الخير.',
                exampleAr: 'صباح الخير. - صباح النور.',
                exampleArabeezy: 'sabah el-kheir. - sabah en-noor.',
                exampleEn: 'Good morning. - Morning of light.'
            },
            {
                id: 'masa_el_kheir',
                ar: 'مسا الخير',
                en: 'good evening',
                enArabeezy: 'masa el-kheir',
                hint: 'Evening greeting.',
                exampleAr: 'مسا الخير يا جماعة.',
                exampleArabeezy: 'masa el-kheir ya jama3a.',
                exampleEn: 'Good evening, everyone.'
            },
            {
                id: 'masa_el_noor',
                ar: 'مسا النور',
                en: 'evening of light (reply)',
                enArabeezy: 'masa en-noor',
                hint: 'Reply to مسا الخير.',
                exampleAr: 'مسا الخير. - مسا النور.',
                exampleArabeezy: 'masa el-kheir. - masa en-noor.',
                exampleEn: 'Good evening. - Evening of light.'
            },
            {
                id: 'assalamu_3alaykom',
                ar: 'السلام عليكم',
                en: 'peace be upon you',
                enArabeezy: 'assalamu 3alaykom',
                hint: 'Very common and polite.',
                exampleAr: 'السلام عليكم يا شباب.',
                exampleArabeezy: 'assalamu 3alaykom ya shabab.',
                exampleEn: 'Peace be upon you, guys.'
            },
            {
                id: 'wa_3alaykom_assalam',
                ar: 'وعليكم السلام',
                en: 'and peace be upon you',
                enArabeezy: 'wa 3alaykom assalam',
                hint: 'Reply to السلام عليكم.',
                exampleAr: 'وعليكم السلام، أهلين.',
                exampleArabeezy: 'wa 3alaykom assalam, ahleen.',
                exampleEn: 'And peace be upon you, welcome.'
            },
            {
                id: 'keefak',
                ar: 'كيفك؟',
                en: 'how are you?',
                enArabeezy: 'keefak / keefik',
                hint: 'Daily spoken form.',
                exampleAr: 'كيفك اليوم؟',
                exampleArabeezy: 'keefak elyoom?',
                exampleEn: 'How are you today?'
            },
            {
                id: 'mnee7',
                ar: 'منيح/منيحة',
                en: 'fine / good',
                enArabeezy: 'mnee7 / mnee7a',
                hint: 'Most common positive answer.',
                exampleAr: 'أنا منيحة، الحمد لله.',
                exampleArabeezy: 'ana mnee7a, elhamdellah.',
                exampleEn: 'I am fine, thank God.'
            },
            {
                id: 'mashi_el_hal',
                ar: 'ماشي الحال',
                en: 'so-so / okay',
                enArabeezy: 'mashi el-7al',
                hint: 'Neutral answer.',
                exampleAr: 'كيفك؟ ماشي الحال.',
                exampleArabeezy: 'keefak? mashi el-7al.',
                exampleEn: 'How are you? So-so.'
            },
            {
                id: 'ta3ban',
                ar: 'تعبان/تعبانة',
                en: 'tired',
                enArabeezy: 'ta3ban / ta3baneh',
                hint: 'Physical or mental tiredness.',
                exampleAr: 'اليوم أنا تعبان شوي.',
                exampleArabeezy: 'elyoom ana ta3ban shway.',
                exampleEn: 'Today I am a bit tired.'
            },
            {
                id: 'shu_ismak',
                ar: 'شو اسمك؟',
                en: 'what is your name?',
                enArabeezy: 'shu ismak / shu ismik',
                hint: 'Basic opening question.',
                exampleAr: 'مرحبا، شو اسمك؟',
                exampleArabeezy: 'marhaba, shu ismak?',
                exampleEn: 'Hello, what is your name?'
            },
            {
                id: 'ana_ismi',
                ar: 'أنا اسمي...',
                en: 'my name is...',
                enArabeezy: 'ana ismi...',
                hint: 'Simple self-introduction chunk.',
                exampleAr: 'أنا اسمي جون.',
                exampleArabeezy: 'ana ismi John.',
                exampleEn: 'My name is John.'
            },
            {
                id: 'min_wen',
                ar: 'من وين إنت؟',
                en: 'where are you from?',
                enArabeezy: 'min wein inta / inti',
                hint: 'Use after name exchange.',
                exampleAr: 'من وين إنت؟',
                exampleArabeezy: 'min wein inta?',
                exampleEn: 'Where are you from?'
            },
            {
                id: 'ana_min',
                ar: 'أنا من...',
                en: 'I am from...',
                enArabeezy: 'ana min...',
                hint: 'Country or city.',
                exampleAr: 'أنا من ألمانيا.',
                exampleArabeezy: 'ana min Almanya.',
                exampleEn: 'I am from Germany.'
            },
            {
                id: 'wein_saken',
                ar: 'وين ساكن/ة؟',
                en: 'where do you live?',
                enArabeezy: 'wein saken / sakneh',
                hint: 'Current residence, not origin.',
                exampleAr: 'هلق وين ساكن؟',
                exampleArabeezy: 'halla2 wein saken?',
                exampleEn: 'Where do you live now?'
            },
            {
                id: 'ana_saken_fi',
                ar: 'أنا ساكن/ة في...',
                en: 'I live in...',
                enArabeezy: 'ana saken/sakneh fi...',
                hint: 'Use with city/place.',
                exampleAr: 'أنا ساكنة في رام الله.',
                exampleArabeezy: 'ana sakneh fi Ramallah.',
                exampleEn: 'I live in Ramallah.'
            },
            {
                id: 'tsharrafna',
                ar: 'تشرفنا',
                en: 'nice to meet you',
                enArabeezy: 'tsharrafna',
                hint: 'Polite after names.',
                exampleAr: 'تشرفنا فيك.',
                exampleArabeezy: 'tsharrafna feek.',
                exampleEn: 'Nice to meet you.'
            },
            {
                id: 'ma3_es_salameh',
                ar: 'مع السلامة',
                en: 'goodbye',
                enArabeezy: 'ma3 es-salameh',
                hint: 'Standard closing.',
                exampleAr: 'مع السلامة، بشوفك بكرا.',
                exampleArabeezy: 'ma3 es-salameh, bashoofak bokra.',
                exampleEn: 'Goodbye, see you tomorrow.'
            }
        ],
        extra: [
            {
                id: 'ya3teek_el_3afyeh',
                ar: 'يعطيك العافية',
                en: 'thank you / blessings on your effort',
                enArabeezy: 'ya3teek el-3afyeh',
                hint: 'Very common socially in Palestine.',
                exampleAr: 'يعطيك العافية أستاذ.',
                exampleArabeezy: 'ya3teek el-3afyeh ustaz.',
                exampleEn: 'Thank you, teacher.'
            },
            {
                id: 'allah_ma3ak',
                ar: 'الله معك',
                en: 'God be with you',
                enArabeezy: 'allah ma3ak',
                hint: 'Warm goodbye.',
                exampleAr: 'الله معك، نشوفك بكرا.',
                exampleArabeezy: 'allah ma3ak, nshoofak bokra.',
                exampleEn: 'God be with you, see you tomorrow.'
            }
        ]
    },

    dialogue: {
        lines: [
            {
                speaker: 'Teacher',
                ar: 'صباح الخير يا جماعة، أهلين فيكم بالصف.',
                arArabeezy: 'sabah el-kheir ya jama3a, ahleen feekom b-es-saf.',
                en: 'Good morning everyone, welcome to class.'
            },
            {
                speaker: 'Lina',
                ar: 'صباح النور أستاذ.',
                arArabeezy: 'sabah en-noor ustaz.',
                en: 'Good morning, teacher.'
            },
            {
                speaker: 'Teacher',
                ar: 'كيفك اليوم يا لينا؟',
                arArabeezy: 'keefik elyoom ya Lina?',
                en: 'How are you today, Lina?'
            },
            {
                speaker: 'Lina',
                ar: 'منيحة الحمد لله. وإنت؟',
                arArabeezy: 'mnee7a elhamdellah. w enta?',
                en: 'I am fine, thank God. And you?'
            },
            {
                speaker: 'Teacher',
                ar: 'منيح، يسلمو. شو اسمك كامل؟',
                arArabeezy: 'mnee7, yislamo. shu ismek kamel?',
                en: 'I am good, thanks. What is your full name?'
            },
            {
                speaker: 'Lina',
                ar: 'أنا اسمي لينا ناصر.',
                arArabeezy: 'ana ismi Lina Naser.',
                en: 'My name is Lina Naser.'
            },
            {
                speaker: 'Teacher',
                ar: 'تشرفنا يا لينا. من وين إنتِ؟',
                arArabeezy: 'tsharrafna ya Lina. min wein inti?',
                en: 'Nice to meet you, Lina. Where are you from?'
            },
            {
                speaker: 'Lina',
                ar: 'أنا من كندا، بس ساكنة برام الله.',
                arArabeezy: 'ana min Canada, bas sakneh b-Ramallah.',
                en: 'I am from Canada, but I live in Ramallah.'
            },
            {
                speaker: 'Teacher',
                ar: 'حلو. من زمان ساكنة هون؟',
                arArabeezy: '7ilw. min zaman sakneh hon?',
                en: 'Nice. Have you lived here long?'
            },
            {
                speaker: 'Lina',
                ar: 'حوالي سنة.',
                arArabeezy: '7awali seneh.',
                en: 'About one year.'
            },
            {
                speaker: 'Adam',
                ar: 'السلام عليكم يا جماعة.',
                arArabeezy: 'assalamu 3alaykom ya jama3a.',
                en: 'Peace be upon you, everyone.'
            },
            {
                speaker: 'Lina',
                ar: 'وعليكم السلام، أهلين آدم.',
                arArabeezy: 'wa 3alaykom assalam, ahleen Adam.',
                en: 'And peace be upon you, welcome Adam.'
            },
            {
                speaker: 'Teacher',
                ar: 'آدم، عرف عن حالك بسرعة.',
                arArabeezy: 'Adam, 3arref 3an 7alak b-sor3a.',
                en: 'Adam, introduce yourself quickly.'
            },
            {
                speaker: 'Adam',
                ar: 'أنا آدم، من نابلس، وساكن بالقدس.',
                arArabeezy: 'ana Adam, min Nablus, w saken b-elQuds.',
                en: 'I am Adam, from Nablus, and I live in Jerusalem.'
            },
            {
                speaker: 'Teacher',
                ar: 'ممتاز. يلا، مع السلامة ولا تنسوا الواجب.',
                arArabeezy: 'mumtaz. yalla, ma3 es-salameh w la tinsow el-wajeb.',
                en: 'Excellent. Alright, goodbye and do not forget homework.'
            }
        ]
    },

    grammar: [
        {
            id: 'pronouns_and_nominal',
            title: 'Basic Pronouns + Nominal Sentences',
            short: 'Use simple pronouns with names, feelings, and identity.',
            description:
                'In spoken Palestinian Arabic, beginners first build short nominal sentences (without verb to be in present): أنا طالب، إنت منيح، هي من غزة.',
            table: {
                title: 'Core Pronouns',
                headers: ['Arabic', 'Arabeezy', 'English', 'Usage'],
                rows: [
                    ['أنا', 'ana', 'I', 'Self introduction'],
                    ['إنتَ / إنتِ', 'inta / inti', 'you', 'Address male/female'],
                    ['هو / هي', 'howwa / hiyye', 'he / she', 'Third person'],
                    ['إحنا', 'e7na', 'we', 'Group including speaker']
                ]
            },
            examples: [
                { ar: 'أنا طالب.', arabeezy: 'ana taleb.', en: 'I am a student.' },
                { ar: 'إنتِ منيحة.', arabeezy: 'inti mnee7a.', en: 'You are fine. (f)' },
                { ar: 'هو من غزة.', arabeezy: 'howwa min Ghazza.', en: 'He is from Gaza.' },
                { ar: 'إحنا جاهزين.', arabeezy: 'e7na jahzeen.', en: 'We are ready.' }
            ],
            teacherNotes:
                'Do not overload grammar terms. Focus on high-frequency chunks and immediate oral output.',
            commonMistakes: [
                'Using formal MSA endings in simple conversation.',
                'Ignoring gender distinction in second person.',
                'Translating word-for-word from English.'
            ],
            functionalUse: 'Used in greetings, self-introduction, and identity statements.'
        },
        {
            id: 'question_patterns',
            title: 'High-Frequency Question Patterns',
            short: 'Three essential questions for first contact.',
            description:
                'Train these as fixed chunks first, then vary details: شو اسمك؟ من وين إنت؟ وين ساكن؟',
            table: {
                title: 'Essential Question Chunks',
                headers: ['Arabic', 'Arabeezy', 'English', 'Function'],
                rows: [
                    ['شو اسمك؟', 'shu ismak?', 'What is your name?', 'Start intro'],
                    ['من وين إنت؟', 'min wein inta?', 'Where are you from?', 'Origin'],
                    ['وين ساكن/ة؟', 'wein saken/sakneh?', 'Where do you live?', 'Current place'],
                    ['كيفك؟', 'keefak?', 'How are you?', 'Polite check-in']
                ]
            },
            examples: [
                { ar: 'شو اسمك؟ - أنا اسمي سارة.', arabeezy: 'shu ismak? - ana ismi Sara.', en: 'What is your name? - My name is Sara.' },
                { ar: 'من وين إنت؟ - أنا من إسبانيا.', arabeezy: 'min wein inta? - ana min Espanya.', en: 'Where are you from? - I am from Spain.' },
                { ar: 'وين ساكن؟ - أنا ساكن بالقدس.', arabeezy: 'wein saken? - ana saken b-elQuds.', en: 'Where do you live? - I live in Jerusalem.' }
            ],
            teacherNotes: 'Prioritize speaking drills: ask-back pattern (question + answer + return question).',
            commonMistakes: [
                'Answering with single words only.',
                'Forgetting to ask back.',
                'Mixing origin vs current residence.'
            ],
            functionalUse: 'Used in first meetings, classes, workplaces, and social events.'
        }
    ],

    microChecks: {
        enabled: true,
        every: 5,
        items: [
            {
                id: 'mc_match_1',
                type: 'match',
                prompt: 'Match the meaning: صباح الخير',
                options: ['Good evening', 'Good morning', 'How are you?', 'Welcome'],
                correct: 'Good morning'
            },
            {
                id: 'mc_choose_2',
                type: 'choose',
                prompt: 'Choose the best reply to: كيفك؟',
                options: ['أنا من غزة.', 'مع السلامة.', 'منيح الحمد لله.', 'شو اسمك؟'],
                correct: 'منيح الحمد لله.'
            },
            {
                id: 'mc_complete_3',
                type: 'complete',
                prompt: 'Complete: ___ اسمك؟',
                options: ['وين', 'شو', 'من', 'ليش'],
                correct: 'شو'
            },
            {
                id: 'mc_complete_4',
                type: 'complete',
                prompt: 'Complete: أنا ___ رام الله.',
                options: ['من', 'على', 'إلى', 'فيه'],
                correct: 'من'
            },
            {
                id: 'mc_reorder_5',
                type: 'reorder',
                prompt: 'Reorder: اسمي / أنا / كريم',
                options: ['اسمي', 'أنا', 'كريم'],
                correct: ['أنا', 'اسمي', 'كريم']
            },
            {
                id: 'mc_match_6',
                type: 'match',
                prompt: 'Match the phrase: تشرفنا',
                options: ['Goodbye', 'Nice to meet you', 'Where are you from?', 'Thank you'],
                correct: 'Nice to meet you'
            },
            {
                id: 'mc_choose_7',
                type: 'choose',
                prompt: 'Best closing phrase:',
                options: ['شو اسمك؟', 'مع السلامة', 'من وين إنت؟', 'كيفك؟'],
                correct: 'مع السلامة'
            },
            {
                id: 'mc_complete_8',
                type: 'complete',
                prompt: 'Complete: من ___ إنت؟',
                options: ['وين', 'كيف', 'شو', 'إيمتى'],
                correct: 'وين'
            }
        ]
    },

    practice: {
        quiz: [
            {
                id: 'greet_q1',
                questionAr: 'كيف تقول “My name is Ahmad”؟',
                optionsEn: ['أنا أحمد من وين.', 'أنا اسمي أحمد.', 'شو اسمك أحمد؟'],
                correctIndex: 1
            },
            {
                id: 'greet_q2',
                questionAr: 'الرد الطبيعي على “صباح الخير” هو:',
                optionsEn: ['مسا النور', 'صباح النور', 'مع السلامة'],
                correctIndex: 1
            },
            {
                id: 'greet_q3',
                questionAr: '“وين ساكن؟” معناها:',
                optionsEn: ['Where are you from?', 'Where do you live?', 'What is your name?'],
                correctIndex: 1
            },
            {
                id: 'greet_q4',
                questionAr: 'أفضل ترتيب لمحادثة تعارف قصيرة:',
                optionsEn: ['Name -> Greeting -> Goodbye', 'Greeting -> Name -> Origin -> Closing', 'Goodbye -> Greeting -> Name'],
                correctIndex: 1
            }
        ],
        rolePlays: [
            'Beginner role-play: Student A is a new classmate. Student B greets, asks name, origin, and where they live now.',
            'Service role-play: Student A enters an office and introduces themselves politely to receptionist.',
            'Stretch role-play (advanced): Same greeting talk but include one follow-up question and one natural reaction (عنجد؟، حلو).'
        ],
        translation: [
            { id: 'gr_t1', type: 'enToAr', textEn: 'Good evening.', textAr: 'مسا الخير.' },
            { id: 'gr_t2', type: 'enToAr', textEn: 'My name is Maria.', textAr: 'أنا اسمي ماريا.' },
            { id: 'gr_t3', type: 'arToEn', textEn: 'Where are you from?', textAr: 'من وين إنت؟' },
            { id: 'gr_t4', type: 'enToAr', textEn: 'I live in Ramallah.', textAr: 'أنا ساكن/ة في رام الله.' },
            { id: 'gr_t5', type: 'arToEn', textEn: 'Nice to meet you.', textAr: 'تشرفنا.' },
            { id: 'gr_t6', type: 'enToAr', textEn: 'Goodbye.', textAr: 'مع السلامة.' }
        ]
    },

    homework: {
        instructions:
            'Record a 45-60 second self-introduction in Palestinian Arabic including: greeting, your name, where you are from, where you live now, and one closing phrase. Then write 6 lines repeating the same content in Arabic script.'
    },

    teacherNotes: {
        warmup: [
            'Start with 90-second listening only: teacher greets 3 times with different tones.',
            'Students identify context: morning, evening, first meeting.'
        ],
        vocabularySteps: [
            'Teach chunks, not isolated words: شو اسمك؟ / أنا اسمي...',
            'Drill masculine/feminine quickly: إنتَ vs إنتِ, ساكن vs ساكنة.'
        ],
        dialogueSteps: [
            'Round 1: read dialogue for gist.',
            'Round 2: pause and shadow each line.',
            'Round 3: students replace names/cities with personal data.'
        ],
        practiceTips: [
            'Force ask-back habit: every answer must include one return question.',
            'Correct only top 2 errors each round to keep fluency high.'
        ],
        wrapup: [
            'Exit ticket: each learner performs a 4-line intro without notes.',
            'Teacher logs one pronunciation target and one grammar target for next class.'
        ],
        myNotes: ''
    }
};


