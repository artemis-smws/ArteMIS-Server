const db = require("../config/firebase");
const {
  collection,
  doc,
  serverTimestamp,
} = require("firebase/firestore");
const Bin = require("../models/bin");
const { CRUD } = require("../utils/crud");

const binRef = collection(db, "bin");

exports.BinController = {
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
  getBin: (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "bin", id);
      const data = CRUD.read(docRef);
      res.send(data);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  },
  patchBin: (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "bin", id);
      const data = CRUD.update(docRef, req.body);
      res.send(data);
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  },
};
