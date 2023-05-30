const { doc, collection, serverTimestamp, updateDoc, addDoc } = require("firebase/firestore")
const db = require("../firebase")
const { CRUD } = require("../module/crud")
const { getLatest } = require("../module/getLatest")

const statusRef = collection(db, 'status')
const wasteRef = collection(db, 'waste')

// update the data within status collection
exports.calculateAverageMiddleware = async (req, res, next) => {
    // get latest waste document for additional data
    const latestDoc = await getLatest(wasteRef)
    // get the latest status document for target of update
    const latestStatus = await getLatest(statusRef)
    const latestStatusId = latestStatus[0].id
    const keys = Object.keys(latestDoc[0])
    // pass from the earlier middleware
    const overall_weight = req.body.overall_weight 
    // get building list for the count of buildings with data
    const building_list = []
    let buildings_count = 1
    
    await keys.forEach(key => {
        if(!(key == 'overall_weight' || key == 'createdAt' || key == 'id' )){
            building_list.push(key)
        }
    })
    await building_list.forEach(building => {
        if(latestDoc[0][building].weight.total != 0){
            buildings_count++;
        }
    })
    // calculate average per building
    const average = overall_weight / buildings_count
    // update for status document
    const docRef = doc(db, 'status', latestStatusId)
    const sampleData = await CRUD.read(docRef)

    // patch to the doc released today 
    await updateDoc(docRef, {
        buildings_count : buildings_count,
        average_per_building : average,
        createdAt : serverTimestamp(),  
        overall_weight : overall_weight,
        overall_recyclable_weight : req.body.overall_recyclable,
        overall_food_waste_weight : req.body.overall_food_waste,
        overall_residual_weight : req.body.overall_residual,
    })
    next()
}