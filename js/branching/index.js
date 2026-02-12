import { dialogueId as dailyId, dialogue as daily } from './beginner/dailyRoutine.js';
import { dialogueId as shoppingId, dialogue as shopping } from './preIntermediate/shopping.js';
import { dialogueId as weatherId, dialogue as weather } from './preIntermediate/weathersmalltalk.js';

import { dialogueId as hobbiesId, dialogue as hobbies } from './intermediate/hobbies.js';

// Minimal placeholders for units that do not have a full branching script yet
import { dialogueId as greetId, dialogue as greet } from './beginner/greetings.js';
import { dialogueId as foodId, dialogue as food } from './beginner/fooddrink.js';
import { dialogueId as famId, dialogue as fam } from './beginner/family.js';
import { dialogueId as transId, dialogue as trans } from './beginner/trans.js';
import { dialogueId as workId, dialogue as work } from './preIntermediate/workstudy.js';
import { dialogueId as healthId, dialogue as health } from './preIntermediate/health.js';
import { dialogueId as aptId, dialogue as apt } from './preIntermediate/apartment.js';
import { dialogueId as opinionsId, dialogue as opinions } from './intermediate/opinions.js';
import { dialogueId as complaintsId, dialogue as complaints } from './intermediate/complaints.js';
import { dialogueId as plansId, dialogue as plans } from './intermediate/plans.js';
import { dialogueId as feelingsId, dialogue as feelings } from './intermediate/feelings.js';

export const branchingDialogues = {
  [greetId]: greet,
  [foodId]: food,
  [famId]: fam,
  [dailyId]: daily,
  [transId]: trans,
  [workId]: work,
  [healthId]: health,
  [shoppingId]: shopping,
  [weatherId]: weather,
  [aptId]: apt,
  [opinionsId]: opinions,
  [complaintsId]: complaints,
  [plansId]: plans,
  [hobbiesId]: hobbies,
  [feelingsId]: feelings,
};

export function findBranchingIdFor(levelName, unitName) {
  return Object.keys(branchingDialogues).find((id) => {
    const d = branchingDialogues[id];
    return d && d.meta && d.meta.level === levelName && d.meta.unit === unitName;
  });
}
