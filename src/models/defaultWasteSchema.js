const { serverTimestamp } = require("firebase/firestore");
const { CRUD } = require("../utils/crud");

async function defaultWasteSchema() {
    const buildingList = await retrieveBuildingList();
    const data = {
        overall_weight: 0,
        createdAt: serverTimestamp(),
    }
    buildingList.forEach((building) => {
        data = Object.assign({
            ...data,
            [building]: {
                campus: campus_name,
                weight: {
                    biodegradable: 0,
                    recyclable: {
                        total: 0,
                    },
                    residual: 0,
                    total: 0,
                }
            }
        })
    })
    return data
}

async function retrieveBuildingList() {
    const building_list = [];
    const buildings = await CRUD.readAll(buildingRef);
    
    buildings.forEach((campus) => {
        const keys = Object.keys(campus);
        // building_name
        keys.forEach((key) => {
            if (key != "id") {
                building_list.push(key);
            }
        });
    });
    return building_list;
}

module.exports =  {
    defaultWasteSchema,
    retrieveBuildingList
}