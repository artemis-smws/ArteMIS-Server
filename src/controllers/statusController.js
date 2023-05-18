const {
  collection,
} = require("firebase/firestore");
const db = require("../firebase");
const { CRUD } = require("../module/crud");

const statusRef = collection(db, "status");
const yearlyRef = collection(db, 'yearly')
const monthlyRef = collection(db, 'monthly')

exports.statusController = {
  getAllStatus: async (req, res) => {
    try {
      const data = await CRUD.readAll(statusRef);
      res.send(data);
    } catch (e) {
      res.send({ error: e.message });
    }
  },
  getAllYearly: async (req, res) => {
    try {
      const data = await CRUD.readAll(yearlyRef)
      res.send(data)
    } catch (e) {
      res.send({error : e.message})
    }
  },
  getAllMonthly: async (req, res) => {
    try {
      const data = await CRUD.readAll(monthlyRef)
      res.send(data)
    } catch (e) {
      res.send({error : e.message})
    }
  },
  postData: async(req, res) => {
    try {
      const data = await CRUD.create(statusRef, req.body);
      res.send(data)
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
