const db = require("../firebase");
const {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
  updateDoc,
} = require("firebase/firestore");
const Bin = require("../models/bin");
const { onRegressionAlertPublished } = require("firebase-functions/v2/alerts/crashlytics");

const binRef = collection(db, "bin");

exports.BinController = {
  getAllBin: async (req, res) => {
    try {
      onSnapshot(binRef, (snapshot) => {
        const data = [];
        if (snapshot.docs.length === 0) {
          res.status(404).send({ error : "No trash bin data found" });
        }
        snapshot.docs.forEach((docs) => {
          const bin = new Bin(
            docs.id,
            docs.data().timestamp,
            docs.data().capacity,
            docs.data().trashbin
          );
          data.push(bin);
        });
        res.send(data);
      });
    } catch (err) {
      res.status(500).send({ error : err.message });
    }
  },
  addBin: async (req, res) => {
    try {
      const data = req.body;
      await addDoc(binRef, data);
      res.send({ message: "Succesfully added data!" });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  },
  getBin: (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "bin", id);
      onSnapshot(docRef, (snapshot) => {
        if(!snapshot.exists) {
            res.status(404).send({error : "The data does not exist"})
        }
        const data = new Bin(
          snapshot.id,
          snapshot.data().timestamp,
          snapshot.data().capacity,
          snapshot.data().trashbin
        );
        res.send(data);
      });
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  },
  patchBin : (req, res) => {
    const id = req.params.id
    const docRef = doc(db, 'bin', id)
    updateDoc(docRef, req.body)
      .then(() => {
        res.send({message : 'successfully updated the data'})
      })
      .catch(e => {
        res.status(500).send({error : e.message})
      })
  }
};
