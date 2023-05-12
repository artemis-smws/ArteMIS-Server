const {
  onSnapshot,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDoc,
} = require("firebase/firestore");
const db = require("../firebase");
const Waste = require("../models/waste");
const { await, CRUD } = require("../crud");

const wasteRef = collection(db, "waste");

exports.WasteController = {
  getAllWaste: async (req, res) => {
    try {
      const data = await CRUD.readAll(wasteRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getLatest: async (req, res) => {
    const latest = query(wasteRef, orderBy("createdAt", "desc"), limit(1));
    try {
      const data = await CRUD.readAll(latest);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getWaste: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "waste", id);
      const data = await CRUD.read(docRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  postWaste: async (req, res) => {
    try {
      const data = await CRUD.create(wasteRef, req.body);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  deleteWaste: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "waste", id);
      const data = await CRUD.delete(docRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  patchWaste: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "waste", id);
      const data = await CRUD.update(docRef, req.body);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
