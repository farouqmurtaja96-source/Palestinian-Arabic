import { LESSON_ID_WORK_STUDY } from '../../core/constants.js';


export const dialogueId = 'BD::' + LESSON_ID_WORK_STUDY;


export const dialogue = {
 meta: {
    level: 'Pre-Intermediate',
    unit: 'Work & Study',
    title: 'Office Day (Smart Branches + Realistic Traps)',
  },
  startNodeId: 'sarah_1',

  nodes: {
   

    // =====================
    // SCENE 1 — Greeting
    // =====================
    sarah_1: {
      speaker: 'Sarah',
      ar: 'صباح النور يا أحمد. كيف حالك؟',
      en: 'Good morning, Ahmed. How are you?',
      arZ: 'Saba7 el-noor ya Ahmed. Keef 7alak?',
      choices: [
        {
          id: 'a1_pro',
          ar: ' صباحوا  سارة ,الحمد لله منيح. وإنتِ؟ ',
          en: 'Good morning, Sarah I’m good, thank God. And you?',
          arZ: 'Sabaho Sara El7amdulillah mnee7. W enti?',
          next: 'sarah_2_tired',
        },
        {
          id: 'a1_neu',
          ar: 'صباح النور , تمام…شوية ضغط بس ماشي كيفك.',
          en: 'Good morning… a bit busy but okay how are you.',
          arZ: 'Tamaam… shway da8et bas maashi Keefak.',
          next: 'sarah_1_tired',
        },
        // Trap (socially cold)
        {
          id: 'a1_trap',
          ar: 'صباح النور … شو بدنا نخلّص اليوم؟',
          en: 'Morning… what do we need to finish today?',
          arZ: 'Saba7 el-noor… sho badna nkhalleṣ elyoom?',
          next: 'sarah_1_trap_react',
        },
      ],
    },

    sarah_1_trap_react: {
      speaker: 'Sarah',
      ar: 'تمام… بس خلينا نبلّش بهدوء. أنا تعبانة شوي من شفت مبارح.',
      en: 'Okay… but let’s start calmly. I’m a bit tired from yesterday’s shift.',
      arZ: 'Tamaam… bas khallina nballesh b-hodoo2. Ana ta3bana shway men shift mbar7.',
      choices: [
        // Repair
        {
          id: 'a1_rep',
          ar: 'معِك حق… آسف. شو صار مبارح؟',
          en: 'You’re right… sorry. What happened yesterday?',
          arZ: 'Ma3ik 7a2… asef. Sho sar mbar7?',
          next: 'sarah_3_reports',
        },
        // Double down (still workable but tense)
        {
          id: 'a1_keep',
          ar: 'تمام… شو وضع التقارير؟',
          en: 'Okay… what’s the status of the reports?',
          arZ: 'Tamaam… sho waḍ3 el-taqareer?',
          next: 'sarah_3_reports',
        },
      ],
    },
sarah_1_tired: {
      speaker: 'Sarah',
      ar: 'الله يعطيك العافية… بس تعبانة شوي من شِفت مبارح.',
      en: 'God give you wellness… I’m just a bit tired from yesterday’s shift.',
      arZ: 'Allah y3teeki el-3afyeh… Ana ta3bana shway men shift mbar7.',
      choices: [
        {
          id: 'a2_q',
          ar: 'الله يعافيكي. ليش؟',
          en: 'May God give you health too. Why?',
          arZ: 'Allah y3afeeki. Leesh?',
          next: 'sarah_3_reports',
        },
        {
          id: 'a2_support',
          ar: 'الله يعافيكي… شو صاير معك؟',
          en: 'God give you health too… what’s going on with you?',
          arZ: 'Allah y3afeeki… shu ṣaayer ma3ek?',
          next: 'sarah_3_reports',
        },
        // Trap: dismissive
        {
          id: 'a2_trap',
          ar: 'آه… بصير هيك.',
          en: 'Yeah… it happens.',
          arZ: 'Ah… biseer heek.',
          next: 'sarah_2_trap_react',
        },
      ],
    },
    sarah_2_tired: {
      speaker: 'Sarah',
      ar: 'أنا منيحة… بس تعبانة شوي من شِفت مبارح.',
      en: 'I’m fine… just a bit tired from yesterday’s shift.',
      arZ: 'Ana mnee7a… bas ta3bana shway men shift mbar7.',
      choices: [
        {
          id: 'a2_q',
          ar: 'جد؟ ليش؟',
          en: 'Really? Why?',
          arZ: 'Jad? Leesh?',
          next: 'sarah_3_reports',
        },
        {
          id: 'a2_support',
          ar: 'الله يعينك… شو صار؟',
          en: 'Hang in there… what happened?',
          arZ: 'Allah y3eenik… sho sar?',
          next: 'sarah_3_reports',
        },
        // Trap: dismissive
        {
          id: 'a2_trap',
          ar: 'آه… بصير هيك.',
          en: 'Yeah… it happens.',
          arZ: 'Ah… biseer heek.',
          next: 'sarah_2_trap_react',
        },
      ],
    },

    sarah_2_trap_react: {
      speaker: 'Sarah',
      ar: 'أكيد بصير… بس مبارح كان يوم طويل. ضَلّينا متأخرين عشان التقارير.',
      en: 'Sure it happens… but yesterday was long. We stayed late for the reports.',
      arZ: 'Akeed biseer… bas mbar7 kan yom taweel. Dalleena mta’akhkreen 3ashan el-taqareer.',
      choices: [
        { id: 'a2_rep', ar: 'معِك حق… يعطيك العافية.', en: 'Fair… good job.', arZ: 'Ma3ik 7a2… ya3ṭeek el-3afye.', next: 'sarah_4_sorry' },
        { id: 'a2_move', ar: 'تمام… خلينا نكمّل.', en: 'Okay… let’s continue.', arZ: 'Tamaam… khallina nkammel.', next: 'sarah_3_sorry' },
      ],
    },

    // =====================
    // SCENE 2 — Reports
    // =====================
    sarah_3_reports: {
      speaker: 'Sarah',
      ar: 'ضلّينا لوقت متأخر عشان نخلّص التقارير.',
      en: 'We stayed late to finish the reports.',
      arZ: 'Dallayna la-wa2et mota2akher 3ashan nkhalleṣ el-taqareer.',
      choices: [
        { id: 'a3_sorry', ar: 'أوه… ما كنت أعرف. آسف.', en: 'Oh… I didn’t know. Sorry.', arZ: 'Oh… ma kont a3raf. Asef.', next: 'sarah_4_sorry' },
        { id: 'a3_thanks', ar: 'يعطيكم العافية… مجهود كبير.', en: 'God give you all wellness… great effort.', arZ: 'Ya3teekom el-3afyeh… majhood kbeer.', next: 'sarah_2_sorry' },
        // Trap: blaming team
        { id: 'a3_trap', ar: 'يعني الفريق لسا مش مخلص؟', en: 'So the team still isn’t done?', arZ: 'Ya3ni el-faree2 lissa mish mkhalleṣ?', next: 'sarah_3_trap_react' },
      ],
    },

    sarah_3_trap_react: {
      speaker: 'Sarah',
      ar: 'ما بعرف … يمكن ناقصهم شغلة. بس هم قالوا قرّبوا يخلصوا.',
      en: 'I don’t know… maybe they’re missing something. But they said they’re almost done.',
      arZ: 'Ma ba3ref… mumkin na2ṣhom shaghleh. Bas hom qaloo qarrabo yikhlaṣu.',
      choices: [
        { id: 'a3_rep2', ar: 'خلينا نتأكد منهم.', en: ' let’s confirm with them.', arZ: ' khallina net2akkad منهم.', next: 'sarah_5_team_status' },
      
      ],
    },
    sarah_2_sorry: {
      speaker: 'Sarah',
      ar: 'الله يعافيك',
      en: 'May God give you health too.',
      arZ: 'Allah y3afeek.',
      choices: [{ id: 'a4_next', ar: 'الفريق خلّص كلشي؟', en: 'Did the team finish everything?', arZ: 'El-faree2 khallaṣ kolshi?', next: 'sarah_5_team_status' }],
    },
 sarah_3_sorry: {
      speaker: 'Sarah',
      ar: 'تمام',
      en: 'okay',
      arZ: 'Tamaam…',
      choices: [{ id: 'a4_next', ar: 'الفريق خلّص كلشي؟', en: 'Did the team finish everything?', arZ: 'El-faree2 khallaṣ kolshi?', next: 'sarah_5_team_status' }],
    },
    sarah_4_sorry: {
      speaker: 'Sarah',
      ar: 'ولا يهمك.',
      en: 'No problem.',
      arZ: 'Wala yhemmik.',
      choices: [{ id: 'a4_next', ar: 'الفريق خلّص كلشي؟', en: 'Did the team finish everything?', arZ: 'El-faree2 khallaṣ kolshi?', next: 'sarah_5_team_status' }],
    },

    sarah_5_team_status: {
      speaker: 'Sarah',
      ar: 'مش متأكدة… هم قالوا إنهم قرّبوا يخلصوا.',
      en: 'I’m not sure… they said they’re almost done.',
      arZ: 'Mish mota2akkde… 2alu 2arabo ykhalleṣo.',
      choices: [
        { id: 'a5_call', ar: 'تمام… فيكي تتصلي فيهم؟', en: 'Okay… can you call them?', arZ: 'Tamaam… feeki tettasli feehom?', next: 'sarah_6_call_them' },
        { id: 'a5_check', ar: 'أنا بروح أشيّك عليهم بسرعة.', en: 'I’ll quickly check on them.', arZ: 'Ana بروح asheek 3aleehom bser3a.', next: 'sys_check_done' },
        { id: 'a5_move', ar: 'تمام… خلينا نكمل شغلنا هلا.', en: 'Okay… let’s continue our work now.', arZ: 'Tamaam… khallina nkammel shoghlna halla2.', next: 'sarah_7_help_file' },
      ],
    },
sarah_6_call_them: {
      speaker: 'Sarah',
      ar: 'حكوا بدهم 10 دقائق.ممكن تساعدني بهالملف',
      en: 'They said they need 10 minutes. Can you help me with this file?',
      arZ: '7akoo bed-hom 10 da2aye2. Mumkin tsa3edni b-hal-file?',
      choices: [
              { id: 'a7_yes', ar: 'أكيد. ورّيني وين المشكلة.', en: 'Of course. Show me where the issue is.', arZ: 'Akeed. Warreeni wein el-moshkile.', next: 'sarah_8_confused_part' },
        { id: 'a7_bound', ar: 'أكيد… بس أعطيني 15 دقيقة وباجي.', en: 'Sure… give me 15 minutes and I’ll come.', arZ: 'Akeed… bas a3ṭeeni 15 da2ee2a w baji.', next: 'sarah_7_bound_react' },
        // Trap: no commitment
        { id: 'a7_trap', ar: 'مشغول هلأ.', en: 'I’m busy now.', arZ: 'Mashghool halla2.', next: 'sarah_7_trap_react' },],
    },
 
    sys_check_done: {
      speaker: 'Sarah',
      ar: 'شو حكولك وكم بدهم وقت ؟',
      en: 'What did they tell you, and how much time do they need?',
      arZ: 'Shu 7akoolak w kam bed-hom wa2et?',
      choices: [{ id: 'back', ar: ' شِفتهم… وقالوا بدهم 10 دقائق.', en: 'I saw them… and they said they need 10 minutes.', arZ: 'Shift-hom… w qaaloo bed-hom 10 da2aye2.', next: 'sarah_7_help_file' }],
    },

    // =====================
    // SCENE 3 — Help with file
    // =====================
    sarah_7_help_file: {
      speaker: 'Sarah',
      ar: 'بعد إذنك… بتقدر تساعدني بهالملف؟',
      en: 'Excuse me… can you help me with this file?',
      arZ: 'Ba3d eznik… bti2dar tsa3edni bhayl-malaf?',
      choices: [
        { id: 'a7_yes', ar: 'أكيد. ورّيني وين المشكلة.', en: 'Of course. Show me where the issue is.', arZ: 'Akeed. Warreeni wein el-moshkile.', next: 'sarah_8_confused_part' },
        { id: 'a7_bound', ar: 'أكيد… بس أعطيني 15 دقيقة وباجي.', en: 'Sure… give me 15 minutes and I’ll come.', arZ: 'Akeed… bas a3ṭeeni 15 da2ee2a w baji.', next: 'sarah_7_bound_react' },
        // Trap: no commitment
        { id: 'a7_trap', ar: 'مشغول هلأ.', en: 'I’m busy now.', arZ: 'Mashghool halla2.', next: 'sarah_7_trap_react' },
      ],
    },

    sarah_7_bound_react: {
      speaker: 'Sarah',
      ar: 'تمام… بس بدي تساعدني قبل الاجتماع لو سمحت.',
      en: 'Okay… but I need you to help me before the meeting, please..',
      arZ: 'Tamaam… bas baddi tsa3edni abl el-ijtima3 law sama7ti.',
      choices: [
        { id: 'a7b_now', ar: 'خلص هلا… ورّيني.', en: 'Okay now… show me.', arZ: 'Khalas halla2… warreeni.', next: 'sarah_8_confused_part' },
        { id: 'a7b_commit', ar: 'أكيد… خلال 10 دقايق بخلص وباجي.', en: 'Sure… in 10 minutes I’ll be back.', arZ: 'Akeed… khilal 10 da2aye2 bakhlaṣ w baji.', next: 'sarah_8_confused_part' },
      ],
    },

    sarah_7_trap_react: {
      speaker: 'Sarah',
      ar: 'طيب… إذا مش هلا، امتى؟ لأنه ضروري.',
      en: 'Okay… if not now, when? It’s urgent.',
      arZ: 'Tayyeb… iza mish halla2, emta? 3ashan daroori.',
      choices: [
        { id: 'a7t_rep', ar:  'اذا ضروري… ورّيني هلا.', en: 'If it’s urgent… show me now.', arZ: 'Iza daroori… warjeeni halla.', next: 'sarah_8_confused_part' },
        { id: 'a7t_time', ar: 'بعد 20 دقيقة بالكثير.', en: 'In 20 minutes max.', arZ: 'Ba3d 20 da2ee2a bel-kteer.', next: 'sarah_8_confused_part' },
      ],
    },

    sarah_8_confused_part: {
      speaker: 'Sarah',
      ar: 'أنا مش فاهمة هالجزء… شو يعني؟',
      en: 'I don’t understand this part… what does it mean?',
      arZ: 'Ana mish fahmeh hal-joz2… sho ya3ni?',
      choices: [
        { id: 'a8_step', ar: 'ولا يهمك… بشرح خطوة خطوة.', en: 'No worries… I’ll explain step by step.', arZ: 'Wala yhemmik… bashra7 khotwe khotwe.', next: 'sarah_9_format_question' },
        { id: 'a8_goal', ar: 'قبل الشرح… شو المطلوب من هالجزء؟', en: 'Before I explain… what’s required in this part?', arZ: 'Qabel el-shar7… sho el-maṭloob men hal-joz2?', next: 'sarah_9_format_question' },
        // Trap: condescending
        { id: 'a8_trap', ar: 'هاي واضحة…', en: 'This is obvious…', arZ: 'Hay wade7a…', next: 'sarah_8_trap_react' },
      ],
    },

    sarah_8_trap_react: {
      speaker: 'Sarah',
      ar: 'يمكن واضحة إلك… بس أنا مش شايفتها هيك.',
      en: 'Maybe it’s obvious to you… but not to me.',
      arZ: 'Mumkin wade7a elk… bas ana mish شايفتها heik.',
      choices: [
        { id: 'a8r_sorry', ar: 'معِك حق… آسف. خلينا نمشيها بهدوء.', en: 'You’re right… sorry. Let’s go calmly.', arZ: 'Ma3ik 7a2… asef. Khallina nimشيها b-hodoo2.', next: 'sarah_9_format_question' },
        { id: 'a8r_where', ar: 'تمام… وين بتوقفي بالزبط؟', en: 'Okay… where exactly do you get stuck?', arZ: 'Tamaam… wein btwa2fi bel-zabt?', next: 'sarah_9_format_question' },
      ],
    },

    sarah_9_format_question: {
      speaker: 'Sarah',
      ar: 'شو رأيك؟ هذا التنسيق صحيح؟',
      en: 'What do you think? Is this the correct format?',
      arZ: 'Shu ra’yek? Hada el-tanseek sa7ee7?',
      choices: [
        { id: 'a9_yes', ar: 'ايوة. شكله مرتب.', en: 'Yes. It looks clean.', arZ: 'Aywa. Shaklo mratab.', next: 'sarah_10_where_others' },
        { id: 'a9_tweak', ar: 'قريب… بس بدّه تعديل بسيط بالعناوين.', en: 'Almost… needs small tweaks in headings.', arZ: 'Qareeb… bas biddoh ta3deel basīṭ bel-3anawen.', next: 'sarah_10_where_others' },
        // Trap: harsh absolute
        { id: 'a9_trap', ar: 'لا، غلط.', en: 'No, it’s wrong.', arZ: 'La, ghalat.', next: 'sarah_9_trap_react' },
      ],
    },

    sarah_9_trap_react: {
      speaker: 'Sarah',
      ar: 'طيب… وين الغلط؟',
      en: 'Okay… what exactly is wrong?',
      arZ: 'Tayyeb… wein el-ghalat?',
      choices: [
        { id: 'a9r_repair', ar: 'قصدي بدّه تعديل مش غلط كامل.', en: 'I mean it needs edits, not totally wrong.', arZ: 'Qaṣdi biddoh ta3deel mish ghalat kamel.', next: 'sarah_10_where_others' },
        { id: 'a9r_detail', ar: 'العنوان + التاريخ + الترتيب بدهم توحيد.', en: 'Title + date + order need consistency.', arZ: 'El-3enwan + el-tareekh + el-tarteeb بدهم taw7eed.', next: 'sarah_10_where_others' },
      ],
    },

    // =====================
    // SCENE 4 — Where are others? Call them
    // =====================
    sarah_10_where_others: {
      speaker: 'Ahmed',
      ar: 'تمام شكرا على التعديل والشرح. ',
      en: 'Alright, thanks for the edit and the explanation.',
      arZ: 'Tamaam, shukran 3al-ta3deel w el-shar7.',
      choices: [
        { id: 'a10_ask', ar: 'عفوا ! وين باقي الفريق ؟', en: 'You’re welcome! Where’s the rest of the team?', arZ: '3afwan! Wain ba2i el-faree2?', next: 'sarah_11_meeting_room' },
        // Trap: complaining
        { id: 'a10_trap', ar: 'أكيد متأخرين كالعادة.', en: 'Probably late as usual.', arZ: 'Akeed mita2akhkhreen kal-3ade.', next: 'sarah_10_trap_react' },
      ],
    },

    sarah_10_trap_react: {
      speaker: 'Sarah',
      ar: 'خلينا ما نحكم… هما بغرفة الاجتماع.',
      en: 'Let’s not judge… they’re in the meeting room.',
      arZ: 'Khallina ma n7kom… homma b-ghorfit el-ijtima3.',
      choices: [{ id: 'a10_rep', ar: 'صح… ناديهم لو سمحتِ.', en: 'True… please call them.', arZ: 'Ṣa7… naadeehom law sama7ti.', next: 'sarah_12_call' }],
    },

    sarah_11_meeting_room: {
      speaker: 'Sarah',
      ar: 'هما بغرفة الاجتماع. استنى… بناديهم.',
      en: 'They’re in the meeting room. Wait… I’ll call them.',
      arZ: 'Homma b-ghorfit el-ijtima3. Istanna… bnaadeehom.',
      choices: [{ id: 'a11_ok', ar: 'أكيد، خدي راحتك.', en: 'Sure, take your time.', arZ: 'Akeed, khudi ra7tik.', next: 'sarah_12_call' }],
    },

    sarah_12_call: {
      speaker: 'Sarah',
      ar: 'يا بنات… خلصتوا؟',
      en: 'Girls… are you done?',
      arZ: 'Ya banat… khallaṣto?',
      choices: [{ id: '...', ar: 'لسا!', en: 'Not yet!', arZ: 'Lissa!', next: 'cow_13_notyet' },
         { id: 'a13_trap', ar: "بس شوية بدنا وقت ", en:"We just need a little time." , arZ:"Bas shwayyeh badna wa2et." , next: ' cow_14_notyet' },
      ],
    },

    cow_13_notyet: {
      speaker: 'Sarah',
      ar: 'تمام… بس يلا لو سمحتوا، الاجتماع قرب.',
      en: 'Okay… but please hurry, meeting is soon.',
      arZ: 'Tamaam… bas yalla law sama7to, el-ijtima3 2areeb.',
      choices: [
        { id: 'a13_soft', ar: 'تمام…', en: 'Okay…', arZ: 'Tamaam…', next: 'sarah_14_finish_today' },
        // Trap: rude order
        
      ],
    },
    cow_14_notyet: {
      speaker: 'Sarah',
      ar: 'خلصّوا بسرعة!',
      en: 'Finish fast!',
      arZ: 'Khallaṣo bser3a!',
      choices: [
        { id: 'a13_soft', ar: 'تمام…', en: 'Okay…', arZ: 'Tamaam…', next: 'sarah_14_finish_today' },
        // Trap: rude order
       
      ],
    },

 

    // =====================
    // SCENE 5 — Finish today + documents + explain again + emails + coffee
    // =====================
    sarah_14_finish_today: {
      speaker: 'Sarah',
      ar: 'بدي أخلّص هالمشروع اليوم.',
      en: 'I want to finish this project today.',
      arZ: 'Biddi akhalleṣ hal-mashroo3 elyoom.',
      choices: [
        { id: 'a14_plan', ar: 'تمام… خلينا نقسّم الشغل ونمشي بخطة.', en: 'Okay… let’s split tasks and follow a plan.', arZ: 'Tamaam… khallina n2assem el-shoghl w nimشي b-khiṭṭa.', next: 'sarah_15_docs' },
        { id: 'a14_reassure', ar: 'لا تقلقي… رح نعمل اللي بنقدر عليه.', en: 'Don’t worry… we’ll do our best.', arZ: 'Ma ti2la2i… ra7 n3mal elli bn2dar 3aleh.', next: 'sarah_15_docs' },
      ],
    },

    sarah_15_docs: {
      speaker: 'Sarah',
      ar: 'أنا متأخرة… بس تفضّل، هاي الوثائق اللي طلبتها.',
      en: 'I’m late already… but here are the documents you asked for.',
      arZ: 'Ana mit2akhkhra… bas tfaddal, hay el-watha2e2 elli ṭalabto.',
      choices: [
        { id: 'a15_thx', ar: 'يسلمو، شكراً.', en: 'Thanks a lot.', arZ: 'Yislamo, shukran.', next: 'cow_16_late' },
        { id: 'a15_review', ar: 'ممتاز… خلينا نراجع بسرعة.', en: 'Great… let’s review quickly.', arZ: 'Momtaaz… khallina nraaje3 bser3a.', next: 'cow_16_late' },
      ],
    },

    cow_16_late: {
      speaker: 'Coworkers',
      ar: 'مرحباً! آسفين على التأخير!',
      en: 'Hi! Sorry, we’re late!',
      arZ: 'Mar7aba! Asfeen 3al-ta2kheer!',
      choices: [
        { id: 'a16_soft', ar: 'ولا يهمكم، تعالوا.', en: 'No problem, come in.', arZ: 'Wala yhemmkom, ta3alo.', next: 'sarah_17_mean_yesterday' },
        { id: 'a16_neu', ar: 'تمام… يلا نبلّش.', en: 'Okay… let’s start.', arZ: 'Tamaam… yalla nballesh.', next: 'sarah_17_mean_yesterday' },
        // Trap: shaming
        { id: 'a16_trap', ar: 'أخيراً…', en: 'Finally…', arZ: 'Akhiran…', next: 'sarah_16_trap_react' },
      ],
    },

    sarah_16_trap_react: {
      speaker: 'Sarah',
      ar: 'خلينا نمشيها… المهم نبلّش.',
      en: 'Let’s move on… the important thing is to start.',
      arZ: 'Khallina nimشيها… el-mohim nballesh.',
      choices: [{ id: 'a16_rep', ar: 'صح… يلا نبلّش.', en: 'True… let’s start.', arZ: 'Ṣa7… yalla nballesh.', next: 'sarah_17_mean_yesterday' }],
    },

    sarah_17_mean_yesterday: {
      speaker: 'Sarah',
      ar: 'يا بنات… فهمتوا شو أحمد قصد مبارح؟',
      en: 'Girls… did you understand what Ahmed meant yesterday?',
      arZ: 'Ya banat… fihimto sho Ahmed 2asad mbar7?',
      choices: [{ id: 'a17_listen', ar: '…', en: '…', arZ: '…', next: 'cow_18_not_sure' }],
    },

    cow_18_not_sure: {
      speaker: 'Coworkers',
      ar: 'مش متأكدين.',
      en: 'We’re not sure.',
      arZ: 'Mish mota2akkdeen.',
      choices: [
        { id: 'a18_explain', ar: 'ولا يهمكم، بشرح مرة ثانية.', en: 'No worries, I’ll explain again.', arZ: 'Wala yhemmkom, bashra7 marra tanya.', next: 'ahmed_19_emails' },
        { id: 'a18_ask', ar: 'شو اللي لخبطكم بالزبط؟', en: 'What exactly confused you?', arZ: 'Sho elli lakhbaṭkom bel-zabt?', next: 'ahmed_19_emails' },
      ],
    },

    ahmed_19_emails: {
      speaker: 'Ahmed',
      ar: 'أول إشي… لازم نراجع الإيميلات.',
      en: 'First… we need to check the emails.',
      arZ: 'Awwal shi… لازم nraaje3 el-emails.',
      choices: [
        { id: 'a19_ok', ar: 'تمام.', en: 'Okay.', arZ: 'Tamaam.', next: 'wrap_21' },
        { id: 'a19_prior', ar: 'تمام… بنرتّب حسب الأولوية.', en: 'Okay… we’ll prioritize.', arZ: 'Tamaam… bnرتّب 7asab el-awlawiyye.', next: 'wrap_21' },
      ],
    },



    wrap_21: {
      speaker: 'Sarah',
      ar: 'نهاركم سعيد يا جماعة.',
      en: 'Have a nice day, everyone.',
      arZ: 'Nhaar-kom sa3eed ya jama3a.',
      choices: [
        { id: 'end1', ar: 'وإنتِ كمان. نشوفكم قريب.', en: 'You too. See you soon.', arZ: 'W enti kaman. bnshofkom qareeb.', next: 'END' },
        { id: 'end2', ar: 'مع السلامة.', en: 'Goodbye.', arZ: 'Ma3 el-salama.', next: 'END' },
      ],
    },

    END: {
      speaker: 'System',
      ar: '✅ نهاية الحوار.',
      en: '✅ End of dialogue.',
      arZ: '✅ Nehayet el-7ewar.',
      choices: [],
    },
  },
};

