import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import firebase_app from '@/firebase/config';
import HeadElement from '@/components/HeadElement';
import LoadingScene from '@/components/LoadingScene';

const auth = getAuth(firebase_app);

export const AuthContext = React.createContext({});

export const useAuthContext = () => React.useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoadingScene, setShowLoadingScene] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowLoadingScene(true);
    //   console.log("timeout reached",loading,showLoadingScene);
    }, 3000);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // console.log("user is not null",loading,showLoadingScene);
      } else {
        setUser(null);
        // console.log("user is null",loading,showLoadingScene);
      }
    //   console.log("Loading is true",loading,showLoadingScene);
      setLoading(true);
    //   clearTimeout(timeoutId); // Clear the timeout when authentication is done
    });

    return () => {
    //   console.log("Unsubscribed",loading,showLoadingScene);
      unsubscribe();
    //   clearTimeout(timeoutId); // Clear the timeout on unmount
    };
  }, [loading,showLoadingScene]);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoaded:loading&&showLoadingScene }}>
        <HeadElement />
      {(showLoadingScene && loading) ? children : <LoadingScene />}
    </AuthContext.Provider>
  );
};