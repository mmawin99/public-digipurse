import Link from 'next/link'
import React from 'react'
import useLanguageSwitcher from './hooks/useLanguageSwitcher'

const NavBar = () => {
  const [lang,setLang] = useLanguageSwitcher();
  return (
    <>
        <div className="daisynavbar bg-firstColor-900/80 fixed text-white z-130">
          <div className="daisynavbar-start">
            <div className="hidden sm:daisydropdown mr-2">
                <label tabIndex={0} className="daisybtn daisybtn-ghost daisybtn-circle">        
                    <i className="fa-solid fa-bars"></i>
                </label>
                <ul tabIndex={0} className="hidden sm:daisymenu daisymenu-sm daisydropdown-content bg-firstColor-900/80 mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                    {/* <li><Link href="/signup">Sign-up</Link></li> */}
                    <li><Link href="/signin">{lang == "th_th" ? "เข้าสู่ระบบ" : "Sign in"}</Link></li>
                    {/* <li><div className="divider"></div></li> */}
                    {/* <li><Link href="/dashboard">Dashboard</Link></li> */}
                </ul>
            </div>
            <a className="daisybtn daisybtn-ghost text-xl">Pursify</a>
            
            {/* <Link href="/signup" className="mr-2 sm:hidden">
                <button className="daisybtn daisybtn-ghost daisybtn-circle !text-base w-max">
                    Sign-up
                </button>
            </Link>
            <Link href="/dashboard" className="mr-2 sm:hidden">
                <button className="daisybtn daisybtn-ghost daisybtn-circle !text-base w-max">
                    Dashboard
                </button>
            </Link> */}
          </div>
          <div className="daisynavbar-end">
          <Link href="/signin" className="mx-2 sm:hidden">
                <button className="daisybtn daisybtn-ghost daisybtn-circle !text-base w-max">
                {lang == "th_th" ? "เข้าสู่ระบบ" : "Sign in"}
                </button>
            </Link>
          </div>
        </div>
    </>
  )
}

export default NavBar