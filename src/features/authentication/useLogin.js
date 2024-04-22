import { FirebaseApp } from '../../lib/helper/firebaseClient';
import { getAuth, signInWithEmailAndPassword, getMultiFactorResolver, TotpMultiFactorGenerator } from 'firebase/auth';

// useLogin.js

export function useLogin(email, password, totp) {
    const auth = getAuth(FirebaseApp);
    // Return the promise here
    return signInWithEmailAndPassword(auth, email, password)
        .catch(function (error) {
            if(error.code == "auth/multi-factor-auth-required") {
                const mfaResolver = getMultiFactorResolver(getAuth(), error);
                //console.log(totp);

                const multiFactorAssertion =
                TotpMultiFactorGenerator.assertionForSignIn(
                    mfaResolver.hints[0].uid,
                    totp
                );
                return mfaResolver.resolveSignIn(multiFactorAssertion);
            }
        });
}