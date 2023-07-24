const { collection, queryEqual, doc } = require("firebase/firestore");
const db = require("../config/firebase");

const { CRUD } = require("../utils/crud");
const { getLatest } = require("../utils/getLatest");

const wasteRef = collection(db, "waste");

exports.calculateTotalMiddleware = async (req, res, next) => {
  const latestDoc = await getLatest(wasteRef);
  const req_keys = Object.keys(req.body);
  // get for validation and getting the request body
  const building_name = req_keys[0];
  let total_weight = 0;
  let total_food_waste = 0;
  let total_recyclable = 0;
  let total_residual = 0;

  // get building list
  const building_list = [];
  const docs_keys = Object.keys(latestDoc[0]);
  await docs_keys.forEach((key) => {
    if (key != "overall_weight" && key != "id" && key != "createdAt") {
      building_list.push(key);
    }
  });
  // add all types of waste per building
  building_list.forEach((building) => {
    total_food_waste += latestDoc[0][building].weight.food_waste || 0;
    total_recyclable += latestDoc[0][building].weight.recyclable.total || 0;
    total_residual += latestDoc[0][building].weight.residual || 0;
    total_weight += latestDoc[0][building].weight.total || 0;
  });
  // check if the building has data
  if (latestDoc[0][building_name].weight.total != 0) {
    // if it has data, subtract the total weight of the building from the overall weight
    total_weight -= latestDoc[0][building_name].weight.total;
  }
  // add the request data to the overall_weight
  req.body.overall_weight = total_weight + req.body[building_name].weight.total;
  req.body.overall_food_waste =
    total_food_waste + req.body[building_name].weight.food_waste;
  req.body.overall_recyclable =
    total_recyclable + req.body[building_name].weight.recyclable.total || 0;
  req.body.overall_residual =
    total_residual + req.body[building_name].weight.residual;
  next();
};
