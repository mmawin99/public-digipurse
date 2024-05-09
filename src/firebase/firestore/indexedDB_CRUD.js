const DB_NAME = "YourIndexedDBName";
const DB_VERSION = 1;
const OBJECT_STORE_NAME = "YourObjectStoreName";

// Open the IndexedDB database
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    };

    request.onsuccess = function(event) {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
};

export const getData = async (cname = "Empty", orderByList = 'created', orderType = 'desc') => {
  try {
    const db = await openDB();
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readonly');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const index = objectStore.index(orderByList);
    const request = index.openCursor(null, orderType);

    return new Promise((resolve, reject) => {
      const data = [];
      request.onsuccess = function(event) {
        const cursor = event.target.result;
        if (cursor) {
          data.push(cursor.value);
          cursor.continue();
        } else {
          resolve({ success: true, "cname": cname, data });
        }
      };

      request.onerror = function(event) {
        reject({ success: false, "cname": cname, error: event.target.error });
      };
    });
  } catch (error) {
    return { success: false, "cname": cname, error };
  }
}

export const updateData = async (id, data) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.put({ id, ...data, userId: auth.currentUser.uid });

    return new Promise((resolve, reject) => {
      request.onsuccess = function() {
        resolve({ success: true });
      };

      request.onerror = function(event) {
        reject({ success: false, error: event.target.error });
      };
    });
  } catch (error) {
    return { success: false, error };
  }
}

export const writeData = async (data) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const timeStampCre = { "created": new Date().getTime(), "lastchange": new Date().getTime() };
    const dataWithUserId = { ...data, ...timeStampCre, userId: auth.currentUser.uid };

    const request = objectStore.add(dataWithUserId);

    return new Promise((resolve, reject) => {
      request.onsuccess = function(event) {
        resolve({ success: true, id: event.target.result });
      };

      request.onerror = function(event) {
        reject({ success: false, error: event.target.error });
      };
    });
  } catch (error) {
    return { success: false, error };
  }
}

export const deleteData = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.delete(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = function() {
        resolve({ success: true });
      };

      request.onerror = function(event) {
        reject({ success: false, error: event.target.error });
      };
    });
  } catch (error) {
    return { success: false, error };
  }
}