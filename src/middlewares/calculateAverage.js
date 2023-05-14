const { collection } = require("firebase/firestore");
const db = require("../firebase");
const {
  getLatest,
  getBuildingCount,
  getTotalWeight,
} = require("./getAverage");
const { CRUD } = require("../crud");

const wasteRef = collection(db, "waste");

// calculate average and overall total weight every endpoint call
module.exports.calculateAverage = (reference) => {
  const middleware = async (req, res, next) => {
    try {
      if (reference) {
        const latestID = await getLatest(reference);
        const buildingCount = await getBuildingCount(latestID);
        const totalWeight = await getTotalWeight(latestID);

        if (totalWeight > 0) {
          const avrg = totalWeight / buildingCount;
          const docRef = doc(db, "waste", latestID);
          CRUD.update(docRef, {
            total_average: avrg,
            total_weight: totalWeight,
          });
        } else {
            res.status(500).send({error : "total weight is not greater than 0"})
        }
      } 
      next();
    } catch (e) {
      res
        .status(500)
        .send({ error: e.message });
    }
  };
  return middleware;
};
