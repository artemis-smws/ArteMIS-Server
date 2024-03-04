const functions = require("firebase-functions");
const { collection, doc, setDoc } = require("firebase/firestore");
const BinDataModel = require("../models/binWasteSchema");
const db = require("../config/firebase");
const createDateId = require("../utils/createDateId");
const { CRUD } = require("../utils/crud");

exports.AddBinData = functions.pubsub
	.schedule("5 0 * * *")
	.timeZone("Asia/Manila")
	.onRun(async (context) => {
		// retrieve all trashbin name
		try {
			const trashbinRef = collection(db, "trashbin");
			const trashbinList = await CRUD.readAll(trashbinRef);
			
			return null;
		} catch (e) {
			console.log(e.message);
		}
	});
