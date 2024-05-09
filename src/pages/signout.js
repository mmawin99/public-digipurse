import useThemeSwitcher from '@/components/hooks/useThemeSwitcher';
import { useAuthContext } from '@/context/AuthContext';
import signOutUser from '@/firebase/auth/signout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { useSession, signIn, signOut } from "next-auth/react"
const Logout = ({setSelected = null, dataSidebar = null,lang}) => {
    let DashboardID = null;
    // dataSidebar.forEach((item,index)=>{
    //   if(item.heading == "Dashboard"){
    //     DashboardID = index;
    //   }
    // })
    const router = useRouter();
    // const [mode,setMode] = useThemeSwitcher();
    const { setUser } = useAuthContext();
    const handleLogout = async (event) => {
        const { result, error } = await signOutUser();
        if (error) {
            return (
                <div>Can not log you out...</div>
            )
        }
        setUser(null);
        signOut();
        return router.push("/")
    }
    return (
        <div className='w-full h-screen flex justify-center items-center col-span-2'>
        <div className='daisycard w-[70vw] lg:w-[80vw] px-4 py-20 text-primary-content rounded-2xl shadow-lg dark:shadow-white dark:shadow-sm'>
            <div className='text-6xl pb-3 font-bold w-full text-center dark:text-white'>
                {lang == "th_th" ? "ออกจากระบบ" : "Sign out"}
            </div>
            <div>
            <form className="flex gap-3 w-full justify-center">
                {/* <div>
                <button onClick={()=>{
              if(DashboardID == null){
                MySwal.fire({
                  'title': 'Dashboard ID didn\'t defined.',
                  icon:'error'
                })
              }else{
                setSelected(DashboardID);
              }
            }} className='hidden md:block daisybtn daisybtn-success bg-golden-400 hover:bg-golden-500 hover:border-golden-400 border-golden-400 text-black shadow-golden-600 shadow-md hover:shadow-none'>
              <i className='far fa-home-alt' /> Go back
            </button>
                </div> */}
                <div>
                <div className='daisybtn daisybtn-success shadow-md shadow-success' onClick={handleLogout}>{lang == "th_th" ? "ออกจากระบบ" : "Sign out"}</div>
                </div>
            </form>
            </div>
        </div>
    </div>
      )
}

export default Logout