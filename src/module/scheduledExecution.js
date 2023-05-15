const functions = require('firebase-functions')

const db = require("../firebase");
const { addDoc, collection, serverTimestamp } = require('firebase/firestore');

const wasteRef = collection(db, 'waste')
const yearlyRef = collection(db, 'total_yearly')

exports.wasteSchedPost = functions.pubsub.schedule('5 0 * * *').onRun((context) => {
    const data = {
        overall_weight : 0,
        createdAt : serverTimestamp()
    }
    addDoc(wasteRef, data)
    return null;
})

exports.yearlyWasteSchedPost = functions.pubsub.schedule("0 0 1 1 *").onRun((context) => {
    const yearNow = new Date().getFullYear()
    const data = {
        year : yearNow,
        total_weight : 0,
        campus : {
            total_weight : 0,
            alangilan : {
                total_weight : 0,
                ACES : 0,
                CEAFA : 0,
                CICS : 0,
                CIT : 0,
                Gymnasium : 0,
                SSC : 0
            }
        }
    }
    addDoc(yearlyRef, data)
    return null;
})