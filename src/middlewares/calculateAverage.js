const { doc, collection, serverTimestamp, updateDoc } = require("firebase/firestore")
const db = require("../firebase")
const { CRUD } = require("../crud")
const { getLatest } = require("../module/getLatest")

const statusRef = collection(db, 'status')

exports.calculateAverageMiddleware = async (req, res, next) => {
    const latestDoc = await getLatest(statusRef)
    const requestKey = Object.keys(req.body)

    const current_avg = latestDoc[0].current_average
    let buildings_count = latestDoc[0].buildings_count
    const req_total = req.body[requestKey[0]].weight.total

    let average = current_avg * buildings_count

    const overall_weight = req_total + average
    buildings_count++
    average = overall_weight / buildings_count

    const docRef = doc(db, 'status', latestDoc[0].id)

    // patch to the doc released today 
    await updateDoc(docRef, {
        buildings_count : buildings_count,
        current_average : average,
        createdAt : serverTimestamp(),
        overall_weight : overall_weight
    })
    next()
}