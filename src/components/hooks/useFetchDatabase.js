import { useCallback, useEffect } from 'react';

// Replace with your actual Firebase functions
import { useLocalStorage } from '@uidotdev/usehooks';
import { getDatabaseName } from '../MainConfig';
import { getData } from '@/firebase/firestore/CRUD';
import { findStartAndEndDate, transactionsProcess, transactionsProcessCate, transactionsProcessWMY } from '../ModuleCentralClass';

export function useFetchDatabase(canUse,uid) {
  const [cachedData, saveCacheData] = useLocalStorage(`DigiPurseData_${uid}`, null);
  const [cacheCalculatedData, saveCacheCalculatedData] = useLocalStorage(`DigiPurseCalculateData_${uid}`, null);
  const [cacheCalculatedDataWMY, saveCacheCalculatedDataWMY] = useLocalStorage(`DigiPurseCalculateData_WMY_${uid}`, null);
  const [cacheCalculatedDataCateProcess, saveCacheCalculatedDataCateProcess] = useLocalStorage(`DigiPurseCalculateData_Cate_${uid}`, null);
  const [cachedTime, setCachedTime] = useLocalStorage(`DigiPurseData_${uid}_savetime`, null);

  // const deleteData = () => {
  //   // Remove the cached data from localStorage
  //   localStorage.removeItem(`expensifyData_${uid}`);
  //   localStorage.removeItem(`expensifyData_${uid}_savetime`);
  //   // Set the data state to null to clear the cached data in the component
  //   saveCacheData(null);
  //   setCachedTime(null);
  // };

  const fetchData = useCallback(async (callingBack = ()=>{}) => {
    try {
      if (uid) {
        // Get the database name using the provided UID
        const databaseName = getDatabaseName(uid);
  
        if (databaseName) {
          // Create an object to store the fetched data
          const databaseData = {};
  
          // Create an array of promises for data retrieval
          const dataPromises = [];
  
          for (const key in databaseName) {
            if (key === "txn") {
              const promise = getData(databaseName[key], key, "txn_date", "desc");
              dataPromises.push(promise);
            } else {
              const promise = getData(databaseName[key], key);
              dataPromises.push(promise);
            }
          }
  
          // Fetch data from all databases in parallel
          const fetchedDataArray = await Promise.all(dataPromises);
  
          // Map the fetched data back to the corresponding database names
          fetchedDataArray.forEach((index, key) => {
            databaseData[index.cname] = index;
          });
  
          // Save the data as JSON to localStorage
          setCachedTime(new Date().getTime());
          saveCacheData(databaseData);
          callingBack(databaseData);
          // Return a resolved promise to indicate success
          return Promise.resolve();
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Return a rejected promise to indicate failure
      return Promise.reject(error);
    }
  }, [uid, saveCacheData, setCachedTime]);
  // console.log("Fetch data Firebase calling");
  const calculateData = useCallback(async (callingValue = null)=>{
    try{
      if(cachedData !== null){
        let dateData,calculatedData,calculateDataWMY,calculateDataCate;
        if(await callingValue == null){
          dateData = await findStartAndEndDate(cachedData.txn.data);
          calculatedData = await transactionsProcess(cachedData.wallet.data,cachedData.txn.data,dateData[0],dateData[1]);
          calculateDataWMY = await transactionsProcessWMY(calculatedData);
          calculateDataCate = await transactionsProcessCate(cachedData.group.data,cachedData.txn.data);
        }else{
          dateData = await findStartAndEndDate(callingValue.txn.data);
          calculatedData = await transactionsProcess(callingValue.wallet.data,callingValue.txn.data,dateData[0],dateData[1]);
          calculateDataWMY = await transactionsProcessWMY(calculatedData);
          calculateDataCate = await transactionsProcessCate(cachedData.group.data,cachedData.txn.data);
        }
        await saveCacheCalculatedData(calculatedData);
        await saveCacheCalculatedDataWMY(calculateDataWMY);
        await saveCacheCalculatedDataCateProcess(calculateDataCate);
      }
    }catch(error){
      console.error(error);
    }
  },[cachedData, saveCacheCalculatedData, saveCacheCalculatedDataWMY, saveCacheCalculatedDataCateProcess]);

  const updateData = useCallback(async () => {
    try {
      // First, fetch and save the new data
      await fetchData((cbValue)=>{
        calculateData(cbValue);
      });
      // Now that fetchData has succeeded, you can call calculateData
  
      // Return an object indicating success
      return { success: true };
    } catch (error) {
      console.log(error);
      // If there's an error during the update process, return an object indicating failure
      return { success: false, error };
    }
  }, [calculateData, fetchData]);
  useEffect(() => {
    if(canUse){

      if (!cachedData) {
        // If there's no cached data, fetch and save it
        fetchData();
        calculateData();
      }
      if(cacheCalculatedData == null || cacheCalculatedData == "null" || typeof cacheCalculatedData == "undefined"){
        calculateData();
      }
    }
  }, [canUse, uid, cachedData, updateData, cacheCalculatedData ,calculateData, fetchData, saveCacheData, setCachedTime]);

  return [cachedData, cachedTime, updateData, cacheCalculatedData,cacheCalculatedDataWMY, cacheCalculatedDataCateProcess];
}
