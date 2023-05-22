const functions = require("firebase-functions");

const db = require("../firebase");
const {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  setDoc,
} = require("firebase/firestore");
const { CRUD } = require("./crud");
const { getLatest } = require("./getLatest");

const wasteRef = collection(db, "waste");
const yearlyRef = collection(db, "yearly");
const statusRef = collection(db, "status");
const monthlyRef = collection(db, "monthly");
const buildingRef = collection(db, "building");

exports.wasteSchedPost = functions.pubsub
  .schedule("5 0 * * *")
  .onRun(async (context) => {
    let data = {
        overall_weight :  0,
        createdAt : serverTimestamp()
    };

    const buildings = await CRUD.readAll(buildingRef);

    // treated by campus
    buildings.forEach((campus) => {
      const building_list = [];
      let campus_name = campus.id

      const keys = Object.keys(campus);
        // building_name 
      keys.forEach((key) => {
        if (key != "id") {
          building_list.push(key);
        } 
      });
      // insert to data object
      building_list.forEach(building => {
        data = Object.assign({...data, [building] : {
            campus : campus_name,
            weight : {
                food_waste : 0,
                recyclable : 0,
                residual : 0,
                total : 0
            }
        }})
      })

    });

    addDoc(wasteRef, data);
    console.log('successfully posted')
    return null;
  });

exports.monthlyStatusSchedPost = functions.pubsub
  .schedule("0 0 1 */1 *")
  .onRun((context) => {
    const today = new Date();
    const monthNow = today.getMonth() + 1;
    const yearNow = today.getFullYear();
    const docID = monthNow + yearNow;

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
    setDoc(monthlyRef, data, docID);
  });

exports.statusSchedPostDaily = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async (context) => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const docID = `${day}-${month}-${year % 100}`;

    const previousDoc = await getLatest(statusRef);
    const prev_average = previousDoc[0].current_average;
    const prev_weight = previousDoc[0].overall_weight;
    const data = {
      buildings_count: 0,
      current_average: prev_average,
      overall_weight: prev_weight,
      createdAt: serverTimestamp(),
    };
    setDoc(statusRef, data, docID);
  });

exports.yearlyWasteSchedPost = functions.pubsub
  .schedule("0 0 1 1 *")
  .onRun((context) => {
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
    setDoc(yearlyRef, data, yearNow);
    return null;
  });
