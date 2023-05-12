const { reference } = require("@popperjs/core")
const { getDocs, getDoc, addDoc, updateDoc, doc, deleteDoc } = require("firebase/firestore")
const db = require("./firebase")

exports.CRUD = {
    create : async(reference, passed_data) => {
        try {
            await addDoc(reference, passed_data)
            return {message : "Successfully posted data!"}
        } catch(e) {
            return {error : e.message}
        }
    },
    readAll : async(reference) => {
        const data = []
        await getDocs(reference)
            .then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    data.push({...doc.data(), id : doc.id})
                })
            })
        return data
    },
    // pass doc type reference 
    read : async(reference) => {
        const data = []
        await getDoc(reference)
            .then(snapshot => {
                data.push({...snapshot.data(), id : snapshot.id})
            })
        return data;
    },
    // pass doc type reference (const docRef = doc(db, 'path', id))
    update : async(reference, passed_data) => {
        try {
            updateDoc(reference, passed_data)
            return {message : "Successfully updated data!"}
        } catch(e) {
            return {error : e.message}
        }
    },
    // pass doc type reference (const docRef = doc(db, 'path', id))
    delete : async(reference) => {
        try {
            deleteDoc(docRef)
            return {message : "Successfully deleted data!"}
        } catch(e) {
            return {error : e.message}
        }
    }
}