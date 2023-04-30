const db = require("../firebase");
const {
  collection,
  onSnapshot,
  addDoc,
  doc,
  getDoc,
} = require("firebase/firestore");
const Bin = require("../models/bin");

const binRef = collection(db, "bin");

exports.BinController = {
  getAllBin: async (req, res) => {
    try {
      onSnapshot(binRef, (snapshot) => {
        const data = [];
        if (snapshot.docs.length === 0) {
          res.send({ message: "No trash bin data found" });
        }
        snapshot.docs.forEach((docs) => {
          const bin = new Bin(
            docs.id,
            docs.data().latitude,
            docs.data().longitude,
            docs.data().timestamp,
            docs.data().capacity,
            docs.data().type
          );
          data.push(bin);
        });
        res.send(data);
      });
    } catch (err) {
      res.send({ message: err.message });
    }
  },
  addBin: async (req, res) => {
    try {
      const data = req.body;
      await addDoc(binRef, data);
      res.send({ message: "Succesfully added data!" });
    } catch (err) {
      res.send({ message: err.message });
    }
  },
  getBin: (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "bin", id);
      onSnapshot(docRef, (doc) => {
        const data = new Bin(
          doc.id,
          doc.data().latitude,
          doc.data().longitude,
          doc.data().timestamp,
          doc.data().capacity,
          doc.data().type
        );
        res.send(data);
      });
    } catch (err) {
      res.send({ message: err.message });
    }
  },
};
