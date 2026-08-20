// Auto-generated refactor: keeps original logic mostly intact.
// NOTE: This module assigns key objects/functions to window to keep cross-file references working.

import * as CONST from '../core/constants.js';
import { defaultLessons as importedDefaultLessons } from '../lessons/index.js';
import { interactiveLessons } from '../curricula/interactive/index.js';
import { gazaSituations } from '../curricula/interactive/data/gazaSituationsData.js';
import { palestinianProverbs } from '../curricula/interactive/data/palestinianCultureData.js';
import * as Cloud from '../cloud/lessonsCloud.js?v=20260515-lesson-sync';
import { arabicLetters, arabicLettersExtras, arabicLettersExercises } from '../data/arabicLettersData.js';
import {
    canUseTeacherRole,
} from './teacherAccess.js';
import {
    resolveUserRole,
    bootstrapTeacherAccess,
    createStudentAccount,
} from './authFlows.js';
import {
    wireDialogueEditor,
    wireGrammarEditor,
    wireTranslationEditor,
    wireQuizEditor,
    wireRolePlayEditor,
    wireHomeworkEditor,
    wireTeacherNotesEditor,
} from './teacherPracticeEditor.js';

// Re-create original constant names in module scope
const LS_STUDENTS_KEY = CONST.LS_STUDENTS_KEY;
const LS_LESSON_PREFIX = CONST.LS_LESSON_PREFIX;
const LS_FONT_SIZE_KEY = CONST.LS_FONT_SIZE_KEY;
const LS_CUSTOM_UNITS_KEY = CONST.LS_CUSTOM_UNITS_KEY;
const LS_BACKUP_SETTINGS_KEY = CONST.LS_BACKUP_SETTINGS_KEY;
const LS_WHITEBOARD_PREFIX = CONST.LS_WHITEBOARD_PREFIX;
const LS_USER_ROLE_KEY = CONST.LS_USER_ROLE_KEY;
const LESSON_ID_GREETING = CONST.LESSON_ID_GREETING;
const LESSON_ID_DAILY_ROUTINE = CONST.LESSON_ID_DAILY_ROUTINE;
const LESSON_ID_FOOD_DRINK = CONST.LESSON_ID_FOOD_DRINK;
const LESSON_ID_FAMILY = CONST.LESSON_ID_FAMILY;
const LESSON_ID_TRANSPORT = CONST.LESSON_ID_TRANSPORT;
const LESSON_ID_WORK_STUDY = CONST.LESSON_ID_WORK_STUDY;
const LESSON_ID_HEALTH = CONST.LESSON_ID_HEALTH;
const LESSON_ID_APARTMENT = CONST.LESSON_ID_APARTMENT;
const LESSON_ID_SHOPPING = CONST.LESSON_ID_SHOPPING;
const LESSON_ID_WEATHER = CONST.LESSON_ID_WEATHER;
const LESSON_ID_OPINIONS = CONST.LESSON_ID_OPINIONS;
const LESSON_ID_COMPLAINTS = CONST.LESSON_ID_COMPLAINTS;
const LESSON_ID_PLANS_FUTURE = CONST.LESSON_ID_PLANS_FUTURE;
const LESSON_ID_FEELINGS = CONST.LESSON_ID_FEELINGS;
const LESSON_ID_HOBBIES = CONST.LESSON_ID_HOBBIES;
const BASE_PROGRESS_TEMPLATE = CONST.BASE_PROGRESS_TEMPLATE;

// Match original variable name used throughout the legacy code
const CURRICULUMS = {
    structured: { id: "structured", title: "Structured Teaching Curriculum", badge: "Curriculum 1" },
    interactive: { id: "interactive", title: "Interactive Palestinian Arabic Course", badge: "Curriculum 2" },
};
const defaultLessons = {
    ...Object.fromEntries(Object.entries(importedDefaultLessons).map(([id, lesson]) => [id, {
        ...lesson,
        meta: { ...(lesson.meta || {}), curriculumId: "structured" },
    }])),
    ...interactiveLessons,
};
const getServerTimestamp = Cloud.getServerTimestamp;
const loadLessonsFromCloudOnce = Cloud.loadLessonsFromCloudOnce;
const subscribeLessonsFromCloud = Cloud.subscribeLessonsFromCloud;
const saveLessonToCloud = Cloud.saveLessonToCloud;
const deleteLessonFromCloud = Cloud.deleteLessonFromCloud;
const startLessonCloudSync = Cloud.startLessonCloudSync;
const stopLessonCloudSync = Cloud.stopLessonCloudSync;
const syncLessonsNow = Cloud.syncLessonsNow;
const setLessonSyncForScreen = Cloud.setLessonSyncForScreen;

const lessons = {};
// Expose for cloud module and other modules
window.lessons = lessons;


let cloudSaveTimer = null;

function scheduleCloudSave() {
    if (!appState.currentUser || appState.currentUser.role !== "teacher") return;
    clearTimeout(cloudSaveTimer);
    cloudSaveTimer = setTimeout(() => {
        saveStudentsToCloud().catch(console.error);
    }, 600); // Ù†ØµÙ Ø«Ø§Ù†ÙŠØ© Ø¨Ø¹Ø¯ Ø¢Ø®Ø± ØªØºÙŠÙŠØ±
}

// ========================= STATE =========================
const appState = {
    students: [],
    currentStudentId: null,
    currentLessonId: LESSON_ID_GREETING,
    currentCurriculumId: null,
    teacherMode: false,
    currentTab: "overview",
    lessonFontSize: 1,
    vocabCoreVisited: {},
    guestMode: false,
    guestStudent: null,
};
window.appState = appState;
let backupSettings = {
    frequency: "off",      // "off" | "daily" | "2d" | "weekly"
    lastBackupAt: null,    // ISO string
};

function getScopedStorageKey(baseKey) {
    const uid = appState.currentUser?.uid || "anonymous";
    return `${baseKey}:${uid}`;
}

