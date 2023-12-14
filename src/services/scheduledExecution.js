const functions = require("firebase-functions");
const db = require("../config/firebase");
const {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
} = require("firebase/firestore");
const { CRUD } = require("../utils/crud");
const { getLatest, getLast7Days } = require("../utils/getLatest");
const { wasteRef, buildingRef, weeklyRef} = require("../utils/getDocReference");
const createDateId = require("../utils/createDateId");
const { defaultWasteSchema } = require("../models/defaultWasteSchema");

// put predefined document field for the day
exports.wasteSchedPost = functions.pubsub
  .schedule("5 0 * * *")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    const data = await defaultWasteSchema();
    const docName = createDateId()
    await setDoc(doc(db, 'waste', docName), data);
    console.log("successfully posted");
    return null;
  });