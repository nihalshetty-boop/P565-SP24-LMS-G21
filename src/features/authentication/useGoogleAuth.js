import { FirebaseApp } from '../../lib/helper/firebaseClient';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider();

export async function useGoogleAuth() {
  const auth = getAuth(FirebaseApp);
  return signInWithPopup(auth, googleProvider);
}