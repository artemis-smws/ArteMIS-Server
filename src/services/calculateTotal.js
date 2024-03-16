const { collection, queryEqual, doc, refEqual } = require("firebase/firestore");
const db = require("../config/firebase");
const { getLatest } = require("../utils/getLatest");
const getBuildingName = require("../utils/getBuildingName");

exports.calculateTotalMiddleware = async (req, res, next) => {
  const { building_name, weight } = req.body;

  let totalWeightVar = 0;
  let totalBiodegradableVar = 0;
  let totalRecyclableVar = 0;
  let totalResidualVar = 0;
  let totalInfectiousVar = 0;

  const wasteRef = collection(db, "waste");
  const latestDoc = await getLatest(wasteRef);
  
  const buildingList = getBuildingName(latestDoc)
  // add overall total weights excluding the current building on input (even if 0)
  buildingList.forEach(building => {
    if (building != building_name) {
      totalWeightVar += latestDoc[0][building].weight.total || 0
      totalRecyclableVar += latestDoc[0][building].weight.recyclable.total || 0
      totalResidualVar += latestDoc[0][building].weight.residual || 0
      totalBiodegradableVar += latestDoc[0][building].weight.biodegradable || 0
      totalInfectiousVar += latestDoc[0][building].weight.infectious || 0
    } 
  })
  // add the current inputs 
  req.body.overall_weight = totalWeightVar + weight.total
  req.body.overall_biodegradable = totalBiodegradableVar + weight.biodegradable
  req.body.overall_recyclable = totalRecyclableVar + weight.recyclable.total
  req.body.overall_residual = totalResidualVar + weight.residual
  req.body.overall_infectious = totalInfectiousVar + weight.infectious

  next();
};
