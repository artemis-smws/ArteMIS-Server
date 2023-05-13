const {
  collection,
} = require("firebase/firestore");
const db = require("../firebase");
const { CRUD } = require("../crud");

const total_yearlyRef = collection(db, "total_yearly");

exports.total_yearlyController = {
  getAll: async (req, res) => {
    try {
      const data = await CRUD.readAll(total_yearlyRef);
      res.send(data);
    } catch (e) {
      res.send({ error: e.message });
    }
  },
  postData: async(req, res) => {
    try {
      const data = await CRUD.create(total_yearlyRef, req.body);
      res.send(data)
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
