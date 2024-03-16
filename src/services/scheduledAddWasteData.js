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
const createDateId = require("../utils/createDateId");
const { defaultWasteSchemaSchedule } = require("../models/defaultWasteSchema");

// put predefined document field for the day
exports.wasteSchedPost = functions.pubsub
	.schedule("5 0 * * *")
	.timeZone("Asia/Manila")
	.onRun(async (context) => {
		try {
			const data = await defaultWasteSchemaSchedule();
			const docName = createDateId();
			await setDoc(doc(db, "waste", docName), data);
			console.log("successfully posted");
			return null;
		} catch (e) {
			console.log(e.message);
		}
	});
