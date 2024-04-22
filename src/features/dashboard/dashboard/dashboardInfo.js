import { doc, getDoc } from "firebase/firestore";
// import { FirebaseApp, db } from '../../lib/helper/firebaseClient';
import { FirebaseApp,db } from "../../../lib/helper/firebaseClient";
// import { isFaculty } from '../../lib/helper/userInfo';
import { isFaculty } from "../../../lib/helper/userInfo";
import { getAuth } from 'firebase/auth';



export async function getCourses() {
    const docRef = doc(db, isFaculty ? "faculty" : "students", getAuth(FirebaseApp).currentUser.uid);
    const docSnap = await getDoc(docRef);
    /*
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        console.log("No such document!");
    }*/
    return docSnap.data().courses;
}

export async function getCourseName(courseID) {
    //console.log(courseID);
    const docRef = doc(db, "subjects", courseID);
    const docSnap = await getDoc(docRef);
    /*
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        console.log("No such document!");
    }*/
    return docSnap.data().Name;
}

export async function getName() {
    const docRef = doc(db, isFaculty ? "faculty" : "students", getAuth(FirebaseApp).currentUser.uid,);
    const docSnap = await getDoc(docRef);
    /*
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        console.log("No such document!");
    }*/
    return docSnap.data().Name;
}