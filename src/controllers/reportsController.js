const {
  collection,
  onSnapshot,
  getDoc,
  doc,
  serverTimestamp,
  addDoc,
} = require("firebase/firestore");
const db = require("../firebase");

const reportsRef = collection(db, "reports");

exports.ReportsController = {
  getAllReport: (req, res) => {
    try {
      onSnapshot(reportsRef, (snapshot) => {
        const data = [];
        snapshot.docs.forEach((doc) => {
          data.push({ ...doc.data(), id: doc.id });
        });
        res.send(data);
      });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getReport: (req, res) => {
    const id = req.params.id;
    const docRef = doc(db, "reports", id);
    try {
      onSnapshot(docRef, (snapshot) => {
        res.send(snapshot.data());
      });
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  postReport: (req, res) => {
    const data = {
      title: req.body.title,
      type: req.body.type,
      image: req.body.image,
      location: req.body.image,
      description: req.body.description,
      submittedAt: serverTimestamp(),
    };
    addDoc(reportsRef, data)
      .then(() => {
        res.send({ message: "Successfully send report" });
      })
      .catch((e) => {
        res.status(500).send({ error: e.message });
      });
  },
};
