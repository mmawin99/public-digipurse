import firebase_app from "../config";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

// MongoDB Connection URI

// Function to sign up user
export default async function signUp(email, password) {
  let result = null,
    error = null;

  try {
    // Check user status in MongoDB
    // const userStatus = await checkUserStatus(email);

    // Create user in Firebase Authentication
    result = await createUserWithEmailAndPassword(auth, email, password);

    // You may want to store the user status in Firebase as well
    // For example, you can use Firebase Firestore or Realtime Database

    // Return user status along with result
    return { result, error };
  } catch (e) {
    error = e;
    return { result, error };
  }
}