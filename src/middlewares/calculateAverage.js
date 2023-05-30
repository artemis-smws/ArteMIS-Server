const { doc, collection, serverTimestamp, updateDoc } = require("firebase/firestore")
const db = require("../firebase")
const { CRUD } = require("../module/crud")
const { getLatest } = require("../module/getLatest")

const statusRef = collection(db, 'status')
const wasteRef = collection(db, 'waste')

// update the data within status collection
exports.calculateAverageMiddleware = async (req, res, next) => {
    const latestDoc = await getLatest(wasteRef)
    const latestStatus = await getLatest(statusRef)
    const latestStatusId = latestStatus[0].id
    const keys = Object.keys(latestDoc[0])
    const overall_weight = req.body.overall_weight + latestDoc[0].overall_weight
    const building_list = []
    let buildings_count = 0
    
    keys.forEach(key => {
        if(!(key == 'overall_weight' || key == 'createdAt' || key == 'id' )){
            building_list.push(key)
        }
    })
    
    building_list.forEach(building => {
        if(latestDoc[0][building].weight.total != 0){
            buildings_count++;
        }
    })

    const average = overall_weight / buildings_count

    const docRef = doc(db, 'status', latestStatusId)

    // patch to the doc released today 
    await updateDoc(docRef, {
        buildings_count : buildings_count,
        current_average : average,
        createdAt : serverTimestamp(),  
        overall_weight : overall_weight
    })
    next()
}