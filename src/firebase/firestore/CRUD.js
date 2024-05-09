import { collection, getDocs, doc, addDoc as addFirestoreDoc, updateDoc as updateFirestoreDoc, deleteDoc as deleteFirestoreDoc, query, where, getDocs as getDocsFromQuery, Timestamp, orderBy, deleteDoc } from 'firebase/firestore';
import { auth, firestore } from '../config';

export const getData = async (collectionName,cname = "Empty",orderByList = 'created',orderType = 'desc') => {
  try {
    const q = query(collection(firestore, collectionName),orderBy(orderByList,orderType));
    const querySnapshot = await getDocsFromQuery(q);
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true,"cname": cname, data };
  } catch (error) {
    return { success: false,"cname": cname, error };
  }
}

export const updateData = async (collectionName, id, data) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    const updatedDataWithUserId = { ...data, userId: auth.currentUser.uid };
    await updateFirestoreDoc(docRef, updatedDataWithUserId);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}

export const writeData = async (collectionName, data) => {
  try {
    // console.log("==============================BEGIN WRITING PROCESS============");
    // console.log("Recieving Parameter:");
    // console.log("collectionName: ",collectionName);
    // console.log("data: ",data);
    const timeStampCre = {"created":Timestamp.now(),"lastchange":Timestamp.now()};
    // console.log("Timestamp parameter: ",timeStampCre);
    const dataWithUserId = { ...data,...timeStampCre, userId: auth.currentUser.uid };
    // console.log("FULL DATA: ",dataWithUserId);
    const collectionPref = collection(firestore, collectionName);
    const docRef = await addFirestoreDoc(collectionPref, dataWithUserId);
    // console.log("==============================END WRITING PROCESS============");
    return { success: true, id: docRef.id };
  } catch (error) {
    // console.log("ERROR OCCURED: ", error);
    // console.log("==============================END WRITING PROCESS============");
    return { success: false, error };
  }
}

export const deleteData = async (collectionName, id) => {
  try {
    const docRef = doc(firestore, collectionName, id);
    // console.log(docRef);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
