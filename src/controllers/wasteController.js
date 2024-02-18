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
const db = require("../config/firebase");
const { CRUD } = require("../utils/crud");
const { wasteRef } = require('../utils/getDocReference');
const { getLast30Days, getLatest } = require("../utils/getLatest");
const { defaultWasteSchema } = require("../models/defaultWasteSchema");

exports.WasteController = {
  getAllWaste: async (req, res) => {
    try {
      const q = query(wasteRef, orderBy("createdAt", "asc"))
      const data = await CRUD.readAll(q);
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
  getLast7Days: async (req, res) => {
    const q = query(wasteRef, orderBy("createdAt", "desc"), limit(7));
    try {
      const docs = await CRUD.readAll(q);
      res.send(docs);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getLast30Days: async (req, res) => {
    const q = query(wasteRef, orderBy("createdAt", "desc"), limit(30));
    try {
      const docs = await CRUD.readAll(q);
      res.send(docs);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getLast90Days: async (req, res) => {
    const q = query(wasteRef, orderBy("createdAt", "desc"), limit(90));
    try {
      const docs = await CRUD.readAll(q);
      res.send(docs);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getLast365Days: async (req, res) => {
    const q = query(wasteRef, orderBy("createdAt", "desc"), limit(365));
    try {
      const docs = await CRUD.readAll(q);
      res.send(docs);
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
  getHighest: async (req, res) => {
    try {
      const q = query(wasteRef, orderBy("overall_weight", "desc"), limit(1));
      const data = await CRUD.readAll(q);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getLowest: async (req, res) => {
    try {
      const q = query(wasteRef, orderBy("overall_weight", "asc"), limit(1));
      const data = await CRUD.readAll(q);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  postWaste: async (req, res) => {
    try {
      const docRef = doc(db, "waste", serverTimestamp())
      const data = await CRUD.createSpecific(wasteRef, {
        ...req.body,
        createdAt: serverTimestamp(),
      });
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
  resetWasteData: async (req, res) => {
    try {
      const id = req.params.id
      const docRef = doc(db, "waste", id)
      const defaultData = await defaultWasteSchema()
      const data = await CRUD.update(docRef, defaultData)
      res.send(data)
    } catch (e) {
      res.status(500).send({error : e.message})
    }
  },
  // only access for the users
  patchWaste: async (req, res) => {
    try {
      const id = req.params.id;
      const {
        building_name,
        campus,
        weight,
        overall_weight,
        overall_residual,
        overall_recyclable,
        overall_infectious,
        overall_biodegradable
      } = req.body
      const docRef = doc(db, "waste", id);
      
      const data = await CRUD.update(docRef, {
        [building_name]: {
          campus: campus,
          weight: {
            biodegradable: weight.biodegradable,
            residual: weight.residual,
            recyclable: weight.recyclable,
            infectious: weight.infectious,
            total: weight.total,
          },
        },
        overall_weight: overall_weight,
        overall_residual : overall_residual,
        overall_recyclable : overall_recyclable,
        overall_infectious : overall_infectious,
        overall_biodegradable : overall_biodegradable
      });
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
