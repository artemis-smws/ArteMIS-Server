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

const wasteRef = collection(db, "waste");

exports.WasteController = {
  getAllWaste: (req, res) => {
    try {
      const data = [];
      onSnapshot(wasteRef, (snapshot) => {
        snapshot.docs.forEach((doc) => {
          const staged = new Waste(
            doc.id,
            doc.data().location,
            doc.data().food_waste,
            doc.data().hazardous_waste,
            doc.data().recyclable,
            doc.data().residual,
            doc.data().createdAt
          );
          data.push(staged);
        });
        res.send(data);
      });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getLatest: (req, res) => {
    const latest = query(wasteRef, orderBy("createdAt"), limit(1));
    try {
      onSnapshot(latest, (snapshot) => {
        const data = [];
        snapshot.docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        res.send(data);
      });
    } catch (e) {
      res.status(500).send({error : e.message})
    }
  },
  getWaste: (req, res) => {
    const id = req.params.id;
    const docRef = doc(db, "waste", id);
    try {
      onSnapshot(docRef, (snapshot) => {
        if (!snapshot.exists) {
          res.status(404).send({ error: "The data does not exist" });
        }
        const data = new Waste(
          snapshot.id,
          snapshot.data().location,
          snapshot.data().food_waste,
          snapshot.data().hazardous_waste,
          snapshot.data().recyclable,
          snapshot.data().residual,
          snapshot.data().createdAt
        );
        res.send(data);
      });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  postWaste : (req, res) => {
    addDoc(wasteRef, req.body)
      .then(() => {
        res.send({message : "Successfully added data"})
      })
      .catch(e => {
        res.send({message : e.message})
      })
  },
  deleteWaste: (req, res) => {
    const id = req.params.id;
    const docRef = doc(db, "waste", id);
    deleteDoc(docRef)
      .then(() => {
        res.send({ message: "Successfully deleted data" });
      })
      .catch((e) => {
        res.status(500).send({ error: e.message });
      });
  },
  patchWaste: (req, res) => {
    const id = req.params.id;
    const docRef = doc(db, "waste", id);
    updateDoc(docRef, req.body)
      .then(() => {
        res.send({ message: "successfully updated the data" });
      })
      .catch((e) => {
        res.status(500).send({ error: e.message });
      });
  },
};
