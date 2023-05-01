const { collection, setDoc, doc, onSnapshot, deleteDoc } = require("firebase/firestore");
const db = require("../firebase");

const trashbinRef = collection(db, "trashbin");

const Trashbin = require('../models/trashbin')

exports.TrashbinController = {
  getAllTrashbin: (req, res) => {
    const data = [];
    try {
      onSnapshot(trashbinRef, (snapshot) => {
        snapshot.docs.forEach((docs) => {
          data.push({ ...docs.data(), id: docs.id });
        });
        res.send(data);
      });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getTrashbin : (req, res) => {
    const id = req.params.id
    const docRef = doc(db, 'trashbin', id)
    try {
      onSnapshot(docRef, (snapshot) => {
        const data = new Trashbin(
          snapshot.data().longitude,
          snapshot.data().latitude,
          snapshot.data().type,
          snapshot.data().location,
          snapshot.data().establishment
        )
        res.send(data)
      })
    } catch(e) {
      res.status(500).send({error : e.message})
    }
  },
  deleteTrashbin : (req, res) => {
    const id = req.params.id
    const docRef = doc(db, 'trashbin', id)
    deleteDoc(docRef)
      .then(() => {
        res.send({message : `Successfully deleted trash bin :${id}` })
      })
      .catch(e => {
        res.status(500).send({error : e.message})
      })
  },
  addTrashbin: (req, res) => {
    const id = req.params.id;
    const docRef = doc(db, "trashbin", id);
    setDoc(docRef, {
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      location: req.body.location,
      establishment: req.body.establishment,
    })
      .then(() => {
        res.send({ message: "successfully added data" });
      })
      .catch((e) => {
        res.status(500).send({ error : e.message });
      });
  },
};
