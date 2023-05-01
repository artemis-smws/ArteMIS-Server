const { onSnapshot, collection, addDoc, doc, deleteDoc, updateDoc } = require("firebase/firestore");
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
            doc.data().hazwaste,
            doc.data().recyclable,
            doc.data().residual
          );
          data.push(staged);
        });
        res.send(data);
      });
    } catch (e) {
      res.send({ message: e.message });
    }
  },
  addWaste: (req, res) => {
    const data = {
      hazwaste: req.body.hazwaste,
      recyclable: req.body.recyclable,
      residual: req.body.residual,
    };
    addDoc(wasteRef, data)
      .then(() => {
        res.send({ message: "Successfully added data!" });
      })
      .catch((e) => {
        res.send({ message: e.message });
      });
  },
  getWaste: (req, res) => {
    const id = req.params.id;
    const docRef = doc(db, "waste", id);
    try {
      onSnapshot(docRef, (snapshot) => {
        if(!snapshot.exists) {
            res.send({message : "The data does not exist"})
        }
        const data = new Waste(
          snapshot.id,
          snapshot.data().hazwaste,
          snapshot.data().recyclable,
          snapshot.data().residual
        );
        res.send(data);
      });
    } catch (e) {
      res.send({ message: e.message });
    }
  },
  deleteWaste: (req, res) => {
    const id = req.params.id
    const docRef = doc(db, 'waste', id)
    deleteDoc(docRef)
        .then(() => {
            res.send({message : "Successfully deleted data"})
        })
        .catch(e => {
            res.send({message : e.message})
        })
  },
  patchWaste : (req, res) => {
    const id = req.params.id
    const docRef = doc(db, 'waste', id)
    updateDoc(docRef, req.body)
        .then(() => {
            res.send({message : "successfully updated the data"})
        })
        .catch(e => {
            res.send({message : e.message})
        })
  }
};
