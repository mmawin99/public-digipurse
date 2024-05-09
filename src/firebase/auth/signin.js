import firebase_app from "../config";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signInFirebase(email, password) {
    let result = null,
        error = null,code = null;
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
        code = e.code;
        error = e;
    }
    return { result, error, code };
}