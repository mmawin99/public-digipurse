import { StringVersionDiGiPurse } from '@/Data/Data';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { CryptoFunc, MySwal } from './ModuleCentralClass';
import Settings from './test.settings';
import { useAuthContext } from '@/context/AuthContext';
import { signOut } from 'firebase/auth';
import { useSession } from 'next-auth/react';
import { checkFirebaseUserExists } from '@/firebase/auth/authorizeNextAuthToFirebase';

const Profiles = ({lang, data,setSelected,authorize,authorizeFunction}) => {
  // const swal = MySwal;
  const { data:session } = useSession();
  let settingID = null;
  let SignoutID = null;
  let PremiumID = null;
  const {user,setUser} = useAuthContext();
  data.forEach((item,index)=>{
    if(item.heading == "Settings"){
      settingID = index;
    }else if(item.heading == "Signout"){
      SignoutID = index;
    }else if(item.heading == "Premium"){
      PremiumID = index;
    }
  })
  // const { user } = useAuthContext();
  const [UserphotoURL, setPhotoURL] = useState("https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png");
  const [Username,setName] = useState(lang == "th_th" ? "ยังไม่มีชื่อ" : "No name yet.");
  const [UserEmail,setEmail] = useState(lang == "th_th" ? "อีเมลที่ไม่รู้จัก" : "Unknown Email");
  useEffect(()=>{
    setName(session.user.name);
    setPhotoURL(session.user.image);
    if(typeof session.user.email !== "undefined"){
      setEmail(session.user.email);
    }
  },[session,UserEmail]);
  return (
    <div className='relative col-span-2 md:col-span-1'>
    <div className=' -z-130 fixed w-full h-full'></div>
    <div className='w-full h-full bg-glassDashboard/10 px-4 pt-8'>
      <h1  className='text-[2em] font-bold md:text-center'>{lang == "th_th" ? "โปรไฟล์" : "Profile"}</h1>
      {/* <hr className='bg-black' /> */}
      <div className='w-full flex flex-col items-center bg-pinkDashboard/30 rounded-xl p-4 mt-4'>
        <div className='flex flex-row gap-3 md:flex-col items-center justify-start w-full'>
            {/* <div className="daisyindicator"> */}
                {/* <div className="daisyindicator-item daisyindicator-bottom daisyindicator-center translate-x-5 translate-y-[0.5rem]"> */}
                  {/* <button className="daisybtn daisybtn-primary"><i className='fad fa-pencil' /></button> */}
                {/* </div>  */}
                <div className='relative w-32 h-32 rounded-full'>
                    <Image src={UserphotoURL} alt={"John Doe Profile Image"} sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' className='rounded-full' fill />
                </div>
            {/* </div> */}
            <div className='mt-4 md:text-center'>
              <div className='font-bold text-2xl md:flex md:flex-col'><span>{Username}</span> <span className='font-medium text-base'>
                ({UserEmail})</span></div>
                {authorize ? <div className={``}>
                <span className={`${session.user.statusUser == "premium" ? "text-golden-600" : "text-blackDashboard"}`}><i className='fad fa-crown' /></span>
                <span className="font-semibold">{session.user.statusUser == "premium" ?  (lang == "th_th" ? "พรีเมี่ยม" : "Premium") : (lang == "th_th" ? "ปกติ" : "Regular")}</span>
              </div> : "" }
              <div className={`font-semibold ${authorize ? "text-xs" : "text-lg"}`}>
                {
                  authorize ?
                  <>
                  <div className="daisybadge daisybadge-success bg-success dark:bg-[#4ade80] gap-2">
                    <i className='far fa-check' />
                    <div>{lang == "th_th" ? "ได้รับอนุญาตจาก" : "Authorized by"} <span className='font-bold'>{session.settings.settings.provider}</span></div>
                  </div>
                </> :
                  <div className="daisybadge daisybadge-error gap-2">
                  <i className='far fa-times' />
                  {lang == "th_th" ? "ไม่ได้รับอนุญาต" : "Unauthorized"}
                </div>
                }
              </div>
              {/* {authorize ? <div className='font-semibold text-xs'>
                <span className='text-blackDashboard'><i className='fad fa-id-card' /></span>
                &nbsp;ID: 
                <span className='font-bold'> {typeof user.uid == "undefined" ? session.uniqueEncodeEmail : user.uid}</span>
              </div> : "" } */}
            </div>
            {authorize ? <div className='flex gap-4'>
            {session.user.statusUser == "premium" ? "" : <button onClick={()=>{
                if(PremiumID == null){
                  MySwal.fire({
                    'title': (lang == "th_th" ? "ไม่ได้กำหนด ID พรีเมียม" : "Premium ID didn't defined."),
                    icon:'error'
                  })
                }else{
                  setSelected(PremiumID);
                }
              }} className='hidden md:block daisybtn daisybtn-success bg-golden-400 hover:bg-golden-500 hover:border-golden-500 border-golden-400 text-white shadow-golden-600 shadow-md hover:shadow-none'>
                <i className="fad fa-crown" /> {lang == "th_th" ? "ซื้อพรีเมี่ยม" : "Purchase Premium"}
              </button> }
              <button onClick={()=>{
                if(settingID == null){
                  MySwal.fire({
                    'title': (lang == "th_th" ? "ไม่ได้กำหนด ID การตั้งค่า" : "Settings ID didn't defined."),
                    icon:'error'
                  })
                }else{
                  setSelected(settingID);
                }
              }} className='hidden md:block daisybtn daisybtn-success bg-firstColor-400 hover:bg-firstColor-500 hover:border-firstColor-400 border-firstColor-400 text-white shadow-firstColor-600 shadow-md hover:shadow-none'>
                <i className='fad fa-cog' /> {lang == "th_th"? "ตั้งค่า" : "Settings"}
              </button>
            </div> : "" }
        </div>
        {!authorize ? <>
          <div className='daisydivider' />
          <div className='daisybtn daisybtn-info' onClick={()=>{
            authorizeFunction();
          }}>{lang == "th_th" ? "อนุมัติบัญชี" : "Authorize an account"}</div>
          <div className='daisydivider' />
          <div className='daisyalert daisyalert-info'>
            <i className='far fa-info-circle' />
            <span>{lang == "th_th" ? "โปรดทราบ: นี่เป็นการอนุญาตเซสชันอีเมลเพียงครั้งเดียว หมายความว่าคุณต้องอนุญาตเซสชันอีเมลของคุณในครั้งแรกบนแอปพลิเคชัน Pursify เท่านั้น" : "FYI : This is one time authorize email session, Mean you've to authorize your email session at first time on Pursify Application only."}</span>
          </div>
          <div className='daisyalert daisyalert-warning mt-4'>
            <i className='far fa-info-circle' />
            <span>{lang == "th_th" ? "โปรดทราบ : การเข้าสู่ระบบโดยใช้แพลตฟอร์มอื่นด้วยอีเมลเดียวกันจะทำการอนุญาตโดยอัตโนมัติ" : "FYI : Login using other platform with the same email will automatically authorize."}</span>
          </div>
          </> : "" }
          {authorize ? <>
            <div className='daisydivider' />
            <div className='flex flex-col gap-2 w-full'>
              {
                session.user.statusUser == "premium" ? <div className="flex flex-row gap-2 text-lg sm:text-base">
                  <div className="font-bold">{lang == "th_th" ? "ซื้อพรีเมี่ยมเมื่อ :" : "Purchased premium on :"} </div>
                  <div>{new Date(session.user.premiumInformation.payment_date).toLocaleDateString("th-TH")}</div>
                </div> : ""
              }
                <div className="flex flex-row gap-2 text-lg sm:text-base">
                  <div className="font-bold">{lang == "th_th" ? "สร้างบัญชีเมื่อ :" : "Create account on :"} </div>
                  <div>{new Date(user.metadata.creationTime).toLocaleDateString("th-TH")}</div>
                </div>
                <div className="flex flex-row gap-2 text-lg sm:text-base">
                  <div className="font-bold">{lang == "th_th" ? "เข้าสู่ระบบครั้งล่าสุด :" : "Last Login :"} </div>
                  <div>{new Date(user.metadata.lastSignInTime).toLocaleDateString("th-TH")}</div>
                </div>
              <div className='daisydivider' />
              <div className="flex flex-row gap-2 text-lg sm:text-base">
                <div className="font-bold">{lang == "th_th" ? "เซสชันปัจจุบัน :" : "Current session :"} </div>
                <div>{CryptoFunc.MD5(session.accessToken).toString().split("").filter((i,j)=>{ if(j < 8){ return i;}else{return "";}}).join("")}</div>
              </div>
              {session.user.statusUser == "premium" ? <div className="flex flex-row gap-2 text-lg sm:text-base">
                <div className="font-bold">{lang == "th_th" ? "รหัสอ้างอิงพรีเมี่ยม : " : "Premium Reference :"} </div>
                <div>{session.user?.premiumInformation?.payment_session?.split("_")[2].split("")
                .map((i,j)=>{ if (j > 12) return null; return i; })
                .filter((i)=>{ return i != null;}).join("")}...</div>
              </div> : "" }
            </div>
            </> : ""}
        <div className='hidden md:daisydivider' />
        <button onClick={()=>{
              if(SignoutID == null){
                MySwal.fire({
                  'title': (lang == "th_th" ? "ไม่ได้กำหนด ID การออกจากระบบ" : "Signout ID didn't defined."),
                  icon:'error'
                })
              }else{
                setSelected(SignoutID);
              }
            }} className='hidden md:block daisybtn daisybtn-success bg-red-400 hover:bg-red-500 hover:border-red-400 border-red-400 text-white shadow-red-600 shadow-md hover:shadow-none'>
              <i className='fad fa-right-from-bracket' /> {lang == "th_th" ? "ออกจากระบบ" : "Signout"}
            </button>
        <div className='daisydivider' />
        <StringVersionDiGiPurse />
      </div>
    </div>
    <div className='hidden md:block md:h-4 md:w-full'></div>
</div>
  )
}

export default Profiles