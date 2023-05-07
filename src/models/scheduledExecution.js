const functions = require('firebase-functions')

const db = require("../firebase");

exports.scheduledPost = functions.pubsub.schedule('0 0 * * *').onRun((context) => {
    const data = {
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
    admin_db.collection('waste').add(data)
    return null;
})