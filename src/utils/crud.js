const { getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc } = require("firebase/firestore")
const db = require("../config/firebase")

exports.    CRUD = {
    create : async(reference, passed_data) => {
        try {
            await addDoc(reference, passed_data)
            return {message : "Succcessfully added data!"}
        } catch(e) {
            return {error : e.message}
        }
    },
    // pass either a collection or doc type reference
    createSpecific : async(reference, passed_data) => {
        try {
            await setDoc(reference, passed_data)
            return {message : "Succcessfully added data!"}
        } catch(e) {
            return {error : e.message}
        }
    },
    // returns an array of objects 
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
    // returns single object
    read : async(reference, model) => {
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
    },
}