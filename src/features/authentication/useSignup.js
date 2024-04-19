import { doc, setDoc } from 'firebase/firestore';
import { FirebaseApp, db } from '../../lib/helper/firebaseClient';
import { multiFactor, TotpMultiFactorGenerator, TotpSecret, getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';


export async function useSignup(email, password, fullName, department, level, qualification) {
    try {
        const auth = getAuth(FirebaseApp);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        sendEmailVerification(auth.currentUser)
            .then(() => {
                console.log("Email verification sent.")
            // Email verification sent!
            // ...
            });

        if (qualification === undefined) {
            // must be student
            await setDoc(doc(db, "students", userCredential.user.uid), {
                Level: level,
                Name: fullName,
                email: email,
                department: department,
                courses: []
            });
        } else {
            // If instructor
            await setDoc(doc(db, "faculty", userCredential.user.uid), {
                Level: level,
                Name: fullName,
                email: email,
                department: department,
                qualification: qualification,
                courses: []
            });
        }

        return userCredential.user; // Return user object if signup is successful
    } catch (error) {
        // Handle Errors here and return error message
        console.error(error.code, error.message);
        return error.message;
    }
}