function escapeHtml(str) {
    return String(str || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function escapeAttr(str) {
    return escapeHtml(str).replace(/`/g, "&#96;");
}

const exportContext = {
    lessonId: null,
    studentName: "",
    source: "", // "lesson-view" Ø£Ùˆ "teacher-dashboard"
};
let customUnits = {
    Beginner: [],
    "Pre-Intermediate": [],
    Intermediate: [],
};
// =============== SECONDARY AUTH APP (Ù„Ø¥Ù†Ø´Ø§Ø¡ Ø§Ù„Ø·Ù„Ø§Ø¨ ÙÙ‚Ø·) ===============
let secondaryAuth = null;

function getSecondaryAuth() {
    if (secondaryAuth) return secondaryAuth;

    if (typeof firebase === "undefined" || typeof firebaseConfig === "undefined") {
        console.warn("Firebase or firebaseConfig not available for secondary app.");
        return null;
    }

    // Ù†Ø­Ø§Ùˆل Ù†Ù„Ù‚Ù‰ app Ø¨Ø§Ø³م "teacherAdmin" Ù„Ùˆ Ù…ÙˆØ¬ÙˆØ¯
    let secondaryApp = firebase.apps.find((a) => a.name === "teacherAdmin");
    if (!secondaryApp) {
        secondaryApp = firebase.initializeApp(firebaseConfig, "teacherAdmin");
    }

    secondaryAuth = secondaryApp.auth();
    return secondaryAuth;
}

// ================= AUTH UI =================
function updateAuthUI() {
    const authStatus = document.getElementById("authStatus");
    const btnLogin = document.getElementById("btnLogin");
    const btnLogout = document.getElementById("btnLogout");

    const navTeacher = document.querySelector(
        '.top-nav__link[data-nav="teacher-dashboard-screen"]'
    );
    const navProfiles = document.querySelector(
        '.top-nav__link[data-nav="students-screen"]'
    );

    if (!appState.currentUser) {
        if (authStatus) authStatus.textContent = "Not signed in";
        if (btnLogin) btnLogin.style.display = "inline-flex";
        if (btnLogout) btnLogout.style.display = "none";

        // Ø£ي Ø­Ø¯ Ù…Ø´ Ù…Ø³Ø¬ّل → Ù…Ø§ ÙŠØ´ÙˆÙ Teacher Dashboard
        if (navTeacher) navTeacher.style.display = "none";
        // Ù„Ùˆ Ø­Ø§Ø¨Ø© ØªØ®لي Profiles Ø¸Ø§Ù‡Ø± Ù‚Ø¨ل ØªØ³Ø¬يل Ø§Ù„Ø¯Ø®Ùˆل، Ø®ليه Ù‡ÙŠÙƒ:
        if (navProfiles) navProfiles.style.display = "inline-flex";
        if (typeof window.setDrawingLayerForRole === "function") {
            window.setDrawingLayerForRole(null);
        }
        return;
    }

    const { email, role } = appState.currentUser;

    if (role === "guest") {
        if (authStatus) authStatus.textContent = "GUEST - Limited access";
        if (btnLogin) btnLogin.style.display = "inline-flex";
        if (btnLogout) {
            btnLogout.style.display = "inline-flex";
            btnLogout.textContent = "Exit Guest";
        }
        if (navTeacher) navTeacher.style.display = "none";
        if (navProfiles) navProfiles.style.display = "none";
        if (typeof window.setDrawingLayerForRole === "function") {
            window.setDrawingLayerForRole("guest");
        }
        return;
    }

    if (authStatus) authStatus.textContent = `${role.toUpperCase()} - ${email}`;
    if (btnLogin) btnLogin.style.display = "none";
    if (btnLogout) {
        btnLogout.style.display = "inline-flex";
        btnLogout.textContent = "Logout";
    }

    if (role === "teacher") {
        if (navTeacher) navTeacher.style.display = "inline-flex";
        if (navProfiles) navProfiles.style.display = "inline-flex";
    } else {
        // student
        if (navTeacher) navTeacher.style.display = "none";
        // Ø§Ù„Ø·Ø§Ù„Ø¨ Ù…Ø§ ÙŠØ´ÙˆÙ ØµÙØ­Ø© Ø§Ù„Ø¨Ø±ÙˆÙØ§ÙŠÙ„Ø§Øª
        if (navProfiles) navProfiles.style.display = "none";
    }
    if (typeof window.setDrawingLayerForRole === "function") {
        window.setDrawingLayerForRole(role);
    }
}

// =============== AUTH STATE LISTENER =================
	auth.onAuthStateChanged(async (user) => {
	    if (!user) {
	        appState.currentUser = null;
	        appState.students = [];
	        appState.currentStudentId = null;
	        updateAuthUI();
        // Ø±Ø¬Ù‘Ø¹يه Ù„Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©
        showScreen("home-screen");
        return;
    }

    try {
        // Ù†Ø­Ø§Ùˆل Ù†Ù‚Ø±Ø£ Ø§Ù„Ø¯ÙˆØ± من Firestore، ÙˆÙ„Ùˆ Ù…Ø´ Ù…ÙˆØ¬ÙˆØ¯ من localStorage
        let savedRole = null;
        try {
            savedRole = localStorage.getItem(LS_USER_ROLE_KEY);
        } catch (e) {
            console.warn("Could not read role from localStorage", e);
        }

        const { role } = await resolveUserRole({
            db,
            uid: user.uid,
            email: user.email,
            savedRole,
            fallbackRole: null,
        });

	        appState.currentUser = {
	            uid: user.uid,
	            email: user.email,
	            role,
	        };
	        if (role === "teacher") {
	            appState.students = [];
	            appState.currentStudentId = null;
	        }

        // Ù†Ø­Ø¯Ù‘Ø« Ø§Ù„Ù€ localStorage Ø¨Ø§Ù„Ø¯ÙˆØ± Ø§Ù„Ù†Ù‡Ø§Ø¦ي
        try {
            localStorage.setItem(LS_USER_ROLE_KEY, role);
        } catch (e) {
            console.warn("Could not save role to localStorage", e);
        }

        updateAuthUI();

	        if (role === "teacher") {
	            await bootstrapTeacherAccess({ db, firebase, uid: user.uid, email: user.email });
            await syncTeacherStudentsFromCloud?.();
	            renderStudents();
	            renderTeacherPicker();
	            goToTeacherDashboard();
        } else {
            appState.students = [
                {
                    id: user.uid,
                    name: user.email,
                    level: "Beginner",
                    goals: [],
                    progress: {},
                    homeworkNotes: {},
                },
            ];
            appState.currentStudentId = user.uid;
            appState.currentCurriculumId = null;
            goToCurriculumChoice();
        }
    } catch (err) {
        console.error("auth.onAuthStateChanged error:", err);
    }
});

// =======================
// Translation Sentence Generator (from lesson vocabulary)
// =======================

function repairMojibakeText(value) {
    const text = (value || "").toString();
    const mojibakePattern = /[\u00C3\u00C2\u00D8\u00D9\u00E2\u00F0]/;
    if (!mojibakePattern.test(text)) return text;
    const cp1252 = {
        0x20AC: 0x80, 0x201A: 0x82, 0x0192: 0x83, 0x201E: 0x84,
        0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02C6: 0x88,
        0x2030: 0x89, 0x0160: 0x8A, 0x2039: 0x8B, 0x0152: 0x8C,
        0x017D: 0x8E, 0x2018: 0x91, 0x2019: 0x92, 0x201C: 0x93,
        0x201D: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
        0x02DC: 0x98, 0x2122: 0x99, 0x0161: 0x9A, 0x203A: 0x9B,
        0x0153: 0x9C, 0x017E: 0x9E, 0x0178: 0x9F,
    };
    try {
        const bytes = [];
        for (const ch of text) {
            const code = ch.codePointAt(0);
            if (code <= 255) bytes.push(code);
            else if (cp1252[code]) bytes.push(cp1252[code]);
            else return text;
        }
        const repaired = new TextDecoder("utf-8", { fatal: false }).decode(new Uint8Array(bytes));
        return repaired.includes("\uFFFD") ? text : repaired;
    } catch {
        return text;
    }
}

function normalizeText(s) {
    return repairMojibakeText(s).trim();
}

function pickRandom(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function uniqBy(arr, keyFn) {
    const seen = new Set();
    const out = [];
    for (const x of arr) {
        const k = keyFn(x);
        if (!k || seen.has(k)) continue;
        seen.add(k);
        out.push(x);
    }
    return out;
}

// Try to detect nouns / greetings / misc from vocabulary (very lightweight)
function bucketVocabulary(vocabItems) {
    const items = (Array.isArray(vocabItems) ? vocabItems : [])
        .map((it) => ({
            ...it,
            ar: normalizeText(it.ar),
            en: normalizeText(it.en),
            hint: normalizeText(it.hint),
            exampleAr: normalizeText(it.exampleAr),
            exampleEn: normalizeText(it.exampleEn),
        }))
        .filter((it) => it.ar || it.en);

    // greetings / common phrases: heuristics by english keywords OR arabic starts
    const greetingKeywords = [
        "hello",
        "hi",
        "good morning",
        "good evening",
        "goodbye",
        "welcome",
        "nice to meet",
        "please",
        "thanks",
        "thank you",
    ];

    const greetings = items.filter((it) => {
        const en = it.en.toLowerCase();
        const ar = it.ar;
        return (
            greetingKeywords.some((k) => en.includes(k)) ||
            ar.includes("مرحبا") ||
            ar.includes("أهلا") ||
            ar.includes("صباح") ||
            ar.includes("مساء") ||
            ar.includes("مع السلامة") ||
            ar.includes("تشرف")
        );
    });

    // nouns: heuristic - english contains "my" forms or common noun list in hint
    // (Not perfect; we also just keep "others" as nouns candidates.)
    const nounCandidates = items.filter((it) => {
        const en = it.en.toLowerCase();
        const ar = it.ar;
        // If it looks like a noun (contains "/" or is a single word) we allow it
        const enWords = en.split(/\s+/).filter(Boolean);
        return enWords.length <= 3 || ar.length <= 12;
    });

    // verbs: if forms.present has content OR english starts with "to "
    const verbs = items.filter((it) => {
        const en = it.en.toLowerCase();
        const hasForms =
            it.forms &&
            ((it.forms.present && Object.keys(it.forms.present).length > 0) ||
                (it.forms.past && Object.keys(it.forms.past).length > 0) ||
                (it.forms.future && Object.keys(it.forms.future).length > 0));
        return hasForms || en.startsWith("to ");
    });

    const others = items;

    return {
        all: items,
        greetings: uniqBy(greetings, (x) => x.id || x.ar || x.en),
        nouns: uniqBy(nounCandidates, (x) => x.id || x.ar || x.en),
        verbs: uniqBy(verbs, (x) => x.id || x.ar || x.en),
        others: uniqBy(others, (x) => x.id || x.ar || x.en),
    };
}

/**
 * Generate translation sentences (not word=word) from lesson vocabulary
 * @param {object} lesson - the lesson object (has vocabulary)
 * @param {number} count - how many translation items to generate
 * @returns {Array} translation items [{id,type,textAr,textEn}]
 */
function generateTranslationFromVocab(lesson, count = 10) {
    const vocabCore = lesson?.vocabulary?.core || [];
    const vocabExtra = lesson?.vocabulary?.extra || [];
    const vocab = bucketVocabulary([...vocabCore, ...vocabExtra]);

    const results = [];

    // Some reusable fillers to make sentences natural
    const names = ["سارة", "أحمد", "لينا", "كريم", "نابِل", "هبة"];
    const timesAr = ["اليوم", "هلّق", "بكرا"];
    const timesEn = ["today", "now", "tomorrow"];

    function addPair(en, ar) {
        const textEn = normalizeText(en);
        const textAr = normalizeText(ar);
        if (!textEn || !textAr) return;

        // avoid duplicates
        const key = (textEn + "||" + textAr).toLowerCase();
        if (results.some((r) => (r.textEn + "||" + r.textAr).toLowerCase() === key)) return;

        // alternate directions roughly half/half
        const type = results.length % 2 === 0 ? "enToAr" : "arToEn";

        results.push({
            id: `auto_t_${results.length + 1}`,
            type,
            textEn,
            textAr,
        });
    }

    // ---------- Template 1: Greeting + name ----------
    // "Hello, I'm X." / "Ù…Ø±Ø­Ø¨Ø§، Ø£Ù†Ø§ X."
    if (vocab.greetings.length) {
        const g = pickRandom(vocab.greetings);
        const helloAr = g?.ar || "مرحبا";
        const helloEn = g?.en || "Hello";
        const name = pickRandom(names);

        addPair(`${helloEn}! I'm ${name}.`, `${helloAr}! أنا ${name}.`);
    } else {
        const name = pickRandom(names);
        addPair(`Hello! I'm ${name}.`, `مرحبا! أنا ${name}.`);
    }

    // ---------- Template 2: How are you? + I'm fine ----------
    // "How are you today? I'm fine." / "ÙƒÙŠÙÙƒ Ø§Ù„ÙŠÙˆم؟ Ø£Ù†Ø§ Ù…Ù†ÙŠØ­/Ù…Ù†ÙŠØ­Ø©."
    // If you have "ÙƒÙŠÙÙƒ" or "Ù…Ù†ÙŠØ­" in vocab, use them, else fallback
    const howAr =
        pickRandom(vocab.others.filter((x) => x.ar.includes("كيف")))?.ar || "كيفك";
    const howEn =
        pickRandom(vocab.others.filter((x) => x.en.toLowerCase().includes("how are")))?.en ||
        "How are you";
    const fineAr =
        pickRandom(vocab.others.filter((x) => x.ar.includes("منيح") || x.ar.includes("منيحة")))
            ?.ar || "منيح";
    const fineEn =
        pickRandom(vocab.others.filter((x) => x.en.toLowerCase().includes("fine")))
            ?.en || "I'm fine";

    const tA = pickRandom(timesAr);
    const tE = timesEn[timesAr.indexOf(tA)] || "today";
    addPair(`${howEn} ${tE}? ${fineEn}.`, `${howAr} ${tA}؟ أنا ${fineAr}.`);

    // ---------- Template 3: Nice to meet you ----------
    // "Nice to meet you, X." / "ØªØ´Ø±ÙÙ†Ø§ ÙŠØ§ X."
    const meetAr =
        pickRandom(vocab.others.filter((x) => x.ar.includes("تشرف")))?.ar || "تشرفنا";
    const meetEn =
        pickRandom(vocab.others.filter((x) => x.en.toLowerCase().includes("nice to meet")))
            ?.en || "Nice to meet you";
    const name2 = pickRandom(names);
    addPair(`${meetEn}, ${name2}.`, `${meetAr} يا ${name2}.`);

    // ---------- Template 4: Want + noun (biddi + noun) ----------
    // We'll pick a noun candidate; if none, use "Ù‚Ù‡ÙˆØ©" (coffee)
    const noun = pickRandom(vocab.nouns) || { ar: "قهوة", en: "coffee" };
    // Natural sentence:
    // "I want a coffee, please." / "Ø¨Ø¯ي Ù‚Ù‡ÙˆØ©، Ù„Ùˆ Ø³Ù…Ø­Øª."
    addPair(
        `I want ${noun.en || "coffee"}, please.`,
        `بدي ${noun.ar || "قهوة"}، لو سمحت.`
    );

    // ---------- Template 5: Do you have + noun? ----------
    // "Do you have ___?" / "Ø¹Ù†Ø¯Ùƒ ___؟"
    const noun2 = pickRandom(shuffle(vocab.nouns)) || { ar: "مي", en: "water" };
    addPair(`Do you have ${noun2.en || "water"}?`, `عندك ${noun2.ar || "مي"}؟`);

    // ---------- Template 6: My family / my work / my study style ----------
    // If you have family nouns, use them, otherwise use generic
    const familyWord =
        pickRandom(vocab.others.filter((x) => x.en.toLowerCase().includes("family") || x.ar.includes("عيلة")))
            ?.ar || "عيلتي";
    const familyEn =
        pickRandom(vocab.others.filter((x) => x.en.toLowerCase().includes("family")))
            ?.en || "My family";

    addPair(`${familyEn} is big.`, `${familyWord} كبيرة.`);

    // ---------- Template 7: Goodbye + see you tomorrow ----------
    const byeAr =
        pickRandom(vocab.others.filter((x) => x.ar.includes("مع السلامة") || x.ar.includes("الله معك")))
            ?.ar || "مع السلامة";
    const byeEn =
        pickRandom(vocab.others.filter((x) => x.en.toLowerCase().includes("goodbye")))
            ?.en || "Goodbye";
    addPair(`${byeEn}, see you tomorrow.`, `${byeAr}، بشوفك بكرا.`);

    // ---------- Bonus: Use existing example sentences from vocab (if present) ----------
    // These are already full sentences and strongly "from the lesson"
    // We add a few of them if they exist, to reach target count.
    const examplePairs = vocab.all
        .filter((it) => it.exampleAr && it.exampleEn)
        .map((it) => ({ en: it.exampleEn, ar: it.exampleAr }));

    for (const ex of shuffle(examplePairs)) {
        if (results.length >= count) break;
        addPair(ex.en, ex.ar);
    }

    // If still not enough, generate variations with different nouns/times
    while (results.length < count) {
        const n = pickRandom(vocab.nouns) || { ar: "قهوة", en: "coffee" };
        const ta = pickRandom(timesAr);
        const te = timesEn[timesAr.indexOf(ta)] || "today";
        addPair(
            `I want ${n.en || "coffee"} ${te}.`,
            `بدي ${n.ar || "قهوة"} ${ta}.`
        );
    }

    return results.slice(0, count);
}

/**
 * Ensure lesson has translation items (auto-generate if empty)
 * Call this when opening a lesson or rendering the Translation tab.
 */
function ensureLessonTranslation(lesson, count = 10) {
    if (!lesson.practice) lesson.practice = {};
    if (!Array.isArray(lesson.practice.translation) || lesson.practice.translation.length === 0) {
        lesson.practice.translation = generateTranslationFromVocab(lesson, count);
    }
}
function safeArr(x) { return Array.isArray(x) ? x : []; }
function txt(x) { return (x ?? "").toString().trim(); }
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function pick(arr) { return arr.length ? arr[Math.floor(Math.random() * arr.length)] : null; }
function uniqPairs(items) {
    const seen = new Set();
    return items.filter(it => {
        const key = (txt(it.textEn) + "||" + txt(it.textAr)).toLowerCase();
        if (!txt(it.textEn) || !txt(it.textAr)) return false;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}


function generateTranslationItemsFromLesson(lesson, minCount = 7) {
    const items = [];

    const vocab = lesson?.vocabulary || {};
    const core = safeArr(vocab.core);
    const extra = safeArr(vocab.extra);
    const allVocab = [...core, ...extra];

    // 1) Ø£Ø®Ø° Ø£Ù…Ø«Ù„Ø© من vocabulary (Ø£ÙØ¶ل Ù…ØµØ¯Ø± Ù„Ø£نه Ø¬مل Ø¬Ø§Ù‡Ø²Ø© من Ø§Ù„Ù…Ù†Ù‡Ø¬)
    for (const v of allVocab) {
        const ar = txt(v.exampleAr);
        const en = txt(v.exampleEn);
        if (ar && en) {
            items.push({ id: `ex_${txt(v.id) || Math.random()}`, textEn: en, textAr: ar });
        }
    }

    // 2) Ø£Ø®Ø° Ø¬مل من Ø§Ù„Ø­ÙˆØ§Ø± (Ùƒل Ø³Ø·Ø± pair Ù…Ø¹ ØªØ±Ø¬Ù…Øªه)
    const lines = safeArr(lesson?.dialogue?.lines);
    for (const line of lines) {
        const ar = txt(line.ar);
        const en = txt(line.en);
        if (ar && en) {
            items.push({ id: `dlg_${Math.random()}`, textEn: en, textAr: ar });
        }
    }

    // 3) Ø¥Ø°Ø§ Ù„Ø³ه Ø£قل من Ø§Ù„Ù…Ø·Ù„ÙˆØ¨: Ù†ÙˆÙ„Ù‘Ø¯ Ø¬مل Ø¨Ø§Ù„Ù‚ÙˆØ§Ù„Ø¨
    const nouns = allVocab
        .map(v => ({ ar: txt(v.ar), en: txt(v.en) }))
        .filter(v => v.ar || v.en);

    const nameAr = ["سارة", "أحمد", "لينا", "كريم", "هبة", "نابِل"];
    const nameEn = ["Sara", "Ahmad", "Lina", "Karim", "Hiba", "Nabil"];

    const getNoun = () => pick(nouns) || { ar: "قهوة", en: "coffee" };

    const templates = [
        () => {
            const i = Math.floor(Math.random() * nameAr.length);
            return { en: `Hello! I'm ${nameEn[i]}.`, ar: `مرحبا! أنا ${nameAr[i]}.` };
        },
        () => {
            return { en: `How are you today?`, ar: `كيفك اليوم؟` };
        },
        () => {
            const n = getNoun();
            return { en: `I want ${n.en || "coffee"}, please.`, ar: `بدي ${n.ar || "قهوة"}، لو سمحت.` };
        },
        () => {
            const n = getNoun();
            return { en: `Do you have ${n.en || "water"}?`, ar: `عندك ${n.ar || "مي"}؟` };
        },
        () => {
            const n = getNoun();
            return { en: `This is ${n.en || "it"}.`, ar: `هاد ${n.ar || "هاد"}.` };
        },
        () => {
            return { en: `Nice to meet you.`, ar: `تشرفنا.` };
        },
        () => {
            return { en: `Goodbye, see you tomorrow.`, ar: `مع السلامة، بشوفك بكرا.` };
        },
    ];

    let guard = 0;
    while (items.length < minCount && guard < 50) {
        const t = pick(templates);
        if (t) {
            const out = t();
            items.push({ id: `auto_${items.length + 1}`, textEn: out.en, textAr: out.ar });
        }
        guard++;
    }

    return uniqPairs(items).slice(0, Math.max(minCount, 7));
}


function ensureTranslationItems(lesson, minCount = 7) {
    if (!lesson.practice) lesson.practice = {};
    const list = safeArr(lesson.practice.translation);

    if (list.length > 0) return; // Ù…ÙˆØ¬ÙˆØ¯Ø© Ù…Ø³Ø¨Ù‚Ø§Ù‹

    const generated = generateTranslationItemsFromLesson(lesson, minCount);

    // Ù†Ø­ÙˆÙ„Ù‡Ø§ Ù„ØµÙŠØºØ© Ø§Ù„Ù‚Ø§Ù„Ø¨: type + textEn/textAr
    lesson.practice.translation = generated.map((it, idx) => ({
        id: it.id || `t_${idx + 1}`,
        type: idx % 2 === 0 ? "enToAr" : "arToEn",
        textEn: it.textEn,
        textAr: it.textAr,
    }));
}


// ========================= VOCAB MODAL STATE =========================
const vocabModalState = {
    list: [],       // array of items (core Ø£Ùˆ extra)
    index: 0,       // current index in list
    showExamples: true,// هل Ø§Ù„Ø£Ù…Ø«Ù„Ø© Ø¸Ø§Ù‡Ø±Ø© Ø£Ùˆ Ù…Ø®ÙÙŠØ©
    showAr: true,
    showEn: true,
    showArabeezy: true,
    nextClickCount: 0,
};
const translationState = {
    items: [],
    index: 0,
    hidePrompt: false,
    hideAnswer: false,
    shuffled: false,
};
const microCheckState = {
    isOpen: false,
    pendingNextAdvance: false,
    currentItem: null,
    currentLessonId: null,
    checked: false,
    selectedOption: null,
    buildAnswer: [],
    rotationIndexByLesson: {},
};

function getVocabMemoryKey(lessonId, studentId = appState.currentStudentId) {
    const sid = studentId || "anon";
    return `pal_vocab_memory_${sid}_${lessonId || "unknown"}`;
}

function loadVocabMemory(lessonId, studentId = appState.currentStudentId) {
    try {
        const raw = localStorage.getItem(getVocabMemoryKey(lessonId, studentId));
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function saveVocabMemory(lessonId, memory, studentId = appState.currentStudentId) {
    try {
        localStorage.setItem(
            getVocabMemoryKey(lessonId, studentId),
            JSON.stringify(memory || {})
        );
    } catch { }
}

function setVocabMemoryStatus(lessonId, itemId, status) {
    if (!lessonId || !itemId) return;
    const memory = loadVocabMemory(lessonId);
    memory[itemId] = status;
    saveVocabMemory(lessonId, memory);
}



function getMicroCheckConfig(lesson) {
    const cfg = lesson?.microChecks || {};
    return {
        enabled: cfg.enabled === true,
        every: Number.isFinite(cfg.every) ? cfg.every : 5,
        items: Array.isArray(cfg.items) ? cfg.items : [],
    };
}

function ensureMicroCheckItems(lesson) {
    if (!lesson || !lesson.microChecks) return;
    const items = Array.isArray(lesson.microChecks.items) ? lesson.microChecks.items : [];
    const existingTypes = new Set(items.map((it) => it.type));
    const needed = ["match", "complete", "reorder", "choose"].filter(
        (type) => !existingTypes.has(type)
    );
    if (!needed.length) return;
    const generated = buildMicroCheckItemsFromLesson(lesson, needed);
    if (generated.length) {
        lesson.microChecks.items = items.concat(generated);
    }
}

function buildMicroCheckItemsFromLesson(lesson, types) {
    const vocab = getLessonVocabPairs(lesson);
    const grammarRows = getLessonGrammarRows(lesson);
    const items = [];
    let autoId = 1;
    const makeId = (prefix) => `mc_auto_${prefix}_${autoId++}`;

    types.forEach((type) => {
        let item = null;
        if (type === "match") {
            item = buildMatchMicroCheck(vocab, makeId);
        } else if (type === "complete") {
            item = buildCompleteMicroCheck(vocab, makeId);
        } else if (type === "reorder") {
            item = buildReorderMicroCheck(vocab, makeId);
        } else if (type === "choose") {
            item = buildChooseMicroCheck(grammarRows, makeId);
        }
        if (item) items.push(item);
    });

    return items;
}

function getLessonVocabPairs(lesson) {
    const vocab = lesson?.vocabulary || {};
    const items = [...safeArr(vocab.core), ...safeArr(vocab.extra)].map((it) => ({
        ar: txt(it.ar),
        en: txt(it.en),
        exampleAr: txt(it.exampleAr),
        exampleEn: txt(it.exampleEn),
    }));
    return items.filter((it) => it.ar && it.en);
}

function getLessonGrammarRows(lesson) {
    const pronouns = [
        "أنا",
        "إنتَ",
        "إنتِ",
        "هو",
        "هي",
        "إحنا",
        "إنتو",
        "هم",
        "انت",
        "انتي",
    ];
    const items = safeArr(lesson?.grammar);
    const rows = [];
    items.forEach((g) => {
        const examples = Array.isArray(g.examples) ? g.examples : [];
        examples.forEach((ex) => {
            const exampleText = txt(ex.ar);
            if (!exampleText) return;
            const matched = pronouns.find((p) => exampleText.includes(p));
            if (!matched) return;
            rows.push({ pronoun: matched, example: exampleText });
        });
    });
    return rows;
}

function buildMatchMicroCheck(vocab, makeId) {
    if (vocab.length < 2) return null;
    const target = pick(vocab);
    if (!target) return null;
    const distractors = shuffleArray(vocab.filter((it) => it.en !== target.en))
        .map((it) => it.en)
        .filter(Boolean);
    const options = shuffleArray([target.en, ...distractors].slice(0, 4));
    if (options.length < 2) return null;
    return {
        id: makeId("match"),
        type: "match",
        prompt: `Match the Arabic word with its English meaning: ${target.ar}`,
        options,
        correct: target.en,
    };
}

function buildCompleteMicroCheck(vocab, makeId) {
    const candidates = vocab.filter(
        (it) => it.exampleAr && it.ar && it.exampleAr.includes(it.ar)
    );
    if (!candidates.length) return null;
    const target = pick(candidates);
    if (!target) return null;
    const prompt = target.exampleAr.replace(target.ar, "___");
    const distractors = shuffleArray(vocab.filter((it) => it.ar !== target.ar))
        .map((it) => it.ar)
        .filter(Boolean);
    const options = shuffleArray([target.ar, ...distractors].slice(0, 4));
    if (options.length < 2) return null;
    return {
        id: makeId("complete"),
        type: "complete",
        prompt,
        options,
        correct: target.ar,
    };
}

function buildReorderMicroCheck(vocab, makeId) {
    const sentences = vocab
        .map((it) => it.exampleAr || it.exampleEn)
        .filter(Boolean);
    const candidates = sentences
        .map((text) => ({ text, words: tokenizeMicroCheckWords(text) }))
        .filter((it) => it.words.length >= 3 && it.words.length <= 8);
    if (!candidates.length) return null;
    const target = pick(candidates);
    if (!target) return null;
    return {
        id: makeId("reorder"),
        type: "reorder",
        prompt: "Rearrange the words",
        options: target.words,
        correct: target.words,
    };
}

function buildChooseMicroCheck(rows, makeId) {
    if (rows.length < 2) return null;
    const target = pick(rows);
    if (!target) return null;
    const distractors = shuffleArray(rows.filter((r) => r.pronoun !== target.pronoun))
        .map((r) => r.pronoun)
        .filter(Boolean);
    const options = shuffleArray([target.pronoun, ...distractors].slice(0, 4));
    if (options.length < 2) return null;
    return {
        id: makeId("choose"),
        type: "choose",
        prompt: `Choose the correct pronoun: ${target.example}`,
        options,
        correct: target.pronoun,
    };
}

function tokenizeMicroCheckWords(text) {
    return String(text)
        .replace(/[.,!?;:()"]/g, "")
        .split(/\s+/)
        .filter(Boolean);
}

function pickNextMicroCheckItem(lesson) {
    const cfg = getMicroCheckConfig(lesson);
    if (!cfg.items.length) return null;
    const lessonId = appState.currentLessonId || "lesson";
    const nextIndex = microCheckState.rotationIndexByLesson[lessonId] || 0;
    microCheckState.rotationIndexByLesson[lessonId] =
        (nextIndex + 1) % cfg.items.length;
    return cfg.items[nextIndex];
}

function openMicroCheckModal(lesson) {
    const item = pickNextMicroCheckItem(lesson);
    if (!item) return false;
    const modal = document.getElementById("microCheckModal");
    if (!modal) return false;

    microCheckState.isOpen = true;
    microCheckState.currentItem = item;
    microCheckState.currentLessonId = appState.currentLessonId;
    microCheckState.checked = false;
    microCheckState.selectedOption = null;
    microCheckState.buildAnswer = [];

    renderMicroCheckItem(item);
    modal.classList.add("modal--open");
    return true;
}

function closeMicroCheckModal() {
    const modal = document.getElementById("microCheckModal");
    if (modal) modal.classList.remove("modal--open");
    microCheckState.isOpen = false;
    microCheckState.currentItem = null;
    microCheckState.checked = false;
    microCheckState.selectedOption = null;
    microCheckState.buildAnswer = [];
    microCheckState.pendingNextAdvance = false;
}

function renderMicroCheckItem(item) {
    const titleEl = document.getElementById("microCheckTitle");
    const promptEl = document.getElementById("microCheckPrompt");
    const optionsEl = document.getElementById("microCheckOptions");
    const builderEl = document.getElementById("microCheckBuilder");
    const feedbackEl = document.getElementById("microCheckFeedback");
    const resetBtn = document.getElementById("microCheckResetBtn");
    const checkBtn = document.getElementById("microCheckCheckBtn");
    const continueBtn = document.getElementById("microCheckContinueBtn");
    const closeBtn = document.getElementById("microCheckCloseBtn");

    if (!titleEl || !promptEl || !optionsEl || !builderEl || !feedbackEl) return;

    const titles = {
        match: "Match (Arabic ↔ English)",
        complete: "Complete the sentence",
        reorder: "Build it",
        choose: "Choose the correct form",
    };

    titleEl.textContent = item.title || titles[item.type] || "Micro-Check";
    promptEl.textContent = item.prompt || "";
    feedbackEl.textContent = "";
    optionsEl.innerHTML = "";
    builderEl.innerHTML = "";

    if (resetBtn) resetBtn.style.display = item.type === "reorder" ? "" : "none";
    if (checkBtn) checkBtn.disabled = false;
    if (continueBtn) continueBtn.disabled = true;
    if (closeBtn) closeBtn.disabled = true;

    if (item.type === "reorder") {
        const bankLabel = document.createElement("div");
        bankLabel.className = "translation-muted";
        bankLabel.textContent = "Word bank";

        const answerLabel = document.createElement("div");
        answerLabel.className = "translation-muted";
        answerLabel.textContent = "Your sentence";

        const bank = document.createElement("div");
        bank.className = "microcheck__bank";
        const answer = document.createElement("div");
        answer.className = "microcheck__answer";

        const baseWords = Array.isArray(item.options) && item.options.length
            ? item.options
            : Array.isArray(item.correct)
                ? item.correct
                : String(item.correct || "")
                    .split(" ")
                    .filter(Boolean);
        const words = shuffleArray(baseWords || []);
        microCheckState.buildAnswer = [];

        function renderBank() {
            bank.innerHTML = "";
            words.forEach((w, idx) => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.className = "microcheck__chip";
                chip.textContent = w;
                chip.addEventListener("click", () => {
                    const picked = words.splice(idx, 1)[0];
                    microCheckState.buildAnswer.push(picked);
                    renderBank();
                    renderAnswer();
                });
                bank.appendChild(chip);
            });
        }

        function renderAnswer() {
            answer.innerHTML = "";
            microCheckState.buildAnswer.forEach((w, idx) => {
                const chip = document.createElement("button");
                chip.type = "button";
                chip.className = "microcheck__chip";
                chip.textContent = w;
                chip.addEventListener("click", () => {
                    const removed = microCheckState.buildAnswer.splice(idx, 1)[0];
                    words.splice(idx, 0, removed);
                    renderBank();
                    renderAnswer();
                });
                answer.appendChild(chip);
            });
        }

        renderBank();
        renderAnswer();

        builderEl.appendChild(bankLabel);
        builderEl.appendChild(bank);
        builderEl.appendChild(answerLabel);
        builderEl.appendChild(answer);

        if (resetBtn) {
            resetBtn.onclick = () => {
                words.splice(0, words.length, ...shuffleArray(baseWords || []));
                microCheckState.buildAnswer = [];
                renderBank();
                renderAnswer();
                feedbackEl.textContent = "";
                microCheckState.checked = false;
                if (continueBtn) continueBtn.disabled = true;
                if (closeBtn) closeBtn.disabled = true;
            };
        }
        return;
    }

    const options = shuffleArray(item.options || []);
    options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "microcheck__option";
        btn.textContent = opt;
        btn.dataset.option = opt;
        btn.addEventListener("click", () => {
            if (microCheckState.checked) return;
            microCheckState.selectedOption = opt;
            optionsEl.querySelectorAll(".microcheck__option").forEach((b) => {
                b.classList.toggle("is-selected", b.dataset.option === opt);
            });
        });
        optionsEl.appendChild(btn);
    });
}

function evaluateMicroCheck() {
    const item = microCheckState.currentItem;
    const feedbackEl = document.getElementById("microCheckFeedback");
    const continueBtn = document.getElementById("microCheckContinueBtn");
    const closeBtn = document.getElementById("microCheckCloseBtn");

    if (!item || !feedbackEl) return;

    if (item.type === "reorder") {
        const correct = Array.isArray(item.correct)
            ? item.correct
            : String(item.correct || "")
                .split(" ")
                .filter(Boolean);
        if (microCheckState.buildAnswer.length !== correct.length) {
            feedbackEl.textContent = "Complete the sentence first.";
            return;
        }
        const isCorrect =
            microCheckState.buildAnswer.join(" ").trim() === correct.join(" ").trim();
        feedbackEl.textContent = isCorrect ? "Correct!" : "Not quite. Try again.";
        microCheckState.checked = isCorrect;
        if (isCorrect) {
            if (continueBtn) continueBtn.disabled = false;
            if (closeBtn) closeBtn.disabled = false;
        }
        return;
    }

    if (!microCheckState.selectedOption) {
        feedbackEl.textContent = "Choose an answer first.";
        return;
    }

    const correct =
        Array.isArray(item.correct) ? item.correct[0] : item.correct;
    const isCorrect = microCheckState.selectedOption === correct;
    feedbackEl.textContent = isCorrect ? "Correct!" : "Not quite. Try again.";
    microCheckState.checked = isCorrect;

    document.querySelectorAll("#microCheckOptions .microcheck__option").forEach((btn) => {
        const isThisCorrect = btn.dataset.option === correct;
        btn.classList.toggle("is-correct", isThisCorrect && microCheckState.checked);
        btn.classList.toggle(
            "is-wrong",
            !isThisCorrect && btn.dataset.option === microCheckState.selectedOption && microCheckState.checked
        );
    });

    if (isCorrect) {
        if (continueBtn) continueBtn.disabled = false;
        if (closeBtn) closeBtn.disabled = false;
    }
}

function continueFromMicroCheck() {
    if (!microCheckState.checked) return;
    closeMicroCheckModal();
    if (microCheckState.pendingNextAdvance) {
        microCheckState.pendingNextAdvance = false;
        if (vocabModalState.list.length) {
            vocabModalState.index =
                (vocabModalState.index + 1) % vocabModalState.list.length;
            renderVocabModalFromState();
        }
    }
}

// ========================= HELPERS =========================
// ========================= WHITEBOARD =========================
const whiteboardState = {
    isDrawing: false,
    lastX: 0,
    lastY: 0,
    ctx: null,
    color: "#111827",
    size: 3,
};

function getWhiteboardKeyForCurrentLesson() {
    return LS_WHITEBOARD_PREFIX + (appState.currentLessonId || "no_lesson");
}

function saveWhiteboardToLS() {
    const canvas = document.getElementById("whiteboardCanvas");
    if (!canvas) return;
    try {
        const dataUrl = canvas.toDataURL("image/png");
        localStorage.setItem(getWhiteboardKeyForCurrentLesson(), dataUrl);
    } catch {
        // ignore
    }
}

function loadWhiteboardFromLS() {
    const canvas = document.getElementById("whiteboardCanvas");
    if (!canvas) return;
    const dataUrl = localStorage.getItem(getWhiteboardKeyForCurrentLesson());
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!dataUrl) return;
    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataUrl;
}

function initWhiteboardCanvas() {
    const canvas = document.getElementById("whiteboardCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    whiteboardState.ctx = ctx;

    // Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª Ø§Ù„Ø±Ø³م
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // ØªØ­ميل Ø£ي Ø±Ø³م Ù…Ø­ÙÙˆØ¸
    loadWhiteboardFromLS();

    function getCanvasPos(evt) {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;

        if (evt.touches && evt.touches.length > 0) {
            clientX = evt.touches[0].clientX;
            clientY = evt.touches[0].clientY;
        } else {
            clientX = evt.clientX;
            clientY = evt.clientY;
        }

        return {
            x: ((clientX - rect.left) / rect.width) * canvas.width,
            y: ((clientY - rect.top) / rect.height) * canvas.height,
        };
    }

    function startDrawing(evt) {
        evt.preventDefault();
        whiteboardState.isDrawing = true;
        const pos = getCanvasPos(evt);
        whiteboardState.lastX = pos.x;
        whiteboardState.lastY = pos.y;
    }

    function draw(evt) {
        if (!whiteboardState.isDrawing) return;
        evt.preventDefault();
        const pos = getCanvasPos(evt);
        ctx.strokeStyle = whiteboardState.color;
        ctx.lineWidth = whiteboardState.size;

        ctx.beginPath();
        ctx.moveTo(whiteboardState.lastX, whiteboardState.lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        whiteboardState.lastX = pos.x;
        whiteboardState.lastY = pos.y;
    }

    function stopDrawing(evt) {
        if (!whiteboardState.isDrawing) return;
        whiteboardState.isDrawing = false;
        saveWhiteboardToLS();
    }

    // Mouse events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    // Touch events
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);
    canvas.addEventListener("touchcancel", stopDrawing);
}

// ========================= BACKUP SETTINGS =========================
function loadBackupSettings() {
    try {
        const raw = localStorage.getItem(LS_BACKUP_SETTINGS_KEY);
        if (!raw) {
            backupSettings = { frequency: "off", lastBackupAt: null };
            return;
        }
        const parsed = JSON.parse(raw);
        backupSettings = {
            frequency: parsed.frequency || "off",
            lastBackupAt: parsed.lastBackupAt || null,
        };
    } catch {
        backupSettings = { frequency: "off", lastBackupAt: null };
    }
}

function saveBackupSettings() {
    localStorage.setItem(LS_BACKUP_SETTINGS_KEY, JSON.stringify(backupSettings));
}

function backupFrequencyToDays(freq) {
    switch (freq) {
        case "daily":
            return 1;
        case "2d":
            return 2;
        case "weekly":
            return 7;
        default:
            return null; // off
    }
}

function checkBackupReminder() {
    const banner = document.getElementById("backupReminderBanner");
    const info = document.getElementById("backupLastInfo");
    if (!banner || !info) return;

    const daysLimit = backupFrequencyToDays(backupSettings.frequency);
    if (!daysLimit) {
        banner.classList.add("hidden");
        return;
    }

    if (!backupSettings.lastBackupAt) {
        // Ù…Ø§ Ùي ÙˆÙ„Ø§ backup Ù„Ø³ه
        banner.textContent =
            "You haven't created any backup yet. It's a good time to export your data now.";
        banner.classList.remove("hidden");
        info.textContent = "";
        return;
    }

    const last = new Date(backupSettings.lastBackupAt);
    const diffMs = Date.now() - last.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays >= daysLimit) {
        banner.textContent =
            `It has been about ${Math.round(diffDays)} day(s) since your last backup. ` +
            `Please export your data so you don't lose student progress.`;
        banner.classList.remove("hidden");
    } else {
        banner.classList.add("hidden");
    }

    info.textContent =
        "Last backup: " +
        last.toLocaleString() +
        "  |  Frequency: " +
        backupSettings.frequency;
}
// ========================= BACKUP EXPORT / IMPORT =========================
function buildBackupSnapshot() {
    return {
        version: 1,
        createdAt: new Date().toISOString(),
        students: appState.students || [],
        lessons: lessons || {},
        customUnits: customUnits || {},
        settings: {
            lessonFontSize: appState.lessonFontSize,
        },
    };
}

function downloadBackupFile(snapshot) {
    const json = JSON.stringify(snapshot, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const date = new Date();
    const stamp =
        date.getFullYear().toString() +
        String(date.getMonth() + 1).padStart(2, "0") +
        String(date.getDate()).padStart(2, "0") +
        "_" +
        String(date.getHours()).padStart(2, "0") +
        String(date.getMinutes()).padStart(2, "0");

    a.href = url;
    a.download = `pal_arabic_backup_${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function handleExportBackup() {
    const snapshot = buildBackupSnapshot();
    downloadBackupFile(snapshot);

    // Ø­Ø¯Ù‘Ø« ÙˆÙ‚Øª Ø¢Ø®Ø± backup
    backupSettings.lastBackupAt = new Date().toISOString();
    saveBackupSettings();
    checkBackupReminder();
    alert("Backup exported successfully. Keep the JSON file in a safe place.");
}

function applyBackupSnapshot(snapshot) {
    if (!snapshot || typeof snapshot !== "object") {
        alert("Invalid backup file.");
        return;
    }

    // students
    if (Array.isArray(snapshot.students)) {
        appState.students = snapshot.students;
        saveStudentsToLS();
    }

    // lessons (Ù†Ù…Ø­ي Ø§Ù„Ù‚Ø¯يم ÙˆÙ†Ø­Ø· Ø§Ù„Ø¬Ø¯ÙŠØ¯)
    if (snapshot.lessons && typeof snapshot.lessons === "object") {
        // clear current lessons
        Object.keys(lessons).forEach((id) => {
            delete lessons[id];
        });

        // clear old lesson entries from localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(LS_LESSON_PREFIX)) {
                localStorage.removeItem(key);
                i--; // Ù„Ø£ن length ØªØºÙŠØ±
            }
        }

        Object.keys(snapshot.lessons).forEach((id) => {
            lessons[id] = snapshot.lessons[id];
            saveLessonToLS(id);
        });
    }

    // custom units
    if (snapshot.customUnits && typeof snapshot.customUnits === "object") {
        customUnits = {
            Beginner: snapshot.customUnits.Beginner || [],
            "Pre-Intermediate": snapshot.customUnits["Pre-Intermediate"] || [],
            Intermediate: snapshot.customUnits.Intermediate || [],
        };
        saveCustomUnits();
    }

    // settings (Ø²ي Ø­Ø¬م Ø§Ù„Ø®Ø·)
    if (snapshot.settings) {
        if (typeof snapshot.settings.lessonFontSize === "number") {
            appState.lessonFontSize = snapshot.settings.lessonFontSize;
            applyFontSize();
            saveFontSize();
        }
    }

    // Ø¥Ø¹Ø§Ø¯Ø© Ø±Ø³م Ø§Ù„ÙˆØ§Ø¬Ù‡Ø§Øª Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ©
    renderStudents();
    renderTeacherPicker();
    if (getCurrentStudent()) {
        renderLevels();
    }

    alert("Backup imported successfully.");
}

function handleImportBackupFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const json = e.target.result;
            const snapshot = JSON.parse(json);
            if (
                !confirm(
                    "Importing this backup will replace current students, lessons and units.\nAre you sure?"
                )
            ) {
                return;
            }
            applyBackupSnapshot(snapshot);
        } catch (err) {
            console.error(err);
            alert("Could not read backup file.");
        }
    };
    reader.readAsText(file);
}

const $ = (s) => document.querySelector(s);
const $all = (s) => Array.from(document.querySelectorAll(s));

const arabicLettersState = {
    selectedId: arabicLetters[0]?.id || null,
    tab: "letters",
    selectedForm: "initial",
    initialized: false,
    mode: "student",
};
const arabicLettersModalState = {
    open: false,
};
const arabicLettersExerciseState = {
    match: new Map(),
    order: new Map(),
    mcq: new Map(),
};

function renderArabicLettersScreen() {
    if (!arabicLettersState.initialized) return;
    renderArabicLettersExtras();
    renderArabicLettersGrid();
    renderArabicLetterDetail();
    renderArabicLettersSide();
    renderArabicLettersExercises();
    setArabicLettersTab(arabicLettersState.tab || "letters");
}

function initArabicLettersScreen() {
    const lettersGrid = $("#lettersGrid");
    if (!lettersGrid || arabicLettersState.initialized) return;

    const tabButtons = $all(".letters-tab-btn");
    tabButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.lettersTab || "letters";
            setArabicLettersTab(tab);
        });
    });

    lettersGrid.addEventListener("click", (event) => {
        const card = event.target.closest(".letter-card");
        if (!card) return;
        const letterId = card.dataset.letterId;
        if (!letterId) return;
        arabicLettersState.selectedId = letterId;
        renderArabicLettersGrid();
        renderArabicLetterDetail();
        openLetterModal();
    });

    const exercises = $("#lettersExercises");
    if (exercises) {
        exercises.addEventListener("click", handleArabicLettersExerciseClick);
    }
    const btnLetterModalPrev = $("#btnLetterModalPrev");
    const btnLetterModalNext = $("#btnLetterModalNext");
    if (btnLetterModalPrev) {
        btnLetterModalPrev.addEventListener("click", () => {
            selectAdjacentArabicLetter(-1);
        });
    }
    if (btnLetterModalNext) {
        btnLetterModalNext.addEventListener("click", () => {
            selectAdjacentArabicLetter(1);
        });
    }

    const letterModal = $("#letterModal");
    if (letterModal) {
        letterModal.addEventListener("click", (event) => {
            const btn = event.target.closest("[data-letter-form]");
            if (!btn) return;
            const form = btn.dataset.letterForm;
            if (!form) return;
            arabicLettersState.selectedForm = form;
            renderArabicLetterDetail();
        });
    }

    $all("[data-close-letter-modal]").forEach((el) =>
        el.addEventListener("click", () => closeLetterModal())
    );

    const lettersSide = $("#lettersSide");
    if (lettersSide) {
        lettersSide.addEventListener("click", (event) => {
            const btn = event.target.closest("[data-letters-mode]");
            if (!btn) return;
            const mode = btn.dataset.lettersMode;
            if (!mode) return;
            setArabicLettersMode(mode);
        });
    }

    arabicLettersState.initialized = true;
    renderArabicLettersScreen();
}

function setArabicLettersTab(tab) {
    arabicLettersState.tab = tab;
    const lettersTab = $("#lettersTabLetters");
    const exercisesTab = $("#lettersTabExercises");
    const tabButtons = $all(".letters-tab-btn");

    if (lettersTab) lettersTab.classList.toggle("letters-tab--active", tab === "letters");
    if (exercisesTab) exercisesTab.classList.toggle("letters-tab--active", tab === "exercises");
    tabButtons.forEach((btn) => {
        const isActive = btn.dataset.lettersTab === tab;
        btn.classList.toggle("is-active", isActive);
    });
}

function setArabicLettersMode(mode) {
    arabicLettersState.mode = mode === "teacher" ? "teacher" : "student";
    renderArabicLettersSide();
}

function renderArabicLettersExtras() {
    const extras = $("#lettersExtras");
    if (!extras) return;
    extras.innerHTML = arabicLettersExtras
        .map(
            (item) => `
            <div class="letters-extra">
                <div class="letters-extra__title">${item.title}</div>
                <div class="letters-extra__text">${item.text}</div>
            </div>
        `
        )
        .join("");
}

function buildArabicLettersExportHtml() {
    const extrasHtml = arabicLettersExtras
        .map(
            (item) => `
            <div class="extra-card">
                <div class="extra-title">${escapeHtml(item.title)}</div>
                <div class="extra-text">${escapeHtml(item.text)}</div>
            </div>
        `
        )
        .join("");

    const lettersHtml = arabicLetters
        .map((letter) => {
            const sunMoon = letter.sunMoon === "sun" ? "Sun" : "Moon";
            const examples = letter.examples || {};
            const exInitial =
                examples.initial?.arTashkeel || examples.initial?.ar || "";
            const exMedial =
                examples.medial?.arTashkeel || examples.medial?.ar || "";
            const exFinal =
                examples.final?.arTashkeel || examples.final?.ar || "";
            return `
                <div class="letter-card">
                    <div class="letter-glyph" lang="ar">${escapeHtml(letter.letter)}</div>
                    <div class="letter-name">${escapeHtml(letter.nameEn)} (${escapeHtml(letter.nameAr)})</div>
                    <div class="letter-meta">${escapeHtml(letter.sound)} · ${sunMoon}</div>
                    <div class="letter-forms">
                        <div><span>Isolated</span><strong lang="ar">${escapeHtml(letter.forms.isolated)}</strong></div>
                        <div>
                            <span>Initial</span>
                            <strong lang="ar">${escapeHtml(letter.forms.initial)}</strong>
                            <em lang="ar">${escapeHtml(exInitial)}</em>
                        </div>
                        <div>
                            <span>Medial</span>
                            <strong lang="ar">${escapeHtml(letter.forms.medial)}</strong>
                            <em lang="ar">${escapeHtml(exMedial)}</em>
                        </div>
                        <div>
                            <span>Final</span>
                            <strong lang="ar">${escapeHtml(letter.forms.final)}</strong>
                            <em lang="ar">${escapeHtml(exFinal)}</em>
                        </div>
                    </div>
                    <div class="letter-example">
                        <span lang="ar">${escapeHtml(letter.exampleAr)}</span>
                        <span class="example-roman">${escapeHtml(letter.exampleArabeezy)}</span>
                    </div>
                    <div class="letter-note">${escapeHtml(letter.note)}</div>
                </div>
            `;
        })
        .join("");

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Arabic Letters Export</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: "IBM Plex Sans Arabic", system-ui, sans-serif; margin: 20px; color: #0f172a; direction: rtl; }
    h1 { font-size: 20px; margin-bottom: 8px; }
    .subtitle { font-size: 12px; color: #64748b; margin-bottom: 14px; }
    .extras { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 16px; }
    .extra-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 12px; }
    .extra-title { font-weight: 700; font-size: 12px; margin-bottom: 4px; }
    .extra-text { font-size: 11px; color: #475569; }
    .letters-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr)); gap: 12px; }
    .letter-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 12px; background: #fff; break-inside: avoid; page-break-inside: avoid; }
    .extra-card { break-inside: avoid; page-break-inside: avoid; }
    .letter-glyph { font-size: 32px; font-weight: 700; text-align: center; }
    .letter-name { text-align: center; font-weight: 600; margin-top: 4px; font-size: 13px; }
    .letter-meta { text-align: center; font-size: 11px; color: #64748b; margin-top: 2px; }
    .letter-forms { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 6px; margin-top: 8px; }
    .letter-forms div { border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px 6px; text-align: center; font-size: 11px; display: grid; gap: 2px; }
    .letter-forms span { display: block; color: #64748b; font-size: 9px; }
    .letter-forms strong { font-size: 13px; }
    .letter-forms em { font-style: normal; font-size: 11px; color: #475569; }
    .letter-example { margin-top: 6px; display: flex; justify-content: space-between; font-size: 11px; }
    .example-roman { color: #64748b; }
    .letter-note { margin-top: 6px; font-size: 10px; color: #64748b; }
    @media print { body { margin: 10mm; } }
  </style>
</head>
<body>
  <h1>Arabic Letters</h1>
  <div class="subtitle">Exported from Palestinian Arabic Local LMS</div>
  <div class="extras">${extrasHtml}</div>
  <div class="letters-grid">${lettersHtml}</div>
</body>
</html>`;
}

function exportArabicLettersPdf() {
    const html = buildArabicLettersExportHtml();
    const win = window.open("", "_blank");
    if (!win) {
        alert("Popup blocked - please allow popups to export PDF.");
        return;
    }
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
}

function renderArabicLettersSide() {
    const side = $("#lettersSide");
    if (!side) return;

    const letter =
        arabicLetters.find((item) => item.id === arabicLettersState.selectedId) || arabicLetters[0];
    const mode = arabicLettersState.mode || "student";

    const tips =
        mode === "teacher"
            ? [
                "Start with sound + example word out loud.",
                "Show isolated form, then connect it in a short word.",
                "Highlight if it connects to the left or not.",
                "Use one quick exercise before moving on.",
            ]
            : [
                "Tap a letter card to open details.",
                "Say the sound, then read the example word.",
                "Notice how the shape changes in a word.",
                "Try one exercise for practice.",
            ];

    const flow =
        mode === "teacher"
            ? ["Model", "Repeat", "Connect", "Check"]
            : ["See", "Say", "Trace", "Practice"];

    const noteLower = (letter?.note || "").toLowerCase();
    const connectsLeft = noteLower.includes("does not connect")
        ? "Does not connect left"
        : "Connects left";

    side.innerHTML = `
        <div class="letters-panel">
            <div class="letters-panel__title">Mode</div>
            <div class="letters-mode">
                <button class="letters-mode__btn ${mode === "student" ? "is-active" : ""}" data-letters-mode="student">Student</button>
                <button class="letters-mode__btn ${mode === "teacher" ? "is-active" : ""}" data-letters-mode="teacher">Teacher</button>
            </div>
            <div class="letters-panel__meta">Switch tips and flow to match who is using the screen.</div>
        </div>

        <div class="letters-panel letters-focus">
            <div class="letters-panel__title">Current Letter</div>
            <div class="letters-focus__glyph" lang="ar">${letter?.letter || ""}</div>
            <div class="letters-focus__name">${letter?.nameEn || ""} (${letter?.nameAr || ""})</div>
            <div class="letters-focus__chips">
                <span class="letters-chip">${letter?.sunMoon === "sun" ? "Sun letter" : "Moon letter"}</span>
                <span class="letters-chip">${connectsLeft}</span>
            </div>
            <div class="letters-focus__note">${letter?.note || ""}</div>
        </div>

        <div class="letters-panel">
            <div class="letters-panel__title">${mode === "teacher" ? "Teaching Tips" : "Learning Tips"}</div>
            <ul class="letters-tiplist">
                ${tips.map((tip) => `<li>${tip}</li>`).join("")}
            </ul>
        </div>

        <div class="letters-panel">
            <div class="letters-panel__title">Quick Flow</div>
            <div class="letters-flow">
                ${flow.map((step, i) => `<span class="letters-flow__step">${i + 1}. ${step}</span>`).join("")}
            </div>
        </div>
    `;
}

function renderArabicLettersGrid() {
    const lettersGrid = $("#lettersGrid");
    if (!lettersGrid) return;

    lettersGrid.innerHTML = arabicLetters
        .map((letter) => {
            const isActive = letter.id === arabicLettersState.selectedId;
            const sunMoon = letter.sunMoon === "sun" ? "sun" : "moon";
            return `
                <button class="letter-card ${isActive ? "letter-card--active" : ""}" data-letter-id="${letter.id}">
                    <span class="letter-card__glyph" lang="ar">${letter.letter}</span>
                    <span class="letter-card__name">${letter.nameEn}</span>
                    <span class="letter-card__badge letter-card__badge--${sunMoon}">
                        ${sunMoon === "sun" ? "Sun" : "Moon"}
                    </span>
                </button>
            `;
        })
        .join("");
}

function renderArabicLetterDetail() {
    const letter = arabicLetters.find((item) => item.id === arabicLettersState.selectedId) || arabicLetters[0];
    if (!letter) return;
    const glyph = $("#letterModalGlyph");
    const name = $("#letterModalName");
    const sound = $("#letterModalSound");
    const formIsolated = $("#letterModalFormIsolated");
    const formInitial = $("#letterModalFormInitial");
    const formMedial = $("#letterModalFormMedial");
    const formFinal = $("#letterModalFormFinal");
    const exampleAr = $("#letterModalExampleAr");
    const exampleArabeezy = $("#letterModalExampleArabeezy");
    const note = $("#letterModalNote");
    const sunMoon = $("#letterModalSunMoon");
    const writingSteps = $("#letterModalWritingSteps");

    if (glyph) glyph.textContent = letter.letter;
    if (name) name.textContent = `${letter.nameEn} (${letter.nameAr})`;
    if (sound) sound.textContent = `Sound: ${letter.sound}`;
    if (sunMoon) sunMoon.textContent = letter.sunMoon === "sun" ? "Sun letter" : "Moon letter";
    if (formIsolated) formIsolated.textContent = letter.forms.isolated;
    if (formInitial) formInitial.textContent = letter.forms.initial;
    if (formMedial) formMedial.textContent = letter.forms.medial;
    if (formFinal) formFinal.textContent = letter.forms.final;
    if (exampleAr) exampleAr.textContent = letter.exampleAr;
    if (exampleArabeezy) exampleArabeezy.textContent = letter.exampleArabeezy;
    if (note) note.textContent = letter.note;

    renderLetterFormExample(letter);
    renderLetterFormButtons();
    renderLetterWritingSteps(letter, writingSteps);
    renderArabicLettersSide();
}

function selectAdjacentArabicLetter(direction) {
    const currentIndex = arabicLetters.findIndex((item) => item.id === arabicLettersState.selectedId);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + direction + arabicLetters.length) % arabicLetters.length;
    arabicLettersState.selectedId = arabicLetters[nextIndex].id;
    renderArabicLettersGrid();
    renderArabicLetterDetail();
    if (arabicLettersModalState.open) openLetterModal();
}

function openLetterModal() {
    const modal = $("#letterModal");
    if (!modal) return;
    arabicLettersState.selectedForm = arabicLettersState.selectedForm || "initial";
    renderArabicLetterDetail();
    modal.classList.add("modal--open");
    arabicLettersModalState.open = true;
}

function closeLetterModal() {
    const modal = $("#letterModal");
    if (!modal) return;
    modal.classList.remove("modal--open");
    arabicLettersModalState.open = false;
}

function renderLetterFormExample(letter) {
    const label = $("#letterModalExampleLabel");
    const exampleAr = $("#letterModalExampleFormAr");
    const exampleArabeezy = $("#letterModalExampleFormArabeezy");
    const form = arabicLettersState.selectedForm || "initial";
    const example = letter.examples?.[form];

    if (label) {
        const labelText =
            form === "isolated"
                ? "Example (Isolated)"
                : form === "initial"
                    ? "Example (Beginning)"
                    : form === "medial"
                        ? "Example (Middle)"
                        : "Example (End)";
        label.textContent = labelText;
    }
    if (exampleAr) exampleAr.textContent = example?.ar || "";
    if (exampleArabeezy) exampleArabeezy.textContent = example?.arabeezy || "";
}

function renderLetterFormButtons() {
    $all(".letter-form--btn").forEach((btn) => {
        const form = btn.dataset.letterForm;
        btn.classList.toggle("letter-form--active", form === arabicLettersState.selectedForm);
    });
}

function renderLetterWritingSteps(letter, listEl) {
    if (!listEl) return;
    const steps =
        letter.writingSteps && letter.writingSteps.length
            ? letter.writingSteps
            : [
                "Start at the top guideline, then follow the curve smoothly.",
                "Lift the pen only when the stroke ends.",
                "Practice isolated, then connect it in a short word.",
            ];
    listEl.innerHTML = steps.map((step) => `<li>${step}</li>`).join("");
}

function renderArabicLettersExercises() {
    const exercises = $("#lettersExercises");
    if (!exercises) return;

    exercises.innerHTML = arabicLettersExercises
        .map((exercise) => {
            if (exercise.type === "match") return renderArabicLettersMatch(exercise);
            if (exercise.type === "order") return renderArabicLettersOrder(exercise);
            if (exercise.type === "mcq") return renderArabicLettersMcq(exercise);
            return "";
        })
        .join("");

    arabicLettersExercises.forEach((exercise) => {
        if (exercise.type === "match") {
            arabicLettersExerciseState.match.set(exercise.id, {
                selectedLeft: null,
                pairs: exercise.pairs,
                matchedLeft: new Set(),
                matchedRight: new Set(),
            });
        }
        if (exercise.type === "order") {
            arabicLettersExerciseState.order.set(exercise.id, {
                current: [],
                answer: exercise.answer,
            });
        }
        if (exercise.type === "mcq") {
            arabicLettersExerciseState.mcq.set(exercise.id, {
                selected: null,
                answer: exercise.answer,
            });
        }
    });
}

function renderArabicLettersMatch(exercise) {
    const rightItems = shuffleArray(exercise.pairs.map((item) => item.right));
    return `
        <div class="exercise-card" data-exercise-id="${exercise.id}" data-exercise-type="match">
            <div class="exercise-title">Match</div>
            <div class="exercise-prompt">${exercise.prompt}</div>
            <div class="match-grid">
                <div class="match-column">
                    ${exercise.pairs
            .map(
                (pair) => `
                        <button class="match-item" data-match-left="${pair.left}">
                            ${pair.left}
                        </button>
                    `
            )
            .join("")}
                </div>
                <div class="match-column">
                    ${rightItems
            .map(
                (item) => `
                        <button class="match-item" data-match-right="${item}" lang="ar">
                            ${item}
                        </button>
                    `
            )
            .join("")}
                </div>
            </div>
        </div>
    `;
}

function renderArabicLettersOrder(exercise) {
    const pool = shuffleArray(exercise.pool);
    return `
        <div class="exercise-card" data-exercise-id="${exercise.id}" data-exercise-type="order">
            <div class="exercise-title">Build it</div>
            <div class="exercise-prompt">${exercise.prompt}</div>
            <div class="order-answer" data-order-answer></div>
            <div class="order-pool">
                ${pool
            .map(
                (item) => `
                    <button class="order-chip" data-order-item="${item}" lang="ar">
                        ${item}
                    </button>
                `
            )
            .join("")}
            </div>
            <div class="order-status" data-order-status>Tap letters to build the word.</div>
            <div class="order-controls" style="margin-top:8px; display:flex; gap:8px;">
                <button class="btn btn--ghost btn--sm" data-order-action="undo">Undo</button>
                <button class="btn btn--ghost btn--sm" data-order-action="reset">Reset</button>
            </div>
        </div>
    `;
}

function renderArabicLettersMcq(exercise) {
    return `
        <div class="exercise-card" data-exercise-id="${exercise.id}" data-exercise-type="mcq">
            <div class="exercise-title">Choose</div>
            <div class="exercise-prompt">${exercise.prompt}</div>
            <div class="mcq-options">
                ${exercise.options
            .map(
                (item) => `
                    <button class="mcq-option" data-mcq-option="${item}" lang="ar">${item}</button>
                `
            )
            .join("")}
            </div>
        </div>
    `;
}

function handleArabicLettersExerciseClick(event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    const exerciseCard = target.closest("[data-exercise-id]");
    if (!exerciseCard) return;
    const exerciseId = exerciseCard.dataset.exerciseId;
    const exerciseType = exerciseCard.dataset.exerciseType;

    if (exerciseType === "match") handleArabicLettersMatchClick(exerciseId, exerciseCard, target);
    if (exerciseType === "order") handleArabicLettersOrderClick(exerciseId, exerciseCard, target);
    if (exerciseType === "mcq") handleArabicLettersMcqClick(exerciseId, exerciseCard, target);
}

function handleArabicLettersMatchClick(exerciseId, exerciseCard, target) {
    const state = arabicLettersExerciseState.match.get(exerciseId);
    if (!state) return;

    const leftBtn = target.closest("[data-match-left]");
    const rightBtn = target.closest("[data-match-right]");

    if (leftBtn) {
        const leftValue = leftBtn.dataset.matchLeft;
        if (state.matchedLeft.has(leftValue)) return;
        state.selectedLeft = leftValue;
        exerciseCard.querySelectorAll("[data-match-left]").forEach((btn) => {
            btn.classList.toggle("is-selected", btn.dataset.matchLeft === leftValue);
        });
        return;
    }

    if (rightBtn && state.selectedLeft) {
        const rightValue = rightBtn.dataset.matchRight;
        if (state.matchedRight.has(rightValue)) return;
        const expected = state.pairs.find((pair) => pair.left === state.selectedLeft)?.right;

        if (expected === rightValue) {
            state.matchedLeft.add(state.selectedLeft);
            state.matchedRight.add(rightValue);
            exerciseCard
                .querySelector(`[data-match-left="${state.selectedLeft}"]`)
                ?.classList.add("is-correct");
            rightBtn.classList.add("is-correct");
        } else {
            rightBtn.classList.add("is-wrong");
            setTimeout(() => rightBtn.classList.remove("is-wrong"), 500);
        }

        state.selectedLeft = null;
        exerciseCard.querySelectorAll("[data-match-left]").forEach((btn) => {
            btn.classList.remove("is-selected");
        });
    }
}

function handleArabicLettersOrderClick(exerciseId, exerciseCard, target) {
    const state = arabicLettersExerciseState.order.get(exerciseId);
    if (!state) return;

    const orderItem = target.closest("[data-order-item]");
    const actionBtn = target.closest("[data-order-action]");

    if (orderItem) {
        if (state.current.length >= state.answer.length) return;
        state.current.push(orderItem.dataset.orderItem);
        updateArabicLettersOrderState(state, exerciseCard);
        return;
    }

    if (actionBtn) {
        const action = actionBtn.dataset.orderAction;
        if (action === "undo") state.current.pop();
        if (action === "reset") state.current = [];
        updateArabicLettersOrderState(state, exerciseCard);
    }
}

function updateArabicLettersOrderState(state, exerciseCard) {
    const answerEl = exerciseCard.querySelector("[data-order-answer]");
    const statusEl = exerciseCard.querySelector("[data-order-status]");
    if (!answerEl || !statusEl) return;

    answerEl.innerHTML = state.current
        .map((item) => `<span class="order-chip" lang="ar">${item}</span>`)
        .join("");

    const isComplete = state.current.length === state.answer.length;
    const isCorrect = isComplete && state.current.join("") === state.answer.join("");
    if (isCorrect) {
        statusEl.textContent = "Great! You built the word.";
    } else if (isComplete) {
        statusEl.textContent = "Almost! Try again.";
    } else {
        statusEl.textContent = "Tap letters to build the word.";
    }
}

function handleArabicLettersMcqClick(exerciseId, exerciseCard, target) {
    const option = target.closest("[data-mcq-option]");
    if (!option) return;
    const state = arabicLettersExerciseState.mcq.get(exerciseId);
    if (!state) return;

    const selected = option.dataset.mcqOption;
    const isCorrect = selected === state.answer;
    exerciseCard.querySelectorAll("[data-mcq-option]").forEach((btn) => {
        btn.classList.remove("is-correct", "is-wrong");
    });
    option.classList.add(isCorrect ? "is-correct" : "is-wrong");
}
function openExportModal(source, lessonId, studentName = "") {
    exportContext.lessonId = lessonId;
    exportContext.studentName = studentName;
    exportContext.source = source;

    const modal = document.getElementById("exportModal");
    if (modal) modal.classList.add("modal--open");
}

function closeExportModal() {
    const modal = document.getElementById("exportModal");
    if (modal) modal.classList.remove("modal--open");
}

async function saveStudentsToCloud() {
    if (!appState.currentUser || appState.currentUser.role !== "teacher") return;

    const batch = db.batch();
    const ref = db.collection("teacherStudents");

    // Ù†ÙØ¶ي Ùƒل Ø·Ù„Ø§Ø¨ Ù‡Ø°Ø§ Ø§Ù„Ù…Ø¹لم Ø«م Ù†Ø±ÙØ¹ من Ø¬Ø¯ÙŠØ¯ (Ø¨Ø³ÙŠØ·Ø© Ù…Ø¨Ø¯Ø¦ÙŠÙ‹Ø§)
    const snap = await ref.where("teacherId", "==", appState.currentUser.uid).get();
    snap.forEach((doc) => batch.delete(doc.ref));

    appState.students.forEach((s) => {
        const docRef = ref.doc(s.id);
        batch.set(docRef, {
            teacherId: appState.currentUser.uid,
            name: s.name,
            level: s.level,
            goals: s.goals || [],
            progress: s.progress || {},
            homeworkNotes: s.homeworkNotes || {},
            lastSeen: s.lastSeen || null,
            lastSeenByCurriculum: s.lastSeenByCurriculum || {},
        });
    });

    await batch.commit();
}

function saveStudentsToLS({ skipCloud = false } = {}) {
    localStorage.setItem(getStudentsStorageKey(), JSON.stringify(appState.students));
    if (!skipCloud) scheduleCloudSave();
}


async function syncTeacherStudentsFromCloud() {
    if (!appState.currentUser || appState.currentUser.role !== "teacher") return;
    try {

    const ref = db.collection("teacherStudents");
    const snap = await ref.where("teacherId", "==", appState.currentUser.uid).get();

    const loaded = [];
    snap.forEach((doc) => {
        const d = doc.data();
        loaded.push({
            id: doc.id, // Ø£Ùˆ Ø®لي ID Ù…Ø­لي Ù…Ù†ÙØµل
            name: d.name,
            level: d.level,
            goals: d.goals || [],
            progress: d.progress || {},
            homeworkNotes: d.homeworkNotes || {},
            lastSeen: d.lastSeen || null,
            lastSeenByCurriculum: d.lastSeenByCurriculum || {},
        });
    });

    appState.students = loaded;
    saveStudentsToLS({ skipCloud: true }); // Ù†Ø®Ø²ن Ù†Ø³Ø®Ø© Ù…Ø­Ù„ÙŠØ©
    } catch (err) {
        console.warn("Could not sync teacher students from cloud, using local students.", err);
        appState.students = loadStudentsFromLS();
    }
}

function loadStudentsFromLS() {
    try {
        const raw = localStorage.getItem(getStudentsStorageKey());
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function getStudentsStorageKey() {
    const uid = appState.currentUser?.uid || "anonymous";
    return `${LS_STUDENTS_KEY}:${uid}`;
}

function ensureStudentProgress(student, lessonId) {
    if (!student.progress) student.progress = {};
    if (!student.progress[lessonId]) {
        student.progress[lessonId] = { ...BASE_PROGRESS_TEMPLATE };
    } else {
        Object.keys(BASE_PROGRESS_TEMPLATE).forEach((key) => {
            if (!(key in student.progress[lessonId])) {
                student.progress[lessonId][key] = BASE_PROGRESS_TEMPLATE[key];
            }
        });
    }
}

function getCurrentStudent() {
    if (appState.currentUser && appState.currentUser.role === "guest") {
        return appState.guestStudent || null;
    }
    return appState.students.find((s) => s.id === appState.currentStudentId) || null;
}

function getStudentProgress(student, lessonId) {
    ensureStudentProgress(student, lessonId);
    return student.progress[lessonId];
}

function setStudentProgressField(sectionKey, value) {
    const student = getCurrentStudent();
    if (!student) return;
    ensureStudentProgress(student, appState.currentLessonId);
    student.progress[appState.currentLessonId][sectionKey] = value;
    saveStudentsToLS();
    updateProgressBar();
    updateSectionStatusBadge(sectionKey);
}

// lessons save/load
function loadLessonDataFromLS() {
    // start from defaults
    Object.keys(defaultLessons).forEach((id) => {
        lessons[id] = JSON.parse(JSON.stringify(defaultLessons[id]));
    });

    // then override / add from localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(LS_LESSON_PREFIX)) {
            const id = key.slice(LS_LESSON_PREFIX.length);
            try {
                const data = JSON.parse(localStorage.getItem(key));
                lessons[id] = data;
            } catch {
                /* ignore */
            }
        }
    }

    // Sanitize/normalize lessons loaded from localStorage (old/partial/corrupted entries can exist)
    Object.keys(lessons).forEach((id) => {
        const lesson = lessons[id];
        if (!lesson || typeof lesson !== "object") {
            delete lessons[id];
            return;
        }
        if (!lesson.meta || typeof lesson.meta !== "object") lesson.meta = {};
        lesson.meta.level = (lesson.meta.level || "").trim();
        lesson.meta.unit = (lesson.meta.unit || "").trim();
        lesson.meta.lessonTitle = (lesson.meta.lessonTitle || "").trim();

        // If meta is still missing core fields, drop it (prevents runtime crashes in teacher picker)
        if (!lesson.meta.level || !lesson.meta.unit || !lesson.meta.lessonTitle) {
            delete lessons[id];
            return;
        }

        if (!lesson.vocabulary) lesson.vocabulary = { core: [], extra: [] };
        if (!Array.isArray(lesson.vocabulary.core)) lesson.vocabulary.core = [];
        if (!Array.isArray(lesson.vocabulary.extra)) lesson.vocabulary.extra = [];

        if (!Array.isArray(lesson.useInLife)) lesson.useInLife = [];

        if (!lesson.dialogue) lesson.dialogue = { lines: [] };
        if (!Array.isArray(lesson.dialogue.lines)) lesson.dialogue.lines = [];

        if (!Array.isArray(lesson.grammar)) lesson.grammar = [];
        if (lesson.grammarTab && typeof lesson.grammarTab === "object") {
            delete lesson.grammarTab;
        }

        if (!lesson.practice) lesson.practice = { quiz: [], rolePlays: [], translation: [] };
        if (!Array.isArray(lesson.practice.quiz)) lesson.practice.quiz = [];
        if (!Array.isArray(lesson.practice.rolePlays)) lesson.practice.rolePlays = [];
        if (!Array.isArray(lesson.practice.translation)) lesson.practice.translation = [];

        if (!lesson.microChecks || typeof lesson.microChecks !== "object") {
            lesson.microChecks = { enabled: false, every: 5, items: [] };
        }
        lesson.microChecks.enabled = true;
        if (!Number.isFinite(lesson.microChecks.every)) lesson.microChecks.every = 5;
        if (!Array.isArray(lesson.microChecks.items)) lesson.microChecks.items = [];
    });
}
function markVocabularyDone() {
    // Ù‡Ø°ي Ø§Ù„Ø¯Ø§Ù„Ø© ØªØ¹ØªÙ…Ø¯ Ø¥Ù†Ùˆ Ø¹Ù†Ø¯Ùƒ setStudentProgressField Ù…ÙˆØ¬ÙˆØ¯Ø©
    // ÙˆØªØ´ØªØºل Ø¹Ù„Ù‰ Ø§Ù„Ø¯Ø±Ø³ ÙˆØ§Ù„Ø·Ø§Ù„Ø¨ Ø§Ù„Ø­Ø§ليين
    try {
        setStudentProgressField("vocabulary", true);
    } catch (e) {
        console.warn("Could not mark vocabulary as done:", e);
    }
}

function saveLessonToLS(lessonId) {
    localStorage.setItem(LS_LESSON_PREFIX + lessonId, JSON.stringify(lessons[lessonId]));
}

// custom units
function loadCustomUnits() {
    try {
        const raw = localStorage.getItem(LS_CUSTOM_UNITS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            customUnits = {
                Beginner: parsed.Beginner || [],
                "Pre-Intermediate": parsed["Pre-Intermediate"] || [],
                Intermediate: parsed.Intermediate || [],
            };
        }
    } catch {
        /* ignore */
    }
}
function saveCustomUnits() {
    localStorage.setItem(LS_CUSTOM_UNITS_KEY, JSON.stringify(customUnits));
}

// font size
function loadFontSize() {
    const raw = localStorage.getItem(LS_FONT_SIZE_KEY);
    if (!raw) {
        appState.lessonFontSize = 1;
    } else {
        const n = parseFloat(raw);
        appState.lessonFontSize = isNaN(n) ? 1 : n;
    }
    applyFontSize();
}
function saveFontSize() {
    localStorage.setItem(LS_FONT_SIZE_KEY, String(appState.lessonFontSize));
}
function applyFontSize() {
    const v = Math.max(0.85, Math.min(1.4, appState.lessonFontSize));
    document.documentElement.style.setProperty("--lesson-font-size", v + "rem");
}

// ========================= NAVIGATION =========================
function showScreen(id) {
    $all(".screen").forEach((sec) =>
        sec.classList.toggle("screen--active", sec.id === id)
    );
}

function goToHome() {
    persistResumeBeforeNav();
    // Ù†Ø¯Ø®ل ÙˆØ¶Ø¹ Ø§Ù„ØµÙØ­Ø© Ø§Ù„Ø±Ø¦ÙŠØ³ÙŠØ© ÙÙ‚Ø·
    document.body.classList.add("home-only");

    // Ù†Ø®لي Ø¨Ø³ Ø§Ù„Ù‡Ùˆم screen هي Ø§Ù„Ø¸Ø§Ù‡Ø±Ø©
    showScreen("home-screen");
}

function goToStudents() {
    persistResumeBeforeNav();
    const role = appState.currentUser?.role || "";
    if (!appState.currentUser || role === "student" || role === "guest") {
        if (getCurrentStudent()) {
            goToLevels();
        } else {
            goToHome();
        }
        return;
    }
    document.body.classList.remove("home-only");
    showScreen("students-screen");
    renderStudents();
}

function goToCurriculumChoice() {
    persistResumeBeforeNav();
    document.body.classList.remove("home-only");
    const student = getCurrentStudent();
    if (!student) {
        if (appState.currentUser?.role === "teacher") goToStudents();
        else goToHome();
        return;
    }
    showScreen("curriculum-screen");
    const label = document.getElementById("currentStudentNameCurriculum");
    if (label) label.textContent = student.name;
}

function selectCurriculum(curriculumId) {
    if (!CURRICULUMS[curriculumId]) return;
    appState.currentCurriculumId = curriculumId;
    const student = getCurrentStudent();
    if (student && tryResumeStudent(student)) return;
    setStudentLessonContext(student);
    goToLevels();
}

function goToLevels() {
    persistResumeBeforeNav();
    document.body.classList.remove("home-only");
    if (isGuestUser() && appState.guestStudent && !appState.currentStudentId) {
        appState.currentStudentId = appState.guestStudent.id;
    }
    const currentStudent = getCurrentStudent();
    if (!currentStudent) {
        if (appState.currentUser?.role === "teacher") {
            goToStudents();
        } else {
            goToHome();
        }
        return;
    }
    if (!appState.currentCurriculumId) {
        goToCurriculumChoice();
        return;
    }
    showScreen("levels-screen");
    $("#currentStudentNameLevels").textContent = currentStudent.name;
    const btnSwitchProfile = $("#btnSwitchProfile");
    const btnGoTeacherDashboard = $("#btnGoTeacherDashboard");
    const btnPlacementTest = $("#btnPlacementTest");
    const btnPalestinianProverbs = $("#btnPalestinianProverbs");
    if (btnSwitchProfile) btnSwitchProfile.style.display = isGuestUser() ? "none" : "inline-flex";
    if (btnGoTeacherDashboard) btnGoTeacherDashboard.style.display = isGuestUser() ? "none" : "inline-flex";
    if (btnPlacementTest) btnPlacementTest.hidden = appState.currentCurriculumId !== "interactive";
    if (btnPalestinianProverbs) btnPalestinianProverbs.hidden = appState.currentCurriculumId !== "interactive";
    renderLevels();
    renderGazaSituationsHub();
    updateContinueButton();
}

function goToArabicLetters() {
    persistResumeBeforeNav();
    document.body.classList.remove("home-only");
    showScreen("arabic-letters-screen");
    initArabicLettersScreen();
    renderArabicLettersScreen();
}
function goToLessonView(opts = {}) {
    const { teacherMode = null } = opts;
    if (!getCurrentStudent()) {
        goToStudents();
        return;
    }
    if (isGuestUser() && !isGuestAllowedLesson(appState.currentLessonId)) {
        toast("Guest access is limited to the first two units.");
        goToLevels();
        return;
    }
    showScreen("lesson-screen");
    if (teacherMode !== null) {
        appState.teacherMode = teacherMode;
        $("#teacherModeToggle").checked = teacherMode;
    }
    updateTeacherTabsVisibility();
    updateLessonTopBar();
    updateProgressBar();
    const lesson = lessons[appState.currentLessonId];
    updateLessonTabsVisibility(lesson);
    appState.currentTab = normalizeLessonTabKey(appState.currentTab, lesson);
    setActiveTab(appState.currentTab || "overview");

    // Ø­Ø§Ùˆل ÙŠØ­مّل whiteboard Ø­ق Ù‡Ø°Ø§ Ø§Ù„Ø¯Ø±Ø³ Ù„Ùˆ Ø§Ù„Ù„ÙˆØ­Ø© Ù…ÙØªÙˆØ­Ø©
    const whiteboardPanel = document.getElementById("whiteboardPanel");
    if (whiteboardPanel && !whiteboardPanel.classList.contains("hidden")) {
        initWhiteboardCanvas();
    }
}

function buildLessonExportHtml(lesson, options) {
    const {
        includeVocab,
        includeDialogue,
        includeGrammar,
        includeHomework,
        includeTeacherNotes,
        version,
        studentName,
    } = options;

    const escapeHtml = (str) =>
        String(str || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    // ========== Vocabulary ==========
    let vocabRows = "";
    if (includeVocab && lesson.vocabulary) {
        const allVocab = [
            ...(lesson.vocabulary.core || []),
            ...(lesson.vocabulary.extra || []),
        ];
        allVocab.forEach((w) => {
            vocabRows += `
            <tr>
                <td class="ar">${escapeHtml(w.ar)}</td>
                <td class="en">${escapeHtml(w.en)}</td>
                
                <td class="en">${escapeHtml(w.enArabeezy)}</td>
                <td class="en">
                    ${escapeHtml(w.exampleAr || "")}
                    ${w.exampleAr || w.exampleArabeezy || w.exampleEn ? " - " : ""}
                    ${escapeHtml(w.exampleArabeezy || "")}
                    ${w.exampleArabeezy && w.exampleEn ? " - " : ""}
                    ${escapeHtml(w.exampleEn || "")}
                </td>
            </tr>`;
        });
    }

    // ========== Dialogue ==========
    let dialogueHtml = "";
    if (includeDialogue && lesson.dialogue && lesson.dialogue.lines) {
        dialogueHtml = lesson.dialogue.lines
            .map(
                (line) => `
                <div class="dialogue-line">
                    <span class="speaker">${escapeHtml(line.speaker)}:</span>
                    <div class="dialogue-ar">${escapeHtml(line.ar)}</div>
                    ${line.arArabeezy || line.arabeezy
                        ? `<div class="dialogue-arabeezy">${escapeHtml(line.arArabeezy || line.arabeezy)}</div>`
                        : ""}
                    ${line.en
                        ? `<span class="dialogue-en">${escapeHtml(line.en)}</span>`
                        : ""
                    }
                </div>
            `
            )
            .join("");
    }

    // ========== Grammar ==========
    let grammarHtml = "";
    if (includeGrammar && lesson.grammar && lesson.grammar.length) {
        grammarHtml = lesson.grammar
            .map((g) => {
                const desc = g.description ? `<p>${escapeHtml(g.description)}</p>` : "";
                let tableHtml = "";
                if (g.table && Array.isArray(g.table.headers) && Array.isArray(g.table.rows)) {
                    const headCells = g.table.headers
                        .map((h) => `<th>${escapeHtml(h)}</th>`)
                        .join("");
                    const bodyRows = g.table.rows
                        .map(
                            (row) =>
                                `<tr>${row
                                    .map((cell) => `<td>${escapeHtml(cell)}</td>`)
                                    .join("")}</tr>`
                        )
                        .join("");
                    tableHtml = `
                        <div class="grammar-table">
                            <div class="grammar-table__title">${escapeHtml(g.table.title || "Table")}</div>
                            <table class="grammar-table__table">
                                <thead><tr>${headCells}</tr></thead>
                                <tbody>${bodyRows}</tbody>
                            </table>
                        </div>`;
                }

                const examples = Array.isArray(g.examples) ? g.examples : [];
                const examplesHtml = examples.length
                    ? `<div class="grammar-examples">
                            <div class="grammar-examples__title">Examples</div>
                            ${examples
                        .map(
                            (ex) => `
                                <div class="grammar-example">
                                    <div class="grammar-example__ar">${escapeHtml(ex.ar || "")}</div>
                                    <div class="grammar-example__arabeezy">${escapeHtml(ex.arabeezy || "")}</div>
                                    <div class="grammar-example__en">${escapeHtml(ex.en || "")}</div>
                                </div>`
                        )
                        .join("")}
                        </div>`
                    : "";

                const teacherNotes =
                    includeTeacherNotes && version === "teacher"
                        ? `<div class="grammar-teacher">
                                <div class="grammar-teacher__title">Teacher Notes</div>
                                <div class="grammar-teacher__text">${escapeHtml(
                            g.teacherNotes || ""
                        )}</div>
                           </div>`
                        : "";

                return `<div class="grammar-item">
                            <h4>${escapeHtml(g.title)}</h4>
                            ${desc}
                            ${tableHtml}
                            ${examplesHtml}
                            ${teacherNotes}
                        </div>`;
            })
            .join("");
    }

    // ========== Homework ==========
    let homeworkHtml = "";
    if (includeHomework && lesson.homework && lesson.homework.instructions) {
        homeworkHtml = `<p>${escapeHtml(lesson.homework.instructions)}</p>`;
    }

    // ========== Teacher Notes ==========
    let teacherNotesHtml = "";
    const notes = lesson.teacherNotes && lesson.teacherNotes.myNotes;
    if (includeTeacherNotes && version === "teacher" && notes) {
        teacherNotesHtml = `<p>${escapeHtml(notes)}</p>`;
    }

    return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<title>Lesson Export - ${escapeHtml(lesson.meta.lessonTitle)}</title>
<style>
    body {
        font-family:
            "Amiri",
            "Scheherazade New",
            "IBM Plex Sans Arabic",
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
        margin: 20px;
        color: #111827;
        
      
    }
        .headtext{
         direction: center;
          text-align: center;
        }
    h1, h2, h3, h4 {
        margin: 0 0 6px;
        color: #0f172a;
    }
    h1 {
        font-size: 20px;
        margin-bottom: 10px;
        
    }
    .meta {
        font-size: 12px;
        margin-bottom: 14px;
         direction: ltr;
    }
    .meta div {
        margin-bottom: 2px;
    }
    .section {
    
        margin-top: 12px;
        padding-top: 10px;
        border-top: 1px solid #e5e7eb;
        /* Keep sections together where possible, but allow long blocks to split naturally. */
    }
    table {
        width: 100%;
        border-collapse: collapse;
        font-size: 11px;
        direction: rtl; /* Ø§Ù„Ø¬Ø¯Ùˆل Ù†ÙØ³ه RTL */
    }
    th, td {
        border: 1px solid #e5e7eb;
        padding: 4px 6px;
        vertical-align: top;
    }
    th {
        background: #e0f2fe;
    }
    .ar {
        direction: rtl;
        text-align: right;
        font-family: "Amiri", "Scheherazade New", "IBM Plex Sans Arabic", system-ui, sans-serif;
        font-size: 20px;
    }
    .en {
        direction: ltr;
        text-align: left;
        font-size: 20px;
    }
    .small-note {
        font-size: 12px;
        color: #6b7280;
        margin-top: 4px;
        direction: ltr;
    }
    .grammar-item {
        margin-bottom: 8px;
        font-size: 18px;
        direction: ltr;
    }
    .grammar-item h4 {
        font-size: 18px;
        margin-bottom: 2px;
        direction: ltr;
    }
    .section-title {
        display:flex;
        justify-content:space-between;
        align-items:baseline;
        
    }
    .badge {
        font-size:10px;
        padding:2px 6px;
        border-radius:999px;
        background:#e5f9f5;
        color:#047857;
    }

    /* Dialogue RTL with English below. */
    .dialogue-line {
        margin-bottom: 6px;
        direction: rtl;
        text-align: right;
        font-size: 24px;
    }
    .speaker {
        font-weight: 700;
        margin-left: 4px;
    }
    .dialogue-ar {
        font-family: "Amiri", "Scheherazade New", "IBM Plex Sans Arabic", system-ui, sans-serif;
    }
    .dialogue-en {
        display: block;
       
        font-size: 20px;
        color: #4b5563;
        margin-right: 2em; /* Ø´Ùˆي Ù…Ø³Ø§ÙØ© Ø¹ن Ø§Ø³م Ø§Ù„Ù…ØªØ­Ø¯Ø« */
    }

    @media print {
        body { margin: 10mm; }
        .small-note { display:none; }
    }
</style>
</head>
<body>
    <h1 class="headtext">Palestinian Arabic - ${escapeHtml(lesson.meta.lessonTitle)}</h1>
    <div class="meta" >
        <div><strong>Level:</strong> ${escapeHtml(lesson.meta.level)}</div>
        <div><strong>Unit:</strong> ${escapeHtml(lesson.meta.unit)}</div>
        ${studentName
            ? `<div><strong>Student:</strong> ${escapeHtml(studentName)}</div>`
            : ""
        }
        <div><strong>Version:</strong> ${version === "teacher" ? "Teacher" : "Student"
        }</div>
    </div>

    ${vocabRows
            ? `<div class="section">
                <div class="section-title">
                    <h2>المفردات - Vocabulary</h2>
                    <span class="badge">Core & Extra</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>العربي</th>
                            <th>English</th>
                            <th>enArabeezy</th>
                            <th>Example</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${vocabRows}
                    </tbody>
                </table>
            </div>`
            : ""
        }

    ${dialogueHtml
            ? `<div class="section">
                <h2>المحادثة - Dialogue</h2>
                ${dialogueHtml}
            </div>`
            : ""
        }

    ${grammarHtml
            ? `<div class="section">
                <h2>القواعد - Grammar</h2>
                ${grammarHtml}
            </div>`
            : ""
        }

    ${homeworkHtml
            ? `<div class="section">
                <h2>الواجب - Homework</h2>
                ${homeworkHtml}
            </div>`
            : ""
        }

    ${teacherNotesHtml
            ? `<div class="section">
                <h2>ملاحظات المعلم - Teacher Notes</h2>
                ${teacherNotesHtml}
            </div>`
            : ""
        }

    <p class="small-note">
        Generated from Palestinian Arabic Local LMS - you can print or save as PDF from your browser.
    </p>
</body>
</html>
        </div>
      </div>
    `;
}


function openPrintWindow(html) {
    const win = window.open("", "_blank");
    if (!win) {
        alert("Popup blocked - please allow popups to export PDF.");
        return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    // Ù†Ø¹Ø·يه ÙˆÙ‚Øª Ø¨Ø³ÙŠØ· ÙŠØ±Ù†Ù‘Ø¯Ø± Ù‚Ø¨ل Ø§Ù„Ø·Ø¨Ø§Ø¹Ø©
    win.focus();
    setTimeout(() => {
        win.print();
    }, 300);
}

function goToTeacherDashboard() {
    persistResumeBeforeNav();
    // Ù„Ùˆ Ù…Ø´ Ù…Ø³Ø¬ل، Ø£Ùˆ Ù…Ø´ Ù…Ø¯Ø±Ù‘Ø³:
    if (!appState.currentUser || appState.currentUser.role !== "teacher") {
        // Ø¨Ø¯ل Ù…Ø§ Ù†Ø¹مل alert Ø¨Ø³، Ù†ÙØªØ­ه Ø¹Ù„Ù‰ Ù…ÙˆØ¯Ø§ل ØªØ³Ø¬يل Ø¯Ø®Ùˆل Ø§Ù„Ù…Ø¯Ø±Ù‘Ø³
        if (typeof openAuthModal === "function") {
            openAuthModal("teacher");
        } else {
            alert("Teacher access only.");
        }
        return;
    }
    document.body.classList.remove("home-only")
    showScreen("teacher-dashboard-screen");
    renderTeacherPicker();
}




// ========================= STUDENTS =========================
function renderStudents() {
    const grid = $("#studentsGrid");
    const empty = $("#noStudentsMessage");
    grid.innerHTML = "";

    if (!appState.students.length) {
        empty.style.display = "block";
        return;
    }
    empty.style.display = "none";

    appState.students.forEach((student) => {
        const card = document.createElement("article");
        card.className = "student-card";

        const avatar = document.createElement("div");
        avatar.className = "student-card__avatar";
        avatar.textContent = student.name.charAt(0).toUpperCase();

        const nameEl = document.createElement("div");
        nameEl.className = "student-card__name";
        nameEl.textContent = student.name;

        const levelEl = document.createElement("div");
        levelEl.className = "student-card__level";
        levelEl.textContent = `Level: ${student.level}`;

        const goalsWrap = document.createElement("div");
        goalsWrap.className = "student-card__goals";

        const goals = student.goals || [];
        if (goals.length) {
            const map = {
                Travel: "Travel",
                Study: "🎓 Study",
                Family: "Family",
                VisitPalestine: "🕌 Visit Palestine",
                Work: "Work",
                Fun: "For Fun",
            };
            goals.forEach((g) => {
                const tag = document.createElement("span");
                tag.className = "goal-tag";
                tag.textContent = map[g] || g;
                goalsWrap.appendChild(tag);
            });
        } else if (student.goal) {
            const tag = document.createElement("span");
            tag.className = "goal-tag";
            tag.textContent = student.goal;
            goalsWrap.appendChild(tag);
        }

        const footer = document.createElement("div");
        footer.className = "student-card__footer";

        const btnContinue = document.createElement("button");
        btnContinue.className = "btn btn--primary btn--sm";
        btnContinue.textContent = "Continue Learning";
        btnContinue.addEventListener("click", () => {
            appState.currentStudentId = student.id;
            appState.currentCurriculumId = null;
            goToCurriculumChoice();
        });

        const btnDelete = document.createElement("button");
        btnDelete.className = "student-card__delete";
        btnDelete.textContent = "Delete";
        btnDelete.addEventListener("click", () => {
            if (!confirm(`Delete student "${student.name}"?`)) return;
            appState.students = appState.students.filter((s) => s.id !== student.id);
            saveStudentsToLS();
            if (appState.currentStudentId === student.id) appState.currentStudentId = null;
            renderStudents();
        });

        footer.appendChild(btnContinue);
        footer.appendChild(btnDelete);

        card.appendChild(avatar);
        card.appendChild(nameEl);
        card.appendChild(levelEl);
        card.appendChild(goalsWrap);
        card.appendChild(footer);

        grid.appendChild(card);
    });
}

// ========================= LEVELS & UNITS =========================
function getLessonCurriculumId(lesson) {
    return lesson?.meta?.curriculumId || "structured";
}

function findLessonIdFor(levelName, unitName) {
    const curriculumId = appState.currentCurriculumId || "structured";
    return Object.keys(lessons).find((id) =>
        lessons[id].meta &&
        getLessonCurriculumId(lessons[id]) === curriculumId &&
        lessons[id].meta.level === levelName &&
        lessons[id].meta.unit === unitName
    );
}

function renderLevels() {
    const container = $("#levelsContainer");
    container.innerHTML = "";

    const levelsDef = [
        {
            level: "Beginner",
            units: ["Greetings", "Family", "Daily Routine", "Food & Drink", "Transportation", "Cumulative Review 1", "Beginner Final"],
        },
        {
            level: "Pre-Intermediate",
            units: ["Work & Study", "Weather & Small Talk", "Shopping & Prices", "Health & Emergencies", "Apartment & Problems", "Cumulative Review 2", "Pre-Intermediate Final"],
        },
        {
            level: "Intermediate",
            units: ["Opinions", "Complaints", "Plans & Future", "Free Time & Hobbies", "Feelings", "Cumulative Review 3", "Intermediate Final"],
        },
    ];

    const student = getCurrentStudent();

    levelsDef.forEach((lvl) => {
        const card = document.createElement("article");
        card.className = "level-card";

        const titleRow = document.createElement("div");
        titleRow.className = "level-card__title";

        const title = document.createElement("h4");
        title.className = "td-lessonitem__title";
        title.textContent = lvl.level;

        const badge = document.createElement("span");
        badge.className = "badge badge--soft";
        badge.textContent = CURRICULUMS[appState.currentCurriculumId]?.badge || "Curriculum";

        titleRow.appendChild(title);
        titleRow.appendChild(badge);

        const unitsContainer = document.createElement("div");
        unitsContainer.className = "level-card__units";

        const curriculumUnits = Object.values(lessons)
            .filter((lesson) => getLessonCurriculumId(lesson) === appState.currentCurriculumId)
            .filter((lesson) => lesson?.meta?.level === lvl.level)
            .map((lesson) => lesson.meta.unit)
            .filter(Boolean);
        const allUnits = appState.currentCurriculumId === "interactive"
            ? [...lvl.units.filter((unit) => curriculumUnits.includes(unit)), ...curriculumUnits.filter((unit) => !lvl.units.includes(unit))]
            : [...lvl.units];

        // add custom units for this level
        if (customUnits[lvl.level] && customUnits[lvl.level].length) {
            customUnits[lvl.level].forEach((u) => {
                if (!allUnits.includes(u)) allUnits.push(u);
            });
        }

        allUnits.forEach((unitName) => {
            const pill = document.createElement("div");
            pill.className = "unit-pill";

            const nameSpan = document.createElement("span");
            nameSpan.className = "unit-pill__name";
            nameSpan.textContent = unitName;

            const statusSpan = document.createElement("span");
            statusSpan.className = "unit-pill__status";

            const lessonId = findLessonIdFor(lvl.level, unitName);

            if (lessonId) {
                if (isGuestUser() && !isGuestAllowedLesson(lessonId)) {
                    pill.classList.add("unit-pill--locked");
                    statusSpan.textContent = "Locked (Guest)";
                    pill.addEventListener("click", () => {
                        toast("Guest access is limited to the first two units.");
                    });
                } else {
                    pill.classList.add("unit-pill--clickable");
                }
                if (student) {
                    const progress = getStudentProgress(student, lessonId);
                    const total = Object.keys(progress).length || 1;
                    const completed = Object.values(progress).filter(Boolean).length;
                    const percent = Math.round((completed / total) * 100);
                    if (!statusSpan.textContent) {
                        statusSpan.textContent = `Progress: ${completed}/${total} sections`;
                    }

                    if (percent >= 80) {
                        pill.classList.add("unit-pill--done");
                    } else if (percent >= 30) {
                        pill.classList.add("unit-pill--mid");
                    } else {
                        pill.classList.add("unit-pill--low");
                    }
                } else {
                    statusSpan.textContent = "Open lesson";
                    pill.classList.add("unit-pill--low");
                }

                if (!pill.classList.contains("unit-pill--locked")) {
                    pill.addEventListener("click", () => {
                        appState.currentLessonId = lessonId;
                        appState.currentTab = "overview";
                        goToLessonView();
                    });
                }
            } else {
                pill.classList.add("unit-pill--nolesson");
                statusSpan.textContent = "No lesson template yet";
            }

            pill.appendChild(nameSpan);
            pill.appendChild(statusSpan);
            unitsContainer.appendChild(pill);
        });

        card.appendChild(titleRow);
        card.appendChild(unitsContainer);
        container.appendChild(card);
    });

    const dialogueContainer = document.getElementById("dialogueOnlyContainer");
    const dialogueHeader = dialogueContainer?.previousElementSibling;
    const showDialoguePractice = appState.currentCurriculumId === "structured";
    if (dialogueContainer) {
        dialogueContainer.style.display = showDialoguePractice ? "grid" : "none";
    }
    if (dialogueHeader) {
        dialogueHeader.style.display = showDialoguePractice ? "block" : "none";
    }

    // Render the new "Dialogue Only (Decisions)" section if present
    try {
        if (showDialoguePractice && typeof window.renderDialogueOnlyLevels === "function") {
            window.renderDialogueOnlyLevels();
        }
    } catch (e) { }
}


function renderGazaSituationsHub() {
    const hub = document.getElementById("gazaSituationsHub");
    const container = document.getElementById("gazaSituationsContainer");
    const visible = appState.currentCurriculumId === "interactive";
    if (hub) hub.hidden = !visible;
    if (!visible || !container) return;
    container.innerHTML = "";
    gazaSituations.forEach((situation) => {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "gaza-hub__card";
        card.innerHTML = `
            <span class="gaza-hub__icon" aria-hidden="true">${situation.icon || "💬"}</span>
            <span class="gaza-hub__card-copy">
                <strong>${situation.title}</strong>
                <span>${situation.subtitle || situation.setting || ""}</span>
                <small>${situation.lines.length} dialogue lines</small>
            </span>
            <span class="gaza-hub__arrow" aria-hidden="true">→</span>`;
        card.addEventListener("click", () => openGazaSituation(situation.id));
        container.appendChild(card);
    });
}

function renderPalestinianProverbs() {
    const root = document.getElementById("palestinianProverbsRoot");
    if (!root) return;
    root.innerHTML = "";

    const intro = document.createElement("header");
    intro.className = "culture-intro culture-intro--proverbs";
    intro.innerHTML = `<p class="culture-intro__eyebrow">${palestinianProverbs.length} expressions from everyday memory</p><h4>Folk sayings Palestinians actually recognise</h4><p>Each card separates the literal image from the intended meaning, then places the proverb inside a natural Palestinian situation.</p>`;
    root.appendChild(intro);

    const grid = document.createElement("div");
    grid.className = "culture-grid culture-grid--proverbs";
    palestinianProverbs.forEach((proverb, index) => {
        const card = document.createElement("article");
        card.className = "culture-card culture-card--proverb";
        const heading = document.createElement("div"); heading.className = "culture-card__heading";
        const number = document.createElement("span"); number.className = "culture-card__number"; number.textContent = String(index + 1).padStart(2, "0");
        const category = document.createElement("p");
        category.className = "culture-card__category";
        category.textContent = proverb.category || "Palestinian saying";
        heading.append(number, category);
        const arabic = document.createElement("h3");
        arabic.className = "culture-card__ar";
        arabic.dir = "rtl";
        arabic.textContent = proverb.ar;
        const transliteration = document.createElement("p");
        transliteration.className = "culture-card__arabeezy";
        transliteration.textContent = proverb.arabeezy;
        const meaning = document.createElement("p");
        meaning.className = "culture-card__meaning";
        meaning.innerHTML = `<strong>What it really means</strong><p>${proverb.meaningEn}</p>`;
        const literal = document.createElement("p"); literal.className = "culture-card__literal"; literal.textContent = `Literal image: ${proverb.literalEn}`;
        const explanation = document.createElement("p");
        explanation.className = "culture-card__explanation"; explanation.textContent = proverb.explanation;
        const usageLabel = document.createElement("strong");
        usageLabel.textContent = "When to say it";
        const usage = document.createElement("p");
        usage.className = "culture-card__use"; usage.append(usageLabel, document.createTextNode(` ${proverb.whenUsed}`));
        const example = document.createElement("p");
        example.className = "culture-card__example";
        example.innerHTML = `<strong>In a natural situation</strong><p dir="rtl">${proverb.exampleAr}</p><p>${proverb.exampleArabeezy}</p><p>${proverb.exampleEn}</p>`;
        card.append(heading, arabic, transliteration, literal, meaning, explanation, usage, example);
        grid.appendChild(card);
    });
    root.appendChild(grid);
    showScreen("palestinian-proverbs-screen");
}

function openGazaSituation(situationId) {
    const situation = gazaSituations.find((item) => item.id === situationId);
    const root = document.getElementById("gazaSituationRoot");
    if (!situation || !root) return;
    root.className = "gaza-situation";
    root.innerHTML = "";
    const hero = document.createElement("section");
    hero.className = "gaza-situation__hero";
    hero.innerHTML = `<span class="gaza-situation__hero-icon">${situation.icon || "💬"}</span><div><p class="gaza-situation__eyebrow">Real-life dialogue</p><h2>${situation.title}</h2><p>${situation.setting || situation.subtitle || ""}</p></div>`;
    const controls = document.createElement("div");
    controls.className = "gaza-situation__controls";
    controls.innerHTML = '<button class="btn btn--outline btn--sm" type="button" data-toggle-arabeezy>Hide Arabeezy</button><button class="btn btn--outline btn--sm" type="button" data-toggle-english>Hide English</button>';
    const dialogue = document.createElement("div");
    dialogue.className = "gaza-situation__dialogue";
    situation.lines.forEach((line) => {
        const row = document.createElement("article");
        row.className = "gaza-situation__line";
        row.innerHTML = `<div class="gaza-situation__speaker">${line.speaker || ""}</div><div class="gaza-situation__text"><p class="gaza-situation__arabic" lang="ar" dir="rtl">${line.ar || ""}</p><p class="gaza-situation__arabeezy">${line.arabeezy || ""}</p><p class="gaza-situation__english">${line.en || ""}</p></div>`;
        dialogue.appendChild(row);
    });
    root.append(hero, controls, dialogue);
    controls.querySelector("[data-toggle-arabeezy]").addEventListener("click", (event) => {
        root.classList.toggle("gaza-situation-root--hide-arabeezy");
        event.currentTarget.textContent = root.classList.contains("gaza-situation-root--hide-arabeezy") ? "Show Arabeezy" : "Hide Arabeezy";
    });
    controls.querySelector("[data-toggle-english]").addEventListener("click", (event) => {
        root.classList.toggle("gaza-situation-root--hide-english");
        event.currentTarget.textContent = root.classList.contains("gaza-situation-root--hide-english") ? "Show English" : "Hide English";
    });
    showScreen("gaza-situation-screen");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ========================= LESSON VIEW =========================
function updateLessonTopBar() {
    const student = getCurrentStudent();
    const lesson = lessons[appState.currentLessonId];
    if (!student || !lesson) return;
    $("#lessonStudentName").textContent = student.name;
    $("#lessonMeta").textContent = `${lesson.meta.level} - ${lesson.meta.unit} - ${lesson.meta.lessonTitle}`;
}

function countCompletedSections(p) {
    return Object.values(p).filter(Boolean).length;
}
function updateProgressBar() {
    const student = getCurrentStudent();
    if (!student) {
        $("#lessonProgressFill").style.width = "0%";
        return;
    }
    const p = getStudentProgress(student, appState.currentLessonId);
    const c = countCompletedSections(p);
    const t = Object.keys(p).length || 1;
    const percent = Math.round((c / t) * 100);
    $("#lessonProgressFill").style.width = percent + "%";
}

function renderSectionStatus(container, sectionKey) {
    const student = getCurrentStudent();
    let done = false;
    if (student) {
        const p = getStudentProgress(student, appState.currentLessonId);
        done = !!p[sectionKey];
    }
    const div = document.createElement("div");
    div.className =
        "section-status " + (done ? "section-status--done" : "section-status--todo");
    div.dataset.sectionStatusKey = sectionKey;
    div.textContent = done ? "✓ Section completed" : "Section not completed yet";
    container.appendChild(div);
}
function updateSectionStatusBadge(sectionKey) {
    const badge = document.querySelector(
        `.section-status[data-section-status-key="${sectionKey}"]`
    );
    if (!badge) return;
    const student = getCurrentStudent();
    const p = student && getStudentProgress(student, appState.currentLessonId);
    const done = !!(p && p[sectionKey]);
    badge.className =
        "section-status " + (done ? "section-status--done" : "section-status--todo");
    badge.textContent = done ? "✓ Section completed" : "Section not completed yet";
}

function isGuestUser() {
    return !!(appState.currentUser && appState.currentUser.role === "guest");
}

function isGuestAllowedLesson(lessonId) {
    if (!lessonId) return false;
    const lesson = lessons[lessonId];
    if (!lesson || !lesson.meta) return false;
    if (lesson.meta.level !== "Beginner") return false;
    const allowed = new Set(["Greetings", "Family"]);
    return allowed.has(lesson.meta.unit);
}

function isGrammarTabEnabled(lesson) {
    if (!lesson) return false;
    const hasGrammar = (Array.isArray(lesson.grammarCapsuleIds) && lesson.grammarCapsuleIds.length > 0)
        || (Array.isArray(lesson.grammar) && lesson.grammar.length > 0);
    return appState.teacherMode && hasGrammar;
}

function updateLessonTabsVisibility(lesson) {
    const availableTabs = safeArr(lesson?.meta?.availableTabs);
    document.querySelectorAll(".lesson-tab[data-tab]").forEach((tab) => {
        const tabKey = tab.dataset.tab;
        if (availableTabs.length) tab.style.display = availableTabs.includes(tabKey) ? "inline-flex" : "none";
        else if (tabKey !== "grammar" && tabKey !== "culture") tab.style.display = "inline-flex";
    });
    const grammarTab = document.querySelector('.lesson-tab[data-tab="grammar"]');
    if (grammarTab) {
        grammarTab.textContent = "Grammar";
        grammarTab.style.display = isGrammarTabEnabled(lesson) ? "inline-flex" : "none";
    }
    const cultureTab = document.querySelector('.lesson-tab[data-tab="culture"]');
    if (cultureTab) cultureTab.style.display = safeArr(lesson?.culture).length ? "inline-flex" : "none";
}

function normalizeLessonTabKey(tabKey, lesson) {
    const availableTabs = safeArr(lesson?.meta?.availableTabs);
    const firstVisibleTab = () => availableTabs.find((key) => key !== "grammar" && key !== "culture") || "overview";
    if (availableTabs.length && !availableTabs.includes(tabKey)) return firstVisibleTab();
    if (tabKey === "grammar" && !isGrammarTabEnabled(lesson)) {
        return firstVisibleTab();
    }
    if (tabKey === "culture") return "overview";
    return tabKey || "overview";
}


function getUseInLifeQuestions(lesson) {
    const raw = Array.isArray(lesson?.useInLife) ? lesson.useInLife : [];
    const items = raw
        .map((q) => {
            if (typeof q === "string") return { en: q };
            if (q && typeof q === "object") {
                return { ar: q.ar || "", en: q.en || "" };
            }
            return null;
        })
        .filter(Boolean)
        .filter((q) => q.ar || q.en);

    return items;
}

function persistResumeBeforeNav() {
    // Only save when lesson screen is active for the current student.
    // Prevents copying previous student's lesson into a newly selected student.
    try {
        const lessonScreen = document.getElementById("lesson-screen");
        const inLessonScreen = !!(lessonScreen && lessonScreen.classList.contains("screen--active"));
        if (inLessonScreen && appState && appState.currentLessonId && appState.currentStudentId) {
            saveResumeSpot({ silent: true });
        }
    } catch { }
}

function getDefaultLessonIdForLevel(level) {
    const curriculumId = appState.currentCurriculumId || "structured";
    const wantedLevel = (level || "Beginner").trim();
    return Object.keys(lessons).find((id) => {
        const lesson = lessons[id];
        return getLessonCurriculumId(lesson) === curriculumId
            && (lesson?.meta?.level || "").trim() === wantedLevel
            && !/review|final|placement/i.test(lesson?.meta?.unit || "");
    }) || Object.keys(lessons).find((id) => getLessonCurriculumId(lessons[id]) === curriculumId) || LESSON_ID_GREETING;
}

function setStudentLessonContext(student) {
    appState.currentLessonId = getDefaultLessonIdForLevel(student?.level);
    appState.currentTab = "overview";
}

// =======================
// Resume Last Spot (per student)
// =======================
function ensureStudentLastSeen(student) {
    if (!student) return;
    if (!student.lastSeen || typeof student.lastSeen !== "object") {
        student.lastSeen = null;
    }
}

function saveResumeSpot({ silent = false } = {}) {
    const student = getCurrentStudent();
    if (!student) return;
    ensureStudentLastSeen(student);

    const curriculumId = appState.currentCurriculumId || "structured";
    if (!student.lastSeenByCurriculum || typeof student.lastSeenByCurriculum !== "object") student.lastSeenByCurriculum = {};
    const resumeSpot = { lessonId: appState.currentLessonId, tab: appState.currentTab || "overview", at: Date.now() };
    student.lastSeenByCurriculum[curriculumId] = resumeSpot;
    if (curriculumId === "structured") student.lastSeen = resumeSpot;

    saveStudentsToLS();
    // if teacher, also save student cloud snapshot (debounced)
    try { scheduleCloudSave(); } catch { }

    if (!silent) {
        toast("Saved! Next time this student will open right here.");
    }
    updateContinueButton();
}

function tryResumeStudent(student) {
    if (!student || !appState.currentCurriculumId) return false;
    const saved = student.lastSeenByCurriculum?.[appState.currentCurriculumId]
        || (appState.currentCurriculumId === "structured" ? student.lastSeen : null);
    if (!saved) return false;
    const { lessonId, tab } = saved;
    if (!lessonId || !lessons[lessonId]) return false;
    const lessonLevel = (lessons[lessonId]?.meta?.level || "").trim();
    const studentLevel = (student.level || "").trim();
    if (lessonLevel && studentLevel && lessonLevel !== studentLevel) return false;

    appState.currentLessonId = lessonId;
    appState.currentTab = tab || "overview";
    goToLessonView({ teacherMode: false });
    return true;
}

function updateContinueButton() {
    const btn = document.getElementById("btnContinueLesson");
    const student = getCurrentStudent();
    if (!btn) return;
    const canResume = !!(student && student.lastSeen && lessons[student.lastSeen.lessonId]);
    btn.disabled = !canResume;
    if (canResume) {
        const lesson = lessons[student.lastSeen.lessonId];
        btn.textContent = `Continue: ${lesson.meta.unit}`;
    } else {
        btn.textContent = "Continue";
    }
}

// Tabs
function setActiveTab(tabKey) {
    const lesson = lessons[appState.currentLessonId];
    const normalizedTab = normalizeLessonTabKey(tabKey, lesson);
    appState.currentTab = normalizedTab;
    // Auto-save student's last spot whenever they switch tabs
    try { saveResumeSpot({ silent: true }); } catch { }
    $all(".lesson-tab").forEach((btn) =>
        btn.classList.toggle("lesson-tab--active", btn.dataset.tab === normalizedTab)
    );

    const container = $("#lessonTabContent");
    container.innerHTML = "";
    if (!lesson) return;

    switch (normalizedTab) {
        case "overview":
            renderOverviewTab(container, lesson);
            break;
        case "vocabulary":
            renderVocabularyTab(container, lesson);
            break;
        case "dialogue":
            renderDialogueTab(container, lesson);
            break;
        case "grammar":
            renderGrammarTab(container, lesson);
            break;
        case "translation":
            renderTranslationTab(container, lesson);
            break;
        case "practice":
            renderPracticeTab(container, lesson);
            break;
        case "homework":
            renderHomeworkTab(container, lesson);
            break;
        case "review":
            renderReviewTab(container, lesson);
            break;
        case "teacher-notes":
            renderTeacherNotesTab(container, lesson);
            break;
    }
}

// Overview
function renderOverviewTab(container, lesson) {
    const ov = lesson.overview;
    const h3 = document.createElement("h3");
    h3.textContent = ov.title;
    const p = document.createElement("p");
    p.textContent = ov.description;

    const goalsTitle = document.createElement("p");
    goalsTitle.textContent = "By the end of this lesson, the student can:";
    goalsTitle.style.fontWeight = "600";

    const ul = document.createElement("ul");
    ov.goals.forEach((g) => {
        const li = document.createElement("li");
        li.textContent = g;
        ul.appendChild(li);
    });

    const speakingOutcomes = Array.isArray(ov.speakingOutcomes) ? ov.speakingOutcomes : [];
    const speakingTitle = document.createElement("p");
    speakingTitle.textContent = "Speaking outcomes:";
    speakingTitle.style.fontWeight = "600";
    speakingTitle.style.marginTop = "10px";
    const speakingList = document.createElement("ul");
    speakingOutcomes.forEach((outcome) => {
        const li = document.createElement("li");
        li.textContent = outcome;
        speakingList.appendChild(li);
    });

    const useTitle = document.createElement("h4");
    useTitle.textContent = "Use it in your life";
    useTitle.style.marginTop = "12px";

    const useList = document.createElement("div");
    const useItems = getUseInLifeQuestions(lesson);
    useItems.forEach((q) => {
        const wrap = document.createElement("div");
        wrap.style.marginBottom = "6px";

        if (q.ar) {
            const ar = document.createElement("div");
            ar.className = "dialogue-col--ar";
            ar.style.fontSize = "1rem";
            ar.textContent = q.ar;
            wrap.appendChild(ar);
        }

        if (q.en) {
            const en = document.createElement("div");
            en.className = "translation-muted";
            en.textContent = q.en;
            wrap.appendChild(en);
        }

        useList.appendChild(wrap);
    });

    const btn = document.createElement("button");
    btn.className = "btn btn--primary btn--sm";
    btn.textContent = "Mark Overview as Done";
    btn.addEventListener("click", () => setStudentProgressField("overview", true));

    container.appendChild(h3);
    container.appendChild(p);
    container.appendChild(goalsTitle);
    container.appendChild(ul);
    if (speakingOutcomes.length) {
        container.appendChild(speakingTitle);
        container.appendChild(speakingList);
    }
    if (useItems.length) {
        container.appendChild(useTitle);
        container.appendChild(useList);
    }
    container.appendChild(btn);
    renderSectionStatus(container, "overview");
}

// Vocabulary


function renderVocabModalFromState() {
    const item = vocabModalState.list[vocabModalState.index];
    if (!item) return;

    const elAr = $("#vocabModalWord");
    const elEn = $("#vocabModalMeaning");
    const elArabeezy = $("#vocabModalArabeezy");
    const elHint = $("#vocabModalHint");
    const elProgress = $("#vocabModalProgress");

    const exAr = $("#vocabModalExampleAr");
    const exArabeezy = $("#vocabModalExampleArabeezy");
    const exEn = $("#vocabModalExampleEn");

    // Fill text
    elAr.textContent = item.ar || "";
    elEn.textContent = item.en || "";
    elArabeezy.textContent = item.enArabeezy || "";
    if (elHint) elHint.textContent = item.hint || "";

    if (exAr) exAr.textContent = item.exampleAr || "";
    if (exArabeezy) exArabeezy.textContent = item.exampleArabeezy || "";
    if (exEn) exEn.textContent = item.exampleEn || "";

    if (elProgress) {
        elProgress.textContent = `${vocabModalState.index + 1} / ${vocabModalState.list.length}`;
    }

    // ✅ Word visibility (Arabic word follows example toggle)
    elAr.style.display = (vocabModalState.showAr && vocabModalState.showExamples) ? "" : "none";
    elEn.style.display = vocabModalState.showEn ? "" : "none";
    elArabeezy.style.display = vocabModalState.showArabeezy ? "" : "none";

    // ✅ Examples visibility (independent, but respects each language toggle)
    const showEx = !!vocabModalState.showExamples;

    if (exAr) exAr.style.display = (showEx && vocabModalState.showAr) ? "" : "none";
    if (exEn) exEn.style.display = vocabModalState.showEn ? "" : "none";
    if (exArabeezy) exArabeezy.style.display = vocabModalState.showArabeezy ? "" : "none";

    // Buttons text
    const btnAr = $("#vocabToggleArBtn");          // Ù„Ùˆ Ø¹Ù†Ø¯Ùƒ Ø²Ø± Ø¹Ø±Ø¨ي
    const btnEn = $("#vocabToggleEnBtn");
    const btnEx = $("#vocabToggleExamplesBtn");
    const btnArabeezy = $("#vocabToggleArabeezyBtn");

    if (btnAr) btnAr.textContent = vocabModalState.showAr ? "Hide" : "Show";
    if (btnEn) btnEn.textContent = vocabModalState.showEn ? "Hide" : "Show";
    if (btnArabeezy) btnArabeezy.textContent = vocabModalState.showArabeezy ? "Hide" : "Show";
    if (btnEx) btnEx.textContent = vocabModalState.showExamples ? "Hide" : "Show";
}




function openVocabModal(list, index) {
    vocabModalState.list = list || [];
    vocabModalState.index = index || 0;
    vocabModalState.showExamples = true;
    vocabModalState.showAr = true;
    vocabModalState.showEn = true;
    vocabModalState.showArabeezy = true;
    vocabModalState.nextClickCount = 0;
    microCheckState.pendingNextAdvance = false;

    renderVocabModalFromState();
    $("#vocabModal").classList.add("modal--open");
}


function closeVocabModal() {
    $("#vocabModal").classList.remove("modal--open");
    vocabModalState.list = [];
    closeMicroCheckModal();
}


function ensureVocabVisitedSet() {
    const sid = appState.currentStudentId || "anon";
    if (!appState.vocabCoreVisited[sid]) {
        appState.vocabCoreVisited[sid] = {};
    }
    if (!appState.vocabCoreVisited[sid][appState.currentLessonId]) {
        appState.vocabCoreVisited[sid][appState.currentLessonId] = new Set();
    }
    return appState.vocabCoreVisited[sid][appState.currentLessonId];
}
function maybeAutoCompleteVocab() {
    const lesson = lessons[appState.currentLessonId];
    const set = ensureVocabVisitedSet();
    const totalCore = lesson.vocabulary.core.length;
    if (totalCore && set.size >= totalCore) {
        setStudentProgressField("vocabulary", true);
    }
}

function renderVocabularyGroup(container, titleText, items, isCore) {
    const title = document.createElement("div");
    title.className = "vocab-group-title";
    title.textContent = titleText;
    container.appendChild(title);

    const list = document.createElement("div");
    list.className = "vocab-list";

    items.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "vocab-item";

        const ar = document.createElement("div");
        ar.className = "vocab-item__ar";
        ar.textContent = item.ar;

        const en = document.createElement("div");
        en.className = "vocab-item__en";
        en.textContent = item.en;

        card.appendChild(ar);
        card.appendChild(en);

        card.addEventListener("click", () => {
            // ✅ Ù†Ø±Ø³ل Ø§Ù„Ù„ÙŠØ³Øª + index Ù„Ù„Ù…ÙˆØ¯Ø§ل
            openVocabModal(items, index);

            // Ù†ÙØ³ Ù…Ù†Ø·ق Ø§Ù„Ù€ progress Ø§Ù„Ù‚Ø¯يم
            if (isCore) {
                const s = ensureVocabVisitedSet();
                s.add(item.id);
                maybeAutoCompleteVocab();
            }
        });

        list.appendChild(card);
    });

    container.appendChild(list);
}


function handleAddVocabItem(lesson, groupKey) {
    const ar = prompt("Arabic word (with vowels):");
    if (!ar) return;
    const en = prompt("English meaning:");
    if (!en) return;
    const hint = prompt("Optional hint / note:") || "";
    const enArabeezy = prompt("Arabeezy (optional):") || "";
    const exampleAr = prompt("Example sentence in Arabic (optional):") || "";
    const exampleArabeezy = prompt("Example sentence in Arabeezy (optional):") || "";
    const exampleEn = prompt("Example sentence in English (optional):") || "";
    lesson.vocabulary[groupKey].push({
        id: groupKey + "_" + Date.now(),
        ar,
        en,
        enArabeezy,
        hint,
        exampleAr,
        exampleArabeezy,
        exampleEn,
    });
    saveLessonToLS(appState.currentLessonId);
    saveLessonToCloud(appState.currentLessonId);
    setActiveTab("vocabulary");
}

function handleEditVocabItems(lesson) {
    const all = [
        ...lesson.vocabulary.core.map((i) => ({ ...i, groupKey: "core" })),
        ...lesson.vocabulary.extra.map((i) => ({ ...i, groupKey: "extra" })),
    ];
    if (!all.length) {
        alert("No vocabulary to edit.");
        return;
    }
    const list = all.map((i, idx) => `${idx + 1}. ${i.ar} / ${i.en}`).join("\n");
    const indexStr = prompt(
        "Choose item number to edit/delete:\n" + list + "\n\nEnter number (or cancel):"
    );
    if (!indexStr) return;
    const index = Number(indexStr) - 1;
    if (isNaN(index) || index < 0 || index >= all.length) return;
    const item = all[index];

    const action = prompt(
        `Selected: ${item.ar} / ${item.en}\nType:\n  e = edit\n  d = delete`
    );
    if (!action) return;

    const group = lesson.vocabulary[item.groupKey];
    const idxInGroup = group.findIndex((x) => x.id === item.id);
    if (action.toLowerCase() === "d") {
        if (idxInGroup !== -1) group.splice(idxInGroup, 1);
    } else if (action.toLowerCase() === "e") {
        const ar = prompt("Arabic:", item.ar) || item.ar;
        const en = prompt("English:", item.en) || item.en;
        const enArabeezy =
            prompt("Arabeezy:", item.enArabeezy || "") || item.enArabeezy || "";
        const hint = prompt("Hint:", item.hint || "") || item.hint || "";
        const exampleAr =
            prompt("Example Arabic:", item.exampleAr || "") || item.exampleAr || "";
        const exampleArabeezy =
            prompt("Example Arabeezy:", item.exampleArabeezy || "") || item.exampleArabeezy || "";
        const exampleEn =
            prompt("Example English:", item.exampleEn || "") || item.exampleEn || "";
        if (idxInGroup !== -1) {
            group[idxInGroup] = {
                ...item,
                ar,
                en,
                enArabeezy,
                hint,
                exampleAr,
                exampleArabeezy,
                exampleEn,
            };
        }
    }
    saveLessonToLS(appState.currentLessonId);
    saveLessonToCloud(appState.currentLessonId);
    setActiveTab("vocabulary");
}

function renderVocabularyTab(container, lesson) {
    const hint = document.createElement("p");
    hint.className = "teacher-edit-note";
    hint.textContent =
        "Tap a card to see details and example sentences. When you finish reviewing, press 'Done' to complete this section.";
    container.appendChild(hint);

    // ✅ Ø´Ø±ÙŠØ· "Øªم Ø¥Ù†Ù‡Ø§Ø¡ Ø§Ù„Ù‚Ø³م"
    const doneBar = document.createElement("div");
    doneBar.className = "section-done-bar";

    const doneLabel = document.createElement("span");
    doneLabel.className = "section-done-text";


    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn--outline btn--sm section-done-btn";
    doneBtn.textContent = "Mark Vocabulary as Done";

    doneBtn.addEventListener("click", () => {
        markVocabularyDone();
    });

    doneBar.appendChild(doneLabel);
    doneBar.appendChild(doneBtn);
    container.appendChild(doneBar);

    // ✅ Ø¨Ø§قي ØªØ¨ÙˆÙŠØ¨ Ø§Ù„Ù…ÙØ±Ø¯Ø§Øª
    const vocab = lesson.vocabulary || {};
    const core = Array.isArray(vocab.core) ? vocab.core : [];
    const extra = Array.isArray(vocab.extra) ? vocab.extra : [];

    if (core.length) {
        renderVocabularyGroup(container, "Core Vocabulary", core, true);
    }
    if (extra.length) {
        renderVocabularyGroup(container, "Extra Vocabulary", extra, false);
    }
}



// Dialogue
function renderDialogueTab(container, lesson) {
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.gap = "8px";

    const title = document.createElement("h4");
    title.className = "td-lessonitem__title";
    title.textContent = "Model Dialogue";

    const controls = document.createElement("div");
    controls.style.display = "flex";
    controls.style.gap = "6px";
    controls.style.flexWrap = "wrap";

    const btnToggleEnglish = document.createElement("button");
    btnToggleEnglish.className = "btn btn--ghost btn--sm";
    btnToggleEnglish.textContent = "Show/Hide English";

    const btnToggleArabic = document.createElement("button");
    btnToggleArabic.className = "btn btn--ghost btn--sm";
    btnToggleArabic.textContent = "Show/Hide Arabic";

    const btnToggleArabeezy = document.createElement("button");
    btnToggleArabeezy.className = "btn btn--ghost btn--sm";
    btnToggleArabeezy.textContent = "Show/Hide Arabeezy";

    const btnDone = document.createElement("button");
    btnDone.className = "btn btn--primary btn--sm";
    btnDone.textContent = "Mark Dialogue as Done";
    btnDone.addEventListener("click", () => setStudentProgressField("dialogue", true));

    const dialogueQuestions = safeArr(lesson?.dialogue?.questions);
    const btnToggleQuestions = document.createElement("button");
    btnToggleQuestions.className = "btn btn--ghost btn--sm";
    btnToggleQuestions.textContent = "Dialogue Questions";
    btnToggleQuestions.setAttribute("aria-haspopup", "dialog");
    btnToggleQuestions.hidden = dialogueQuestions.length === 0;

    controls.appendChild(btnToggleArabic);
    controls.appendChild(btnToggleEnglish);
    controls.appendChild(btnToggleArabeezy);
    controls.appendChild(btnDone);
    controls.appendChild(btnToggleQuestions);

    header.appendChild(title);
    header.appendChild(controls);

    const layout = document.createElement("div");
    layout.className = "dialogue-layout";

    const enCol = document.createElement("div");
    enCol.className = "dialogue-col";

    const arCol = document.createElement("div");
    arCol.className = "dialogue-col dialogue-col--ar";

    lesson.dialogue.lines.forEach((line) => {
        const enLine = document.createElement("div");
        enLine.className = "dialogue-line";
        const enSpeaker = document.createElement("div");
        enSpeaker.className = "dialogue-speaker-en";
        enSpeaker.textContent = line.speaker;
        const enText = document.createElement("div");
        enText.className = "dialogue-text";
        enText.textContent = line.en;
        enLine.appendChild(enSpeaker);
        enLine.appendChild(enText);
        enCol.appendChild(enLine);

        const arLine = document.createElement("div");
        arLine.className = "dialogue-line";
        const arSpeaker = document.createElement("div");
        arSpeaker.className = "dialogue-speaker-ar";
        arSpeaker.textContent = line.speaker;
        const arContent = document.createElement("div");
        arContent.className = "dialogue-content";

        const arText = document.createElement("div");
        arText.className = "dialogue-text";
        arText.textContent = line.ar;
        arContent.appendChild(arText);

        const arArabeezyText = line.arArabeezy || line.arabeezy || "";
        if (arArabeezyText) {
            const arArabeezy = document.createElement("div");
            arArabeezy.className = "dialogue-arabeezy";
            arArabeezy.textContent = arArabeezyText;
            arContent.appendChild(arArabeezy);
        }
        arLine.appendChild(arSpeaker);
        arLine.appendChild(arContent);
        arCol.appendChild(arLine);
    });

    layout.appendChild(enCol);
    layout.appendChild(arCol);

    let questionsModal = null;
    let questionsSection = null;
    let closeQuestionsButton = null;
    if (dialogueQuestions.length) {
        questionsModal = document.createElement("div");
        questionsModal.className = "dialogue-questions-modal";
        questionsModal.hidden = true;
        questionsModal.setAttribute("role", "dialog");
        questionsModal.setAttribute("aria-modal", "true");
        questionsModal.setAttribute("aria-labelledby", "dialogueQuestionsTitle");

        const questionsBackdrop = document.createElement("button");
        questionsBackdrop.type = "button";
        questionsBackdrop.className = "dialogue-questions-modal__backdrop";
        questionsBackdrop.setAttribute("aria-label", "Close dialogue questions");

        questionsSection = document.createElement("section");
        questionsSection.className = "dialogue-questions";
        questionsSection.id = "dialogueQuestionsPanel";
        btnToggleQuestions.setAttribute("aria-controls", questionsSection.id);

        closeQuestionsButton = document.createElement("button");
        closeQuestionsButton.type = "button";
        closeQuestionsButton.className = "dialogue-questions__close";
        closeQuestionsButton.textContent = "×";
        closeQuestionsButton.setAttribute("aria-label", "Close dialogue questions");
        questionsSection.appendChild(closeQuestionsButton);

        const questionsTitle = document.createElement("h5");
        questionsTitle.className = "dialogue-questions__title";
        questionsTitle.id = "dialogueQuestionsTitle";
        questionsTitle.textContent = "Dialogue Questions";
        questionsSection.appendChild(questionsTitle);

        const questionsList = document.createElement("ol");
        questionsList.className = "dialogue-questions__list";

        dialogueQuestions.forEach((question) => {
            const item = document.createElement("li");
            item.className = "dialogue-question";

            const arQuestion = document.createElement("div");
            arQuestion.className = "dialogue-question__ar";
            arQuestion.dir = "rtl";
            arQuestion.textContent = question.ar || "";
            item.appendChild(arQuestion);

            if (question.en) {
                const enQuestion = document.createElement("div");
                enQuestion.className = "dialogue-question__en";
                enQuestion.textContent = question.en;
                item.appendChild(enQuestion);
            }

            questionsList.appendChild(item);
        });

        questionsSection.appendChild(questionsList);
        questionsModal.appendChild(questionsBackdrop);
        questionsModal.appendChild(questionsSection);

        const closeQuestionsModal = () => {
            questionsModal.hidden = true;
            btnToggleQuestions.focus();
        };

        closeQuestionsButton.addEventListener("click", closeQuestionsModal);
        questionsBackdrop.addEventListener("click", closeQuestionsModal);
        questionsModal.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeQuestionsModal();
        });
    }

    btnToggleQuestions.addEventListener("click", () => {
        if (!questionsModal) return;
        questionsModal.hidden = false;
        closeQuestionsButton?.focus();
    });

    let englishVisible = true;
    let arabicVisible = true;
    let arabeezyVisible = true;


    function adjustLayout() {
        const showArabicCol = arabicVisible || arabeezyVisible;
        if (englishVisible && showArabicCol) {
            layout.style.gridTemplateColumns = "minmax(0, 1fr) minmax(0, 1fr)";
            enCol.style.display = "block";
            arCol.style.display = "block";
            enCol.style.margin = "0";
            arCol.style.margin = "0";
        } else if (englishVisible && !showArabicCol) {
            layout.style.gridTemplateColumns = "minmax(0, 1fr)";
            enCol.style.display = "block";
            arCol.style.display = "none";
            enCol.style.margin = "0 auto";
        } else if (!englishVisible && showArabicCol) {
            layout.style.gridTemplateColumns = "minmax(0, 1fr)";
            enCol.style.display = "none";
            arCol.style.display = "block";
            arCol.style.margin = "0 auto";
        } else {
            // Ù„Ùˆ Ø§Ù„Ø§Ø«نين Ù…Ø®Ùيين، Ø®ليه ÙØ§Ø¶ي Ù„Ùƒن Ù†Ø­Ø§ÙØ¸ Ø¹Ù„Ù‰ Ø§Ù„ØªØ®Ø·ÙŠØ·
            layout.style.gridTemplateColumns = "minmax(0, 1fr)";
            enCol.style.display = "none";
            arCol.style.display = "none";
        }
    }

    function updateArabicVisibility() {
        arCol.querySelectorAll(".dialogue-text").forEach((el) => {
            el.style.display = arabicVisible ? "" : "none";
        });
        questionsSection?.querySelectorAll(".dialogue-question__ar").forEach((el) => {
            el.style.display = arabicVisible ? "" : "none";
        });
    }

    function updateArabeezyVisibility() {
        arCol.querySelectorAll(".dialogue-arabeezy").forEach((el) => {
            el.style.display = arabeezyVisible ? "" : "none";
        });
    }

    btnToggleEnglish.addEventListener("click", () => {
        englishVisible = !englishVisible;
        adjustLayout();
        questionsSection?.querySelectorAll(".dialogue-question__en").forEach((el) => {
            el.style.display = englishVisible ? "" : "none";
        });
    });

    btnToggleArabic.addEventListener("click", () => {
        arabicVisible = !arabicVisible;
        adjustLayout();
        updateArabicVisibility();
    });

    btnToggleArabeezy.addEventListener("click", () => {
        arabeezyVisible = !arabeezyVisible;
        adjustLayout();
        updateArabeezyVisibility();
    });

    // Ø£Ùˆل Ù…Ø±Ø©
    adjustLayout();
    updateArabicVisibility();
    updateArabeezyVisibility();

    container.appendChild(header);
    container.appendChild(layout);
    if (questionsModal) container.appendChild(questionsModal);

    if (appState.teacherMode) {
        const note = document.createElement("p");
        note.className = "teacher-edit-note";
        note.textContent =
            "Teacher Mode: You can edit the dialogue from the Teacher Dashboard form (Edit Lesson Content).";
        container.appendChild(note);
    }

    renderSectionStatus(container, "dialogue");
}

// Translation
function renderTranslationTab(container, lesson) {
    ensureTranslationItems(lesson, 7);

    const list = safeArr(lesson?.practice?.translation);
    translationState.items = list;
    translationState.index = 0;
    translationState.hidePrompt = false;
    translationState.hideAnswer = false;
    translationState.shuffled = false;

    // زر "تم"
    const doneBar = document.createElement("div");
    doneBar.className = "section-done-bar";

    const doneText = document.createElement("span");
    doneText.className = "translation-muted";
    doneText.textContent = "بعد ما تخلص ترجمة الجمل اضغط تم لإنهاء القسم.";

    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn--outline btn--sm";
    doneBtn.textContent = "✓ تم إنهاء قسم الترجمة";
    doneBtn.addEventListener("click", () => {
        setStudentProgressField("translation", true);
    });

    doneBar.appendChild(doneText);
    doneBar.appendChild(doneBtn);
    container.appendChild(doneBar);

    // Toolbar (إخفاء مرتب، مش معجوق)
    const toolbar = document.createElement("div");
    toolbar.className = "translation-toolbar";

    const left = document.createElement("div");
    left.className = "group";

    const btnHidePrompt = document.createElement("button");
    btnHidePrompt.className = "btn btn--ghost btn--sm";
    btnHidePrompt.textContent = "Hide prompt";

    const btnHideAnswer = document.createElement("button");
    btnHideAnswer.className = "btn btn--ghost btn--sm";
    btnHideAnswer.textContent = "Hide answer";

    const btnShuffle = document.createElement("button");
    btnShuffle.className = "btn btn--ghost btn--sm";
    btnShuffle.textContent = "Shuffle";

    const btnReset = document.createElement("button");
    btnReset.className = "btn btn--ghost btn--sm";
    btnReset.textContent = "Reset";

    left.appendChild(btnHidePrompt);
    left.appendChild(btnHideAnswer);
    left.appendChild(btnShuffle);
    left.appendChild(btnReset);

    const right = document.createElement("div");
    right.className = "group";

    const counter = document.createElement("span");
    counter.className = "translation-muted";
    counter.textContent = list.length ? `1 / ${list.length}` : "0 / 0";

    const btnPrev = document.createElement("button");
    btnPrev.className = "btn btn--ghost btn--sm";
    btnPrev.textContent = "Prev";

    const btnNext = document.createElement("button");
    btnNext.className = "btn btn--ghost btn--sm";
    btnNext.textContent = "Next";

    right.appendChild(btnPrev);
    right.appendChild(btnNext);
    right.appendChild(counter);

    toolbar.appendChild(left);
    toolbar.appendChild(right);
    container.appendChild(toolbar);

    // Card container
    const cardHost = document.createElement("div");
    container.appendChild(cardHost);

    // Render function
    function renderTranslationCard() {
        cardHost.innerHTML = "";

        const item = translationState.items[translationState.index];
        if (!item) {
            const p = document.createElement("p");
            p.className = "translation-muted";
            p.textContent = "No translation items available.";
            cardHost.appendChild(p);
            return;
        }

        const type = item.type === "arToEn" ? "Arabic → English" : "English → Arabic";

        const card = document.createElement("div");
        card.className = "translation-card";

        const badge = document.createElement("span");
        badge.className = "translation-badge";
        badge.textContent = type;

        const prompt = document.createElement("div");
        prompt.className = "translation-prompt";

        const answer = document.createElement("div");
        answer.className = "translation-answer";

        // prompt/answer content
        if (item.type === "enToAr") {
            prompt.textContent = translationState.hidePrompt ? "••••••••" : `EN: ${txt(item.textEn)}`;
            answer.textContent = translationState.hideAnswer ? "••••••••" : `AR: ${txt(item.textAr)}`;
        } else {
            prompt.textContent = translationState.hidePrompt ? "••••••••" : `AR: ${txt(item.textAr)}`;
            answer.textContent = translationState.hideAnswer ? "••••••••" : `EN: ${txt(item.textEn)}`;
        }

        const btnShow = document.createElement("button");
        btnShow.className = "btn btn--outline btn--sm";
        btnShow.textContent = "Show answer";

        btnShow.addEventListener("click", () => {
            const isVisible = answer.classList.toggle("is-visible");
            btnShow.textContent = isVisible ? "Hide answer" : "Show answer";
        });

        const footer = document.createElement("div");
        footer.className = "translation-footer";

        const tip = document.createElement("span");
        tip.className = "translation-muted";
        tip.textContent = "Try to say it out loud before showing the answer.";

        footer.appendChild(tip);
        footer.appendChild(btnShow);

        card.appendChild(badge);
        card.appendChild(prompt);
        card.appendChild(footer);
        card.appendChild(answer);

        cardHost.appendChild(card);

        counter.textContent = `${translationState.index + 1} / ${translationState.items.length}`;

        // Update toolbar button text states
        btnHidePrompt.textContent = translationState.hidePrompt ? "Show prompt" : "Hide prompt";
        btnHideAnswer.textContent = translationState.hideAnswer ? "Show answer" : "Hide answer";
    }

    // toolbar actions
    btnHidePrompt.addEventListener("click", () => {
        translationState.hidePrompt = !translationState.hidePrompt;
        renderTranslationCard();
    });

    btnHideAnswer.addEventListener("click", () => {
        translationState.hideAnswer = !translationState.hideAnswer;
        renderTranslationCard();
    });

    btnShuffle.addEventListener("click", () => {
        translationState.items = shuffleArray(translationState.items);
        translationState.index = 0;
        translationState.shuffled = true;
        renderTranslationCard();
    });

    btnReset.addEventListener("click", () => {
        translationState.index = 0;
        translationState.hidePrompt = false;
        translationState.hideAnswer = false;
        renderTranslationCard();
    });

    btnPrev.addEventListener("click", () => {
        if (!translationState.items.length) return;
        translationState.index =
            (translationState.index - 1 + translationState.items.length) % translationState.items.length;
        renderTranslationCard();
    });

    btnNext.addEventListener("click", () => {
        if (!translationState.items.length) return;
        translationState.index =
            (translationState.index + 1) % translationState.items.length;
        renderTranslationCard();
    });

    renderTranslationCard();
    renderSectionStatus(container, "translation");
}

// Grammar
function renderGrammarTab(container, lesson) {
    const title = document.createElement("h4");
    title.className = "td-lessonitem__title";
    title.textContent = "Grammar Notes";
    container.appendChild(title);

    const items = safeArr(lesson?.grammar);
    if (!items.length) {
        const empty = document.createElement("p");
        empty.className = "translation-muted";
        empty.textContent = "No grammar points available yet.";
        container.appendChild(empty);
    } else {
        const accordion = document.createElement("div");
        accordion.className = "grammar-accordion";

        items.forEach((g, idx) => {
            const details = document.createElement("details");
            details.className = "grammar-accordion__item";
            if (idx === 0) details.open = true;

            const summary = document.createElement("summary");
            summary.className = "grammar-accordion__summary";

            const summaryTitle = document.createElement("span");
            summaryTitle.className = "grammar-accordion__title";
            summaryTitle.textContent = g.title || "Grammar point";

            const summaryHint = document.createElement("span");
            summaryHint.className = "grammar-accordion__hint";
            summaryHint.textContent = g.short || "Tap to see rules, examples, and notes.";

            summary.appendChild(summaryTitle);
            summary.appendChild(summaryHint);

            const body = document.createElement("div");
            body.className = "grammar-accordion__body";

            const desc = document.createElement("p");
            desc.className = "grammar-desc";
            desc.textContent = g.description || "";
            body.appendChild(desc);

            if (g.table && Array.isArray(g.table.headers) && Array.isArray(g.table.rows)) {
                const tableWrap = document.createElement("div");
                tableWrap.className = "grammar-topic-table";

                const tableTitle = document.createElement("div");
                tableTitle.className = "grammar-topic-table__title";
                tableTitle.textContent = g.table.title || "Table";

                const table = document.createElement("table");
                table.className = "grammar-table__table";

                const thead = document.createElement("thead");
                const headRow = document.createElement("tr");
                g.table.headers.forEach((h) => {
                    const th = document.createElement("th");
                    th.textContent = h;
                    headRow.appendChild(th);
                });
                thead.appendChild(headRow);

                const tbody = document.createElement("tbody");
                g.table.rows.forEach((row) => {
                    const tr = document.createElement("tr");
                    row.forEach((cell) => {
                        const td = document.createElement("td");
                        td.textContent = cell;
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });

                table.appendChild(thead);
                table.appendChild(tbody);
                tableWrap.appendChild(tableTitle);
                tableWrap.appendChild(table);
                body.appendChild(tableWrap);
            }

            const examples = Array.isArray(g.examples) ? g.examples : [];
            const examplesBlock = document.createElement("div");
            examplesBlock.className = "grammar-examples";
            const examplesTitle = document.createElement("div");
            examplesTitle.className = "grammar-examples__title";
            examplesTitle.textContent = "Examples";
            examplesBlock.appendChild(examplesTitle);

            if (!examples.length) {
                const emptyExamples = document.createElement("div");
                emptyExamples.className = "grammar-examples__empty";
                emptyExamples.textContent = "No examples yet.";
                examplesBlock.appendChild(emptyExamples);
            } else {
                const list = document.createElement("div");
                list.className = "grammar-examples__list";
                examples.forEach((ex) => {
                    const row = document.createElement("div");
                    row.className = "grammar-example";

                    const ar = document.createElement("div");
                    ar.className = "grammar-example__ar";
                    ar.textContent = ex.ar || "";

                    const arabeezy = document.createElement("div");
                    arabeezy.className = "grammar-example__arabeezy";
                    arabeezy.textContent = ex.arabeezy || "";

                    const en = document.createElement("div");
                    en.className = "grammar-example__en";
                    en.textContent = ex.en || "";

                    row.appendChild(ar);
                    row.appendChild(arabeezy);
                    row.appendChild(en);
                    list.appendChild(row);
                });
                examplesBlock.appendChild(list);
            }
            body.appendChild(examplesBlock);

            if (appState.teacherMode) {
                const notesWrap = document.createElement("div");
                notesWrap.className = "grammar-teacher";

                const notesTitle = document.createElement("div");
                notesTitle.className = "grammar-teacher__title";
                notesTitle.textContent = "Teacher Notes";

                const notesText = document.createElement("div");
                notesText.className = "grammar-teacher__text";
                notesText.textContent = g.teacherNotes || "No teacher notes yet.";

                notesWrap.appendChild(notesTitle);
                notesWrap.appendChild(notesText);
                body.appendChild(notesWrap);
            }

            details.appendChild(summary);
            details.appendChild(body);
            accordion.appendChild(details);
        });

        container.appendChild(accordion);
    }

    const doneBtn = document.createElement("button");
    doneBtn.className = "btn btn--outline btn--sm";
    doneBtn.textContent = "Mark Grammar as Done";
    doneBtn.addEventListener("click", () => setStudentProgressField("grammar", true));
    container.appendChild(doneBtn);
    renderSectionStatus(container, "grammar");
}


// Practice
function renderPracticeTab(container, lesson) {
    if (lesson?.practice?.assessmentMode) {
        return renderAssessmentPractice(container, lesson);
    }
    if (lesson?.meta?.curriculumId === "interactive") {
        return renderPracticeTabClean(container, lesson);
    }
    return renderStandardPractice(container, lesson);
}
function renderStandardPractice(container, lesson) {
    const title = document.createElement("h4");
    title.className = "td-lessonitem__title";
    title.textContent = "Practice - Recognition, Production & Simulation";

    const quizBlock = document.createElement("div");
    let correctCount = 0;

    lesson.practice.quiz.forEach((q) => {
        const qWrap = document.createElement("div");
        qWrap.className = "quiz-question";

        const qText = document.createElement("div");
        qText.className = "flashcard__ar";
        qText.style.direction = "rtl";
        qText.textContent = q.questionAr;

        const optionsWrap = document.createElement("div");
        optionsWrap.className = "quiz-options";

        const feedback = document.createElement("div");
        feedback.className = "quiz-feedback";

        q.optionsEn.forEach((opt, idx) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "quiz-option";
            btn.textContent = opt;
            btn.addEventListener("click", () => {
                if (idx === q.correctIndex) {
                    btn.classList.add("quiz-option--correct");
                    feedback.textContent = "✅ Correct!";
                    correctCount++;
                    if (correctCount >= 5 || correctCount >= lesson.practice.quiz.length) {
                        setStudentProgressField("practice", true);
                    }
                } else {
                    btn.classList.add("quiz-option--incorrect");
                    feedback.textContent = "Not quite. Try again.";
                }
            });
            optionsWrap.appendChild(btn);
        });

        qWrap.appendChild(qText);
        qWrap.appendChild(optionsWrap);
        qWrap.appendChild(feedback);
        quizBlock.appendChild(qWrap);
    });

    const roleTitle = document.createElement("p");
    roleTitle.style.marginTop = "8px";
    roleTitle.style.fontWeight = "600";
    roleTitle.textContent = "Role-play prompts:";

    const ul = document.createElement("ul");
    ul.className = "roleplay-list";
    lesson.practice.rolePlays.forEach((rp) => {
        const li = document.createElement("li");
        li.textContent = rp;
        ul.appendChild(li);
    });

    const structuredPractice = document.createElement("div");
    const practiceSections = Array.isArray(lesson.practice.sections)
        ? lesson.practice.sections
        : [];

    practiceSections.forEach((section) => {
        const sectionWrap = document.createElement("div");
        sectionWrap.className = "quiz-question";

        const sectionTitle = document.createElement("h4");
        sectionTitle.className = "td-lessonitem__title";
        sectionTitle.textContent = section.title || "Practice";
        sectionWrap.appendChild(sectionTitle);

        if (section.realSituationSimulation) {
            const sim = document.createElement("p");
            sim.className = "teacher-edit-note";
            sim.textContent = `Real Situation Simulation: ${section.realSituationSimulation}`;
            sectionWrap.appendChild(sim);
        }

        function appendList(label, items, formatter) {
            if (!Array.isArray(items) || !items.length) return;
            const subTitle = document.createElement("p");
            subTitle.style.fontWeight = "600";
            subTitle.textContent = label;
            sectionWrap.appendChild(subTitle);

            const list = document.createElement("ul");
            list.className = "roleplay-list";
            items.forEach((item) => {
                const li = document.createElement("li");
                li.textContent = formatter(item);
                list.appendChild(li);
            });
            sectionWrap.appendChild(list);
        }

        appendList("Matching", section.matching, (item) => `${item.ar} = ${item.en}`);
        appendList("Multiple choice", section.multipleChoice, (item) => {
            const opts = Array.isArray(item.options) ? item.options.join(" / ") : "";
            return `${item.prompt} (${opts})`;
        });
        appendList("Fill in the blank", section.fillInTheBlank, (item) => `${item.prompt} Answer: ${item.answer}`);
        appendList("Reorder sentences", section.reorderSentences, (item) => {
            const words = Array.isArray(item.words) ? item.words.join(" / ") : "";
            return `${item.prompt} Words: ${words}`;
        });
        appendList("Translation (Arabic ↔ English)", section.translation, (item) => `${item.en} = ${item.ar}`);
        appendList("Write your own sentences (5-10)", section.writeYourOwnSentences, (item) => item);

        structuredPractice.appendChild(sectionWrap);
    });

    const btnDone = document.createElement("button");
    btnDone.className = "btn btn--primary btn--sm";
    btnDone.textContent = "Mark Practice as Done";
    btnDone.addEventListener("click", () => setStudentProgressField("practice", true));

    container.appendChild(title);
    container.appendChild(quizBlock);
    container.appendChild(roleTitle);
    container.appendChild(ul);
    if (practiceSections.length) {
        container.appendChild(structuredPractice);
    }
    container.appendChild(btnDone);

    if (appState.teacherMode) {
        const note = document.createElement("p");
        note.className = "teacher-edit-note";
        note.textContent =
            "Teacher notes are disabled in the public student build.";
        container.appendChild(note);
    }

    renderSectionStatus(container, "practice");
}

function renderAssessmentPractice(container, lesson) {
    const practice = lesson.practice || {};
    const questions = safeArr(practice.questions);
    const answers = new Map();
    const shuffledOptions = questions.map((question) => {
        const entries = safeArr(question.options).map((text, originalIndex) => ({ text, originalIndex }));
        for (let index = entries.length - 1; index > 0; index -= 1) {
            const swapIndex = Math.floor(Math.random() * (index + 1));
            [entries[index], entries[swapIndex]] = [entries[swapIndex], entries[index]];
        }
        return entries;
    });
    const root = document.createElement("div");
    root.className = "practice-pro";

    const header = document.createElement("div");
    header.className = "practice-pro__header";
    const headerText = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = practice.assessmentTitle || "Final Assessment";
    const intro = document.createElement("p");
    intro.textContent = "Answer every question, then submit once. Correct answers are not shown during the test.";
    headerText.appendChild(title);
    headerText.appendChild(intro);
    header.appendChild(headerText);
    root.appendChild(header);

    const list = document.createElement("div");
    list.className = "practice-pro__body";
    questions.forEach((question, questionIndex) => {
        const card = document.createElement("article");
        card.className = "practice-pro__card";
        const counter = document.createElement("div");
        counter.className = "practice-pro__counter";
        counter.textContent = `${questionIndex + 1} / ${questions.length} · ${question.skill || "Language"}`;
        const prompt = document.createElement("div");
        prompt.className = "practice-pro__prompt";
        prompt.textContent = question.prompt || "";
        const choices = document.createElement("div");
        choices.className = "practice-pro__choices";
        shuffledOptions[questionIndex].forEach(({ text: option, originalIndex }) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "practice-pro__choice";
            button.textContent = option;
            button.addEventListener("click", () => {
                answers.set(questionIndex, originalIndex);
                choices.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
                button.classList.add("is-selected");
            });
            choices.appendChild(button);
        });
        card.appendChild(counter);
        card.appendChild(prompt);
        card.appendChild(choices);
        list.appendChild(card);
    });
    root.appendChild(list);

    const speakingScores = [];
    if (practice.speaking) {
        const speaking = document.createElement("article");
        speaking.className = "practice-pro__panel";
        const body = document.createElement("div");
        body.className = "practice-pro__body";
        const heading = document.createElement("h5");
        heading.textContent = "Teacher-scored speaking task";
        const prompt = document.createElement("p");
        prompt.className = "practice-pro__prompt";
        prompt.textContent = practice.speaking.prompt || "";
        body.appendChild(heading);
        body.appendChild(prompt);
        safeArr(practice.speaking.criteria).forEach((criterion, index) => {
            const row = document.createElement("label");
            row.className = "practice-pro__line";
            const text = document.createElement("span");
            text.textContent = criterion;
            const select = document.createElement("select");
            select.className = "practice-pro__input";
            [[0, "0 - Not demonstrated"], [1, "1 - With support"], [2, "2 - Independent"]].forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = String(value);
                option.textContent = label;
                select.appendChild(option);
            });
            speakingScores[index] = select;
            row.appendChild(text);
            row.appendChild(select);
            body.appendChild(row);
        });
        speaking.appendChild(body);
        root.appendChild(speaking);
    }

    const result = document.createElement("div");
    result.className = "practice-pro__feedback";
    const submit = document.createElement("button");
    submit.type = "button";
    submit.className = "btn btn--primary";
    submit.textContent = "Submit final assessment";
    submit.addEventListener("click", () => {
        if (answers.size < questions.length) {
            result.className = "practice-pro__feedback is-no";
            result.textContent = `Answer all questions first (${answers.size}/${questions.length} completed).`;
            return;
        }
        const objectiveScore = questions.reduce((score, question, index) => score + (answers.get(index) === question.correctIndex ? 1 : 0), 0);
        const speakingScore = speakingScores.reduce((score, select) => score + Number(select.value || 0), 0);
        const objectivePercent = questions.length ? Math.round((objectiveScore / questions.length) * 100) : 0;
        const overallMax = questions.length + speakingScores.length * 2;
        const overallScore = objectiveScore + speakingScore;
        const overallPercent = overallMax ? Math.round((overallScore / overallMax) * 100) : 0;
        const level = lesson?.meta?.level || "Beginner";
        const recommendations = {
            Beginner: {
                ready: "Ready for Pre-Intermediate.",
                review: "Continue, but review weak Beginner topics first.",
                repeat: "Repeat Cumulative Review 1 before moving on.",
            },
            "Pre-Intermediate": {
                ready: "Ready for Intermediate.",
                review: "Continue, but review weak Pre-Intermediate topics first.",
                repeat: "Repeat Cumulative Review 2 before moving on.",
            },
            Intermediate: {
                ready: "Intermediate outcomes achieved; move to advanced expansion and real-life fluency work.",
                review: "Review weak Intermediate topics before advanced expansion.",
                repeat: "Repeat Cumulative Review 3 before moving on.",
            },
        };
        const messages = recommendations[level] || recommendations.Beginner;
        const recommendation = practice.placementMode
            ? objectivePercent >= 72
                ? "Recommended starting level: Intermediate. Review any missed Pre-Intermediate skills first."
                : objectivePercent >= 39
                    ? "Recommended starting level: Pre-Intermediate."
                    : "Recommended starting level: Beginner."
            : overallPercent >= 80
                ? messages.ready
                : overallPercent >= 60
                    ? messages.review
                    : messages.repeat;
        result.className = "practice-pro__feedback is-ok";
        result.textContent = practice.placementMode
            ? `Placement score: ${objectiveScore}/${questions.length} (${objectivePercent}%). ${recommendation}`
            : `Objective: ${objectiveScore}/${questions.length} (${objectivePercent}%). Speaking: ${speakingScore}/${speakingScores.length * 2}. Overall: ${overallPercent}%. ${recommendation}`;
        setStudentProgressField("practice", true);
    });
    root.appendChild(submit);
    root.appendChild(result);
    container.appendChild(root);
    renderSectionStatus(container, "practice");
}

function renderPracticeTabClean(container, lesson) {
    const practice = lesson.practice || {};
    const sections = safeArr(practice.sections);
    const sectionA = sections.find((s) => String(s.title || "").startsWith("A")) || sections[0] || {};
    const sectionB = sections.find((s) => String(s.title || "").startsWith("B"))
        || sections[1]
        || (practice.separateExerciseTypes ? sections[0] : null)
        || {};
    const sectionC = sections.find((s) => String(s.title || "").startsWith("C")) || sections[2] || {};
    let activeStage = "recognition";
    let completed = new Set();

    const root = document.createElement("div");
    root.className = "practice-pro";

    const header = document.createElement("div");
    header.className = "practice-pro__header";
    const headerText = document.createElement("div");
    const title = document.createElement("h4");
    title.textContent = "Practice";
    const subtitle = document.createElement("p");
    subtitle.textContent = "Choose one exercise type and review at your own pace.";
    headerText.appendChild(title);
    headerText.appendChild(subtitle);

    const progressWrap = document.createElement("div");
    progressWrap.className = "practice-pro__progress";
    const progressNumber = document.createElement("strong");
    const progressLabel = document.createElement("span");
    progressLabel.textContent = "complete";
    progressWrap.appendChild(progressNumber);
    progressWrap.appendChild(progressLabel);
    header.appendChild(headerText);
    const arabeezyToggle = document.createElement("button");
    arabeezyToggle.type = "button";
    arabeezyToggle.className = "btn btn--outline btn--sm";
    arabeezyToggle.textContent = "Hide Arabizi";
    arabeezyToggle.addEventListener("click", () => {
        const hidden = root.classList.toggle("practice-pro--hide-arabeezy");
        arabeezyToggle.textContent = hidden ? "Show Arabizi" : "Hide Arabizi";
    });
    header.appendChild(arabeezyToggle);
    header.appendChild(progressWrap);

    const nav = document.createElement("div");
    nav.className = "practice-pro__nav";
    nav.setAttribute("role", "tablist");
    nav.setAttribute("aria-label", "Practice exercise types");

    const stageArea = document.createElement("div");
    stageArea.className = "practice-pro__stage";

    let stages = [
        {
            id: "recognition",
            label: "A) Recognition",
            desc: "Understand the phrase before answering.",
            count: safeArr(practice.quiz).slice(0, 5).length + safeArr(sectionA.matching).length + safeArr(sectionA.multipleChoice).length,
        },
        {
            id: "controlled",
            label: "B) Controlled",
            desc: "Build correct sentences with help.",
            count: safeArr(sectionB.fillInTheBlank).length
                + safeArr(sectionB.correctTheMistake).length
                + safeArr(sectionB.reorderSentences).length,
        },
        {
            id: "real",
            label: "C) Real Use",
            desc: "Use the phrases in real situations.",
            count: Math.min(
                safeArr(practice.translation).length + safeArr(sectionC.translation).length,
                Number(practice.maxTranslationItems) || Infinity
            ) + safeArr(practice.rolePlays).length,
        },
    ].filter((stage) => stage.id !== "real" || practice.showRealUse !== false);
    if (practice.separateExerciseTypes) {
        stages = [
            { id: "recognition", label: "Recognition", desc: "Review meanings before building sentences.", count: safeArr(practice.quiz).slice(0, 5).length + safeArr(sectionA.matching).length + safeArr(sectionA.multipleChoice).length },
            { id: "fill", label: "Fill in the missing word", desc: "Complete one focused sentence at a time.", count: safeArr(sectionB.fillInTheBlank).length },
            { id: "correct", label: "Correct the sentence", desc: "Find the grammar mistake and correct it.", count: safeArr(sectionB.correctTheMistake).length },
            { id: "reorder", label: "Rearrange the words", desc: "Build a natural Palestinian Arabic sentence.", count: safeArr(sectionB.reorderSentences).length },
        ].filter((stage) => stage.count > 0);
    }

    function normalizeAnswer(value) {
        return String(value || "").replace(/[،.؟!?\s]/g, "").trim();
    }

    const englishCueByAnswer = new Map(Object.entries({
        "Ø¨ÙŽØ±Ù’ÙƒÙŽØ¨": "ride / take", "Ø²ÙŽØ­Ù’Ù…ÙŽØ©": "traffic", "Ù‚ÙŽØ¯Ù‘ÙÙŠØ´": "how much", "Ù„ÙŽÙˆْ": "if / please", "Ù…ÙØ´Ù’ÙˆÙŽØ§Ø±": "trip / errand",
        "Ø¨ÙŽØ¯Ù’Ø±ÙØ³": "study", "Ø¨ÙØªÙØ´Ù’ØªÙŽØºÙ’Ù„Ùي": "work - you, feminine", "Ø¨ÙÙƒÙŽÙ…Ù‘Ùل": "finish - he", "Ø¨ÙÙ†Ù’Ø±ÙŽØ§Ø¬ÙØ¹": "review - we", "Ø¨ÙØ´Ù’ØªÙØºÙ’Ù„ÙÙˆØ§": "work - they", "Ø¨ÙÙ€": "by / per",
        "Ù…Ùن": "than / from", "ÙƒÙŽØ§ن": "was", "Ø±ÙŽØ§Ø­": "will", "ÙÙي": "there is / in", "Ø£ÙŽØ´Ù’ØªÙØ±Ùي": "buy", "Ø³ÙØ¹ÙØ±": "price", "ÙƒÙÙŠÙ„ÙÙˆ": "kilo", "Ø¨ÙÙ„ÙŽÙˆْن": "in a color",
        "Ù†Ùي": "me - object suffix", "Ø¹ÙÙ†Ù’Ø¯": "with / at", "Ø§ÙØ±Ù’Ø¬ÙŽØ¹": "come back", "Ù‚ÙŽØ§Ø³ÙŽØª": "measured - she",
        "ØªÙŽØ­Ù’Øª": "under", "ÙˆÙŽØ±ÙŽØ§": "behind", "Ù…ÙŽØ³Ù’Ø¯ÙÙˆØ¯ÙŽØ©": "blocked - feminine", "ØµÙŽÙ„Ù‘ÙŽØ­": "fixed - he",
        "Ù„ÙŽØ£ÙŽÙ†Ù‘ÙŽÙ‡ÙŽØ§": "because it is - feminine", "Ø¨ÙŽØ³": "but", "Ù…ÙŽØ¹": "although / with", "Ù†ÙŽÙÙ’Ø³": "same", "Ø£ÙŽØ­Ù’ÙƒÙي": "talk", "Ø­َلّ": "solution", "Ø­ÙŽÙ‚Ù‘Ùي": "my right", "ÙŠÙÙŠØ¬Ùي": "come - he",
        "Ù†ÙŽØ§ÙˆÙي/Ù†ÙŽØ§ÙˆÙ’ÙŠÙŽØ©": "planning / intending", "Ø¨ÙÙ†Ù’Ø£ÙŽØ¬Ù‘Ùل": "we postpone", "Ø¨ÙŽØ¹Ù’Ø¯": "after", "ØªÙØ´Ùيل": "carry / take", "ÙÙŽØ±ÙŽØ§ØºÙي": "my free time", "Ù‚ÙŽØ¨ْل": "before", "Ù…ÙŽØ±Ù‘ÙŽØªÙين": "twice", "Ù†ÙŽØ§Ø¯ÙØ±Ù‹Ø§": "rarely", "Ø¹ÙŽØ´ÙŽØ§ن": "because",
        "Ù…ÙŽØ²ÙŽØ§Ø¬Ùي": "my mood", "Ù…ÙŽØ¶Ù’ØºÙÙˆØ·/Ù…ÙŽØ¶Ù’ØºÙÙˆØ·ÙŽØ©": "stressed", "Ø®ÙØ¯/Ø®ÙØ¯Ùي": "take - masculine/feminine", "Ø·ÙŽÙ…Ù‘ÙÙ†Ù‘Ùي": "reassure me"
    }).map(([answer, cue]) => [normalizeAnswer(answer), cue]));

    function englishCueFor(item) {
        if (/\([^)]*[A-Za-z][^)]*\)/.test(String(item.prompt || ""))) return "";
        return item.cueEn || englishCueByAnswer.get(normalizeAnswer(item.answer)) || "";
    }

    function recognitionPromptInEnglish(value) {
        const text = String(value || "").trim();
        const quoted = text.match(/[«“\"]([^»”\"]+)[»”\"]/);
        if (quoted && /(Ù…ÙŽØ¹ْ?ن|Ù…Ø¹Ù†Ø§)/.test(text)) return `Choose the English meaning of ${quoted[1]}.`;
        if (/^Ùƒ[َ]?Ù…Ù‘Ùل/.test(text)) return `Complete the sentence: ${text.replace(/^Ùƒ[َ]?Ù…Ù‘Ùل\s*:?\s*/, "")}`;
        if (/^[«“\"]/.test(text) && quoted) return `Choose the correct meaning or use of ${quoted[1]}.`;
        return /[A-Za-z]{4}/.test(text) ? text : `Choose the correct answer: ${text}`;
    }

    function setProgress() {
        const total = stages.length;
        progressNumber.textContent = `${completed.size}/${total}`;
        if (completed.size >= total) setStudentProgressField("practice", true);
    }

    function markStageDone(stageId) {
        completed.add(stageId);
        setProgress();
        renderNav();
    }

    function makeButton(text, className = "btn btn--outline btn--sm") {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = className;
        btn.textContent = text;
        return btn;
    }

    function feedback(text = "") {
        const fb = document.createElement("div");
        fb.className = "practice-pro__feedback";
        fb.textContent = text;
        return fb;
    }

    function setFeedback(fb, ok, text) {
        fb.className = ok ? "practice-pro__feedback is-ok" : "practice-pro__feedback is-no";
        fb.textContent = text;
    }

    function stageShell(stage) {
        stageArea.innerHTML = "";
        const shell = document.createElement("div");
        shell.className = "practice-pro__panel";

        const head = document.createElement("div");
        head.className = "practice-pro__panel-head";
        const h = document.createElement("h5");
        h.textContent = stage.label;
        const p = document.createElement("p");
        p.textContent = stage.desc;
        head.appendChild(h);
        head.appendChild(p);

        const body = document.createElement("div");
        body.className = "practice-pro__body";
        shell.appendChild(head);
        shell.appendChild(body);
        stageArea.appendChild(shell);
        return body;
    }

    function renderNav() {
        nav.innerHTML = "";
        stages.forEach((stage) => {
            const btn = makeButton(stage.label, "practice-pro__tab");
            btn.setAttribute("role", "tab");
            btn.classList.toggle("is-active", stage.id === activeStage);
            btn.classList.toggle("is-done", completed.has(stage.id));
            btn.setAttribute("aria-selected", String(stage.id === activeStage));
            btn.innerHTML = `<span>${stage.label}</span><small>${stage.count || 0} items</small>`;
            btn.addEventListener("click", () => {
                activeStage = stage.id;
                renderNav();
                renderStage();
            });
            nav.appendChild(btn);
        });
    }

    function renderChoiceCard(parent, promptText, options, correctValue, isArabic = false) {
        const card = document.createElement("article");
        card.className = "practice-pro__card";
        const prompt = document.createElement("div");
        prompt.className = isArabic ? "practice-pro__arabic" : "practice-pro__prompt";
        prompt.textContent = promptText || "";
        const choices = document.createElement("div");
        choices.className = "practice-pro__choices";
        const fb = feedback();
        safeArr(options).forEach((option) => {
            const btn = makeButton(option, "practice-pro__choice");
            btn.addEventListener("click", () => {
                choices.querySelectorAll("button").forEach((b) => b.classList.remove("is-ok", "is-no"));
                const ok = option === correctValue;
                btn.classList.add(ok ? "is-ok" : "is-no");
                setFeedback(fb, ok, ok ? "Correct" : `Answer: ${correctValue}`);
            });
            choices.appendChild(btn);
        });
        card.appendChild(prompt);
        card.appendChild(choices);
        card.appendChild(fb);
        parent.appendChild(card);
    }

    function renderChoiceDrill(parent, items) {
        if (!items.length) return;
        let index = 0;
        const shell = document.createElement("article");
        shell.className = "practice-pro__drill";
        const counter = document.createElement("div");
        counter.className = "practice-pro__counter";
        const prompt = document.createElement("div");
        const choices = document.createElement("div");
        choices.className = "practice-pro__choices";
        const fb = feedback();
        const controls = document.createElement("div");
        controls.className = "practice-pro__controls";
        const prev = makeButton("Previous", "btn btn--ghost btn--sm");
        const next = makeButton("Next", "btn btn--ghost btn--sm");

        function paint() {
            const item = items[index];
            counter.textContent = `${index + 1} / ${items.length}`;
            prompt.className = item.isArabic ? "practice-pro__arabic" : "practice-pro__prompt";
            prompt.textContent = item.prompt || "";
            choices.innerHTML = "";
            fb.textContent = "";
            fb.className = "practice-pro__feedback";
            safeArr(item.options).forEach((option) => {
                const btn = makeButton(option, "practice-pro__choice");
                btn.addEventListener("click", () => {
                    choices.querySelectorAll("button").forEach((b) => b.classList.remove("is-ok", "is-no"));
                    const ok = option === item.correct;
                    btn.classList.add(ok ? "is-ok" : "is-no");
                    setFeedback(fb, ok, ok ? "Correct" : `Answer: ${item.correct}`);
                });
                choices.appendChild(btn);
            });
        }

        prev.addEventListener("click", () => {
            index = (index - 1 + items.length) % items.length;
            paint();
        });
        next.addEventListener("click", () => {
            index = (index + 1) % items.length;
            paint();
        });

        controls.appendChild(prev);
        controls.appendChild(next);
        shell.appendChild(counter);
        shell.appendChild(prompt);
        shell.appendChild(choices);
        shell.appendChild(fb);
        shell.appendChild(controls);
        parent.appendChild(shell);
        paint();
    }

    function renderRecognition() {
        const stage = stages[0];
        const body = stageShell(stage);
        const choiceItems = [
            ...safeArr(practice.quiz).slice(0, 5).map((q) => {
                const options = safeArr(q.optionsEn);
                return {
                    prompt: recognitionPromptInEnglish(q.questionAr),
                    options,
                    correct: options[q.correctIndex],
                    isArabic: true,
                };
            }),
            ...safeArr(sectionA.multipleChoice).map((item) => ({
                prompt: item.prompt,
                options: item.options,
                correct: item.correct,
                isArabic: false,
            })),
        ];
        renderChoiceDrill(body, choiceItems);

        if (safeArr(sectionA.matching).length) {
            const match = document.createElement("div");
            match.className = "practice-pro__match-board";

            const promptCol = document.createElement("div");
            promptCol.className = "practice-pro__match-col";
            const answerCol = document.createElement("div");
            answerCol.className = "practice-pro__match-col";

            const promptTitle = document.createElement("div");
            promptTitle.className = "practice-pro__match-title";
            promptTitle.textContent = "Arabic";
            const answerTitle = document.createElement("div");
            answerTitle.className = "practice-pro__match-title";
            answerTitle.textContent = "Choose the matching number";
            promptCol.appendChild(promptTitle);
            answerCol.appendChild(answerTitle);

            const matchingItems = safeArr(sectionA.matching);
        matchingItems.forEach((item, idx) => {
                const promptRow = document.createElement("div");
                promptRow.className = "practice-pro__match-prompt";
                const number = document.createElement("span");
                number.className = "practice-pro__match-number";
                number.textContent = String(idx + 1);
                const ar = document.createElement("span");
                ar.className = "practice-pro__arabic";
                ar.textContent = item.ar || "";
                if (item.arabeezy) {
                    const arabeezy = document.createElement("small");
                    arabeezy.className = "practice-pro__arabeezy";
                    arabeezy.textContent = item.arabeezy;
                    ar.appendChild(arabeezy);
                }
                promptRow.appendChild(number);
                promptRow.appendChild(ar);
                promptCol.appendChild(promptRow);
            });

            shuffleArray(matchingItems.map((item, idx) => ({ ...item, matchNumber: idx + 1 }))).forEach((item) => {
                const answerRow = document.createElement("div");
                answerRow.className = "practice-pro__match-answer";
                const select = document.createElement("select");
                select.className = "practice-pro__match-select";
                const empty = document.createElement("option");
                empty.value = "";
                empty.textContent = "#";
                select.appendChild(empty);
                matchingItems.forEach((_candidate, idx) => {
                    const option = document.createElement("option");
                    option.value = String(idx + 1);
                    option.textContent = String(idx + 1);
                    select.appendChild(option);
                });
                const text = document.createElement("span");
                text.textContent = item.en || "";
                const fb = document.createElement("span");
                fb.className = "practice-pro__match-status";
                select.addEventListener("change", () => {
                    const ok = Number(select.value) === item.matchNumber;
                    answerRow.classList.toggle("is-ok", ok);
                    answerRow.classList.toggle("is-no", Boolean(select.value) && !ok);
                    fb.textContent = ok ? "Correct" : (select.value ? "Try again" : "");
                });
                answerRow.appendChild(select);
                answerRow.appendChild(text);
                answerRow.appendChild(fb);
                answerCol.appendChild(answerRow);
            });

            match.appendChild(promptCol);
            match.appendChild(answerCol);
            body.appendChild(match);
        }

        const done = makeButton("Finish Recognition", "btn btn--primary btn--sm");
        done.addEventListener("click", () => {
            markStageDone("recognition");
            const nextStage = stages[1];
            if (nextStage) {
                activeStage = nextStage.id;
                renderStage();
            }
        });
        body.appendChild(done);
    }

    function renderControlled(stageId = "controlled") {
        const stage = stages.find((item) => item.id === stageId) || stages[1];
        const body = stageShell(stage);
        let responseItems = [
            ...safeArr(sectionB.fillInTheBlank).map((item) => ({ ...item, instruction: "Fill in the missing word." })),
            ...safeArr(sectionB.correctTheMistake).map((item) => ({ ...item, instruction: "Correct the sentence." })),
        ];
        if (practice.separateExerciseTypes) {
            if (stageId === "fill") responseItems = safeArr(sectionB.fillInTheBlank).map((item) => ({ ...item, instruction: "Fill in the missing word." }));
            else if (stageId === "correct") responseItems = safeArr(sectionB.correctTheMistake).map((item) => ({ ...item, instruction: "Correct the sentence." }));
            else responseItems = [];
        }
        const responseDeck = document.createElement("div");
        const responseCards = [];

        responseItems.forEach((item, itemIndex) => {
            const card = document.createElement("article");
            card.className = "practice-pro__card";
            const counter = document.createElement("div");
            counter.className = "practice-pro__counter";
            counter.textContent = `${itemIndex + 1} / ${responseItems.length}`;
            const instruction = document.createElement("p");
            instruction.className = "practice-pro__hint";
            const cue = englishCueFor(item);
            instruction.textContent = cue ? `${item.instruction} English cue: ${cue}.` : item.instruction;
            const prompt = document.createElement("div");
            prompt.className = "practice-pro__arabic";
            prompt.textContent = item.prompt || "";
            const readingHelp = document.createElement("p");
            readingHelp.className = "practice-pro__hint";
            readingHelp.classList.add("practice-pro__arabeezy");
            readingHelp.textContent = item.arabeezy ? `Read it: ${item.arabeezy}` : "";
            const row = document.createElement("div");
            row.className = "practice-pro__line";
            const input = document.createElement("input");
            input.className = "practice-pro__input";
            input.type = "text";
            input.placeholder = stageId === "correct" ? "Type the corrected sentence" : "Type the missing word";
            const check = makeButton("Check");
            const fb = feedback();
            check.addEventListener("click", () => {
                const ok = normalizeAnswer(input.value) === normalizeAnswer(item.answer);
                setFeedback(fb, ok, ok ? "Correct" : `Answer: ${item.answer}`);
            });
            row.appendChild(input);
            row.appendChild(check);
            card.appendChild(counter);
            card.appendChild(instruction);
            card.appendChild(prompt);
            if (item.arabeezy) card.appendChild(readingHelp);
            card.appendChild(row);
            card.appendChild(fb);
            card.classList.toggle("hidden", itemIndex !== 0);
            responseCards.push(card);
            responseDeck.appendChild(card);
        });
        body.appendChild(responseDeck);

        if (responseCards.length > 1) {
            let responseIndex = 0;
            const controls = document.createElement("div");
            controls.className = "practice-pro__controls";
            const previous = makeButton("Previous", "btn btn--ghost btn--sm");
            const next = makeButton("Next exercise", "btn btn--outline btn--sm");
            const showResponse = (nextIndex) => {
                responseCards[responseIndex].classList.add("hidden");
                responseIndex = (nextIndex + responseCards.length) % responseCards.length;
                responseCards[responseIndex].classList.remove("hidden");
            };
            previous.addEventListener("click", () => showResponse(responseIndex - 1));
            next.addEventListener("click", () => showResponse(responseIndex + 1));
            controls.appendChild(previous);
            controls.appendChild(next);
            body.appendChild(controls);
        }

        const reorderItems = !practice.separateExerciseTypes || stageId === "reorder"
            ? safeArr(sectionB.reorderSentences)
            : [];
        reorderItems.forEach((item) => {
            const card = document.createElement("article");
            card.className = "practice-pro__card";
            const prompt = document.createElement("p");
            prompt.className = "practice-pro__hint";
            prompt.textContent = item.prompt || "Put the words in order.";
            if (item.arabeezy) {
                const arabeezy = document.createElement("span");
                arabeezy.className = "practice-pro__arabeezy";
                arabeezy.textContent = `Read it: ${item.arabeezy}`;
                prompt.appendChild(arabeezy);
            }
            const answer = document.createElement("div");
            answer.className = "practice-pro__answer-bank";
            const bank = document.createElement("div");
            bank.className = "practice-pro__chips";
            const selected = [];

            safeArr(item.words).forEach((word) => {
                const chip = makeButton(word, "practice-pro__chip");
                chip.addEventListener("click", () => {
                    selected.push(word);
                    chip.disabled = true;
                    chip.classList.add("is-used");
                    const chosen = makeButton(word, "practice-pro__chip is-selected");
                    chosen.addEventListener("click", () => {
                        const index = selected.indexOf(word);
                        if (index > -1) selected.splice(index, 1);
                        chosen.remove();
                        chip.disabled = false;
                        chip.classList.remove("is-used");
                    });
                    answer.appendChild(chosen);
                });
                bank.appendChild(chip);
            });

            const fb = feedback();
            const check = makeButton("Check order");
            check.addEventListener("click", () => {
                const ok = normalizeAnswer(selected.join(" ")) === normalizeAnswer(item.answer);
                setFeedback(fb, ok, ok ? "Correct" : `Answer: ${item.answer}`);
            });
            card.appendChild(prompt);
            card.appendChild(answer);
            card.appendChild(bank);
            card.appendChild(check);
            card.appendChild(fb);
            body.appendChild(card);
        });

        const done = makeButton(`Finish ${stage.label}`, "btn btn--primary btn--sm");
        done.addEventListener("click", () => {
            markStageDone(stage.id);
            const currentIndex = stages.findIndex((item) => item.id === stage.id);
            const nextStage = stages[currentIndex + 1];
            if (nextStage) {
                activeStage = nextStage.id;
                renderStage();
            }
        });

        const isLastPracticeStage = stages[stages.length - 1]?.id === stage.id;
        if (practice.showRealUse === false && isLastPracticeStage && safeArr(practice.rolePlays).length) {
            const situation = document.createElement("article");
            situation.className = "practice-pro__situation";
            const badge = document.createElement("span");
            badge.textContent = "Speaking situation";
            const situationText = document.createElement("p");
            situationText.textContent = practice.rolePlays[0];
            situation.appendChild(badge);
            situation.appendChild(situationText);
            body.appendChild(situation);
        }
        body.appendChild(done);
    }

    function renderRealUse() {
        const stage = stages[2];
        const body = stageShell(stage);
        const allTranslations = safeArr(practice.translation).length
            ? safeArr(practice.translation)
            : safeArr(sectionC.translation);
        const translations = allTranslations.slice(0, Number(practice.maxTranslationItems) || allTranslations.length);

        if (translations.length) {
            const slider = document.createElement("div");
            slider.className = "practice-pro__translation";
            let index = 0;
            const card = document.createElement("article");
            card.className = "practice-pro__translate-card";
            const counter = document.createElement("div");
            counter.className = "practice-pro__counter";
            const direction = document.createElement("div");
            direction.className = "practice-pro__translate-direction";
            const prompt = document.createElement("div");
            prompt.className = "practice-pro__translate-prompt";
            const response = document.createElement("textarea");
            response.className = "practice-pro__translate-input";
            response.rows = 3;
            response.placeholder = "Write your translation here...";
            const answer = document.createElement("div");
            answer.className = "practice-pro__translate-answer hidden";
            const controls = document.createElement("div");
            controls.className = "practice-pro__controls";
            const prev = makeButton("Previous", "btn btn--ghost btn--sm");
            const show = makeButton("Show answer", "btn btn--outline btn--sm");
            const next = makeButton("Next", "btn btn--ghost btn--sm");
            const selfCheck = document.createElement("div");
            selfCheck.className = "practice-pro__self-check hidden";
            const gotIt = makeButton("Got it", "practice-pro__self-btn");
            const needsWork = makeButton("Need practice", "practice-pro__self-btn");
            const selfStatus = document.createElement("span");
            selfStatus.className = "practice-pro__self-status";
            selfCheck.appendChild(gotIt);
            selfCheck.appendChild(needsWork);
            selfCheck.appendChild(selfStatus);

            function paintTranslation() {
                const item = translations[index];
                counter.textContent = `${index + 1} / ${translations.length}`;
                const sourceIsArabic = item.type === "arToEn";
                const source = sourceIsArabic
                    ? (item.textAr || item.ar || "")
                    : (item.textEn || item.en || "");
                const target = sourceIsArabic
                    ? (item.textEn || item.en || "")
                    : (item.textAr || item.ar || "");
                direction.textContent = sourceIsArabic ? "Arabic -> English" : "English -> Arabic";
                prompt.textContent = source;
                prompt.classList.toggle("is-arabic", sourceIsArabic);
                if (sourceIsArabic && item.textArabeezy) {
                    prompt.textContent = `${source}\n${item.textArabeezy}`;
                }
                answer.textContent = target;
                answer.classList.toggle("is-arabic", !sourceIsArabic);
                answer.classList.add("hidden");
                response.value = "";
                selfCheck.classList.add("hidden");
                selfStatus.textContent = "";
                gotIt.classList.remove("is-ok");
                needsWork.classList.remove("is-no");
                show.textContent = "Show answer";
            }

            prev.addEventListener("click", () => {
                index = (index - 1 + translations.length) % translations.length;
                paintTranslation();
            });
            next.addEventListener("click", () => {
                index = (index + 1) % translations.length;
                paintTranslation();
            });
            show.addEventListener("click", () => {
                answer.classList.toggle("hidden");
                show.textContent = answer.classList.contains("hidden") ? "Show answer" : "Hide answer";
                selfCheck.classList.toggle("hidden", answer.classList.contains("hidden"));
            });
            gotIt.addEventListener("click", () => {
                gotIt.classList.add("is-ok");
                needsWork.classList.remove("is-no");
                selfStatus.textContent = "Nice. Move to the next one.";
            });
            needsWork.addEventListener("click", () => {
                needsWork.classList.add("is-no");
                gotIt.classList.remove("is-ok");
                selfStatus.textContent = "Mark it for review and try it again.";
            });

            controls.appendChild(prev);
            controls.appendChild(show);
            controls.appendChild(next);
            card.appendChild(counter);
            card.appendChild(direction);
            card.appendChild(prompt);
            card.appendChild(response);
            card.appendChild(answer);
            card.appendChild(selfCheck);
            card.appendChild(controls);
            slider.appendChild(card);
            body.appendChild(slider);
            paintTranslation();
        }

        const rolePlays = safeArr(practice.rolePlays);
        if (rolePlays.length) {
            const sims = document.createElement("div");
            sims.className = "practice-pro__situations";
            rolePlays.forEach((text, idx) => {
                const item = document.createElement("article");
                item.className = "practice-pro__situation";
                const badge = document.createElement("span");
                badge.textContent = `Situation ${idx + 1}`;
                const p = document.createElement("p");
                p.textContent = text;
                item.appendChild(badge);
                item.appendChild(p);
                sims.appendChild(item);
            });
            body.appendChild(sims);
        }

        if (practice.showWriting !== false) {
            const writingPrompts = safeArr(sectionC.writeYourOwnSentences);
            const write = document.createElement("div");
            write.className = "practice-pro__write";
            const label = document.createElement("label");
            label.textContent = "Write your own sentences";
            const help = document.createElement("p");
            help.textContent = writingPrompts.length
                ? writingPrompts.slice(0, 2).join(" ")
                : "Write 5-10 short sentences using the phrases from this lesson.";
            const textarea = document.createElement("textarea");
            textarea.className = "homework-notes";
            textarea.rows = 5;
            textarea.placeholder = "Write 5-10 short sentences here...";
            write.appendChild(label);
            write.appendChild(help);
            write.appendChild(textarea);
            body.appendChild(write);
        }

        const done = makeButton("Finish Practice", "btn btn--primary btn--sm");
        done.addEventListener("click", () => markStageDone("real"));
        body.appendChild(done);
    }

    function renderStage() {
        if (activeStage === "recognition") renderRecognition();
        else if (activeStage === "real") renderRealUse();
        else renderControlled(activeStage);
    }

    container.appendChild(root);
    root.appendChild(header);
    root.appendChild(nav);
    root.appendChild(stageArea);

    const doneAll = makeButton("Mark Practice as Done", "btn btn--outline btn--sm");
    doneAll.addEventListener("click", () => {
        completed = new Set(stages.map((stage) => stage.id));
        setProgress();
        renderNav();
    });
    root.appendChild(doneAll);

    renderNav();
    setProgress();
    renderStage();
    renderSectionStatus(container, "practice");
}

// Homework
function renderHomeworkTab(container, lesson) {
    if (lesson?.meta?.curriculumId === "interactive") {
        return renderHomeworkTabClean(container, lesson);
    }
    return renderHomeworkTabLegacy(container, lesson);
}
function renderHomeworkTabClean(container, lesson) {
    const student = getCurrentStudent();
    const progress = student && getStudentProgress(student, appState.currentLessonId);
    const tasks = safeArr(lesson.homework?.tasks);
    const taskState = new Set();

    if (!tasks.length) {
        const title = document.createElement("h4");
        title.className = "td-lessonitem__title";
        title.textContent = "Homework";

        const card = document.createElement("div");
        card.className = "homework-simple homework-simple--plain";

        const text = document.createElement("p");
        text.className = "homework-text homework-simple__text";
        text.textContent = lesson.homework?.instructions || "No homework assigned yet.";
        card.appendChild(text);

        const complete = document.createElement("label");
        complete.className = "homework-simple__complete";
        const check = document.createElement("input");
        check.type = "checkbox";
        check.checked = progress && progress.homework;
        const checkText = document.createElement("span");
        checkText.textContent = "Homework assigned / completed";
        complete.appendChild(check);
        complete.appendChild(checkText);
        check.addEventListener("change", () => setStudentProgressField("homework", check.checked));

        container.appendChild(title);
        container.appendChild(card);
        container.appendChild(complete);
        renderSectionStatus(container, "homework");
        return;
    }

    const root = document.createElement("div");
    root.className = "homework-pro";

    const header = document.createElement("div");
    header.className = "homework-pro__header";
    const h = document.createElement("h4");
    h.textContent = "Homework";
    const p = document.createElement("p");
    p.textContent = lesson.homework?.instructions || "Complete the homework tasks.";
    const meter = document.createElement("div");
    meter.className = "homework-pro__meter";
    header.appendChild(h);
    header.appendChild(p);
    header.appendChild(meter);

    const notes = document.createElement("textarea");
    notes.className = "homework-notes homework-pro__notes";
    notes.placeholder = "Write homework answers or teacher notes here...";
    notes.value =
        (student &&
            student.homeworkNotes &&
            student.homeworkNotes[appState.currentLessonId]) ||
        "";
    notes.addEventListener("change", () => {
        if (!student) return;
        if (!student.homeworkNotes) student.homeworkNotes = {};
        student.homeworkNotes[appState.currentLessonId] = notes.value;
        saveStudentsToLS();
    });

    function updateMeter() {
        meter.textContent = `${taskState.size}/${tasks.length || 0} tasks done`;
        if (tasks.length && taskState.size === tasks.length) setStudentProgressField("homework", true);
    }

    const grid = document.createElement("div");
    grid.className = "homework-pro__grid";
    tasks.forEach((task, idx) => {
        const card = document.createElement("article");
        card.className = "homework-pro__card";
        const badge = document.createElement("span");
        badge.className = "homework-pro__badge";
        badge.textContent = `Task ${idx + 1}`;
        const title = document.createElement("h5");
        title.textContent = task.title || "Homework task";
        const desc = document.createElement("p");
        desc.textContent = task.instructions || "";
        card.appendChild(badge);
        card.appendChild(title);
        card.appendChild(desc);

        if (safeArr(task.examples).length) {
            const examples = document.createElement("div");
            examples.className = "homework-pro__examples";
            safeArr(task.examples).forEach((example) => {
                const btn = document.createElement("button");
                btn.type = "button";
                btn.textContent = example;
                btn.addEventListener("click", () => {
                    notes.value = notes.value ? `${notes.value}\n${example}` : example;
                    notes.dispatchEvent(new Event("change"));
                    notes.focus();
                });
                examples.appendChild(btn);
            });
            card.appendChild(examples);
        }

        const done = document.createElement("label");
        done.className = "homework-pro__check";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const span = document.createElement("span");
        span.textContent = "Done";
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                taskState.add(idx);
                card.classList.add("is-done");
            } else {
                taskState.delete(idx);
                card.classList.remove("is-done");
            }
            updateMeter();
        });
        done.appendChild(checkbox);
        done.appendChild(span);
        card.appendChild(done);
        grid.appendChild(card);
    });

    const notesBlock = document.createElement("div");
    notesBlock.className = "homework-pro__notes-block";
    const notesTitle = document.createElement("label");
    notesTitle.textContent = "Answers / notes";
    notesBlock.appendChild(notesTitle);
    notesBlock.appendChild(notes);

    const footer = document.createElement("div");
    footer.className = "homework-pro__footer";
    const complete = document.createElement("label");
    complete.className = "homework-pro__complete";
    const completeCheck = document.createElement("input");
    completeCheck.type = "checkbox";
    completeCheck.checked = progress && progress.homework;
    const completeText = document.createElement("span");
    completeText.textContent = "Homework assigned / completed";
    complete.appendChild(completeCheck);
    complete.appendChild(completeText);
    completeCheck.addEventListener("change", () => setStudentProgressField("homework", completeCheck.checked));

    const doneAll = document.createElement("button");
    doneAll.type = "button";
    doneAll.className = "btn btn--primary btn--sm";
    doneAll.textContent = "Mark Homework as Done";
    doneAll.addEventListener("click", () => {
        completeCheck.checked = true;
        setStudentProgressField("homework", true);
    });
    footer.appendChild(complete);
    footer.appendChild(doneAll);

    root.appendChild(header);
    root.appendChild(grid);
    root.appendChild(notesBlock);
    root.appendChild(footer);
    container.appendChild(root);
    updateMeter();
    renderSectionStatus(container, "homework");
}

function renderReviewTab(container, lesson) {
    const title = document.createElement("h4");
    title.className = "td-lessonitem__title";
    title.textContent = "Quick Review - Flashcards";

    const all = [...lesson.vocabulary.core, ...lesson.vocabulary.extra];
    if (!all.length) {
        const p = document.createElement("p");
        p.textContent = "No vocabulary available for review.";
        container.appendChild(title);
        container.appendChild(p);
        renderSectionStatus(container, "review");
        return;
    }

    let pool = shuffleArray(all).slice(0, Math.min(5, all.length));
    let index = 0;
    let showFront = true;

    const card = document.createElement("div");
    card.className = "flashcard";
    const arEl = document.createElement("div");
    arEl.className = "flashcard__ar";
    const enEl = document.createElement("div");
    enEl.className = "flashcard__en";

    function renderCard() {
        const item = pool[index];
        if (showFront) {
            arEl.textContent = item.ar;
            enEl.textContent = "(tap to reveal meaning)";
            enEl.style.color = "#6b7280";
        } else {
            arEl.textContent = item.ar;
            enEl.textContent = item.en;
            enEl.style.color = "#111827";
        }
    }

    card.appendChild(arEl);
    card.appendChild(enEl);
    card.addEventListener("click", () => {
        showFront = !showFront;
        renderCard();
    });

    const controlsRow = document.createElement("div");
    controlsRow.style.display = "flex";
    controlsRow.style.justifyContent = "space-between";
    controlsRow.style.alignItems = "center";
    controlsRow.style.marginTop = "6px";

    const navButtons = document.createElement("div");
    navButtons.style.display = "flex";
    navButtons.style.gap = "6px";

    const btnPrev = document.createElement("button");
    btnPrev.className = "btn btn--ghost btn--sm";
    btnPrev.textContent = "Prev";
    btnPrev.addEventListener("click", () => {
        if (index > 0) {
            index--;
            showFront = true;
            renderCard();
        }
    });

    const btnNext = document.createElement("button");
    btnNext.className = "btn btn--ghost btn--sm";
    btnNext.textContent = "Next";
    btnNext.addEventListener("click", () => {
        if (index < pool.length - 1) {
            index++;
            showFront = true;
            renderCard();
        } else {
            alert("Nice! Quick review completed.");
            setStudentProgressField("review", true);
        }
    });

    const btnRandom = document.createElement("button");
    btnRandom.className = "btn btn--outline btn--sm";
    btnRandom.textContent = "Random";
    btnRandom.addEventListener("click", () => {
        index = Math.floor(Math.random() * pool.length);
        showFront = true;
        renderCard();
    });

    navButtons.appendChild(btnPrev);
    navButtons.appendChild(btnNext);
    navButtons.appendChild(btnRandom);

    const btnDone = document.createElement("button");
    btnDone.className = "btn btn--primary btn--sm";
    btnDone.textContent = "Mark Quick Review as Done";
    btnDone.addEventListener("click", () => setStudentProgressField("review", true));

    controlsRow.appendChild(navButtons);
    controlsRow.appendChild(btnDone);

    container.appendChild(title);
    container.appendChild(card);
    container.appendChild(controlsRow);

    renderCard();
    renderSectionStatus(container, "review");
}

// Teacher notes
function renderTeacherNotesTab(container, lesson) {
    const title = document.createElement("h4");
    title.className = "td-lessonitem__title";
    title.textContent = "Teacher Notes";

    const info = document.createElement("p");
    info.className = "teacher-edit-note";
    info.textContent =
        "Use this space to plan your flow, note common mistakes, or add extra prompts. Notes are saved locally on this device.";

    const textarea = document.createElement("textarea");
    textarea.className = "homework-notes";
    textarea.value = lesson.teacherNotes.myNotes || "";
    textarea.placeholder =
        "Lesson flow, timing, reminders about pronunciation, extra speaking prompts...";

    textarea.addEventListener("change", () => {
        lesson.teacherNotes.myNotes = textarea.value;
        saveLessonToLS(appState.currentLessonId);
        saveLessonToCloud(appState.currentLessonId);
    });

    container.appendChild(title);
    container.appendChild(info);
    container.appendChild(textarea);
}

// ========================= TEACHER MODE VISIBILITY =========================
function updateTeacherTabsVisibility() {
    const show = appState.teacherMode;
    $all(".lesson-tab--teacher-only").forEach((btn) => {
        btn.style.display = show ? "inline-flex" : "none";
    });
}

// ========================= TEACHER DASHBOARD =========================

function getLessonIdsSorted() {
    return Object.keys(lessons).sort((a, b) => {
        const la = lessons[a]?.meta?.level || "";
        const lb = lessons[b]?.meta?.level || "";
        const ua = lessons[a]?.meta?.unit || "";
        const ub = lessons[b]?.meta?.unit || "";
        const ta = lessons[a]?.meta?.lessonTitle || "";
        const tb = lessons[b]?.meta?.lessonTitle || "";
        return (la + ua + ta).localeCompare(lb + ub + tb);
    });
}

function getUniqueUnits() {
    const units = new Set();
    getLessonIdsSorted().forEach((id) => {
        const u = (lessons[id]?.meta?.unit || "").trim();
        if (u) units.add(u);
    });
    return Array.from(units).sort((a, b) => a.localeCompare(b));
}

function renderTeacherPicker() {
    const unitSel = document.getElementById("tdUnitSelect");
    const lessonSel = document.getElementById("tdLessonSelect");
    const sectionSel = document.getElementById("tdPickSection");
    const btnEdit = document.getElementById("tdEditSelected");
    const btnOpen = document.getElementById("tdOpenSelected");
    const btnDelete = document.getElementById("tdDeleteSelected");
    const btnSync = document.getElementById("tdSyncLessonsNow");

    // If picker UI isn't present, fall back to the full list
    if (!unitSel || !lessonSel || !sectionSel || !btnEdit || !btnOpen || !btnDelete) {
        // Avoid infinite recursion if the dashboard picker isn't in the DOM.
        // Fall back to rendering the long list if available.
        if (typeof renderTeacherLessonList === "function") {
            try { renderTeacherLessonList(); } catch { }
        }
        return;
    }

    // Hide the long list to reduce clutter (still present for compatibility)
    const listEl = document.getElementById("teacherLessonList");
    if (listEl) listEl.style.display = "none";

    const units = getUniqueUnits();
    const savedUnit = localStorage.getItem("td_selected_unit") || "";
    const savedLesson = localStorage.getItem("td_selected_lesson") || "";
    const savedPickSection = localStorage.getItem("td_pick_section") || "overview";

    // Fill unit select
    unitSel.innerHTML = "";
    const optAll = document.createElement("option");
    optAll.value = "";
    optAll.textContent = "All units";
    unitSel.appendChild(optAll);

    units.forEach((u) => {
        const opt = document.createElement("option");
        opt.value = u;
        opt.textContent = u;
        unitSel.appendChild(opt);
    });

    if (savedUnit && units.includes(savedUnit)) unitSel.value = savedUnit;

    // restore last picked section
    if (sectionSel) {
        sectionSel.value = savedPickSection;
        sectionSel.onchange = () => localStorage.setItem("td_pick_section", sectionSel.value || "overview");
    }

    function fillLessons() {
        const unit = unitSel.value;
        const ids = getLessonIdsSorted().filter((id) => {
            const u = (lessons[id]?.meta?.unit || "").trim();
            return !unit || u === unit;
        });

        lessonSel.innerHTML = "";
        const validIds = [];
        ids.forEach((id) => {
            const lesson = lessons[id];
            if (!lesson || !lesson.meta) return;
            const level = lesson.meta.level || "";
            const unitName = lesson.meta.unit || "";
            const title = lesson.meta.lessonTitle || "";
            if (!level || !unitName || !title) return;

            const opt = document.createElement("option");
            opt.value = id;
            opt.textContent = `${level} • ${unitName} • ${title}`;
            lessonSel.appendChild(opt);
            validIds.push(id);
        });

        // restore last selected lesson if still in filtered set
        if (savedLesson && validIds.includes(savedLesson)) lessonSel.value = savedLesson;
        else if (validIds.length) lessonSel.value = validIds[0];

        localStorage.setItem("td_selected_unit", unitSel.value || "");
        localStorage.setItem("td_selected_lesson", lessonSel.value || "");
    }

    fillLessons();

    unitSel.onchange = () => {
        localStorage.setItem("td_selected_unit", unitSel.value || "");
        fillLessons();
    };

    lessonSel.onchange = () => {
        localStorage.setItem("td_selected_lesson", lessonSel.value || "");
    };

    btnEdit.onclick = () => {
        const id = lessonSel.value;
        if (!id) return;
        const picked = (sectionSel && sectionSel.value) ? sectionSel.value : (localStorage.getItem("td_pick_section") || "overview");
        renderTeacherEditor(id, null, picked);
    };

    btnOpen.onclick = () => {
        const id = lessonSel.value;
        if (!id) return;
        appState.currentLessonId = id;
        goToLessonView({ teacherMode: false });
    };

    if (btnSync) {
        btnSync.onclick = async () => {
            await loadLessonsFromCloudOnce();
            // refresh picker lists
            renderTeacherPicker();
            alert("Synced lessons from online.");
        };
    }

    btnDelete.onclick = () => {
        const id = lessonSel.value;
        if (!id) return;
        if (!confirm("Delete this lesson template? This cannot be undone.")) return;
        delete lessons[id];
        localStorage.removeItem(LS_LESSON_PREFIX + id);
        try { deleteLessonFromCloud(id); } catch { }
        // refresh selects
        renderTeacherPicker();
        const editor = $("#teacherEditor");
        editor.style.display = "none";
        editor.innerHTML = "";
    };
}


function renderTeacherLessonList() {
    const listEl = $("#teacherLessonList");
    listEl.innerHTML = "";
    const ids = Object.keys(lessons);
    const q = (document.getElementById("tdLessonSearch")?.value || "").trim().toLowerCase();
    if (!ids.length) {
        const p = document.createElement("p");
        p.className = "empty-state";
        p.textContent =
            "No lesson templates yet. Use “Add New Lesson Template” to create your first lesson.";
        listEl.appendChild(p);
        return;
    }

    ids
        .filter((id) => {
            if (!q) return true;
            const lesson = lessons[id] || {};
            const hay = `${id} ${lesson?.meta?.level || ""} ${lesson?.meta?.unit || ""} ${lesson?.meta?.lessonTitle || ""}`.toLowerCase();
            return hay.includes(q);
        })
        .forEach((id) => {
            const lesson = lessons[id];
            const card = document.createElement("article");
            card.className = "td-lessonitem" + (appState.currentLessonId === id ? " td-lessonitem--active" : "");

            const title = document.createElement("h4");
            title.className = "td-lessonitem__title";
            title.textContent = `${lesson.meta.level} - ${lesson.meta.unit}`;

            const meta = document.createElement("p");
            meta.className = "td-lessonitem__meta";
            meta.textContent = lesson.meta.lessonTitle;

            const badge = document.createElement("span");
            badge.className = "td-lessonitem__id";
            badge.textContent = `ID: ${id}`;

            const actions = document.createElement("div");
            actions.className = "td-lessonitem__actions";

            const btnEdit = document.createElement("button");
            btnEdit.className = "btn btn--primary btn--sm";
            btnEdit.textContent = "Edit Lesson Content";
            btnEdit.addEventListener("click", () => {
                appState.currentLessonId = id;
                renderTeacherEditor(id, card);
            });




            const btnOpen = document.createElement("button");
            btnOpen.className = "btn btn--outline btn--sm";
            btnOpen.textContent = "Open Lesson View";
            btnOpen.addEventListener("click", () => {
                appState.currentLessonId = id;
                appState.teacherMode = false;
                $("#teacherModeToggle").checked = false;
                goToLessonView({ teacherMode: false });
            });

            const btnDelete = document.createElement("button");
            btnDelete.className = "btn btn--ghost btn--sm";
            btnDelete.textContent = "Delete Template";
            btnDelete.addEventListener("click", () => {
                if (
                    !confirm(
                        `Delete lesson template "${lesson.meta.lessonTitle}"?\nThis does not delete students' progress, but the lesson won't be available anymore.`
                    )
                )
                    return;
                delete lessons[id];
                localStorage.removeItem(LS_LESSON_PREFIX + id);
                deleteLessonFromCloud(id);
                const editor = $("#teacherEditor");
                editor.style.display = "none";
                editor.innerHTML = "";
                renderTeacherPicker();
            });

            actions.appendChild(btnEdit);
            actions.appendChild(btnOpen);
            actions.appendChild(btnDelete);

            card.appendChild(title);
            card.appendChild(meta);
            card.appendChild(badge);
            card.appendChild(actions);

            listEl.appendChild(card);
        });
}

function createNewLessonTemplate() {
    const newId = "lesson_" + Date.now();
    lessons[newId] = {
        meta: {
            level: "Beginner",
            unit: "New Unit",
            lessonTitle: "New Lesson",
        },
        overview: {
            title: "New Lesson Overview",
            description: "",
            goals: [],
        },
        useInLife: [],
        vocabulary: {
            core: [],
            extra: [],
        },
        dialogue: {
            lines: [],
        },
        grammar: [],
        practice: {
            quiz: [],
            rolePlays: [],
            translation: [],
        },
        microChecks: {
            enabled: false,
            every: 5,
            items: [],
        },
        homework: {
            instructions: "",
        },
        teacherNotes: {
            myNotes: "",
        },
    };
    saveLessonToLS(newId);
    saveLessonToCloud(newId);
    renderTeacherPicker();
    renderTeacherEditor(newId);
}



function applyTeacherSectionFilter(sectionKey) {
    const sections = $all('.teacher-editor__section[data-td-section]');
    sections.forEach((sec) => {
        const key = sec.getAttribute('data-td-section');
        sec.classList.toggle('td-hidden-section', key !== sectionKey);
    });
    localStorage.setItem("td_selected_section", sectionKey);
}

function renderTeacherEditor(lessonId, anchorCard, preselectSection) {
    const lesson = lessons[lessonId];
    const editor = $("#teacherEditor");
    if (!lesson || !editor) return;

    if (!lesson.practice) lesson.practice = { quiz: [], rolePlays: [], translation: [] };
    if (!Array.isArray(lesson.practice.translation)) lesson.practice.translation = [];
    if (lesson.grammarTab && typeof lesson.grammarTab === "object") {
        delete lesson.grammarTab;
    }

    // Ù†Ø­Ø±Ùƒ Ø§Ù„ÙÙˆØ±م ØªØ­Øª Ø§Ù„ÙƒØ§Ø±Ø¯ Ø§للي Ø§Ù†Ø¶ØºØ· (Teacher Dashboard)
    editor.innerHTML = "";
    if (anchorCard) {
        anchorCard.insertAdjacentElement("afterend", editor);
    } else {
        const list = $("#teacherLessonList");
        if (list) list.insertAdjacentElement("afterend", editor);
    }
    editor.style.display = "block";

    editor.innerHTML = `
     <div class="teacher-editor__section">
     
      <div class="td-editor-buttons">
        
        <button id="tdCloseEditor" class="btn btn--ghost btn--sm">Close Editor</button>
      </div>
    </div>
    <h3>Editing: ${escapeHtml(lesson.meta.level)} - ${escapeHtml(lesson.meta.unit)} - ${escapeHtml(lesson.meta.lessonTitle)}</h3>
    <p class="teacher-edit-note">
      All saved changes here are stored locally and synced to Firebase for all students.
    </p>

    <div class="td-sectionbar">
      <label for="tdSectionSelect">Edit section</label>
      <select id="tdSectionSelect" class="td-select">
        <option value="meta">Lesson Meta</option>
        <option value="overview">Overview</option>
        <option value="vocab">Vocabulary</option>
        <option value="dialogue">Dialogue</option>
        <option value="grammar">Grammar</option>
        <option value="translation">Translation</option>
        <option value="practice">Practice</option>
        <option value="homework">Homework</option>
        <option value="notes">Teacher Notes</option>
      </select>
    </div>

    <div class="teacher-editor__section" data-td-section="meta">
      <h4>Lesson Meta</h4>
      <div class="form-field form-field--inline">
        <label for="tdMetaLevel">Level</label>
        <select id="tdMetaLevel">
          <option value="Beginner">Beginner</option>
          <option value="Pre-Intermediate">Pre-Intermediate</option>
          <option value="Intermediate">Intermediate</option>
        </select>
      </div>
      <div class="form-field">
        <label for="tdMetaUnit">Unit</label>
        <input id="tdMetaUnit" class="td-input" />
      </div>
      <div class="form-field">
        <label for="tdMetaTitle">Lesson Title</label>
        <input id="tdMetaTitle" class="td-input" />
      </div>
      <p class="section-header__subtitle">Lesson ID: <span id="tdMetaId"></span></p>
      <div class="td-editor-buttons">
        <button id="tdSaveMeta" class="btn btn--primary btn--sm">Save Meta</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="overview">
      <h4>Overview</h4>
      <div class="form-field">
        <label for="tdOverviewTitle">Overview Title</label>
        <input id="tdOverviewTitle" class="td-input" />
      </div>
      <div class="form-field">
        <label for="tdOverviewDesc">Description</label>
        <textarea id="tdOverviewDesc" class="homework-notes" rows="3"></textarea>
      </div>
      <div class="form-field">
        <label>Goals</label>
        <div id="tdOverviewGoalsList"></div>
        <div class="td-editor-buttons">
          <button id="tdAddGoal" class="btn btn--outline btn--sm">Add Goal</button>
          <button id="tdSaveGoals" class="btn btn--primary btn--sm">Save Goals</button>
        </div>
      </div>
      <div class="form-field">
        <label>Use it in your life (Arabic + English)</label>
        <div id="tdUseInLifeList"></div>
        <div class="td-editor-buttons">
          <button id="tdAddUseInLife" class="btn btn--outline btn--sm">Add Prompt</button>
        </div>
      </div>
    </div>

    <!-- 🆕 Vocab Section -->
    <div class="teacher-editor__section" data-td-section="vocab">
      <h4>Vocabulary</h4>
      <p class="teacher-edit-note">
        Edit core and extra vocabulary for this lesson. These words ØªØ¸Ù‡Ø± Ùي ØªØ¨ÙˆÙŠØ¨ Vocabulary Ùˆ Quick Review.
      </p>

      <h5>Core Vocabulary</h5>
      <div id="tdVocabCoreList"></div>
      <div class="td-editor-buttons">
        <button id="tdAddVocabCore" class="btn btn--outline btn--sm">Add Core Word</button>
        <button id="tdSaveVocabCore" class="btn btn--primary btn--sm">Save Core</button>
      </div>

      <h5 style="margin-top: 10px;">Extra Vocabulary</h5>
      <div id="tdVocabExtraList"></div>
      <div class="td-editor-buttons">
        <button id="tdAddVocabExtra" class="btn btn--outline btn--sm">Add Extra Word</button>
        <button id="tdSaveVocabExtra" class="btn btn--primary btn--sm">Save Extra</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="dialogue">
      <h4>Dialogue</h4>
      <p class="teacher-edit-note">Edit each line: speaker, Arabic (RTL) and English.</p>
      <div id="tdDialogueList"></div>
      <div class="td-editor-buttons">
        <button id="tdAddDialogueLine" class="btn btn--outline btn--sm">Add Line</button>
        <button id="tdSaveDialogue" class="btn btn--primary btn--sm">Save Dialogue</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="grammar">
      <h4>Grammar Points</h4>
      <p class="teacher-edit-note">Short rules with descriptions.</p>
      <div id="tdGrammarList"></div>
      <div class="td-editor-buttons">
        <button id="tdAddGrammar" class="btn btn--outline btn--sm">Add Rule</button>
        <button id="tdSaveGrammar" class="btn btn--primary btn--sm">Save Grammar</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="translation">
      <h4>Translation (Practice)</h4>
      <p class="teacher-edit-note">Custom translation sentences for the Translation tab.</p>
      <div id="tdTranslationList"></div>
      <div class="td-editor-buttons">
        <button id="tdAddTranslation" class="btn btn--outline btn--sm">Add Sentence</button>
        <button id="tdSaveTranslation" class="btn btn--primary btn--sm">Save Translation</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="practice">
      <h4>Practice - MCQ</h4>
      <p class="teacher-edit-note">Edit quiz questions: Arabic question and 3 English options.</p>
      <div id="tdQuizList"></div>
      <div class="td-editor-buttons">
        <button id="tdAddQuiz" class="btn btn--outline btn--sm">Add MCQ</button>
        <button id="tdSaveQuiz" class="btn btn--primary btn--sm">Save MCQ</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="practice">
      <h4>Practice - Role-play Prompts</h4>
      <p class="teacher-edit-note">Short speaking prompts for in-class practice.</p>
      <div id="tdRoleList"></div>
      <div class="td-editor-buttons">
        <button id="tdAddRole" class="btn btn--outline btn--sm">Add Prompt</button>
        <button id="tdSaveRole" class="btn btn--primary btn--sm">Save Prompts</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="homework">
      <h4>Homework Instructions</h4>
      <p class="teacher-edit-note">This text is shared for all students.</p>
      <textarea id="tdHomeworkText" class="homework-notes" rows="3"></textarea>
      <div class="td-editor-buttons">
        <button id="tdSaveHomework" class="btn btn--primary btn--sm">Save Homework</button>
      </div>
    </div>

    <div class="teacher-editor__section" data-td-section="notes">
      <h4>Teacher Notes (Template)</h4>
      <textarea id="tdTeacherNotes" class="homework-notes" rows="3"></textarea>
      <div class="td-editor-buttons">
        <button id="tdSaveTeacherNotes" class="btn btn--primary btn--sm">Save Notes</button>
        <button id="tdCloseEditor" class="btn btn--ghost btn--sm">Close Editor</button>
      </div>
    </div>
  `;

    // Section filter: show only one editor section at a time
    const sectionSel = document.getElementById("tdSectionSelect");
    if (sectionSel) {
        const saved = localStorage.getItem("td_selected_section") || "meta";
        const initial = preselectSection || saved;
        sectionSel.value = initial;
        applyTeacherSectionFilter(sectionSel.value);
        sectionSel.addEventListener("change", () => applyTeacherSectionFilter(sectionSel.value));
    } else {
        // if no selector, show all
        $all('.teacher-editor__section[data-td-section]').forEach((sec) => sec.classList.remove('td-hidden-section'));
    }


    // ========== Meta ==========
    $("#tdMetaLevel").value = lesson.meta.level;
    $("#tdMetaUnit").value = lesson.meta.unit;
    $("#tdMetaTitle").value = lesson.meta.lessonTitle;
    $("#tdMetaId").textContent = lessonId;

    $("#tdSaveMeta").addEventListener("click", () => {
        lesson.meta.level = $("#tdMetaLevel").value;
        lesson.meta.unit = $("#tdMetaUnit").value.trim() || "Unit";
        lesson.meta.lessonTitle = $("#tdMetaTitle").value.trim() || "Lesson";
        saveLessonToLS(lessonId);
        saveLessonToCloud(lessonId);
        renderTeacherPicker();
        alert("Lesson meta saved.");
    });

    // ========== Overview ==========
    $("#tdOverviewTitle").value = lesson.overview.title || "";
    $("#tdOverviewDesc").value = lesson.overview.description || "";

    const goalsListEl = $("#tdOverviewGoalsList");
    function renderGoals() {
        goalsListEl.innerHTML = "";
        (lesson.overview.goals || []).forEach((g) => {
            const row = document.createElement("div");
            row.className = "td-role-row";
            const inp = document.createElement("input");
            inp.className = "td-input td-role-input";
            inp.value = g;
            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "btn btn--ghost btn--sm";
            delBtn.textContent = "Delete";
            delBtn.addEventListener("click", () => row.remove());
            row.appendChild(inp);
            row.appendChild(delBtn);
            goalsListEl.appendChild(row);
        });
    }
    renderGoals();

    const useInLifeListEl = $("#tdUseInLifeList");
    function createUseInLifeRow(item = {}) {
        const row = document.createElement("div");
        row.className = "td-role-row";

        const ar = document.createElement("input");
        ar.className = "td-input td-input--ar";
        ar.placeholder = "Arabic prompt";
        ar.value = item.ar || "";

        const en = document.createElement("input");
        en.className = "td-input";
        en.placeholder = "English prompt";
        en.value = item.en || "";

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn--ghost btn--sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => row.remove());

        row.appendChild(ar);
        row.appendChild(en);
        row.appendChild(delBtn);
        return row;
    }

    function renderUseInLife() {
        if (!useInLifeListEl) return;
        useInLifeListEl.innerHTML = "";
        (lesson.useInLife || []).forEach((q) => {
            const item = typeof q === "string" ? { en: q } : q;
            useInLifeListEl.appendChild(createUseInLifeRow(item));
        });
    }
    renderUseInLife();

    $("#tdAddGoal").addEventListener("click", () => {
        const row = document.createElement("div");
        row.className = "td-role-row";
        const inp = document.createElement("input");
        inp.className = "td-input td-role-input";
        inp.placeholder = "New goal...";
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn--ghost btn--sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => row.remove());
        row.appendChild(inp);
        row.appendChild(delBtn);
        goalsListEl.appendChild(row);
    });

    const addUseInLifeBtn = $("#tdAddUseInLife");
    if (addUseInLifeBtn) {
        addUseInLifeBtn.addEventListener("click", () => {
            if (!useInLifeListEl) return;
            useInLifeListEl.appendChild(createUseInLifeRow({}));
        });
    }

    $("#tdSaveGoals").addEventListener("click", () => {
        const rows = goalsListEl.querySelectorAll(".td-role-row");
        const newGoals = [];
        rows.forEach((r) => {
            const val = r.querySelector("input").value.trim();
            if (val) newGoals.push(val);
        });

        const useRows = useInLifeListEl ? useInLifeListEl.querySelectorAll(".td-role-row") : [];
        const newUseInLife = [];
        useRows.forEach((r) => {
            const inputs = r.querySelectorAll("input");
            const ar = (inputs[0]?.value || "").trim();
            const en = (inputs[1]?.value || "").trim();
            if (ar || en) newUseInLife.push({ ar, en });
        });

        lesson.overview.title = $("#tdOverviewTitle").value.trim() || lesson.overview.title;
        lesson.overview.description =
            $("#tdOverviewDesc").value.trim() || lesson.overview.description;
        lesson.overview.goals = newGoals;
        lesson.useInLife = newUseInLife;
        saveLessonToLS(lessonId);
        // also sync online (shared)
        saveLessonToCloud(lessonId);
        alert("Overview saved.");
    });

    // ========== 🆕 Vocabulary ==========

    const vocabCoreList = $("#tdVocabCoreList");
    const vocabExtraList = $("#tdVocabExtraList");


    function createVocabRow(item = {}, isCore = true) {
        const row = document.createElement("div");
        row.className = "td-quiz-row";
        row.dataset.itemId = item.id || "";

        row.innerHTML = `
          <div class="td-label">Arabic (with vowels)</div>
          <input class="td-input td-input--ar td-vocab-ar" value="${escapeAttr(item.ar || "")}" />

          <div class="td-label">English meaning</div>
          <input class="td-input td-vocab-en" value="${escapeAttr(item.en || "")}" />

          <div class="td-label">Arabeezy (optional)</div>
          <input class="td-input td-vocab-arabeezy" value="${escapeAttr(item.enArabeezy || "")}" />

          <div class="td-label">Hint (optional)</div>
          <input class="td-input td-vocab-hint" value="${escapeAttr(item.hint || "")}" />

          <div class="td-label">Arabic example (optional)</div>
          <textarea class="td-input td-input--ar td-vocab-ex-ar" rows="2">${escapeHtml(item.exampleAr || "")}</textarea>

          <div class="td-label">Arabeezy example (optional)</div>
          <textarea class="td-input td-vocab-ex-arabeezy" rows="2">${escapeHtml(item.exampleArabeezy || "")}</textarea>

          <div class="td-label">English example (optional)</div>
          <textarea class="td-input td-vocab-ex-en" rows="2">${escapeHtml(item.exampleEn || "")}</textarea>
        `;

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn--ghost btn--sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => row.remove());
        row.appendChild(delBtn);

        return row;
    }

    function renderVocabGroup(listEl, items) {
        listEl.innerHTML = "";
        (items || []).forEach((item) => {
            listEl.appendChild(createVocabRow(item));
        });
    }

    renderVocabGroup(vocabCoreList, lesson.vocabulary.core || []);
    renderVocabGroup(vocabExtraList, lesson.vocabulary.extra || []);

    $("#tdAddVocabCore").addEventListener("click", () => {
        vocabCoreList.appendChild(createVocabRow({}, true));
    });

    $("#tdAddVocabExtra").addEventListener("click", () => {
        vocabExtraList.appendChild(createVocabRow({}, false));
    });

    function collectVocabFrom(listEl, isCore) {
        const rows = listEl.querySelectorAll(".td-quiz-row");
        const result = [];
        rows.forEach((row) => {
            const ar = row.querySelector(".td-vocab-ar").value.trim();
            const en = row.querySelector(".td-vocab-en").value.trim();
            const enArabeezy = row.querySelector(".td-vocab-arabeezy").value.trim();
            const hint = row.querySelector(".td-vocab-hint").value.trim();
            const exampleAr = row.querySelector(".td-vocab-ex-ar").value.trim();
            const exampleArabeezy = row.querySelector(".td-vocab-ex-arabeezy").value.trim();
            const exampleEn = row.querySelector(".td-vocab-ex-en").value.trim();
            if (!ar || !en) return;
            let id = row.dataset.itemId;
            if (!id) {
                id = (isCore ? "core_" : "extra_") + Date.now() + "_" + Math.random().toString(16).slice(2);
            }
            result.push({ id, ar, en, enArabeezy, hint, exampleAr, exampleArabeezy, exampleEn });
        });
        return result;
    }

    $("#tdSaveVocabCore").addEventListener("click", () => {
        lesson.vocabulary.core = collectVocabFrom(vocabCoreList, true);
        saveLessonToLS(lessonId);
        // also sync online (shared)
        saveLessonToCloud(lessonId);
        alert("Core vocabulary saved.");
    });

    $("#tdSaveVocabExtra").addEventListener("click", () => {
        lesson.vocabulary.extra = collectVocabFrom(vocabExtraList, false);
        saveLessonToLS(lessonId);
        // also sync online (shared)
        saveLessonToCloud(lessonId);
        alert("Extra vocabulary saved.");
    });

    wireDialogueEditor({ $, lesson, lessonId, saveLessonToLS, saveLessonToCloud });
    wireGrammarEditor({
        $,
        lesson,
        lessonId,
        saveLessonToLS,
        saveLessonToCloud,
        escapeAttr,
        escapeHtml,
    });
    wireTranslationEditor({
        $,
        lesson,
        lessonId,
        saveLessonToLS,
        saveLessonToCloud,
        escapeHtml,
    });
    wireQuizEditor({ $, lesson, lessonId, saveLessonToLS, saveLessonToCloud });

    if (false) { // Legacy inline editor logic kept disabled during module migration.
    // ========== Grammar ==========
    const grammarList = $("#tdGrammarList");
    function renderGrammarRows() {
        grammarList.innerHTML = "";
        (lesson.grammar || []).forEach((g) => {
            const exampleLines = Array.isArray(g.examples)
                ? g.examples.map((ex) => [ex.ar, ex.arabeezy, ex.en].filter(Boolean).join(" | ")).join("\n")
                : "";
            const row = document.createElement("div");
            row.className = "td-quiz-row";
            row.innerHTML = `
        <div class="td-label">Rule title</div>
        <input class="td-input td-grammar-title" value="${escapeAttr(g.title || "")}" />
        <div class="td-label">Description</div>
        <textarea class="td-input td-grammar-desc" rows="2">${escapeHtml(g.description || "")}</textarea>
        <div class="td-label">Examples (Arabic | Arabeezy | English)</div>
        <textarea class="td-input td-grammar-examples" rows="3">${escapeHtml(exampleLines)}</textarea>
        <div class="td-label">Teacher notes</div>
        <textarea class="td-input td-grammar-notes" rows="2">${escapeHtml(g.teacherNotes || "")}</textarea>
      `;
            const delBtn = document.createElement("button");
            delBtn.type = "button";
            delBtn.className = "btn btn--ghost btn--sm";
            delBtn.textContent = "Delete";
            delBtn.addEventListener("click", () => row.remove());
            row.appendChild(delBtn);
            grammarList.appendChild(row);
        });
    }
    renderGrammarRows();

    $("#tdAddGrammar").addEventListener("click", () => {
        const row = document.createElement("div");
        row.className = "td-quiz-row";
        row.innerHTML = `
      <div class="td-label">Rule title</div>
      <input class="td-input td-grammar-title" placeholder="Rule title" />
      <div class="td-label">Description</div>
      <textarea class="td-input td-grammar-desc" rows="2" placeholder="Description / example"></textarea>
      <div class="td-label">Examples (Arabic | Arabeezy | English)</div>
      <textarea class="td-input td-grammar-examples" rows="3" placeholder="Ù…Ø«Ø§ل Ø¹Ø±Ø¨ي | Arabeezy | English"></textarea>
      <div class="td-label">Teacher notes</div>
      <textarea class="td-input td-grammar-notes" rows="2" placeholder="Notes for teacher mode"></textarea>
    `;
        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn--ghost btn--sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => row.remove());
        row.appendChild(delBtn);
        grammarList.appendChild(row);
    });

    $("#tdSaveGrammar").addEventListener("click", () => {
        const rows = grammarList.querySelectorAll(".td-quiz-row");
        const newGrammar = [];
        rows.forEach((r) => {
            const title = r.querySelector(".td-grammar-title").value.trim();
            const desc = r.querySelector(".td-grammar-desc").value.trim();
            const notes = r.querySelector(".td-grammar-notes")?.value.trim() || "";
            const examplesRaw = r.querySelector(".td-grammar-examples")?.value || "";
            const examples = examplesRaw
                .split("\n")
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => {
                    const parts = line.split("|").map((p) => p.trim());
                    return {
                        ar: parts[0] || "",
                        arabeezy: parts[1] || "",
                        en: parts[2] || "",
                    };
                })
                .filter((ex) => ex.ar || ex.en || ex.arabeezy);
            if (title) {
                newGrammar.push({
                    id: "g_" + Date.now() + Math.random(),
                    title,
                    description: desc,
                    teacherNotes: notes,
                    examples,
                });
            }
        });
        lesson.grammar = newGrammar;
        saveLessonToLS(lessonId);
        // also sync online (shared)
        saveLessonToCloud(lessonId);
        alert("Grammar saved.");
    });

    // ========== Translation ==========
    const translationList = $("#tdTranslationList");
    function createTranslationRow(item = {}) {
        const row = document.createElement("div");
        row.className = "td-quiz-row";
        row.dataset.itemId = item.id || "";

        row.innerHTML = `
      <div class="td-label">Direction</div>
      <select class="td-select td-translation-type">
        <option value="enToAr">English → Arabic</option>
        <option value="arToEn">Arabic → English</option>
      </select>
      <div class="td-label">English sentence</div>
      <textarea class="td-input td-translation-en" rows="2">${escapeHtml(item.textEn || "")}</textarea>
      <div class="td-label">Arabic sentence</div>
      <textarea class="td-input td-input--ar td-translation-ar" rows="2">${escapeHtml(item.textAr || "")}</textarea>
    `;

        const typeSel = row.querySelector(".td-translation-type");
        if (typeSel) typeSel.value = item.type || "enToAr";

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn--ghost btn--sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => row.remove());
        row.appendChild(delBtn);
        return row;
    }

    function renderTranslationRows() {
        if (!translationList) return;
        translationList.innerHTML = "";
        (lesson.practice.translation || []).forEach((t) => {
            translationList.appendChild(createTranslationRow(t));
        });
    }
    renderTranslationRows();

    const addTranslationBtn = $("#tdAddTranslation");
    if (addTranslationBtn && translationList) {
        addTranslationBtn.addEventListener("click", () => {
            translationList.appendChild(createTranslationRow({}));
        });
    }

    const saveTranslationBtn = $("#tdSaveTranslation");
    if (saveTranslationBtn && translationList) {
        saveTranslationBtn.addEventListener("click", () => {
            const rows = translationList.querySelectorAll(".td-quiz-row");
            const newItems = [];
            rows.forEach((row, idx) => {
                const type = row.querySelector(".td-translation-type")?.value || "enToAr";
                const textEn = row.querySelector(".td-translation-en")?.value.trim() || "";
                const textAr = row.querySelector(".td-translation-ar")?.value.trim() || "";
                if (!textEn && !textAr) return;
                const id = row.dataset.itemId || `t_${Date.now()}_${idx}`;
                newItems.push({ id, type, textEn, textAr });
            });
            lesson.practice.translation = newItems;
            saveLessonToLS(lessonId);
            saveLessonToCloud(lessonId);
            alert("Translation saved.");
        });
    }

    // ========== Quiz ==========
    const quizList = $("#tdQuizList");
    quizList.innerHTML = "";
    lesson.practice.quiz.forEach((q) => {
        const row = document.createElement("div");
        row.className = "td-quiz-row";

        const qLabel = document.createElement("div");
        qLabel.className = "td-label";
        qLabel.textContent = "Question (Arabic)";

        const qInput = document.createElement("textarea");
        qInput.className = "td-input td-input--ar td-quiz-question";
        qInput.rows = 2;
        qInput.value = q.questionAr || "";

        const optLabel = document.createElement("div");
        optLabel.className = "td-label";
        optLabel.textContent = "Options (English)";

        const optGrid = document.createElement("div");
        optGrid.className = "td-quiz-grid";

        const optInputs = [];
        for (let i = 0; i < 3; i++) {
            const inp = document.createElement("input");
            inp.className = "td-input";
            inp.value = q.optionsEn[i] || "";
            optGrid.appendChild(inp);
            optInputs.push(inp);
        }

        const correctWrap = document.createElement("div");
        correctWrap.style.marginTop = "4px";
        correctWrap.style.display = "flex";
        correctWrap.style.justifyContent = "space-between";
        correctWrap.style.alignItems = "center";

        const sel = document.createElement("select");
        sel.className = "td-select";
        ["Option 1", "Option 2", "Option 3"].forEach((lab, idx) => {
            const op = document.createElement("option");
            op.value = String(idx);
            op.textContent = lab;
            sel.appendChild(op);
        });
        sel.value = String(q.correctIndex || 0);

        const selLabel = document.createElement("span");
        selLabel.className = "td-label";
        selLabel.textContent = "Correct option:";

        const left = document.createElement("div");
        left.style.display = "flex";
        left.style.flexDirection = "column";
        left.style.gap = "2px";
        left.appendChild(selLabel);
        left.appendChild(sel);

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn--ghost btn--sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => row.remove());

        correctWrap.appendChild(left);
        correctWrap.appendChild(delBtn);

        row.appendChild(qLabel);
        row.appendChild(qInput);
        row.appendChild(optLabel);
        row.appendChild(optGrid);
        row.appendChild(correctWrap);

        quizList.appendChild(row);
    });

    $("#tdAddQuiz").addEventListener("click", () => {
        const row = document.createElement("div");
        row.className = "td-quiz-row";

        const qLabel = document.createElement("div");
        qLabel.className = "td-label";
        qLabel.textContent = "Question (Arabic)";

        const qInput = document.createElement("textarea");
        qInput.className = "td-input td-input--ar td-quiz-question";
        qInput.rows = 2;
        qInput.placeholder = "Question in Arabic";

        const optLabel = document.createElement("div");
        optLabel.className = "td-label";
        optLabel.textContent = "Options (English)";

        const optGrid = document.createElement("div");
        optGrid.className = "td-quiz-grid";
        ["Option 1", "Option 2", "Option 3"].forEach((placeholder) => {
            const inp = document.createElement("input");
            inp.className = "td-input";
            inp.placeholder = placeholder;
            optGrid.appendChild(inp);
        });

        const correctWrap = document.createElement("div");
        correctWrap.style.marginTop = "4px";
        correctWrap.style.display = "flex";
        correctWrap.style.justifyContent = "space-between";
        correctWrap.style.alignItems = "center";

        const selLabel = document.createElement("span");
        selLabel.className = "td-label";
        selLabel.textContent = "Correct option:";

        const sel = document.createElement("select");
        sel.className = "td-select";
        ["Option 1", "Option 2", "Option 3"].forEach((lab, idx) => {
            const op = document.createElement("option");
            op.value = String(idx);
            op.textContent = lab;
            sel.appendChild(op);
        });

        const left = document.createElement("div");
        left.style.display = "flex";
        left.style.flexDirection = "column";
        left.style.gap = "2px";
        left.appendChild(selLabel);
        left.appendChild(sel);

        const delBtn = document.createElement("button");
        delBtn.type = "button";
        delBtn.className = "btn btn--ghost btn--sm";
        delBtn.textContent = "Delete";
        delBtn.addEventListener("click", () => row.remove());

        correctWrap.appendChild(left);
        correctWrap.appendChild(delBtn);

        row.appendChild(qLabel);
        row.appendChild(qInput);
        row.appendChild(optLabel);
        row.appendChild(optGrid);
        row.appendChild(correctWrap);
        quizList.appendChild(row);
    });

    $("#tdSaveQuiz").addEventListener("click", () => {
        const rows = quizList.querySelectorAll(".td-quiz-row");
        const newQuiz = [];
        rows.forEach((row) => {
            const qInput = row.querySelector(".td-quiz-question");
            const questionAr = qInput.value.trim();
            if (!questionAr) return;
            const opts = Array.from(row.querySelectorAll(".td-quiz-grid .td-input")).map((i) =>
                i.value.trim()
            );
            if (!opts[0] || !opts[1] || !opts[2]) return;
            const sel = row.querySelector(".td-select");
            const correctIndex = Number(sel.value) || 0;
            newQuiz.push({
                id: "q_" + Date.now() + "_" + Math.random().toString(16).slice(2),
                questionAr,
                optionsEn: opts,
                correctIndex,
            });
        });
        lesson.practice.quiz = newQuiz;
        saveLessonToLS(lessonId);
        // also sync online (shared)
        saveLessonToCloud(lessonId);
        alert("MCQ saved.");
    });

    }

    // ========== Role-play / Homework / Teacher Notes ==========
    wireRolePlayEditor({ $, lesson, lessonId, saveLessonToLS, saveLessonToCloud });
    wireHomeworkEditor({ $, lesson, lessonId, saveLessonToLS, saveLessonToCloud });
    wireTeacherNotesEditor({
        $,
        lesson,
        lessonId,
        saveLessonToLS,
        saveLessonToCloud,
        editor,
    });
}
// ================= AUTH MODAL HELPERS =================
function openAuthModal(forcedRole) {
    document.body.classList.remove("home-only");
    console.log("openAuthModal called with role:", forcedRole);
    const modal = document.getElementById("authModal");
    const roleSelect = document.getElementById("authRole");
    const errorBox = document.getElementById("authError");

    if (!modal) return;

    // Ù…Ø³Ø­ Ø£ي Ø®Ø·Ø£ Ù‚Ø¯يم
    if (errorBox) errorBox.textContent = "";

    // Ù„Ùˆ Ø¬Ø§ي من Ø²Ø± "Ø£Ù†Ø§ Ø·Ø§Ù„Ø¨" Ø£Ùˆ "Ø£Ù†Ø§ Ù…Ø¯Ø±Ø³"
    if (forcedRole === "student" || forcedRole === "teacher") {
        modal.dataset.forcedRole = forcedRole;
        if (roleSelect) roleSelect.value = forcedRole;
    } else {
        // Ù„Ùˆ Ø¬Ø§ي من Ø²Ø± Login Ø§Ù„Ø¹Ø§Ø¯ي
        delete modal.dataset.forcedRole;
    }

    modal.classList.add("modal--open");
}

function closeAuthModal() {
    const modal = document.getElementById("authModal");
    if (!modal) return;
    modal.classList.remove("modal--open");
    delete modal.dataset.forcedRole;
}

// ========================= DOM READY =========================
document.addEventListener("DOMContentLoaded", async () => {
    loadLessonDataFromLS();
    loadCustomUnits();
    loadFontSize();
    appState.students = loadStudentsFromLS();
    loadBackupSettings();
    // top nav
    $all(".top-nav__link").forEach((btn) => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.nav;
            if (target === "home-screen") goToHome();
            else if (target === "students-screen") goToStudents();
            else if (target === "levels-screen") goToLevels();
            else if (target === "teacher-dashboard-screen") goToTeacherDashboard();
        });
    });

    const btnArabicLetters = $("#btnArabicLetters");
    if (btnArabicLetters) {
        btnArabicLetters.addEventListener("click", () => {
            goToArabicLetters();
        });
    }
    const btnPlacementTest = document.getElementById("btnPlacementTest");
    if (btnPlacementTest) {
        btnPlacementTest.addEventListener("click", () => {
            const lessonId = findLessonIdFor("Placement", "Placement Test");
            if (!lessonId) {
                alert("Placement Test is not available yet.");
                return;
            }
            appState.currentLessonId = lessonId;
            appState.currentTab = "practice";
            goToLessonView({ skipResume: true });
        });
    }
    const btnPalestinianProverbs = document.getElementById("btnPalestinianProverbs");
    if (btnPalestinianProverbs) btnPalestinianProverbs.addEventListener("click", () => renderPalestinianProverbs());
    const btnProverbsBack = document.getElementById("btnProverbsBack");
    if (btnProverbsBack) btnProverbsBack.addEventListener("click", () => goToLevels());
    const btnGazaSituationBack = document.getElementById("btnGazaSituationBack");
    if (btnGazaSituationBack) btnGazaSituationBack.addEventListener("click", () => goToLevels());
    const btnLettersBackToUnits = $("#btnLettersBackToUnits");
    if (btnLettersBackToUnits) {
        btnLettersBackToUnits.addEventListener("click", () => {
            goToLevels();
        });
    }
    const btnExportArabicLettersPdf = $("#btnExportArabicLettersPdf");
    if (btnExportArabicLettersPdf) {
        btnExportArabicLettersPdf.addEventListener("click", () => {
            exportArabicLettersPdf();
        });
    }
    // hero buttons
    // ===== HERO BUTTONS (Ø£Ù†Ø§ Ø·Ø§Ù„Ø¨ / Ø£Ù†Ø§ Ù…Ø¯Ø±Ø³) =====
    const btnHeroStudent = document.getElementById("btnHeroStudent");
    const btnHeroTeacher = document.getElementById("btnHeroTeacher");
    const btnHeroGuest = document.getElementById("btnHeroGuest");
    if (btnHeroStudent) {
        btnHeroStudent.addEventListener("click", () => {
            openAuthModal("student");
        });
    }
    if (btnHeroTeacher) {
        btnHeroTeacher.addEventListener("click", () => {
            openAuthModal("teacher");
        });
    }
    if (btnHeroGuest) {
        btnHeroGuest.addEventListener("click", () => {
            appState.currentUser = { uid: "guest", email: "guest", role: "guest" };
            appState.guestStudent = {
                id: "guest",
                name: "Guest",
                level: "Beginner",
                progress: {},
                homeworkNotes: {},
            };
            appState.currentStudentId = "guest";
            appState.currentLessonId = LESSON_ID_GREETING;
            appState.currentTab = "overview";
            updateAuthUI();
            appState.currentCurriculumId = null;
            goToCurriculumChoice();
        });
    }
    // add student
    $("#addStudentForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const name = $("#studentName").value.trim();
        const level = $("#studentLevel").value;
        if (!name) return;

        const goalCheckboxes = document.querySelectorAll('input[name="goalOption"]:checked');
        const goals = Array.from(goalCheckboxes).map((c) => c.value);

        const student = {
            id: "s_" + Date.now(),
            name,
            goals,
            level,
            progress: {},
            homeworkNotes: {},
        };
        appState.students.push(student);
        saveStudentsToLS();
        $("#studentName").value = "";
        goalCheckboxes.forEach((c) => (c.checked = false));
        $("#studentLevel").value = "Beginner";
        renderStudents();
    });
    // ================= WHITEBOARD UI =================
    const whiteboardPanel = document.getElementById("whiteboardPanel");
    const btnToggleWhiteboard = document.getElementById("btnToggleWhiteboard");
    const wbColorInput = document.getElementById("whiteboardColor");
    const wbSizeInput = document.getElementById("whiteboardSize");
    const wbSizeVal = document.getElementById("whiteboardSizeVal");
    const wbClearBtn = document.getElementById("whiteboardClear");
    const wbDownloadBtn = document.getElementById("whiteboardDownload");

    if (btnToggleWhiteboard && whiteboardPanel) {
        btnToggleWhiteboard.addEventListener("click", () => {
            const isHidden = whiteboardPanel.classList.contains("hidden");
            if (isHidden) {
                whiteboardPanel.classList.remove("hidden");
                // Ù„Ù…Ø§ Ø£ÙØªØ­ Ø§Ù„Ù„ÙˆØ­Ø©، Ø£Ù‡ÙŠÙ‘Ø¦ Ø§Ù„ÙƒØ§Ù†ÙØ§Ø³ ÙˆØ£Ø­مّل Ø§Ù„Ø±Ø³Ù…Ø©
                initWhiteboardCanvas();
            } else {
                whiteboardPanel.classList.add("hidden");
            }
        });
    }

    if (wbColorInput) {
        wbColorInput.addEventListener("input", () => {
            whiteboardState.color = wbColorInput.value;
        });
    }

    if (wbSizeInput && wbSizeVal) {
        wbSizeInput.addEventListener("input", () => {
            const v = Number(wbSizeInput.value) || 3;
            whiteboardState.size = v;
            wbSizeVal.textContent = v + "px";
        });
        // Ù‚ÙŠÙ…Ø© Ø§Ø¨ØªØ¯Ø§Ø¦ÙŠØ©
        whiteboardState.size = Number(wbSizeInput.value) || 3;
        wbSizeVal.textContent = whiteboardState.size + "px";
    }

    if (wbClearBtn) {
        wbClearBtn.addEventListener("click", () => {
            const canvas = document.getElementById("whiteboardCanvas");
            if (!canvas || !whiteboardState.ctx) return;
            if (!confirm("Clear this whiteboard for the current lesson?")) return;
            whiteboardState.ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveWhiteboardToLS();
        });
    }

    if (wbDownloadBtn) {
        wbDownloadBtn.addEventListener("click", () => {
            const canvas = document.getElementById("whiteboardCanvas");
            if (!canvas) return;
            const link = document.createElement("a");
            const lesson = lessons[appState.currentLessonId];
            const title = lesson ? lesson.meta.lessonTitle || "lesson" : "lesson";
            link.download = `whiteboard_${title.replace(/\s+/g, "_")}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        });
    }

    const btnExportLesson = document.getElementById("btnExportLessonPdf");
    if (btnExportLesson) {
        btnExportLesson.addEventListener("click", () => {
            const student = getCurrentStudent();
            const studentName = student ? student.name : "";
            const lessonId = appState.currentLessonId;
            if (!lessonId) {
                alert("No lesson selected.");
                return;
            }
            openExportModal("lesson-view", lessonId, studentName);
        });
    }
    const exportForm = document.getElementById("exportOptionsForm");
    if (exportForm) {
        exportForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const modal = document.getElementById("exportModal");
            const lessonId = exportContext.lessonId;
            const lesson = lessons[lessonId];
            if (!lesson) {
                alert("Lesson not found.");
                return;
            }

            const includeVocab = document.getElementById("expIncludeVocab").checked;
            const includeDialogue = document.getElementById("expIncludeDialogue").checked;
            const includeGrammar = document.getElementById("expIncludeGrammar").checked;
            const includeHomework = document.getElementById("expIncludeHomework").checked;
            let includeTeacherNotes =
                document.getElementById("expIncludeTeacherNotes").checked;

            const versionInput = exportForm.querySelector(
                'input[name="expVersion"]:checked'
            );
            const version = versionInput ? versionInput.value : "student";

            if (version === "student") {
                // Ù…Ù‡Ù…Ø§ ÙƒØ§ن checkbox ØªØ¨Ø¹ Teacher Notes، Ù†Ø®Ùيه Ùي Student version
                includeTeacherNotes = false;
            }

            const html = buildLessonExportHtml(lesson, {
                includeVocab,
                includeDialogue,
                includeGrammar,
                includeHomework,
                includeTeacherNotes,
                version,
                studentName: exportContext.studentName,
            });

            closeExportModal();
            openPrintWindow(html);
        });
    }
    // Backup buttons in Teacher Dashboard
    const btnExportBackup = document.getElementById("btnExportBackup");
    const btnImportBackup = document.getElementById("btnImportBackup");
    const backupFileInput = document.getElementById("backupFileInput");
    const backupFrequencySelect = document.getElementById("backupFrequencySelect");
    const backupLastInfo = document.getElementById("backupLastInfo");

    if (backupFrequencySelect) {
        backupFrequencySelect.value = backupSettings.frequency || "off";
        backupFrequencySelect.addEventListener("change", () => {
            backupSettings.frequency = backupFrequencySelect.value;
            saveBackupSettings();
            checkBackupReminder();
        });
    }

    if (backupLastInfo && backupSettings.lastBackupAt) {
        const last = new Date(backupSettings.lastBackupAt);
        backupLastInfo.textContent =
            "Last backup: " +
            last.toLocaleString() +
            "  |  Frequency: " +
            backupSettings.frequency;
    }

    if (btnExportBackup) {
        btnExportBackup.addEventListener("click", () => {
            handleExportBackup();
        });
    }

    if (btnImportBackup && backupFileInput) {
        btnImportBackup.addEventListener("click", () => {
            backupFileInput.click();
        });

        backupFileInput.addEventListener("change", () => {
            const file = backupFileInput.files[0];
            if (file) {
                handleImportBackupFile(file);
                backupFileInput.value = "";
            }
        });
    }

    // ØªØ´ÙŠÙƒ Ø§Ù„ØªØ°ÙƒÙŠØ± Ø¨Ø¹Ø¯ Ù…Ø§ Ù†Ø­مّل Ø§Ù„Ø¥Ø¹Ø¯Ø§Ø¯Ø§Øª
    checkBackupReminder();

    // Ø£Ø²Ø±Ø§Ø± Ø¥ØºÙ„Ø§ق Ø§Ù„Ù…ÙˆØ¯Ø§ل
    document
        .querySelectorAll("[data-close-export-modal], #exportCancelBtn")
        .forEach((el) => {
            el.addEventListener("click", () => closeExportModal());
        });

    // level & teacher buttons
    $("#btnSwitchProfile").addEventListener("click", () => {
        // Save current lesson position before clearing current student
        try { persistResumeBeforeNav(); } catch { }
        appState.currentStudentId = null;
        appState.currentCurriculumId = null;
        goToStudents();
    });
    const btnChangeCurriculum = document.getElementById("btnChangeCurriculum");
    if (btnChangeCurriculum) btnChangeCurriculum.addEventListener("click", () => goToCurriculumChoice());
    document.querySelectorAll("[data-curriculum-id]").forEach((button) => {
        button.addEventListener("click", () => selectCurriculum(button.dataset.curriculumId));
    });
    const btnContinueLesson = document.getElementById("btnContinueLesson");
    if (btnContinueLesson) {
        btnContinueLesson.addEventListener("click", () => {
            const student = getCurrentStudent();
            if (!student) return;
            if (!tryResumeStudent(student)) {
                setStudentLessonContext(student);
                goToLevels();
                toast("No saved spot yet. Opened this student's level.");
            }
        });
    }
    $("#btnGoTeacherDashboard").addEventListener("click", () => {
        goToTeacherDashboard();
    });
    $("#btnBackToLevels").addEventListener("click", () => goToLevels());
    $("#btnBackToStudents").addEventListener("click", () => goToStudents());
    $("#btnTDBackLevels").addEventListener("click", () => goToLevels());
    $("#btnTDBackStudents").addEventListener("click", () => goToStudents());
    // ================= VOCAB MODAL CONTROLS =================
    const btnPrev = document.getElementById("vocabPrevBtn");
    const btnNext = document.getElementById("vocabNextBtn");
    const btnToggleExamples = document.getElementById("vocabToggleExamplesBtn");
    const btnToggleAr = document.getElementById("vocabToggleArBtn");
    const btnToggleEn = document.getElementById("vocabToggleEnBtn");
    const btnToggleArabeezy = document.getElementById("vocabToggleArabeezyBtn");
    const btnDontKnow = document.getElementById("vocabDontKnowBtn");
    function checkIfVocabDone() {
        if (!currentLesson || !currentLesson.vocabulary) return;

        const allVocab = [
            ...(currentLesson.vocabulary.core || []),
            ...(currentLesson.vocabulary.extra || []),
        ];

        const visited = ensureVocabVisitedSet();
        const allSeen = allVocab.every((v) => visited.has(v.id));

        if (allSeen) {
            // Ù„Ù…Ø§ ÙŠÙ…Ø±ّ Ø¹Ù„Ù‰ Ùƒل Ø§Ù„ÙƒÙ„Ù…Ø§Øª Ù…Ø±Ø© ÙˆØ§Ø­Ø¯Ø© Ø¹Ù„Ù‰ Ø§Ù„Ø£قل
            markLessonSectionDone("vocabulary");
            updateLessonProgressUI();
        }
    }
    function updateLessonProgressUI() {
        // Ø­Ø¯Ù‘Ø« Ø´Ø±ÙŠØ· Ø§Ù„ØªÙ‚Ø¯م
        updateProgressBar();

        // Ø­Ø¯Ù‘Ø« Ø¨Ø§Ø¯Ø¬ Ù‚Ø³م Ø§Ù„Ù…ÙØ±Ø¯Ø§Øª ÙÙ‚Ø·
        updateSectionStatusBadge("vocabulary");
    }

    if (btnPrev) {
        btnPrev.addEventListener("click", () => {
            if (!vocabModalState.list.length) return;
            vocabModalState.index =
                (vocabModalState.index - 1 + vocabModalState.list.length) %
                vocabModalState.list.length;
            vocabModalState.showExamples = true; // Ù†Ø±Ø¬Ù‘Ø¹ Ø§Ù„Ø£Ù…Ø«Ù„Ø© Ø¸Ø§Ù‡Ø±Ø© Ø¹Ù†Ø¯ Ø§Ù„Ø§Ù†ØªÙ‚Ø§ل
            renderVocabModalFromState();
        });
    }

    if (btnNext) {
        btnNext.addEventListener("click", () => {
            if (!vocabModalState.list.length) return;

            const currentLesson = lessons[appState.currentLessonId];
            const microCfg = getMicroCheckConfig(currentLesson);
            if (microCfg.enabled && microCfg.items.length) {
                vocabModalState.nextClickCount += 1;
                if (vocabModalState.nextClickCount >= microCfg.every) {
                    vocabModalState.nextClickCount = 0;
                    microCheckState.pendingNextAdvance = true;
                    if (openMicroCheckModal(currentLesson)) {
                        return;
                    }
                    microCheckState.pendingNextAdvance = false;
                }
            }

            vocabModalState.index =
                (vocabModalState.index + 1) % vocabModalState.list.length;

            renderVocabModalFromState();
        });
    }

    if (btnDontKnow) {
        btnDontKnow.addEventListener("click", () => {
            const item = vocabModalState.list[vocabModalState.index];
            if (!item || !item.id) return;
            setVocabMemoryStatus(appState.currentLessonId, item.id, "review");
            renderVocabModalFromState();
        });
    }


    if (btnToggleExamples) {
        btnToggleExamples.addEventListener("click", () => {
            vocabModalState.showExamples = !vocabModalState.showExamples;
            renderVocabModalFromState();
        });
    }
    if (btnToggleAr) {
        btnToggleAr.addEventListener("click", () => {
            vocabModalState.showAr = !vocabModalState.showAr;
            renderVocabModalFromState();
        });
    }

    if (btnToggleEn) {
        btnToggleEn.addEventListener("click", () => {
            vocabModalState.showEn = !vocabModalState.showEn;
            renderVocabModalFromState();
        });
    }

    if (btnToggleArabeezy) {
        btnToggleArabeezy.addEventListener("click", () => {
            vocabModalState.showArabeezy = !vocabModalState.showArabeezy;
            renderVocabModalFromState();
        });
    }

    const microCheckCheckBtn = document.getElementById("microCheckCheckBtn");
    const microCheckContinueBtn = document.getElementById("microCheckContinueBtn");
    const microCheckCloseBtn = document.getElementById("microCheckCloseBtn");

    if (microCheckCheckBtn) {
        microCheckCheckBtn.addEventListener("click", () => evaluateMicroCheck());
    }
    if (microCheckContinueBtn) {
        microCheckContinueBtn.addEventListener("click", () => continueFromMicroCheck());
    }
    if (microCheckCloseBtn) {
        microCheckCloseBtn.addEventListener("click", () => continueFromMicroCheck());
    }
    document.getElementById("btnLogin").addEventListener("click", () => openAuthModal());
    document
        .querySelectorAll("[data-close-auth]")
        .forEach((el) => el.addEventListener("click", closeAuthModal));

    document.getElementById("btnLogout").addEventListener("click", () => {
        if (isGuestUser()) {
            appState.currentUser = null;
            appState.guestMode = false;
            appState.guestStudent = null;
            appState.currentStudentId = null;
            updateAuthUI();
            showScreen("home-screen");
            return;
        }
        auth.signOut();
    });

    document.getElementById("authForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value;
        const roleSelect = document.getElementById("authRole");
        const modal = document.getElementById("authModal");
        const errorBox = document.getElementById("authError");

        if (errorBox) errorBox.textContent = "";

        // Ø§Ù„Ø¯ÙˆØ± Ø§Ù„Ù…Ù‚ØµÙˆØ¯: Ù„Ùˆ Ø¬Ø§ي من Ø²Ø± Student / Teacher Ùي Ø§Ù„Ù‡ÙŠØ±Ùˆ
        let role = roleSelect ? roleSelect.value : "student";
        if (modal && modal.dataset.forcedRole) {
            role = modal.dataset.forcedRole; // student Ø£Ùˆ teacher
        }

        try {
            let cred;

            if (role === "teacher") {
                if (!canUseTeacherRole(email)) {
                    if (errorBox) errorBox.textContent = "Teacher access is restricted.";
                    return;
                }
                // Ø§Ù„Ù…Ø¯Ø±Ù‘Ø³: sign in Ø«م sign up Ù„Ùˆ Ù…Ø´ Ù…ÙˆØ¬ÙˆØ¯
                try {
                    cred = await auth.signInWithEmailAndPassword(email, password);
                } catch (err) {
                    if (err.code === "auth/user-not-found") {
                        if (errorBox) {
                            errorBox.textContent = "Teacher account must be created in Firebase first.";
                        }
                        return;
                    } else {
                        throw err;
                    }
                }
            } else {
                // Ø§Ù„Ø·Ø§Ù„Ø¨: ÙÙ‚Ø· ØªØ³Ø¬يل Ø¯Ø®Ùˆل Ø¨Ø­Ø³Ø§Ø¨ Ø¬Ø§Ù‡Ø²
                try {
                    cred = await auth.signInWithEmailAndPassword(email, password);
                } catch (err) {
                    if (err.code === "auth/user-not-found") {
                        if (errorBox) {
                            errorBox.textContent =
                                "No account exists for this email. Please ask the teacher to create an account for you.";
                        } else {
                            alert("No account exists for this email. Please ask the teacher to create an account for you.");
                        }
                        return;
                    }
                    throw err;
                }
            }

            // Ù†Ù‚Ø±Ø£ Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ù…Ø³ØªØ®Ø¯م من Firestore
	            const { role: resolvedRole } = await resolveUserRole({
	                db,
	                uid: cred.user.uid,
	                email: cred.user.email,
	                savedRole: null,
	                fallbackRole: role,
	            });

	            if (role === "student" && resolvedRole === "teacher") {
	                await auth.signOut();
	                if (errorBox) errorBox.textContent = "This email belongs to a teacher account. Please sign in as Teacher.";
	                return;
	            }

	            let finalRole = resolvedRole;
	            if (role === "teacher") {
	                if (resolvedRole !== "teacher") {
	                    await auth.signOut();
	                    if (errorBox) errorBox.textContent = "This account is not approved as a teacher.";
	                    return;
	                }
	                await bootstrapTeacherAccess({ db, firebase, uid: cred.user.uid, email: cred.user.email });
	                finalRole = "teacher";
	            }

            appState.currentUser = {
                uid: cred.user.uid,
                email: cred.user.email,
                role: finalRole,
            };

            // Ø®Ø²ّن Ø§Ù„Ø¯ÙˆØ± Ù…Ø­Ù„ÙŠØ§Ù‹ Ø¹Ø´Ø§ن Ù†Ø±Ø¬Ø¹ له Ø¨Ø¹Ø¯ Ø§Ù„Ù€ refresh
            try {
                localStorage.setItem(LS_USER_ROLE_KEY, finalRole);
            } catch (e) {
                console.warn("Could not save role to localStorage", e);
            }

            closeAuthModal();
            updateAuthUI();


            // Route by role.
            if (finalRole === "teacher") {
                // Ù†Ø²Ø§من Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ù„Ø§Ø¨ من Ø§Ù„Ø³Ø­Ø§Ø¨Ø© ÙˆÙ†ÙØªØ­ Teacher Dashboard
                await syncTeacherStudentsFromCloud();
                renderStudents();
                renderTeacherPicker();
                goToTeacherDashboard();
            } else {
                // STUDENT:
                // Ù†Ø­مّل Ø¨ÙŠØ§Ù†Ø§Øª Ø§Ù„Ø·Ø§Ù„Ø¨ / ØªÙ‚Ø¯مه من Ø§Ù„Ø³Ø­Ø§Ø¨Ø© (Ù„Ùˆ Ø¹Ù†Ø¯Ùƒ Ù‡Ø°ه Ø§Ù„Ø¯Ø§Ù„Ø©)
                await loadStudentProgressFromCloud?.();

                // Ù†Ø±Ø¨Ø· Ø§Ù„Ø·Ø§Ù„Ø¨ Ø§Ù„Ø­Ø§لي Ø¨Ù€ currentStudentId
                appState.students = [
                    {
                        id: appState.currentUser.uid,
                        name: appState.currentUser.email,
                        level: "Beginner",
                        goals: [],
                        progress: {},
                        homeworkNotes: {},
                    },
                ];
                appState.currentStudentId = appState.currentUser.uid;

                // Ù…Ø¨Ø§Ø´Ø±Ø© Ù†ÙØªØ­ ØµÙØ­Ø© Ø§Ù„ÙˆØ­Ø¯Ø§Øª
                goToLevels();
            }
        } catch (err) {
            console.error("Auth error:", err);
            if (errorBox) {
                if (err.code === "auth/wrong-password" || err.code === "auth/invalid-login-credentials") {
                    errorBox.textContent = "Incorrect password. Please try again.";
                } else {
                    errorBox.textContent = "Login problem: " + err.message;
                }
            } else {
                alert("Auth error: " + err.message);
            }
        }
    });





    // Add Unit form
    $("#addUnitForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const level = $("#addUnitLevel").value;
        const name = $("#addUnitName").value.trim();
        if (!name) return;
        if (!customUnits[level]) customUnits[level] = [];
        if (!customUnits[level].includes(name)) {
            customUnits[level].push(name);
            saveCustomUnits();
        }
        $("#addUnitName").value = "";
        renderLevels();
    });

    // Teacher dashboard actions
    $("#btnTDAddLesson").addEventListener("click", () => {
        createNewLessonTemplate();
    });

    // lesson tabs
    $all(".lesson-tab").forEach((btn) => {
        btn.addEventListener("click", () => setActiveTab(btn.dataset.tab));
    });

    // teacher mode toggle
    $("#teacherModeToggle").addEventListener("change", (e) => {
        appState.teacherMode = e.target.checked;
        updateTeacherTabsVisibility();
        const lesson = lessons[appState.currentLessonId];
        if (lesson) updateLessonTabsVisibility(lesson);
        setActiveTab(appState.currentTab);
    });


    // font size
    $("#btnFontSmaller").addEventListener("click", () => {
        appState.lessonFontSize = Math.max(0.85, appState.lessonFontSize - 0.05);
        applyFontSize();
        saveFontSize();
    });
    $("#btnFontLarger").addEventListener("click", () => {
        appState.lessonFontSize = Math.min(1.4, appState.lessonFontSize + 0.05);
        applyFontSize();
        saveFontSize();
    });

    // vocab modal closes
    $all("[data-close-modal]").forEach((el) =>
        el.addEventListener("click", () => closeVocabModal())
    );


    const tdSyncNowBtn = document.getElementById("tdSyncNowBtn");
    if (tdSyncNowBtn) {
        tdSyncNowBtn.addEventListener("click", async () => {
            tdSyncNowBtn.disabled = true;
            try {
                await syncLessonsNow();
            } catch (e) {
                console.warn("Manual lesson sync failed:", e);
                toast("Could not sync lessons. Please try again.");
            } finally {
                tdSyncNowBtn.disabled = false;
            }
        });
    }
    // initial
    renderStudents();
    renderTeacherPicker();
    goToHome();


    const btnLoginTop = document.getElementById("btnLogin");
    if (btnLoginTop) {
        btnLoginTop.addEventListener("click", () => openAuthModal());
    }


    const createStudentForm = document.getElementById("createStudentForm");
    if (createStudentForm) {
        createStudentForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // ØªØ£ÙƒÙŠØ¯ Ø£ن Ø§Ù„Ù…Ø³ØªØ®Ø¯م Ø§Ù„Ø­Ø§لي Ù…Ø¯Ø±Ù‘Ø³
            if (!appState.currentUser || appState.currentUser.role !== "teacher") {
                alert("Only teachers can create students.");
                return;
            }

            const emailEl = document.getElementById("newStudentEmail");
            const passwordEl = document.getElementById("newStudentPassword");
            const msg = document.getElementById("createStudentMsg");

            const email = emailEl.value.trim();
            const password = passwordEl.value.trim();

            if (msg) {
                msg.textContent = "";
                msg.style.color = "#111827";
            }

            if (!email || !password) {
                if (msg) {
                    msg.style.color = "#b91c1c";
                    msg.textContent = "Please enter student email and a temporary password.";
                }
                return;
            }

            if (password.length < 6) {
                if (msg) {
                    msg.style.color = "#b91c1c";
                    msg.textContent = "Password must be at least 6 characters.";
                }
                return;
            }

            const submitBtn = createStudentForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Creating...";
            }

            try {
                const secAuth = getSecondaryAuth();
                if (!secAuth) {
                    if (msg) {
                        msg.style.color = "#b91c1c";
                        msg.textContent = "Secondary Firebase app is not available.";
                    }
                    return;
                }

                // Create the new user with secondary auth.
                await createStudentAccount({
                    db,
                    firebase,
                    secondaryAuth: secAuth,
                    teacherUid: appState.currentUser.uid || null,
                    email,
                    password,
                });

                // ØªÙ†Ø¸ÙŠÙ Ø§Ù„Ø­Ù‚Ùˆل
                emailEl.value = "";
                passwordEl.value = "";

                if (msg) {
                    msg.style.color = "#15803d";
                    msg.textContent =
                        "Student account created successfully. Share the email and password with the student.";
                }
            } catch (err) {
                console.error("Create student error:", err);
                if (msg) {
                    msg.style.color = "#b91c1c";
                    if (err.code === "auth/email-already-in-use") {
                        msg.textContent = "This email is already in use. Pick another email for the student.";
                    } else if (err.code === "auth/invalid-email") {
                        msg.textContent = "Invalid email format.";
                    } else {
                        msg.textContent = "Error: " + err.message;
                    }
                }
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Create Student";
                }
            }
        });
    }
});


