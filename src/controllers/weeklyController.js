const { collection } = require("firebase/firestore");
const db = require("../firebase");
const { CRUD } = require("../module/crud");

const weeklyRef = collection(db, "weekly");

exports.WeeklyRouter = {
  getAll: async (req, res) => {
    try {
      const data = await CRUD.readAll(weeklyRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
