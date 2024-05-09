import firebase_app, { auth } from "../config";
import { getAuth, signInWithRedirect, getRedirectResult, FacebookAuthProvider } from "firebase/auth";


export async function signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    // You can set custom parameters for Facebook sign-in if needed.
    try {
        await signInWithRedirect(auth, provider);
        // The user's browser has been redirected, so we need to get the result after the redirect.
        const result = await getRedirectResult(auth);
        return { result, error: null };
    } catch (e) {
        return { result: null, error: e };
    }
}
