const {
  collection,
} = require("firebase/firestore");
const db = require("../firebase");
const { CRUD } = require("../module/crud");
const { getLast30Days, getLast7Days, getLatest } = require("../module/getLatest");

const statusRef = collection(db, "status");
const yearlyRef = collection(db, 'yearly')
const monthlyRef = collection(db, 'monthly')
const weeklyRef = collection(db, "weekly")
const wasteRef = collection(db, "waste")

exports.statusController = {
  getAllStatus: async (req, res) => {
    try {
      const data = await CRUD.readAll(statusRef);
      res.send(data);
    } catch (e) {
      res.send({ error: e.message });
    }
  },
  getLatestStatus: async (req, res) => {
    try {
      const data = await getLatest(statusRef)
      res.send(data)
    } catch (e) {
      res.send({error : e.message})
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
  getLatestMonthly: async (req, res) => {
    try {
      const data = await getLatest(monthlyRef)
      res.send(data)
    } catch (e) {
      res.send({error : e.message})
    }
  },
  getAllMonthly : async (req, res) => {
    try {
      const data = await CRUD.readAll(monthlyRef)
      res.send(data)
    } catch (e) {
      res.status(500).send({error : e.message})
    }
  },
  getLatestWeekly : async (req, res) => {
    try {
      const data = getLatest(weeklyRef)
      res.send(data)
    } catch (e) {
      res.status(500).send({error : e.message})
    }
  },
  getAllWeekly : async (req, res) => {
    try {
      const data = await CRUD.readAll(weeklyRef)
      res.send(data)
    } catch (e) {
      res.status(500).send({error : e.message})
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
