const { onSnapshot, collection, orderBy, limit } = require("firebase/firestore")
const db = require("../firebase")

const wasteRef = collection(db, 'waste')

function wasteAverage() {
    onSnapshot(wasteRef, (snapshot) => {

    })
}