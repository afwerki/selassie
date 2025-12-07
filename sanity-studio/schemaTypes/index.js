// /sanity/schemaTypes/index.js

import { homepage } from "./homepage";
import { quizQuestion } from "./quizQuestion";
import { quizSet } from "./quizSet";
import { event } from "./event";   // ✅ NEW

// ... import any other schemas you have

export const schemaTypes = [
  homepage,
  quizQuestion,
  quizSet,
  event,        // ✅ REGISTER EVENT SCHEMA HERE
  // ...other schemas (if any)
];
