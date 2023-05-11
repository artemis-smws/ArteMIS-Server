const functions = require('firebase-functions')

const db = require("../firebase");
const { addDoc, collection, serverTimestamp } = require('firebase/firestore');

const wasteRef = collection(db, 'waste')

exports.scheduledPost = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    const data = {
        createdAt : serverTimestamp()
    }
    addDoc(wasteRef, data)
    return null;
})