const { collection, queryEqual, doc, refEqual } = require("firebase/firestore");
const db = require("../config/firebase");
const { getLatest } = require("../utils/getLatest");

exports.calculateTotalMiddleware = async (req, res, next) => {
  const {
    building_name,
    weight
  } = req.body

  const wasteRef = collection(db, "waste");
  const latestDoc = await getLatest(wasteRef);
  const {overall_recyclable, overall_residual, overall_biodegradable, overall_infectious, overall_weight} = latestDoc[0]
  // if the building to post already has a data
  // remove the existing data and replace it with the new data for the overall weights
  if(latestDoc[0][building_name].weight.total != 0) {
    const {biodegradable, recyclable, residual, infectious, total} = latestDoc[0][building_name].weight
    req.body.overall_weight = (overall_weight - total) + weight.total
    req.body.overall_biodegradable = (overall_biodegradable - biodegradable) + weight.biodegradable
    req.body.overall_recyclable = (overall_recyclable - recyclable.total) + weight.recyclable.total
    req.body.overall_residual = (overall_residual - residual) + weight.residual
    req.body.overall_infectious = (overall_infectious - infectious) + infectious
  } else {
    req.body.overall_weight = overall_weight + weight.total;
    req.body.overall_biodegradable = overall_biodegradable + weight.biodegradable || 0;
    req.body.overall_recyclable = overall_recyclable + weight.recyclable.total || 0;
    req.body.overall_residual = overall_residual + weight.residual || 0;
    req.body.overall_infectious = overall_infectious + weight.infectious || 0
  }

  next();
};
