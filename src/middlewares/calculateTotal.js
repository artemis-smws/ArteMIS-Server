const { collection, queryEqual, doc } = require("firebase/firestore");
const db = require("../firebase");

const { CRUD } = require("../crud");

const wasteRef = collection(db, "waste");

exports.calculateTotalMiddleware = async (req, res, next) => {
  const docRef = doc(db, "waste", req.params.id);
  const latestDoc = await CRUD.read(docRef);
  const request_key = Object.keys(req.body)[0];

  let totalWeight = req.body[request_key].weight.total;

  req.body.overall_weight = totalWeight + latestDoc[0].overall_weight;
  next();
};