async function handleCreateStudentSubmit(e) {
    e.preventDefault();
    console.log("Create student submitted");
    if (!appState.currentUser || appState.currentUser.role !== "teacher") {
        alert("Only teachers can create students.");
        return;
    }

    const emailEl = document.getElementById("newStudentEmail");
    const passwordEl = document.getElementById("newStudentPassword");
    const msg = document.getElementById("createStudentMsg");

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if (msg) {
        msg.textContent = "";
        msg.style.color = "#111827";
    }

    if (!email || !password) {
        if (msg) {
            msg.style.color = "#b91c1c";
            msg.textContent = "Please enter student email and a temporary password.";
        }
        return;
    }

    if (password.length < 6) {
        if (msg) {
            msg.style.color = "#b91c1c";
            msg.textContent = "Password must be at least 6 characters.";
        }
        return;
    }

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating...";
    }

    try {
        const secAuth = getSecondaryAuth();
        if (!secAuth) {
            if (msg) {
                msg.style.color = "#b91c1c";
                msg.textContent = "Secondary Firebase app is not available.";
            }
            return;
        }

        await createStudentAccount({
            db,
            firebase,
            secondaryAuth: secAuth,
            teacherUid: appState.currentUser.uid || null,
            email,
            password,
        });

        emailEl.value = "";
        passwordEl.value = "";

        if (msg) {
            msg.style.color = "#15803d";
            msg.textContent =
                "Student account created successfully. Share the email and password with the student.";
        }
    } catch (err) {
        console.error("Create student error:", err);
        if (msg) {
            msg.style.color = "#b91c1c";
            if (err.code === "auth/email-already-in-use") {
                msg.textContent = "This email is already in use. Pick another email.";
            } else if (err.code === "auth/invalid-email") {
                msg.textContent = "Invalid email format.";
            } else {
                msg.textContent = "Error: " + err.message;
            }
        }
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Create Student";
        }
    }
}








let __toastTimer = null;
function toast(message) {
    const existing = document.getElementById("toast");
    let el = existing;
    if (!el) {
        el = document.createElement("div");
        el.id = "toast";
        el.style.position = "fixed";
        el.style.left = "50%";
        el.style.bottom = "18px";
        el.style.transform = "translateX(-50%)";
        el.style.padding = "10px 12px";
        el.style.borderRadius = "12px";
        el.style.background = "rgba(17,24,39,.92)";
        el.style.color = "white";
        el.style.fontSize = ".9rem";
        el.style.zIndex = "9999";
        el.style.maxWidth = "92vw";
        el.style.boxShadow = "0 10px 20px rgba(0,0,0,.18)";
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.style.opacity = "1";
    if (__toastTimer) clearTimeout(__toastTimer);
    __toastTimer = setTimeout(() => {
        el.style.opacity = "0";
    }, 1800);
}




// ---- Expose key functions to window for cross-module access ----
try { Object.assign(window, { saveLessonToLS, toast, renderLesson, renderLevels }); } catch (e) { }



