const {
  collection,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
} = require("firebase/firestore");
const db = require("../firebase");

const trashbinRef = collection(db, "trashbin");

const Trashbin = require("../models/trashbin");
const { CRUD } = require("../module/crud");

exports.TrashbinController = {
  getAllTrashbin: async(req, res) => {
    const data = [];
    try {
      const data = await CRUD.readAll(trashbinRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getTrashbin: async(req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "trashbin", id);
      const data = await CRUD.read(docRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  deleteTrashbin: async(req, res) => {
    const id = req.params.id;
    const docRef = doc(db, "trashbin", id);
    try {
      const data = await CRUD.delete(docRef)
      res.send(data)
    } catch(e) {
      res.status(500).send({ error: e.message });
    }
  },
  addTrashbin: async(req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "trashbin", id);
      const data = await CRUD.createSpecific(docRef, req.body)
      res.send(data)
    } catch(e) {
      res.status(500).send({ error: e.message });
    }
  },
};
