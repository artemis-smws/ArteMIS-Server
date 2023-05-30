const functions = require("firebase-functions");

const db = require("../firebase");
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
const { CRUD } = require("./crud");
const { getLatest, getLast7Days } = require("./getLatest");

const wasteRef = collection(db, "waste");
const yearlyRef = collection(db, "yearly");
const statusRef = collection(db, "status");
const monthlyRef = collection(db, "monthly");
const buildingRef = collection(db, "building");
const weeklyRef = collection(db, "weekly");

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
              recyclable: 0,
              residual: 0,
              total: 0,
            },
          },
        });
      });
    });

    addDoc(wasteRef, data);
    console.log("successfully posted");
    return null;
  });

// put predefined doc field for the current month
exports.monthlyStatusSchedPost = functions.pubsub
  .schedule("0 0 * */1 *")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    const date = new Date();
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
    const monthDaysWith31Days = [
      "January",
      "March",
      "May",
      "July",
      "August",
      "October",
      "December",
    ];
    let days = 30;
    monthDaysWith31Days.forEach((raw_month) => {
      if (raw_month == month_list[month]) {
        days = 31;
      }
    });
    console.log(days);
    // calculate building count
    const buildingDocs = await CRUD.readAll(buildingRef);
    const building_list = new Set();
    buildingDocs.forEach((doc) => {
      const keys = Object.keys(doc);
      keys.forEach((key) => {
        if (key != "id") {
          building_list.add(key);
        }
      });
    });
    const building_count = building_list.size;

    const q = query(wasteRef, orderBy("createdAt", "desc"), limit(days));
    const docs = await CRUD.readAll(q);
    let total_weight = 0;
    docs.forEach((doc) => {
      total_weight += doc.overall_weight;
    });
    const average = total_weight / days;

    const data = {
      registered_buildings: building_count,
      weight: total_weight,
      average: average,
      createdAt: serverTimestamp(),
    };
    const returnData = await setDoc(doc(db, "monthly", docID), data);
    res.send(returnData);
  });

// create pre-formatted docs for status
// status contains overall info for the day
// update this through the middleware
exports.statusSchedPostDaily = functions.pubsub
  .schedule("1 0 * * *")
  .timeZone("Asia/Manila")
  .onRun(async (context) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const docID = `${month}-${day}-${year % 100}`;

    const data = {
      buildings_count: 0,
      current_average: 0,
      overall_weight: 0,
      types: {
        food_waste: 0,
        residual: 0,
        recyclable: 0,
      },
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, "status", docID), data);
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
        total_recyclable += doc[building].weight.recyclable;
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
