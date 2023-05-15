const functions = require('firebase-functions')

const db = require("../firebase");
const { addDoc, collection, serverTimestamp } = require('firebase/firestore');
const { CRUD } = require('../crud');
const { getLatest } = require('./getLatest');

const wasteRef = collection(db, 'waste')
const yearlyRef = collection(db, 'total_yearly')
const statusRef = collection(db, 'status')

exports.wasteSchedPost = functions.pubsub.schedule('5 0 * * *').onRun((context) => {
    const data = {
        overall_weight : 0,
        createdAt : serverTimestamp()
    }
    addDoc(wasteRef, data)
    return null;
})

exports.statusSchedPostDaily = functions.pubsub.schedule('0 0 * * *').onRun( async (context) => {
    const previousDoc = await getLatest(statusRef)
    const prev_average = previousDoc[0].current_average
    const prev_weight = previousDoc[0].overall_weight
    const data = {
        buildings_count : 0,
        current_average : prev_average,
        overall_weight : prev_weight,
        createdAt : serverTimestamp()
    }
    addDoc(statusRef, data)
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