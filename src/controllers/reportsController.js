const {
  collection,
  onSnapshot,
  getDoc,
  doc,
  serverTimestamp,
  addDoc,
} = require("firebase/firestore");
const db = require("../config/firebase");
const { CRUD } = require("../utils/crud");

const reportsRef = collection(db, "reports");

exports.ReportsController = {
  getAllReport: async (req, res) => {
    try {
      const data = CRUD.readAll(reportsRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getReport: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "reports", id);
      const data = CRUD.read(docRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  postReport: async (req, res) => {
    try {
      const data = await CRUD.create(reportsRef, {
        title: req.body.title,
        building : req.body.building,
        campus : req.body.campus,
        description: req.body.description,
        submittedAt: serverTimestamp(),
      });
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
