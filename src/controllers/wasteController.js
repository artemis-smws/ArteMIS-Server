const {
  onSnapshot,
  collection,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  orderBy,
  limit,
  getDoc,
} = require("firebase/firestore");
const db = require("../firebase");
const { CRUD } = require("../crud");

const wasteRef = collection(db, "waste");

exports.WasteController = {
  getAllWaste: async (req, res) => {
    try {
      const data = await CRUD.readAll(wasteRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getLatest: async (req, res) => {
    const latest = query(wasteRef, orderBy("createdAt", "desc"), limit(1));
    try {
      const data = await CRUD.readAll(latest);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getWaste: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "waste", id);
      const data = await CRUD.read(docRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  // backdoor testing API 
  postWaste: async (req, res) => {
    try {
      const data = await CRUD.create(wasteRef, {
        ...req.body, createdAt : serverTimestamp()
      });
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  deleteWaste: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "waste", id);
      const data = await CRUD.delete(docRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  // only access for the users 
  patchWaste: async (req, res) => {
    try {
      const id = req.params.id;

      const keys = Object.keys(req.body)
      let building_name = ''
      keys.forEach(key => {
        if(key != 'overall_weight') {
          building_name = key
        }
      }) 
      const docRef = doc(db, "waste", id);
      const data = await CRUD.update(docRef, {
        [building_name] : {
          campus : req.body[building_name].campus,
          weight : {
            food_waste : req.body[building_name].weight.food_waste,
            residual : req.body[building_name].weight.residual,
            recyclable : req.body[building_name].weight.recyclable,
            total : req.body[building_name].weight.total
          }
        },
        overall_weight : req.body.overall_weight
      });
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
