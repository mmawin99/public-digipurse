import firebase_app from "../config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import signInFirebase from "./signin";

const auth = getAuth(firebase_app);

export default async function authorizeNextAuthToFirebase(email, password) {
    let result = null,
        error = null,
        code = null;
    
    try {
        result = await signInWithEmailAndPassword(auth, email, password);
    } catch (signInError) {
        code = signInError.code;
        error = signInError;

        // If the error is due to user not found, try creating a new user
        if (code === "auth/user-not-found") {
            try {
                // Attempt to create a new user
                result = await createUserWithEmailAndPassword(auth, email, password);
            } catch (createUserError) {
                code = createUserError.code;
                error = createUserError;
            }
        }
    }

    return { result, error, code };
}
export const checkFirebaseUserExists = async (email,password) => {
    try {
      const signInMethods = await signInFirebase(email,password);
      return {status:signInMethods.code == null,code:signInMethods};
    } catch (error) {
      console.error('Error checking user existence:', error);
      return {status:false,code:error};
    }
  };