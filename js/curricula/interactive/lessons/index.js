// Auto-generated
import { lessonId as greetingsId, lesson as greetings } from './beginner/greetings.js';
import { lessonId as fooddrinkId, lesson as fooddrink } from './beginner/fooddrink.js';
import { lessonId as familyId, lesson as family } from './beginner/family.js';
import { lessonId as dailyId, lesson as dailyRoutine } from './beginner/dailyRoutine.js';
import { lessonId as transportationId, lesson as transportation } from './beginner/trans.js';
import { lessonId as workstudyId, lesson as workstudy } from './preIntermediate/workstudy.js';
import { lessonId as weathersmalltalkId, lesson as weathersmalltalk } from './preIntermediate/weathersmalltalk.js';
import { lessonId as healthId, lesson as health } from './preIntermediate/health.js';
import { lessonId as apartmentId, lesson as apartment } from './preIntermediate/apartment.js';
import { lessonId as shoppingId, lesson as shopping } from './preIntermediate/shopping.js';
import { lessonId as feelingsId, lesson as feelings } from './intermediate/feelings.js';
import { lessonId as complaintsId, lesson as complaints } from './intermediate/Complaints.js';
import { lessonId as hobbiesId, lesson as hobbies } from './intermediate/hobbies.js';
import { lessonId as plansId, lesson as plans } from './intermediate/plans.js';
import { lessonId as opinionsId, lesson as opinions } from './intermediate/opinions.js';
import { lessonId as beginnerReview1Id, lesson as beginnerReview1 } from './review/beginnerReview1.js';
import { lessonId as beginnerFinalId, lesson as beginnerFinal } from './review/beginnerFinal.js';
import { lessonId as preIntermediateReview2Id, lesson as preIntermediateReview2 } from './review/preIntermediateReview2.js';
import { lessonId as preIntermediateFinalId, lesson as preIntermediateFinal } from './review/preIntermediateFinal.js';
import { lessonId as intermediateReview3Id, lesson as intermediateReview3 } from './review/intermediateReview3.js';
import { lessonId as intermediateFinalId, lesson as intermediateFinal } from './review/intermediateFinal.js';
import { lessonId as placementTestId, lesson as placementTest } from './review/placementTest.js';
import { practiceChallengeOverrides } from '../practiceChallengeOverrides.js';

const withPracticeChallenge = (id, lesson) => {
  if (String(id).startsWith('Review-') || String(id).startsWith('Assessment-')) return lesson;
  const override = practiceChallengeOverrides[id];
  if (!override) return lesson;
  return { ...lesson, practice: { ...lesson.practice, ...override } };
};

export const defaultLessons = {
  [greetingsId]: withPracticeChallenge(greetingsId, greetings),
  [fooddrinkId]: fooddrink,
  [familyId]: withPracticeChallenge(familyId, family),
  [transportationId]: withPracticeChallenge(transportationId, transportation),
  [weathersmalltalkId]: withPracticeChallenge(weathersmalltalkId, weathersmalltalk),
  [apartmentId]: withPracticeChallenge(apartmentId, apartment),
  [workstudyId]: withPracticeChallenge(workstudyId, workstudy),
  [dailyId]: withPracticeChallenge(dailyId, dailyRoutine),
  [healthId]: withPracticeChallenge(healthId, health),
  [complaintsId]: withPracticeChallenge(complaintsId, complaints),
  [shoppingId]: withPracticeChallenge(shoppingId, shopping),
  [feelingsId]: withPracticeChallenge(feelingsId, feelings),
  [plansId]: withPracticeChallenge(plansId, plans),
  [hobbiesId]: withPracticeChallenge(hobbiesId, hobbies),
  [opinionsId]: withPracticeChallenge(opinionsId, opinions),
  [beginnerReview1Id]: withPracticeChallenge(beginnerReview1Id, beginnerReview1),
  [beginnerFinalId]: withPracticeChallenge(beginnerFinalId, beginnerFinal),
  [preIntermediateReview2Id]: withPracticeChallenge(preIntermediateReview2Id, preIntermediateReview2),
  [preIntermediateFinalId]: withPracticeChallenge(preIntermediateFinalId, preIntermediateFinal),
  [intermediateReview3Id]: withPracticeChallenge(intermediateReview3Id, intermediateReview3),
  [intermediateFinalId]: withPracticeChallenge(intermediateFinalId, intermediateFinal),
  [placementTestId]: placementTest,
};
