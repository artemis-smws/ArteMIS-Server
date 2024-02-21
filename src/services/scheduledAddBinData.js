const functions = require("firebase-functions")
const { collection, doc, setDoc } = require("firebase/firestore");
const BinDataModel = require("../models/binWasteSchema");
const db = require("../config/firebase");
const createDateId = require("../utils/createDateId");

exports.AddBinData = functions.pubsub
	.schedule("5 0 * * *")
	.timeZone("Asia/Manila")
	.onRun(async (context) => {
		// retrieve all trashbin name
		const trashbinRef = collection(db, "trashbin");
		const trashbinList = await CRUD.readAll(trashbinRef);
		await trashbinList.forEach(async (trashbin) => {
			const binModel = new BinDataModel();
			const data = await binModel.defaultBinData(trashbin.id);
			const docName = createDateId() + "_" + trashbin.id;
			await setDoc(doc(db, "bin", docName), data);
			console.log("successfully posted");
		});
		return null;
	});
