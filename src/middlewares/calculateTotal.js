const { collection, queryEqual, doc } = require("firebase/firestore");
const db = require("../firebase");

const { CRUD } = require("../module/crud");

const wasteRef = collection(db, "waste");

exports.calculateTotalMiddleware = async (req, res, next) => {
  const docRef = doc(db, "waste", req.params.id);
  const latestDoc = await CRUD.read(docRef);
  let total_weight = latestDoc[0].overall_weight
  const req_keys = Object.keys(req.body);
  const building_name = req_keys[0]

  // check if the building has data 
  if (latestDoc[0][building_name].weight.total != 0) {
    // if it has data, subtract the total weight of the building from the overall weight
    total_weight -= latestDoc[0][building_name].weight.total
  }
  
  req.body.overall_weight = total_weight + req.body[building_name].weight.total;
  next();
};
