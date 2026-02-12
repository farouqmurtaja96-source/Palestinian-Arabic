// Tiny helper to create a placeholder branching dialogue.
export function makePlaceholderDialogue({ dialogueId, level, unit, title }) {
  return {
    meta: { level, unit, title: title || `${unit} - Decisions` },
    startNodeId: 'n1',
    nodes: {
      n1: {
        speaker: 'System',
        ar: 'هالمحادثة لسه مش جاهزة. قريباً إن شاء الله ✅',
        en: 'This branching dialogue is not ready yet. Coming soon ✅',
        choices: [],
      },
    },
  };
}

// Workplace branching template with emotional tracking, tension curve,
// traps, repair paths, and multiple endings.
export function makeWorkplaceDialogue({
  dialogueId,
  level,
  unit,
  title,
  topicAr,
  topicEn,
  topicArZ,
}) {
  const tAr = topicAr || 'على سيرة الشغل، بدنا نرتب مهمة اليوم.';
  const tEn = topicEn || 'Speaking of work, we need to organize today\'s task.';
  const tArZ = topicArZ || '3ala seeret el-shoghl, badna nratteb mihmet el-yom.';

  return {
    meta: {
      level,
      unit,
      title: title || `${unit} - Decisions`,
      emotionalTracking: true,
      tensionCurve: true,
      trapLayering: true,
      setting: 'Workplace',
    },
    startNodeId: 'n1_open',
    nodes: {
      n1_open: {
        id: 'n1_open',
        speaker: 'Layan',
        ar: 'صباح الخير يا أحمد. بالمكتب برام الله، كيفك اليوم؟',
        en: 'Good morning, Ahmed. In our Ramallah office, how are you today?',
        arZ: 'Saba7 el-kheir ya Ahmed. Bel-maktab b-Ramallah, keefak el-yom?',
        state: 'neutral',
        tension: 1,
        choices: [
          {
            id: 'c1_support',
            ar: 'صباح النور. تمام. وإنتِ؟',
            en: 'Morning. I am good. And you?',
            arZ: 'Saba7 el-noor. Tamaam. W enti?',
            next: 'n2_status',
          },
          {
            id: 'c1_neutral',
            ar: 'صباح النور. تمام الحمد لله.',
            en: 'Morning. I am fine, thanks.',
            arZ: 'Saba7 el-noor. Tamaam el7amdulillah.',
            next: 'n2_bridge',
          },
          {
            id: 'c1_trap_cold',
            ar: 'صباح النور. شو المطلوب هلق؟',
            en: 'Morning. What do we need now?',
            arZ: 'Saba7 el-noor. Sho el-matloub halla2?',
            next: 'n2_cold_react',
          },
        ],
      },

      n2_status: {
        id: 'n2_status',
        speaker: 'Layan',
        ar: 'آه... منيحة، بس تعبانة شوي من مبارح.',
        en: 'Ah... I am okay, just a little tired from yesterday.',
        arZ: 'Ah... mnee7a, bas ta3bane shway men mbar7.',
        state: 'tired',
        tension: 2,
        choices: [
          {
            id: 'c2_support',
            ar: 'سلامتك. شو صار معك مبارح؟',
            en: 'Hope you are well. What happened yesterday?',
            arZ: 'Salamtik. Sho sar ma3ik mbar7?',
            next: 'n3_interrupt',
          },
          {
            id: 'c2_neutral',
            ar: 'طيب، خلينا نبلش بهدوء.',
            en: 'Okay, let us start calmly.',
            arZ: 'Tayyeb, khallina nballesh b-hodoo2.',
            next: 'n3_interrupt',
          },
          {
            id: 'c2_trap_shift',
            ar: 'على فكرة، وين التقرير؟',
            en: 'By the way, where is the report?',
            arZ: '3ala fekra, wein el-taqreer?',
            next: 'n2_shift_react',
          },
        ],
      },

      n2_bridge: {
        id: 'n2_bridge',
        speaker: 'Layan',
        ar: 'بالمناسبة، قبل ما نكمّل، في ملف لازم نرتبه.',
        en: 'By the way, before we continue, we need to organize a file.',
        arZ: 'Bel-monasabe, qabel ma nkammel, fi malaf lazem nrattebo.',
        state: 'neutral',
        tension: 2,
        choices: [
          {
            id: 'c2b_support',
            ar: 'أكيد، أنا جاهز أساعد.',
            en: 'Sure, I am ready to help.',
            arZ: 'Akeed, ana jahiz asaa3ed.',
            next: 'n3_interrupt',
          },
          {
            id: 'c2b_neutral',
            ar: 'تمام، شو أول خطوة؟',
            en: 'Okay, what is the first step?',
            arZ: 'Tamaam, sho awwal khotwe?',
            next: 'n3_interrupt',
          },
          {
            id: 'c2b_trap_dismiss',
            ar: 'هالملف كل يوم نفس القصة.',
            en: 'This file is always the same story.',
            arZ: 'Hal-malaf kol yom nafs el-2issa.',
            next: 'n2_cold_react',
          },
        ],
      },

      n2_cold_react: {
        id: 'n2_cold_react',
        speaker: 'Layan',
        ar: 'طيب... صباح الخير إلك كمان.',
        en: 'Okay... good morning to you too.',
        arZ: 'Tayyeb... saba7 el-kheir elk kaman.',
        state: 'slightly_offended',
        tension: 3,
        choices: [
          {
            id: 'c2r_repair',
            ar: 'معك حق، آسف. كيف صباحك؟',
            en: 'You are right, sorry. How is your morning?',
            arZ: 'Ma3ik 7a2, asef. Keef saba7ik?',
            next: 'n2_status',
          },
          {
            id: 'c2r_neutral',
            ar: 'طيب، نكمل الشغل.',
            en: 'Okay, let us continue work.',
            arZ: 'Tayyeb, nkammel el-shoghl.',
            next: 'n3_interrupt',
          },
        ],
      },

      n2_shift_react: {
        id: 'n2_shift_react',
        speaker: 'Layan',
        ar: 'موجود... بس كنت بحكي معك.',
        en: 'It is ready... I was just talking with you.',
        arZ: 'Mawjood... bas kent ba7ki ma3ak.',
        state: 'slightly_offended',
        tension: 3,
        choices: [
          {
            id: 'c2s_repair',
            ar: 'حقك علي. احكيلي، وبعدين منشوفه.',
            en: 'My bad. Tell me, then we check it.',
            arZ: '7a2ik 3alay. E7keeli, w ba3den mnshofo.',
            next: 'n3_interrupt',
          },
          {
            id: 'c2s_neutral',
            ar: 'تمام، ورجيني الملف.',
            en: 'Okay, show me the file.',
            arZ: 'Tamaam, warjeeni el-malaf.',
            next: 'n3_interrupt',
          },
        ],
      },

      n3_interrupt: {
        id: 'n3_interrupt',
        speaker: 'Samer',
        ar: 'طيب اسمع... الطابعة علّقت! مين فاضي؟',
        en: 'Okay listen... the printer is stuck! Who is free?',
        arZ: 'Tayyeb esma3... el-tab3a 3alla2et! Meen fadi?',
        state: 'stressed',
        tension: 3,
        choices: [
          {
            id: 'c3_support',
            ar: 'أنا بساعده دقيقة، وبرجع.',
            en: 'I will help him for a minute and come back.',
            arZ: 'Ana basaa3do da2ee2a, w barja3.',
            next: 'n4_help_done',
          },
          {
            id: 'c3_neutral',
            ar: 'إنتِ روحي، وأنا بكمل هون.',
            en: 'You go, and I will continue here.',
            arZ: 'Enti roo7i, w ana bakammel hon.',
            next: 'n4_help_later',
          },
          {
            id: 'c3_trap_ignore',
            ar: 'مش شغلتي الطابعة.',
            en: 'The printer is not my job.',
            arZ: 'Mish shoghlti el-tab3a.',
            next: 'n4_help_refused',
          },
        ],
      },

      n4_help_done: {
        id: 'n4_help_done',
        speaker: 'Layan',
        ar: 'يسلمو. الطابعة زبطت... وبدها قهوة قبلنا.',
        en: 'Thanks. The printer works now... it needs coffee before us.',
        arZ: 'Yislamo. El-tab3a zbetet... w bedha ahwe qablna.',
        state: 'relaxed',
        tension: 2,
        choices: [
          {
            id: 'c4d_support',
            ar: 'ههههه صحيح. خلينا نكمل.',
            en: 'Haha true. Let us continue.',
            arZ: 'Hahaha sa7ee7. Khallina nkammel.',
            next: 'n5_topic',
          },
          {
            id: 'c4d_neutral',
            ar: 'تمام، نرجع للملف.',
            en: 'Okay, back to the file.',
            arZ: 'Tamaam, narja3 lel-malaf.',
            next: 'n5_topic',
          },
          {
            id: 'c4d_trap_sarcasm',
            ar: 'مضحك... بس ضيعنا وقت.',
            en: 'Funny... but we wasted time.',
            arZ: 'Med7ek... bas dayya3na wa2et.',
            next: 'n5_after_trap',
          },
        ],
      },

      n4_help_later: {
        id: 'n4_help_later',
        speaker: 'Layan',
        ar: 'تمام. بس لو سمحت، ما نتأخر عليه.',
        en: 'Okay. But please, let us not keep him waiting.',
        arZ: 'Tamaam. Bas law sama7t, ma nta2akhar 3aleh.',
        state: 'tired',
        tension: 3,
        choices: [
          {
            id: 'c4l_support',
            ar: 'معك حق. خليني أروح هلق.',
            en: 'You are right. I will go now.',
            arZ: 'Ma3ik 7a2. Khallini aroo7 halla2.',
            next: 'n4_help_done',
          },
          {
            id: 'c4l_neutral',
            ar: 'دقيقتين وبرجعله.',
            en: 'Two minutes and I will help him.',
            arZ: 'Da2ee2tein w barja3lo.',
            next: 'n5_topic',
          },
          {
            id: 'c4l_trap',
            ar: 'هو يتصرف لحاله.',
            en: 'He can handle it alone.',
            arZ: 'Huwwe yetsarraf la7alo.',
            next: 'n4_help_refused',
          },
        ],
      },

      n4_help_refused: {
        id: 'n4_help_refused',
        speaker: 'Layan',
        ar: 'ممم... حسّيت ردك قاسي شوي.',
        en: 'Hmm... your response felt a bit harsh.',
        arZ: 'Mmm... 7asseit raddak asi shway.',
        state: 'slightly_offended',
        tension: 4,
        choices: [
          {
            id: 'c4r_repair',
            ar: 'معك حق، آسف. خلينا نساعده سوا.',
            en: 'You are right, sorry. Let us help him together.',
            arZ: 'Ma3ik 7a2, asef. Khallina nsaa3do sawa.',
            next: 'n4_help_done',
          },
          {
            id: 'c4r_neutral',
            ar: 'طيب، نرجع لموضوعنا.',
            en: 'Okay, back to our topic.',
            arZ: 'Tayyeb, narja3 le-mawdoo3na.',
            next: 'n5_after_trap',
          },
        ],
      },

      n5_topic: {
        id: 'n5_topic',
        speaker: 'Layan',
        ar: tAr,
        en: tEn,
        arZ: tArZ,
        state: 'neutral',
        tension: 2,
        choices: [
          {
            id: 'c5_support',
            ar: 'ممتاز. قسّمي المهام وأنا معك.',
            en: 'Great. Split the tasks and I am with you.',
            arZ: 'Momtaz. Qassmi el-mham w ana ma3ik.',
            next: 'n6_small_help',
          },
          {
            id: 'c5_neutral',
            ar: 'تمام، شو الأولوية؟',
            en: 'Okay, what is the priority?',
            arZ: 'Tamaam, sho el-awlawiyye?',
            next: 'n6_small_help',
          },
          {
            id: 'c5_trap_shift',
            ar: 'خلينا نأجلها لبعدين.',
            en: 'Let us postpone it.',
            arZ: 'Khallina n2ajjilha la-ba3deen.',
            next: 'n5_after_trap',
          },
        ],
      },

      n5_after_trap: {
        id: 'n5_after_trap',
        speaker: 'Layan',
        ar: 'يعني... لو منأجلها، بنضغط حالنا آخر اليوم.',
        en: 'I mean... if we postpone, we pressure ourselves later.',
        arZ: 'Ya3ni... law mn2ajjilha, bned8at 7alna akher el-yom.',
        state: 'stressed',
        tension: 4,
        choices: [
          {
            id: 'c5r_repair',
            ar: 'صح. خلينا نبلش هلق شوي شوي.',
            en: 'True. Let us start now, step by step.',
            arZ: 'Sa7. Khallina nballesh halla2 shway shway.',
            next: 'n6_small_help',
          },
          {
            id: 'c5r_keep_cold',
            ar: 'أنا مشغول، اعملي اللي بدك.',
            en: 'I am busy, do what you want.',
            arZ: 'Ana mashghool, e3mali elli biddik.',
            next: 'end_awkward',
          },
        ],
      },

      n6_small_help: {
        id: 'n6_small_help',
        speaker: 'Layan',
        ar: 'في شغلة صغيرة... بتراجعلي الإيميل قبل الإرسال؟',
        en: 'One small thing... can you review my email before sending?',
        arZ: 'Fi shaghleh zghire... btraje3li el-email qabel el-ersal?',
        state: 'neutral',
        tension: 3,
        choices: [
          {
            id: 'c6_support',
            ar: 'أكيد. ابعتيه هلق وبراجعه.',
            en: 'Sure. Send it now and I will review it.',
            arZ: 'Akeed. Eb3ateeh halla2 w braje3o.',
            next: 'end_warm',
          },
          {
            id: 'c6_neutral',
            ar: 'بعد عشر دقايق براجعه.',
            en: 'I will review it in ten minutes.',
            arZ: 'Ba3d 3ashr da2aye2 braje3o.',
            next: 'end_neutral',
          },
          {
            id: 'c6_trap_sarcastic',
            ar: 'إيميل كمان؟ اليوم يوم طلبات.',
            en: 'Another email? Today is all requests.',
            arZ: 'Email kaman? El-yom yom talabaat.',
            next: 'end_awkward',
          },
        ],
      },

      end_warm: {
        id: 'end_warm',
        speaker: 'Layan',
        ar: 'يسلمو يا أحمد. هيك الشغل بروق.',
        en: 'Thanks Ahmed. This is how work feels smooth.',
        arZ: 'Yislamo ya Ahmed. Heik el-shoghl byroo2.',
        state: 'warm',
        tension: 2,
        choices: [
          {
            id: 'e_warm',
            ar: 'ولا يهمك. يومك خفيف.',
            en: 'Anytime. Have an easy day.',
            arZ: 'Wala yhemmik. Yomik khafeef.',
            next: 'END',
          },
        ],
      },

      end_neutral: {
        id: 'end_neutral',
        speaker: 'Layan',
        ar: 'تمام. بستناك بعد شوي.',
        en: 'Okay. I will wait for you shortly.',
        arZ: 'Tamaam. Bastannak ba3d shway.',
        state: 'neutral',
        tension: 3,
        choices: [
          {
            id: 'e_neutral',
            ar: 'تمام، منمشي عليها.',
            en: 'Okay, we will go with that.',
            arZ: 'Tamaam, mnimshi 3aleiha.',
            next: 'END',
          },
        ],
      },

      end_awkward: {
        id: 'end_awkward',
        speaker: 'Layan',
        ar: 'طيب... بنكمّل كل واحد لحاله.',
        en: 'Okay... we will each continue on our own.',
        arZ: 'Tayyeb... bnkammel kol wa7ad la7alo.',
        state: 'slightly_offended',
        tension: 4,
        choices: [
          {
            id: 'e_awkward_repair',
            ar: 'استني، آسف. خلينا نضبطها سوا.',
            en: 'Wait, sorry. Let us fix it together.',
            arZ: 'Istanni, asef. Khallina nzabitha sawa.',
            next: 'end_neutral',
          },
          {
            id: 'e_awkward_keep',
            ar: 'تمام.',
            en: 'Fine.',
            arZ: 'Tamaam.',
            next: 'END',
          },
        ],
      },

      END: {
        id: 'END',
        speaker: 'System',
        ar: '✅ نهاية المشهد.',
        en: '✅ End of scene.',
        arZ: '✅ Nehayet el-mashhad.',
        state: 'neutral',
        tension: 1,
        choices: [],
      },
    },
  };
}
