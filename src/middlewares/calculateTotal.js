const { collection, queryEqual, doc } = require("firebase/firestore");
const db = require("../firebase");

const { CRUD } = require("../module/crud");

const wasteRef = collection(db, "waste");

exports.calculateTotalMiddleware = async (req, res, next) => {
  const docRef = doc(db, "waste", req.params.id);
  const latestDoc = await CRUD.read(docRef);
  const request_key = Object.keys(req.body);
  let req_waste_type;
  let building_name
  request_key.forEach((key) => {
    if (key != "overall_weight") {
      building_name = key;
      re
    }
  });
  if(latestDoc[0][building_name].weight[req.body[building_name]]) {

  
  

  let totalWeight = req.body[request_key].weight.total;
  

  req.body.overall_weight = totalWeight + latestDoc[0].overall_weight;
  next();
};
