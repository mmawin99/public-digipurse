import React, { useState, useEffect } from 'react';
import { updateData, writeData } from '@/firebase/firestore/CRUD';
import { findObjectBySpecific } from '../ModuleCentralClass';
import { getDatabaseName } from '../MainConfig';

const useSettingSync = (uid, settingsName, initialSettingsValue, cacheData, callback) => {
  // Fetch the databaseName using getDatabaseName
  const DBNAME = getDatabaseName(uid);
  let DBNAMEPref;
  if(DBNAME == null){
    DBNAMEPref = null;
    console.log("Error null DBNAME UID:",uid,"settings: ",settingsName);
  }else{
    DBNAMEPref = DBNAME["pref"];
  }

  // Check for DBValue using findObjectBySpecific
  const DBVALUE = cacheData[0] == null ? null : findObjectBySpecific('meta', cacheData[0].pref.data, settingsName);

  // State for settingsValue
  const [settingsValue, setSettingsValue] = useState(initialSettingsValue);

  useEffect(() => {
    // Define the transactionUpdate object inside the useEffect callback
    const transactionUpdate = {
      "meta": settingsName,
      "meta_value": initialSettingsValue
    };

    // Function to write or update data based on DBVALUE
    const updateDatabase = (DBVALUE, DBNAMEPref, settingsName, initialSettingsValue, callback, uid) => {
      if(uid == "undefined") return;
      if(DBNAMEPref == null) return;
      if (DBVALUE === null || DBVALUE == null || DBVALUE == undefined || typeof DBVALUE == "undefined" || typeof DBVALUE == "null") {
        writeData(DBNAMEPref, transactionUpdate).then((res) => {
          console.log("[UID: "+uid+"]["+settingsName+"]Written Response: ",res);
          console.log(DBNAMEPref,transactionUpdate,"UPDATE WRITTEN.");
          console.log("New updated has been written, on your other device will be updated automatically. UID:",uid);
          callback();
        });
      } else {
        updateData(DBNAMEPref, DBVALUE.id, transactionUpdate).then(() => {
          console.log("New updated has been updated, on your other device will be updated automatically. UID:",uid);
          callback();
        });
      }
    };

    // Call the updateDatabase function
    updateDatabase(DBVALUE, DBNAMEPref, settingsName, initialSettingsValue, callback, uid);
  }, [DBVALUE, DBNAMEPref, settingsName, initialSettingsValue, callback, uid]);

  // Return the state and the update function
  return [settingsValue, setSettingsValue];
};

export default useSettingSync;
