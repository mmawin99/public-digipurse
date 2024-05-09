import { useEffect, useState } from 'react';
import { getData } from './firestoreUtils';

function useCacheData(collectionName, cacheKey, cacheExpiration) {
  const [data, setData] = useState([]);
  const [status, setStatus] = useState({ success: null, error: null });

  useEffect(() => {
    const fetchData = async () => {
      const cachedData = JSON.parse(localStorage.getItem(cacheKey));
      if (cachedData && cachedData.timestamp > Date.now() - cacheExpiration) {
        setData(cachedData.data);
      } else {
        const result = await getData(collectionName);
        if (result.success) {
          setData(result.data);
          const cachedData = { data: result.data, timestamp: Date.now() };
          localStorage.setItem(cacheKey, JSON.stringify(cachedData));
          setStatus({ success: true, error: null });
        } else {
          setStatus({ success: false, error: result.error });
        }
      }
    }

    fetchData();
  }, [collectionName, cacheKey, cacheExpiration]);

  const updateCache = async () => {
    const result = await getData(collectionName); // Fetch updated data from the database
    if (result.success) {
      setData(result.data);
      const cachedData = { data: result.data, timestamp: Date.now() };
      localStorage.setItem(cacheKey, JSON.stringify(cachedData));
      setStatus({ success: true, error: null });
    } else {
      setStatus({ success: false, error: result.error });
    }
  }

  return {
    data,
    status,
    updateCache
  };
}

export default useCacheData;
