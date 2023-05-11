const { onSnapshot, collection, orderBy, limit } = require("firebase/firestore")
const db = require("../firebase")

const wasteRef = collection(db, 'waste')

const wasteAverage = async() => {
    const data = []
    await onSnapshot(wasteRef, (snapshot) => {
        snapshot.docs.forEach(doc => {
            data.push({...doc.data(), id : doc.id})
        })
    })
    
}