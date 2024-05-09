import firebase_app from "../config";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

export const auth = getAuth(firebase_app);

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
        await signInWithRedirect(auth, provider);
        // The user's browser has been redirected, so we need to get the result after the redirect.
        const result = await getRedirectResult(auth);
        console.log(result);
        return { result, error: null };
    } catch (e) {
        return { result: null, error: e };
    }
}
