const {
  orderBy,
  limit,
  query,
  doc,
} = require("firebase/firestore");
const db = require("../config/firebase");
const { CRUD } = require("./crud");

// reference = collectionReference
exports.getLatest = async (reference) => {
  const q = query(
    reference,
    orderBy("createdAt", "desc"),
    limit(1)
  );
  const latest_doc = await CRUD.readAll(q);
  return latest_doc;
};

exports.getLast7Days = async (reference) => {
  const q = query(
    reference,
    orderBy("createdAt", "desc"),
    limit(7)
  )
  const fetchedDocs = await CRUD.readAll(q)
  return fetchedDocs
}

exports.getLast30Days = async (reference) => {
  const q = query(
    reference,
    orderBy("createdAt", "desc"),
    limit(30)
  )
  const fetchedDocs = await CRUD.readAll(q)
  return fetchedDocs
}


// reference = collectionReference
exports.getBuildingCount = async (id) => {
  const docRef = doc(db, "waste", id);
  const data = await CRUD.read(docRef);

  const keys = Object.keys(data);
  let building_count = 0;
  keys.forEach((key) => {
    if (!(key == 'createdAt' || key == 'id')) {
      building_count++;
    }
  });
  return building_count;
};

// call before ending the day / after calling the wastePatch callback function
// reference = collectionRef
exports.getTotalWeight = async (id) => {
  let sumTotal = 0;
  const docRef = doc(db, "waste", id);
  const data = await CRUD.read(docRef);
  const keys = Object.keys(data);
  keys.forEach((key) => {
    if (!(key == "createdAt" || key == "id")) {
      sumTotal += data[key]["weight"]["total"];
    }
  });

  return sumTotal;
};
