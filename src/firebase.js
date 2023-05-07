const { initializeApp } = require("firebase/app")
const {getAnalytics, isSupported} = require("firebase/analytics")
const {getFirestore} = require("firebase/firestore")

const config = require('./config/config.js')

const firebase = initializeApp(config.firebaseConfig);

isSupported().then((result) => {
  if (result) {
    const analytics = getAnalytics(firebase);
  }
})

const db = getFirestore();

module.exports = db

