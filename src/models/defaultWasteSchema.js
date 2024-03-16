const { serverTimestamp, doc, collection } = require("firebase/firestore");
const { CRUD } = require("../utils/crud");
const db = require('../config/firebase')

async function defaultWasteSchema() {
    const buildingList = await retrieveBuildingList();
    let data = {
        overall_weight: 0,
        overall_residual: 0,
        overall_recyclable: 0,
        overall_biodegradable: 0,
        overall_infectious: 0,
    }
    buildingList.forEach(building => {
        data = Object.assign({
            ...data,
            [building.building_name]: {
                campus: building.campus_name,
                weight: {
                    biodegradable: 0,
                    recyclable: {
                        total: 0,
                    },
                    residual: 0,
                    infectious: 0,
                    total: 0,
                }
            }
        })
    })
    return data
}

async function defaultWasteSchemaSchedule() {
    const buildingList = await retrieveBuildingList();
    let data = {
        overall_weight: 0,
        overall_residual: 0,
        overall_recyclable: 0,
        overall_biodegradable: 0,
        overall_infectious: 0,
        createdAt: serverTimestamp(),
    }
    buildingList.forEach(building => {
        data = Object.assign({
            ...data,
            [building.building_name]: {
                campus: building.campus_name,
                weight: {
                    biodegradable: 0,
                    recyclable: {
                        total: 0,
                    },
                    residual: 0,
                    infectious: 0,
                    total: 0,
                }
            }
        })
    })
    return data
}

async function retrieveBuildingList() {
    const buildingList = [];
    const buildingRef = collection(db, "building")
    const buildings = await CRUD.readAll(buildingRef);
    
    buildings.forEach(campus => {
        const campusKey = Object.keys(campus)
        campusKey.forEach(key => {
            if(key != 'id') {
                buildingList.push({
                    building_name : key,
                    campus_name : campus['id']
                })
            }
        })  
    });
    return buildingList;
}

module.exports =  {
    defaultWasteSchema,
    retrieveBuildingList,
    defaultWasteSchemaSchedule
}