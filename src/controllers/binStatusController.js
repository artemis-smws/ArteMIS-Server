const db = require("../config/firebase");
const {
	collection,
	doc,
	serverTimestamp,
	where,
	orderBy,
	query,
	limit,
	setDoc,
	getCountFromServer,
} = require("firebase/firestore");
const createDateId = require("./../utils/createDateId");
// const Bin = require("../models/bin");
const { CRUD } = require("../utils/crud");
const BinDataModel = require("../models/binWasteSchema");

const binRef = collection(db, "bin");
const logRef = collection(db, "logs");

exports.BinStatusController = {
	getAllBin: async (req, res) => {
		try {
			const data = await CRUD.readAll(binRef);
			res.send(data);
		} catch (err) {
			res.status(500).send({ error: err.message });
		}
	},
	addBin: async (req, res) => {
		try {
			const data = await CRUD.create(binRef, {
				capacity: req.body.capacity,
				timestamp: serverTimestamp(),
				trashbin: req.body.trashbin,
			});
			res.send(data);
		} catch (err) {
			res.status(500).send({ error: err.message });
		}
	},
	getBin: async (req, res) => {
		try {
			const id = req.params.id;
			const docRef = doc(db, "bin", id);
			const data = await CRUD.read(docRef);
			res.send(data);
		} catch (err) {
			res.status(500).send({ error: err.message });
		}
	},
	patchBin: async (req, res) => {
		try {
			const prefix = createDateId();
			const id = prefix + "_" + req.params.id;
			// send data to logs table
			const response1 = await CRUD.create(logRef, {
				frequency: req.body.frequency,
				capacity: req.body.capacity,
				timestamp: serverTimestamp(),
				trashbin: req.params.id,
				type: req.body.type,
			});
			console.log(response1);
			console.log("Succcessfully added to logs table");
			// send data to bin table
			const docRef = doc(db, "bin", id);
			const data = await CRUD.update(docRef, {
				frequency: req.body.frequency,
				capacity: req.body.capacity,
				timestamp: serverTimestamp(),
				trashbin: req.params.id,
				type: req.body.type,
			});
			res.send(data);
		} catch (err) {
			res.status(500).send({ error: err.message });
		}
	},
	getLatestBinStatus: async (req, res) => {
		try {
			if(req.params.trashbin_name === undefined){
				res.status(400).send({ error: "Please provide trashbin name" });
			}
			const trashbinRef = collection(db, "trashbin");
			const binCount = await getCountFromServer(trashbinRef)
			const q = query(binRef, orderBy("timestamp", "desc"), limit(binCount.data().count));
			const data = await CRUD.readAll(q);
			console.log(data)
			res.send(data);
		} catch (err) {
			res.status(500).send({ error: err.message });
		}
	},
	addLatestBinStatus: async (req, res) => {
		try {
			const trashbinRef = collection(db, "trashbin");
			const trashbinList = await CRUD.readAll(trashbinRef);
			await trashbinList.forEach(async (trashbin) => {
				const binModel = new BinDataModel();
				const data = await binModel.defaultBinData(trashbin.id, trashbin.type);
				const prefix = createDateId();
				const docName = prefix + "_" + trashbin.id;
				await setDoc(doc(db, "bin", docName), data);
				console.log("successfully posted");
			});
			res.send("Successfully added latest bin status");
		} catch (err) {
			res.status(500).send({ error: err.message });
		}
	},
};
