import { LESSON_ID_FOOD_DRINK } from '../../core/constants.js';



export const dialogueId = 'BD::' + LESSON_ID_FOOD_DRINK;

export const dialogue = {
  meta: {
     level: 'Beginner',
  unit: 'Food & Drink',
  title: 'Food & Drink - Decisions',
  },
  startNodeId: 'sarah_1',

  nodes: {

    // =====================
    // SCENE 1 — Greeting
    // =====================
    sarah_1: {
      speaker: 'Sarah',
      ar: 'مرحبا أحمد! كيفك اليوم؟',
      en: 'Hello Ahmed! How are you today?',
      arZ: 'Marhaba Ahmed! Keefak el-yom?',
      choices: [
        { id: 'a1_good', ar: 'اهلا تمام الحمد لله. وإنتِ؟', en: 'hi I’m good, thanks. And you?', arZ: ' Ahlan Tamaam el7amdulillah. W enti?', next: 'sarah_2_status' },
        { id: 'a1_neu', ar: 'ماشي الحال… يوم عادي.', en: 'Okay… normal day.', arZ: 'Maashi el7al… yom 3adi.', next: 'sarah_2_bridge' },
        { id: 'a1_trap', ar: 'أهلين… شو في شغل؟', en: 'Hey… what work is there?', arZ: 'Ahleen… shu fe shoghl?', next: 'sarah_1_trap_react' },
      ],
    },

    sarah_1_trap_react: {
      speaker: 'Sarah',
      ar: 'ولا شي خلص…  شكلك مشغول اليوم.',
      en: 'Nothing’s left…  you look busy today.',
      arZ: 'Wala shi khalaṣ…  shaklak mashghool el-yom.',
      choices: [
        { id: 'a1_rep', ar: 'آسف، قصدي كيف يومك؟', en: 'Sorry, I meant how’s your day?', arZ: 'Asef, qaṣdi keef yomik?', next: 'sarah_2_status' },
        { id: 'a1_move', ar: 'لا عادي… بس شوي جعان.', en: 'No, just a bit hungry.', arZ: 'La 3adi… bas shway ju3an.', next: 'sarah_3_hungry' },
      ],
    },

    sarah_2_status: {
      speaker: 'Sarah',
      ar: 'منيحة… بس شوي جوعانة.',
      en: 'I’m good… just a bit hungry.',
      arZ: 'Mnee7a… bas shway ju3aneh.',
      choices: [
        { id: 'a2_same', ar: 'حتى أنا! نروح نأكل؟', en: 'Me too! Want to eat?', arZ: '7atta ana! Nroo7 nakol?', next: 'sarah_4_where' },
        { id: 'a2_neu', ar: 'آه معقول…', en: 'Yeah makes sense…', arZ: 'Ah ma3ool…', next: 'sarah_4_where' },
        { id: 'a2_trap', ar: 'استني شوي.', en: 'Wait a bit.', arZ: 'Istanni shway.', next: 'sarah_2_trap_react' },
      ],
    },

    sarah_2_bridge: {
      speaker: 'Sarah',
      ar: 'عفكرة… أنا كتير جعانة.',
      en: 'By the way… I’m really hungry.',
      arZ: '3a fekra… ana kteer Jaw‘aaneh..',
      choices: [
        { id: 'a2b_same', ar: 'حتى أنا! نطلع نأكل؟', en: 'Me too! Let’s go eat.', arZ: '7atta ana! Nṭla3 nakol?', next: 'sarah_4_where' },
      ],
    },

    sarah_2_trap_react: {
      speaker: 'Sarah',
      ar: 'طيب بس لا تتأخر، معدتي عم توجعني.',
      en: 'Okay but don’t take long, my stomach hurts.',
      arZ: 'Tayyeb bas la tit2akhar, ma3dti 3am twaja3ni.',
      choices: [{ id: 'a2_rep', ar: 'خلص يلا نروح.', en: 'Okay let’s go.', arZ: 'Khalas yalla nroo7.', next: 'sarah_4_where' }],
    },

    sarah_3_hungry: {
      speaker: 'Sarah',
      ar: 'حتى أنا! يلا نطلع.',
      en: 'Me too! Let’s go.',
      arZ: '7atta ana! Yalla nṭla3.',
      choices: [{ id: 'go', ar: 'وين بدك؟', en: 'Where to?', arZ: 'Wein baddek?', next: 'sarah_4_where' }],
    },

    // =====================
    // SCENE 2 — Choosing place
    // =====================
    sarah_4_where: {
      speaker: 'Sarah',
      ar: 'شو رأيك بالمطعم اللي جنب المكتب؟',
      en: 'What about the restaurant near the office?',
      arZ: 'Sho ra2yak bel-maṭ3am elli janb el-maktab?',
      choices: [
        { id: 'a4_yes', ar: 'فكرة ممتازة.', en: 'Great idea.', arZ: 'Fekra momtaza.', next: 'waitress_1' },
        { id: 'a4_trap', ar: 'أي واحد مش فارقة.', en: 'Whatever.', arZ: 'Ay wa7ad mish fare2a.', next: 'sarah_4_trap_react' },
      ],
    },

    sarah_4_trap_react: {
      speaker: 'Sarah',
      ar: 'طيب خلينا نختار بسرعة.',
      en: 'Okay let’s choose quickly.',
      arZ: 'Tayyeb khallina nkhtar bser3a.',
      choices: [{ id: 'fix', ar: 'يلا المطعم اللي جنبنا.', en: 'Let’s go to the nearby one.', arZ: 'Yalla el-maṭ3am elli janbna.', next: 'waitress_1' }],
    },

    // =====================
    // SCENE 3 — Restaurant
    // =====================
    waitress_1: {
      speaker: 'Waitress',
      ar: 'أهلاً وسهلاً! تفضلوا.',
      en: 'Welcome! Please come in.',
      arZ: 'Ahlan w sahlan! Tfaddalo.',
      choices: [{ id: 'a5', ar: 'شكراً.', en: 'Thanks.', arZ: 'Shukran.', next: 'waitress_2' }],
    },

    waitress_2: {
      speaker: 'Waitress',
      ar: 'تفضلوا اقعدوا هون.',
      en: 'Please sit here.',
      arZ: 'Tfaddalo o3do hon.',
      choices: [{ id: 'a6', ar: 'المكان حلو.', en: 'Nice place.', arZ: 'El-makan 7elo.', next: 'sarah_menu' }],
    },

    sarah_menu: {
      speaker: 'Sarah',
      ar: 'ممكن تساعديني؟ مش فاهمة المينيو.',
      en: 'Can you help? I don’t understand the menu.',
      arZ: 'Mumkin tsa3deeni? Mish fahmeh el-menu.',
      choices: [
        { id: 'a7', ar: 'ولا يهمك، اسأليها.', en: 'No worries, ask her.', arZ: 'Wala yhemmik, is2aliha.', next: 'waitress_explain' },
      ],
    },

    waitress_explain: {
      speaker: 'Waitress',
      ar: 'هاد دجاج مع رز.',
      en: 'This is chicken with rice.',
      arZ: 'Had dajaj ma3 roz.',
      choices: [{ id: 'a8', ar: 'منيح! باخد نفس الطلب.', en: 'Nice! I’ll take the same.', arZ: 'Mnee7! Bakhod nafs el-talab.', next: 'food_serve' }],
    },

    food_serve: {
      speaker: 'Waitress',
      ar: 'تفضلوا، صحتين!',
      en: 'Here you go, enjoy!',
      arZ: 'Tfaddalo, sa7tein!',
      choices: [{ id: 'eat', ar: 'يسلمو.', en: 'Thanks.', arZ: 'Yislamo.', next: 'sarah_after_food' }],
    },

    sarah_after_food: {
      speaker: 'Sarah',
      ar: 'الأكل زاكي!',
      en: 'The food is delicious!',
      arZ: 'El-akel zaki!',
      choices: [{ id: 'agree', ar: 'كتير طيب.', en: 'Very good.', arZ: 'Kteer ṭayyeb.', next: 'bill_time' }],
    },

    bill_time: {
      speaker: 'Ahmed',
      ar: 'ممكن الحساب لو سمحتي؟',
      en: 'Can we have the bill please?',
      arZ: 'Mumkin el-7saab law sama7ti?',
      choices: [{ id: 'pay', ar: 'أنا بدفع.', en: 'I’ll pay.', arZ: 'Ana badfa3.', next: 'end_scene' }],
    },

    end_scene: {
      speaker: 'Sarah',
      ar: 'يسلمو أحمد!',
      en: 'Thanks Ahmed!',
      arZ: 'Yislamo Ahmed!',
      choices: [{ id: 'end', ar: 'يلا نرجع.', en: 'Let’s head back.', arZ: 'Yalla nirja3.', next: 'END' }],
    },

    END: {
      speaker: 'System',
      ar: '✅ نهاية المشهد.',
      en: 'End of scene.',
      arZ: 'Nehayet el-mashhad.',
      choices: [],
    },
  },
};
