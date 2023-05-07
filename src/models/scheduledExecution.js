const functions = require('firebase-functions')

const db = require("../firebase");
const { addDoc, collection } = require('firebase/firestore');

const wasteRef = collection(db, 'waste')

exports.scheduledPost = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    const data = {
        location : "",
        food_waste : {
            weight : 0
        },
        hazardous_waste : {
            weight : 0
        },
        recyclable : {
            weight : 0
        },
        residual : {
            weight : 0
        }
    }
    addDoc(wasteRef, data)
    return null;
})