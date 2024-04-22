import { collection, query, doc, getDocs } from "firebase/firestore";
// import { FirebaseApp, db } from '../../lib/helper/firebaseClient';
import { FirebaseApp, db } from "../../../lib/helper/firebaseClient";

export async function getContent() {
    const content = {};

    const q = query(collection(db, "subjects"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());

        content[doc.id] = doc.data();
    });
    //console.log(content);
    return content;

    /*
    const docRef = doc(db, "subjects");
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
    } else {
        console.log("No such document!");
    }
    return docSnap.data();*/
}