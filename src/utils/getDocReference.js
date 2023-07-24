const { collection } = require("firebase/firestore");
const db = require("../config/firebase");


exports.buildingRef = collection(db, "building")
exports.statusRef = collection(db, "status")
exports.wasteRef = collection(db, "waste")

// temp

exports.yearlyRef = collection(db, "yearly")
exports.monthlyRef = collection(db, "monthly")
exports.weeklyRef = collection(db, "weekly")
