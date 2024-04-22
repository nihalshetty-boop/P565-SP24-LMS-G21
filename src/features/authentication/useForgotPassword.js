import { FirebaseApp } from '../../lib/helper/firebaseClient';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

export async function useForgotPassword(e) {
    let auth = getAuth(FirebaseApp);
    sendPasswordResetEmail(auth, e)
    .then(() => {
        // Password Reset email sent
    }).catch((error) => {
        // Handle Errors here.
        console.log(error.code);
        console.log(error.message);
    })
}
