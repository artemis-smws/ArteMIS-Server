const {
  collection,
  setDoc,
  doc,
  onSnapshot,
  deleteDoc,
  deleteField,
} = require("firebase/firestore");
const db = require("../config/firebase");

const buildingRef = collection(db, "building");

const { CRUD } = require("../utils/crud");

exports.BuildingController = {
  getAllBuilding: async (req, res) => {
    const data = [];
    try {
      const data = await CRUD.readAll(buildingRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  getBuilding: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "building", id);
      const data = await CRUD.read(docRef);
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  deleteBuilding: async (req, res) => {
    try {
      const id = req.params.id;
      const docRef = doc(db, "building", id);
      const building_name = req.body.building_name;
      const data = {
        [building_name]: deleteField(),
      };
      const callback = await CRUD.update(docRef, data);
      res.send(callback);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
  // set body.id to be the name of the campus
  addBuilding: async (req, res) => {
    try {
      const id = req.params.id;
      const buildingName = req.body.building_name;
      const campusRef = doc(db, "building", id);
      const data = await CRUD.update(campusRef, {
        [buildingName]: {
          latitude: req.body.latitude,
          longitude: req.body.longitude,
        },
      });
      res.send(data);
    } catch (e) {
      res.status(500).send({ error: e.message });
    }
  },
};
