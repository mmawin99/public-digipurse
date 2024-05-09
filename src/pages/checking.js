import { useAuthContext } from '@/context/AuthContext';
import { useSession } from 'next-auth/react';
import React from 'react'

const Checking = () => {
    const { data } = useSession();
    const {user,setUser} = useAuthContext();
    CheckUpdateAvailable(isUpdate,setIsUpdate,user.uid,cacheData,swalReact);
    return (
        <div>Checking</div>
    )
}

export default Checking