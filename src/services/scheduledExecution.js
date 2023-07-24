const functions = require("firebase-functions");
const db = require("../config/firebase");
const {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
  query,
  orderBy,
  limit,
} = require("firebase/firestore");
const { CRUD } = require("../utils/crud");
const { getLatest, getLast7Days } = require("../utils/getLatest");
const { wasteRef, buildingRef, weeklyRef} = require("../utils/getDocReference");
const createDateId = require("../utils/createDateId");

// put predefined document field for the day
exports.wasteSchedPost = functions.pubsub
  .schedule("5 0 * * *")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    let data = {
      overall_weight: 0,
      createdAt: serverTimestamp(),
    };
    const buildings = await CRUD.readAll(buildingRef);
    // treated by campus
    buildings.forEach((campus) => {
      const building_list = [];
      let campus_name = campus.id;
        const keys = Object.keys(campus);
      // building_name
      keys.forEach((key) => {
        if (key != "id") {
          building_list.push(key);
        }
      });
      // insert to data object
      building_list.forEach((building) => {
        data = Object.assign({
          ...data,
          [building]: {
            campus: campus_name,
            weight: {
              food_waste: 0,
              recyclable: {
                total: 0,
              },
              residual: 0,
              total: 0,
            },
          },
        });
      });
    });
    const docName = createDateId()
    await setDoc(doc(db, 'waste', docName), data);
    console.log("successfully posted");
    return null;
  });

// put predefined doc field for the current month
exports.monthlyStatusSchedPost = functions.pubsub
  .schedule("5 0 * */1 *")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    const buildingRef = collection(db, 'building')
    const buildingList = await CRUD.readAll(buildingRef)
    const building_list = {}
    buildingList.forEach(campus => {
      const keys = Object.keys(campus)
      keys.forEach(building => {
        if(building != 'id') {
          Object.assign(building_list, {[building] : 0})
        }
      })
    })
    // create document id 
    const date = new Date()
    const month = date.getMonth();
    const year = date.getFullYear();
    const month_list = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const docID = `${month_list[month]}-${year}`;

    const data = {
      registered_buildings: 0,
      overall_total: 0,
      types: {
        food_waste: 0,
        recyclable: 0,
        residual: 0,
      },
      // [ ] list of buildings
      buildings: building_list,
      average: 0,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "monthly", docID), data);
    return null;
  });

// create pre-formatted docs for status
// status contains overall info for the day
// update this through the middleware
exports.statusSchedPostDaily = functions.pubsub
  .schedule("10 0 * * *")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    const docID = createDateId();

    const data = {
      buildings_count: 0,
      average_per_building: 0,
      overall_weight: 0,
      overall_food_waste_weight: 0,
      overall_recyclable_weight: 0,
      overall_residual_weight: 0,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "status", docID), data);
    return null;
  });

// under construction
exports.yearlyWasteSchedPost = functions.pubsub
  .schedule("0 0 1 1 *")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    const yearNow = new Date().getFullYear();
    const data = {
      buildings_count: 0,
      weight: 0,
      average: 0,
      createdAt: serverTimestamp(),
      campus: {
        Alangilan: {
          CICS: 0,
          CEAFA: 0,
        },
      },
    };
    await setDoc(doc(db, "yearly", yearNow), data);
    return null;
  });

exports.weeklyWasteSchedPost = functions.pubsub
  .schedule("0 0 * * */7")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    const docs = await getLast7Days(wasteRef);
    let building_count = 0;
    let total_weekly_weight = 0;
    let weekly_average = 0;
    let total_food_waste = 0;
    let total_residual = 0;
    let total_recyclable = 0;

    const building_set = new Set();

    // get building and building count
    docs.forEach((doc) => {
      const keys = Object.keys(doc);
      const local_building = [];
      keys.forEach((key) => {
        if (!(key == "createdAt" || key == "id" || key == "overall_weight")) {
          building_set.add(key);
          local_building.push(key);
        }
      });
      // get types
      local_building.forEach((building) => {
        total_recyclable += doc[building].weight.recyclable.total;
        total_residual += doc[building].weight.residual;
        total_food_waste += doc[building].weight.food_waste;
      });
      // get overall_weight
      total_weekly_weight += doc.overall_weight;
    });
    building_count = building_set.size;
    weekly_average = total_weekly_weight / building_count;

    const data = {
      total_weight: total_weekly_weight,
      total_building: building_count,
      average_weight: weekly_average,
      types: {
        total_residual: total_residual,
        total_recyclable: total_recyclable,
        total_food_waste: total_food_waste,
      },
    };
    await addDoc(weeklyRef, data);
    return null;
  });
