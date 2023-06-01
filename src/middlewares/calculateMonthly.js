const { CRUD } = require("../module/crud");
const { getLatest } = require("../module/getLatest");
const { doc, collection, updateDoc, query, orderBy, limit, serverTimestamp, where } = require("firebase/firestore");
const db = require("../firebase");

exports.calculateMonthlyMiddleware = async (req, res, next) => {
  const monthlyRef = collection(db, "monthly");
  const buildingRef = collection(db, "building");
  const statusRef = collection(db, "status");
  const wasteRef = collection(db, "waste");
  const latestMonthDoc = await getLatest(monthlyRef);
  const buildingDocs = await CRUD.readAll(buildingRef);
  const req_keys = Object.keys(req.body);
  const reqBuildingName = req_keys[0];

  // identified whether the date has 30 or 31 days
  const monthDaysWith31Days = [
    "January",
    "March",
    "May",
    "July",
    "August",
    "October",
    "December",
  ];
  // calculate the total weight per building
  const registedBuildingList = {};
  // get all building regardless of campus 
  buildingDocs.forEach((campus) => {
    const keys = Object.keys(campus);
    keys.forEach((building) => {
      if (building != "id") {
        // predefine the building list for passed object data
        Object.assign(registedBuildingList, {[building] : 0})
      }
    });
  });
  // count building with data
  let building_count = 1;
  const buildingList = Object.keys(registedBuildingList);
  buildingList.forEach(building => {
    if(latestMonthDoc[0].buildings[building] != 0) {
      building_count++
    }
  })
  // add upcoming building data
  let dayCount = 30;
  monthDaysWith31Days.forEach((month) => {
    if (latestMonthDoc[0].id.includes(month)) {
      dayCount = 31;
    }
  });
  const currentMonth = new Date()
  const q = query(wasteRef, where("createdAt", ">=", new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)), where('createdAt', '<=', new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)))
  const docs = await CRUD.readAll(q);
  // add all total for each building 
  docs.forEach((doc) => { 
    buildingList.forEach((building) => {
      registedBuildingList[building] += doc[building].weight.total
    })
  })








  const preExistingData = latestMonthDoc[0].buildings[reqBuildingName];
  Object.assign(registedBuildingList, {[reqBuildingName] : preExistingData + req.body[reqBuildingName].weight.total})
  // compute for the overall weights
  

  let total_weight = req.body[reqBuildingName].weight.total;
  let total_food_waste = req.body[reqBuildingName].weight.food_waste;
  let total_recyclable = req.body[reqBuildingName].weight.recyclable.total;
  let total_residual = req.body[reqBuildingName].weight.residual;
  const averagePerDay = total_weight / dayCount;

  docs.forEach((doc) => {
    total_weight += doc.overall_weight;
    total_food_waste += doc.overall_food_waste_weight;
    total_recyclable += doc.overall_recyclable_weight;
    total_residual += doc.overall_residual_weight;
  });
  // update the date with the upcoming request data
  const data = {
    registered_buildings: building_count,
    types: {
      food_waste: total_food_waste,
      recyclable: total_recyclable,
      residual: total_residual
    },
    overall_total: total_weight + req.body[reqBuildingName].weight.total,
    buildings: registedBuildingList,
    average: averagePerDay,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, "monthly", latestMonthDoc[0].id), data);
  next()
};
