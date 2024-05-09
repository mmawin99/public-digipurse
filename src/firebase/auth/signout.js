import firebase_app from "../config";
import { signOut, getAuth } from "firebase/auth";

const auth = getAuth(firebase_app);

export default async function signOutUser() {
  let success = false;
  let error = null;

  try {
    await signOut(auth);
    success = true;
  } catch (e) {
    error = e;
  }

  return { success, error };
}