import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase-admin/firestore";

const config = require('./config/config')

const firebase = initializeApp(config.firebaseConfig);

isSupported().then((result) => {
  if (result) {
    const analytics = getAnalytics(firebase);
  }
})
const db = getFirestore()

module.exports = db
