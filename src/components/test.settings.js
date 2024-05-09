import { StringVersionDiGiPurse } from '@/Data/Data'
import React, { useState } from 'react'

const Settings = ({theme,setTheme,lang, setLang}) => {
  const [themeDarkUse,setThemeDarkUse] = useState(theme == "light" ? false : true);
  return (
    <div className='relative col-span-2 md:col-span-1'>
        <div className=' -z-130 fixed w-full h-full'></div>
        <div className='w-full h-full bg-glassDashboard/10 px-4 pt-8'>
          <h1  className='text-[2em] font-bold md:text-center'>{lang == "th_th" ? "การตั้งค่า" : "Settings"}</h1>
          {/* <hr className='bg-black' /> */}
          <div className='w-full bg-pinkDashboard/30 rounded-xl p-4 mt-4'>
            <div className='flex gap-4 justify-between'>
              <div className='font-bold'>{lang == "th_th" ? "โหมดกลางคืน" : "Dark Mode"}</div>
              <div className="form-control">
                <label className="cursor-pointer flex items-center gap-4 justify-center">
                  <span className="label-text text-black dark:text-white">{themeDarkUse ? lang == "th_th" ? "เปิด" : "Enabled" : lang == "th_th" ? "ปิด" : "Disabled"}</span> 
                  <input type="checkbox" className="daisytoggle daisytoggle-black" checked={themeDarkUse} onChange={()=>{
                    setThemeDarkUse(!themeDarkUse);
                    setTheme(themeDarkUse ? 'light' : 'dark');
                  }} />
                </label>
              </div>
            </div>
            <div className="daisydivider"></div>
            <div className="flex gap-4 justify-between">
              <div className='font-bold'>Language/ภาษา</div>
              <div className="flex flex-row gap-2">
              <div onClick={()=>{ setLang("en_us"); }} className={`cursor-pointer select-none ${lang == "en_us" ? "font-bold" : ""}`}>EN</div>
                 / 
              <div onClick={()=>{ setLang("th_th"); }} className={`cursor-pointer select-none ${lang == "th_th" ? "font-bold" : ""}`}>TH</div> 
              </div>
            </div>
            <div className="daisydivider"></div>
            <StringVersionDiGiPurse />
          </div>
        </div>
    </div>
  )
}

export default Settings