import Link from 'next/link';
import React from 'react'
import { GlowingSVGIcon } from './Icon';
const MenuBarItem = ({icon,name,currentPath,pathset,className = ""})=>{
    let active = false;
    let setPath = "";
    if(name == "Home"){
        setPath = "home";
    if(currentPath == setPath){
        active = true;
    }
    }else if(name == "Wallet"){
        setPath = "wallet";
    if(currentPath == setPath){
        active = true;
    }
    }else if(name == "Statistics"){
        setPath = "stats";
    if(currentPath == setPath){
        active = true;
    }
    }else if(name == "Profile"){
        setPath = "profile";
    if(currentPath == setPath){
        active = true;
    }
    }else{
        setPath = "home";
    }
    const handlePath = (setPath)=>{
        pathset(setPath);
    }
    return (
        <div onClick={()=>{handlePath(setPath);}} 
        className={`${className} cursor-pointer flex rounded-full
        flex-col justify-center relative w-14 aspect-square 3xs:w-10
        items-center ${active ? " text-amber-500 bg-black/40 hover:bg-black/70 backdrop-blur-3xl shadow-md shadow-black" : "text-white hover:text-amber-500"} duration-100 transition-colors `}>
            <div className='absolute'>
                <i className={`text-2xl 3xs:text-xl far ${icon}`} />
            </div>
        </div>
    )
}
const Addmenu = ({isHidden,onClickHandle = ()=>{}})=>{
    return (
        <div onClick={onClickHandle} className='
        w-[60px] 3xs:w-[40px] h-[60px] 3xs:h-[40px] bg-gradient-to-r from-amber-300 
        shadow-md shadow-black to-golden-700 hover: z-110
        flex flex-row justify-center items-center text-6xl rounded-full cursor-pointer'>
            <i className={`text-2xl text-black 3xs:text-xl fas fa-plus`} />
        </div>
    )
}
const MenuBar = ({pathRouter,setPathRouter,isHidden = false}) => {
  return (
    <div className={`${isHidden ? "translate-y-20 bottom-0" : "bottom-16 3xs:bottom-14"} 
    transition-all duration-300 fixed left-0 right-0 w-full z-100`}>
        {/* <div className='w-full'> */}
            <div className='w-full relative flex flex-row justify-center items-center'>
                <div className='absolute h-[5rem] 3xs:h-[4rem] w-[460px] 
                bestExtraSmall:w-[92%] bg-[#060533] rounded-full'>
                    <div className={`w-full h-full
                    bg-gradient-to-r from-pink-600/50 to-blue-600/60
                     via-purple-400/50 via-45% rounded-full border-2 border-white/50 flex justify-between px-2 
                     xs:px-2 items-center`}>
                        <div className='w-max'>
                            <div className='w-full h-full flex flex-row 
                            items-center justify-center gap-6 xs:gap-3'>
                                <MenuBarItem pathset={setPathRouter} 
                                    name={"Home"} currentPath={pathRouter} 
                                    icon={"fa-home"} />
                                <MenuBarItem pathset={setPathRouter} 
                                    name={"Wallet"} currentPath={pathRouter} 
                                    icon={"fa-wallet"} />
                                <MenuBarItem pathset={setPathRouter} 
                                    name={"Statistics"} currentPath={pathRouter} 
                                    icon={"fa-chart-line"} />
                                <MenuBarItem pathset={setPathRouter} 
                                    name={"Profile"} currentPath={pathRouter} 
                                    icon={"fa-user"} />
                            </div>
                        </div>
                        <div className={``}>
                            <Addmenu onClickHandle={()=>{setPathRouter("txnadd");}} />
                        </div>
                    </div>
                </div>
            </div>
        {/* </div> */}
    </div>
  )
}

export default MenuBar;