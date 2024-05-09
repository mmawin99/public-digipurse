import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Navigation } from 'swiper/modules';
// Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';
// import 'swiper/css/bundle';
import { EffectCards, Controller } from 'swiper/modules';
import { BackgroundPatternsExport } from './background';
import WalletWrapper from './WalletWrapper';
import { ColorPicker } from './ColorPicker';
import IconFinder from './IconFinder';
import { MySwal, writeAnUpdate } from './ModuleCentralClass';
import { formatDateWithTokens, getDatabaseName, sortByCreated } from './MainConfig';
import { updateData, writeData } from '@/firebase/firestore/CRUD';
import { useRouter } from 'next/router';
import { useLocalStorage, useSessionStorage } from '@uidotdev/usehooks';
import WalletWrapperGrid from './WalletWrapper_grid';

const WalletPatternList = BackgroundPatternsExport;
const Wallets = ({lang, cacheData, user, session}) => {
  const router = useRouter();
  // const [activeDisplayWallet            ,setActiveDisplayWallet]            = useState(0);
  // const [addingState                    ,setAddingState]                    = useState(false);
  // const [editingState                   ,setEditingState]                   = useState(false);
  // const [totalWallet                    ,setTotalWallet]                    = useState(cacheData[0].wallet.data.length);
  // const [generateWalletBackgroundColor  ,setGenerateWalletBackgroundColor]  = useState('rgb(195, 20, 50)');
  // const [generateWalletName             ,setGenerateWalletName]             = useState('Untitled Wallet');
  // const [generateWalletId               ,setGenerateWalletId]               = useState('unknown');
  // const [generateDefaultWalletName      ,setGenerateDefaultWalletName]      = useState('Untitled Wallet');
  // const [generateWalletAvailableBalance ,setGenerateWalletAvailableBalance] = useState("4000.00");
  // const [generateWalletTotalIncome      ,setGenerateWalletTotalIncome]      = useState("4200.00");
  // const [generateWalletTotalExpense     ,setGenerateWalletTotalExpense]     = useState("200.00");
  // const [generateWalletIcon             ,setGenerateWalletIcon]             = useState("fad fa-vault");
  // const [generateWalletTextColor        ,setGenerateWalletTextColor]        = useState("rgb(255,255,255)");
  // const [generateWalletPattern          ,setGenerateWalletPattern]          = useState("topography");
  // const [generateWalletPatternColor     ,setGenerateWalletPatternColor]     = useState("rgb(245,158,11)");
  // const [generateWalletIsLock           ,setGenerateWalletIsLock]           = useState(false);
  // const [generateWalletIsHasLimit       ,setGenerateWalletIsHasLimit]       = useState(false);
  // const [generateWalletLimit            ,setGenerateWalletLimit]            = useState(0);
  // const [isShowIconSelectorWallet       ,setIsShowIconSelectorWallet]       = useState(false);
  const [displayType                    ,setDisplayType]                    = useLocalStorage("digipurse_local_wallet_display_type","swap");
  const [activeDisplayWallet            ,setActiveDisplayWallet]            = useState(0);
  const [activeDisplayWalletData        ,setActiveDisplayWalletData]        = useState(sortByCreated(cacheData[0].wallet.data)[0]);
  const [addingState                    ,setAddingState]                    = useSessionStorage("digipurse_session_wallet_addingState",                    false);
  const [editingState                   ,setEditingState]                   = useSessionStorage("digipurse_session_wallet_editingState",                   false);
  const [totalWallet                    ,setTotalWallet]                    = useSessionStorage("digipurse_session_wallet_totalWallet",                    cacheData[0].wallet.data.length);
  const [generateWalletBackgroundColor  ,setGenerateWalletBackgroundColor]  = useSessionStorage("digipurse_session_wallet_generateWalletBackgroundColor",  'rgb(195, 20, 50)');
  const [generateWalletName             ,setGenerateWalletName]             = useSessionStorage("digipurse_session_wallet_generateWalletName",             'Untitled Wallet');
  const [generateWalletId               ,setGenerateWalletId]               = useSessionStorage("digipurse_session_wallet_generateWalletId",               'unknown');
  const [generateDefaultWalletName      ,setGenerateDefaultWalletName]      = useSessionStorage("digipurse_session_wallet_generateDefaultWalletName",      'Untitled Wallet');
  const [generateWalletAvailableBalance ,setGenerateWalletAvailableBalance] = useSessionStorage("digipurse_session_wallet_generateWalletAvailableBalance", "4000.00");
  const [generateWalletTotalIncome      ,setGenerateWalletTotalIncome]      = useSessionStorage("digipurse_session_wallet_generateWalletTotalIncome",      "4200.00");
  const [generateWalletTotalExpense     ,setGenerateWalletTotalExpense]     = useSessionStorage("digipurse_session_wallet_generateWalletTotalExpense",     "200.00");
  const [generateWalletIcon             ,setGenerateWalletIcon]             = useSessionStorage("digipurse_session_wallet_generateWalletIcon",             "fad fa-vault");
  // const [generateWalletTextColor        ,setGenerateWalletTextColor]        = useSessionStorage("digipurse_session_wallet_generateWalletTextColor",        "rgb(255,255,255)");
  const [generateWalletPattern          ,setGenerateWalletPattern]          = useSessionStorage("digipurse_session_wallet_generateWalletPattern",          "topography");
  const [generateWalletPatternColor     ,setGenerateWalletPatternColor]     = useSessionStorage("digipurse_session_wallet_generateWalletPatternColor",     "rgb(245,158,11)");
  const [generateWalletIsLock           ,setGenerateWalletIsLock]           = useSessionStorage("digipurse_session_wallet_generateWalletIsLock",           false);
  const [generateWalletIsHasLimit       ,setGenerateWalletIsHasLimit]       = useSessionStorage("digipurse_session_wallet_generateWalletIsHasLimit",       false);
  const [generateWalletLimit            ,setGenerateWalletLimit]            = useSessionStorage("digipurse_session_wallet_generateWalletLimit",            0);
  const [isShowIconSelectorWallet       ,setIsShowIconSelectorWallet]       = useSessionStorage("digipurse_session_wallet_isShowIconSelectorWallet",       false);
  const sliderRef = useRef(null);
  const handleCancelAddWallet = ()=>{
    setGenerateWalletId("unknown");
    setTotalWallet(cacheData[0].wallet.data.length);
    setGenerateWalletBackgroundColor('rgb(195, 20, 50)');
    setGenerateWalletName('Untitled Wallet');
    setGenerateDefaultWalletName('Untitled Wallet');
    setGenerateWalletAvailableBalance("4000.00");
    setGenerateWalletTotalIncome("4200.00");
    setGenerateWalletTotalExpense("200.00");
    setGenerateWalletIcon("fad fa-vault");
    // setGenerateWalletTextColor("rgb(255,255,255)");
    setGenerateWalletPattern("topography");
    setGenerateWalletPatternColor("rgb(245,158,11)");
    setGenerateWalletIsLock(false);
    setGenerateWalletIsHasLimit(false);
    setGenerateWalletLimit(0);
    setAddingState(false);
    setEditingState(false);
  }
  const handleEditWalletSetup = (adc)=>{
    let walletData = sortByCreated(cacheData[0].wallet.data);
    setEditingState(true);
    setGenerateWalletId(walletData[adc].id);
    setGenerateWalletBackgroundColor(walletData[adc].wallet_bg_color);
    setGenerateWalletName(walletData[adc].wallet_name);
    setGenerateDefaultWalletName(walletData[adc].wallet_name);
    setGenerateWalletIcon(walletData[adc].wallet_icon);
    // setGenerateWalletTextColor(walletData[adc].wallet_text_color);
    setGenerateWalletPattern(walletData[adc].wallet_pattern);
    setGenerateWalletPatternColor(walletData[adc].wallet_pattern_color);
    setGenerateWalletIsLock(walletData[adc].wallet_isLock);
    setGenerateWalletIsHasLimit(walletData[adc].wallet_isLimit);
    setGenerateWalletLimit(walletData[adc].wallet_limit);
  }
  const handleAddWallet = ()=>{
    MySwal.fire({
      title: "Adding your unique wallet.",
      text:"Wait a few seconds, This will not take long.",
      didOpen: () => {
        MySwal.showLoading()
          setTimeout(()=>{
            MySwal.fire({
                  title:"Are you want to add this wallet?",
                  html: <div className='flex flex-col pb-2'>
                     <WalletWrapper
                        WalletBackgroundColor  = {                  generateWalletBackgroundColor}
                        WalletName             = {                  generateWalletName}
                        WalletAvailableBalance = {                  generateWalletAvailableBalance}
                        WalletTotalIncome      = {                  generateWalletTotalIncome}
                        WalletTotalExpense     = {                  generateWalletTotalExpense}
                        WalletIcon             = {                  generateWalletIcon}
                        // WalletTextColor        = {                  generateWalletTextColor}
                        WalletPattern          = {WalletPatternList[generateWalletPattern]}
                        WalletPatternColor     = {                  generateWalletPatternColor}
                        WalletIsLock           = {                  generateWalletIsLock}
                        WalletIsHasLimit       = {                  generateWalletIsHasLimit}
                        WalletLimit            = {                  generateWalletLimit}
                    />   
                  </div>,
                   showDenyButton: true,
                   showCancelButton: false,
                   confirmButtonText: (lang == "th_th" ? "ใช่ เพิ่มสิ่งนี้!" : "Yes, Add this!"),
                   denyButtonText: (lang == "th_th" ? "ไม่ ไม่เพิ่ม" : "No, not add."),
                   cancelButtonText: (lang == "th_th" ? "ยกเลิก" : "Cancel"),
              }).then((result) => {
              if (result.isConfirmed) {
                    if(generateWalletIsHasLimit == true && generateWalletLimit == 0){
                      MySwal.fire((lang == "th_th" ? "เป้าหมาย Wallet ไม่สามารถเป็น 0" : "Wallet Goal cannot be 0."), '', 'warning')
                      return;
                    }
                    let DBName = getDatabaseName(user.uid)["wallet"];
                    MySwal.fire({
                      title: (lang == "th_th" ? "กำลังเพิ่ม Wallet อยู่ระหว่างดำเนินการ..." : "Adding Wallet in process..."),
                      text:(lang == "th_th" ? "รอสักครู่ ขั้นตอนนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
                      didOpen: () => {
                        MySwal.showLoading()
                          writeData(DBName,{
                            wallet_bg_color:generateWalletBackgroundColor,
                            wallet_name:generateWalletName,
                            wallet_icon:generateWalletIcon,
                            // wallet_text_color:generateWalletTextColor,
                            wallet_pattern:generateWalletPattern,
                            wallet_pattern_color:generateWalletPatternColor,
                            wallet_isLock:generateWalletIsLock,
                            wallet_isLimit:generateWalletIsHasLimit,
                            wallet_limit: generateWalletLimit
                          }).then((res)=>{
                            if(res.success == true){
                              console.log("Entering success",res);
                              writeAnUpdate(user.uid,cacheData,()=>{
                                cacheData[2]().then(respCache=>{
                                  if(respCache.success == true){
                                    setGenerateWalletId("unknown");
                                    let currentTotalWallet = totalWallet;
                                    currentTotalWallet++;
                                    setTotalWallet(currentTotalWallet);
                                    console.log("Current total wallet:",totalWallet);
                                    setGenerateWalletBackgroundColor('rgb(195, 20, 50)');
                                    setGenerateWalletName('Untitled Wallet');
                                    setGenerateDefaultWalletName('Untitled Wallet');
                                    setGenerateWalletAvailableBalance("4000.00");
                                    setGenerateWalletTotalIncome("4200.00");
                                    setGenerateWalletTotalExpense("200.00");
                                    setGenerateWalletIcon("fad fa-vault");
                                    // setGenerateWalletTextColor("rgb(255,255,255)");
                                    setGenerateWalletPattern("topography");
                                    setGenerateWalletPatternColor("rgb(245,158,11)");
                                    setGenerateWalletIsLock(false);
                                    setGenerateWalletIsHasLimit(false);
                                    setGenerateWalletLimit(0);
                                    setAddingState(!addingState);
                                    router.push
                                    MySwal.fire((lang == "th_th" ? "เพิ่มกระเป๋าเงินของคุณสำเร็จ!" : "Add your wallet successfully!"),'','success');
                                  }
                                }).catch((error)=>{
                                  MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #1..." : "Error#1 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                })
                              })
                            }
                          }).catch((error)=>{
                            MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #2..." : "Error#2 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                          })
                      },
                      allowOutsideClick:false,
                      allowEscapeKey:false,
                      allowEnterKey:false
                  })
                  } else if (result.isDenied) {
                    MySwal.fire((lang == "th_th" ? "กระบวนการถูกยกเลิก!" : "Process Cancelled!"), '', 'success')
                  }
                })
          },100);
      },
      allowOutsideClick:false,
      allowEscapeKey:false,
      allowEnterKey:false
    })
  }
  const handleEditWallet = ()=>{
    MySwal.fire({
      title: (lang == "th_th" ? "การแก้ไขกระเป๋าสตางค์ที่ไม่ซ้ำใครของคุณ" : "Editing your unique wallet."),
      text:(lang == "th_th" ? "รอสักครู่ ขั้นตอนนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
      didOpen: () => {
        MySwal.showLoading()
          setTimeout(()=>{
            MySwal.fire({
                  title:(lang == "th_th" ? "คุณแน่ใจที่จะแก้ไขกระเป๋าเงินนี้หรือไม่?" : "Are you sure to edit this wallet?"),
                  html: <div className='flex flex-col pb-2'>
                     <WalletWrapper
                        WalletBackgroundColor  = {                  generateWalletBackgroundColor}
                        WalletName             = {                  generateWalletName}
                        WalletAvailableBalance = {                  generateWalletAvailableBalance}
                        WalletTotalIncome      = {                  generateWalletTotalIncome}
                        WalletTotalExpense     = {                  generateWalletTotalExpense}
                        WalletIcon             = {                  generateWalletIcon}
                        // WalletTextColor        = {                  generateWalletTextColor}
                        WalletPattern          = {WalletPatternList[generateWalletPattern]}
                        WalletPatternColor     = {                  generateWalletPatternColor}
                        WalletIsLock           = {                  generateWalletIsLock}
                        WalletIsHasLimit       = {                  generateWalletIsHasLimit}
                        WalletLimit            = {                  generateWalletLimit}
                    />   
                  </div>,
                   showDenyButton: true,
                   showCancelButton: false,
                   confirmButtonText: (lang == "th_th" ? "ใช่ แก้ไขสิ่งนี้!" : "Yes, edit this!"),
                   denyButtonText: (lang == "th_th" ? "ไม่ ไม่แก้ไข" : "No, not edit."),
              }).then((result) => {
              if (result.isConfirmed) {
                    if(generateWalletIsHasLimit == true && generateWalletLimit == 0){
                      MySwal.fire((lang == "th_th" ? "เป้าหมาย Wallet ไม่สามารถเป็น 0" : "Wallet Goal cannot be 0."), '', 'warning')
                      return;
                    }
                    if(generateWalletIsHasLimit == false){
                      setGenerateWalletLimit(0);
                    }
                    let DBName = getDatabaseName(user.uid)["wallet"];
                    MySwal.fire({
                      title: (lang == "th_th" ? "กำลังแก้ไข Wallet..." : "Editing Wallet in process..."),
                      text:(lang == "th_th" ? "รอสักครู่ ขั้นตอนนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
                      didOpen: () => {
                        MySwal.showLoading()
                          updateData(DBName,generateWalletId,{
                            wallet_bg_color:generateWalletBackgroundColor,
                            wallet_name:generateWalletName,
                            wallet_icon:generateWalletIcon,
                            // wallet_text_color:generateWalletTextColor,
                            wallet_pattern:generateWalletPattern,
                            wallet_pattern_color:generateWalletPatternColor,
                            wallet_isLock:generateWalletIsLock,
                            wallet_isLimit:generateWalletIsHasLimit,
                            wallet_limit: generateWalletLimit
                          }).then((res)=>{
                            if(res.success == true){
                              console.log((lang == "th_th" ? "เข้าสู่ความสำเร็จ" : "Entering success"),res);
                              writeAnUpdate(user.uid,cacheData,()=>{
                                cacheData[2]().then(respCache=>{
                                  if(respCache.success == true){
                                    setGenerateWalletId("unknown");
                                    let currentTotalWallet = totalWallet;
                                    currentTotalWallet++;
                                    setTotalWallet(currentTotalWallet);
                                    console.log((lang == "th_th" ? "กระเป๋าสตางค์ทั้งหมดในปัจจุบัน :" : "Current total wallet : "),totalWallet);
                                    setGenerateWalletBackgroundColor('rgb(195, 20, 50)');
                                    setGenerateWalletName('Untitled Wallet');
                                    setGenerateDefaultWalletName('Untitled Wallet');
                                    setGenerateWalletAvailableBalance("4000.00");
                                    setGenerateWalletTotalIncome("4200.00");
                                    setGenerateWalletTotalExpense("200.00");
                                    setGenerateWalletIcon("fad fa-vault");
                                    // setGenerateWalletTextColor("rgb(255,255,255)");
                                    setGenerateWalletPattern("topography");
                                    setGenerateWalletPatternColor("rgb(245,158,11)");
                                    setGenerateWalletIsLock(false);
                                    setGenerateWalletIsHasLimit(false);
                                    setGenerateWalletLimit(0);
                                    // setAddingState(!addingState);
                                    setEditingState(false);
                                    MySwal.fire((lang == "th_th" ? "แก้ไขกระเป๋าเงินของคุณสำเร็จแล้ว!" : "Edited your wallet successfully!"),'','success');
                                  }
                                }).catch((error)=>{
                                  MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #1..." : "Error#1 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                })
                              })
                            }
                          }).catch((error)=>{
                            MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #2..." : "Error#2 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                          })
                      },
                      allowOutsideClick:false,
                      allowEscapeKey:false,
                      allowEnterKey:false
                  })
                  } else if (result.isDenied) {
                    MySwal.fire((lang == "th_th" ? "กระบวนการถูกยกเลิก!" : "Process Cancelled!"), '', 'success')
                  }
                })
          },100);
      },
      allowOutsideClick:false,
      allowEscapeKey:false,
      allowEnterKey:false
    })
  }
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  useEffect(()=>{
    setTotalWallet(cacheData[0].wallet.data.length);
  },[setTotalWallet,cacheData]);

  const handleSlideChange = (swiper) => {
    // console.log(swiper);
    if(typeof swiper?.activeIndex !== "undefined"){
      // console.log("Active index change from "+activeDisplayWallet+" to "+swiper.activeIndex);
      setActiveDisplayWallet(swiper.activeIndex);
      let walletData = sortByCreated(cacheData[0].wallet.data)[swiper.activeIndex];
      console.log((lang == "th_th" ? "ข้อมูลปัจจุบันของกระเป๋าเงิน :" : "Wallet current data :"),walletData);
      setActiveDisplayWalletData(walletData);
    }
  };
  if(isShowIconSelectorWallet == true){
    return (
      <IconFinder current={generateWalletIcon} 
      styleIcon={["classicduotone","brands"]}
      cancelHandle={()=>{ setIsShowIconSelectorWallet(!isShowIconSelectorWallet); }} 
      successHandle={(icon)=>{ setIsShowIconSelectorWallet(!isShowIconSelectorWallet);
                               setGenerateWalletIcon(icon); }} 
      />
    )
  }else if(addingState == true){
    //หน้าเพิ่ม Wallet
    return (
      <>
        <div className='relative col-span-2 md:col-span-1'>
          <div className=' -z-130 fixed w-full h-full'></div>
          <div className='w-full h-full bg-glassDashboard/10 px-4 pt-8'>
            <div className='w-full h-full pt-8 flex flex-col items-center pr-6 md:pr-0'>
              <h1  className='text-[2em] px-4 font-bold w-full md:text-center mb-10 md:mb-0'>{lang == "th_th" ? "เพิ่มกระเป๋าเงิน" : "Add Wallet"}</h1>
              <div className='w-full xl:w-[639px] sm:w-[70vw] md:w-[90vw] !aspect-[1011/638] ms:w-[75vw]'>
                <div className='flex flex-row xl:flex-col gap-2 md:items-center'>
                  <div className={`w-[768px] xl:w-full md:w-[80vw] ExtraXL:justify-center flex flex-col bg-pinkDashboard/30 rounded-3xl p-8 md:p-8 sm:p-6 ms:p-4 items-center`}>
                    <WalletWrapperGrid
                      WalletBackgroundColor  = {                  generateWalletBackgroundColor}
                      WalletName             = {                  generateWalletName}
                      WalletAvailableBalance = {                  generateWalletAvailableBalance}
                      WalletTotalIncome      = {                  generateWalletTotalIncome}
                      WalletTotalExpense     = {                  generateWalletTotalExpense}
                      WalletIcon             = {                  generateWalletIcon}
                      // WalletTextColor        = {                  generateWalletTextColor}
                      WalletPattern          = {WalletPatternList[generateWalletPattern]}
                      WalletPatternColor     = {                  generateWalletPatternColor}
                      WalletIsLock           = {                  generateWalletIsLock}
                      WalletIsHasLimit       = {                  generateWalletIsHasLimit}
                      WalletLimit            = {                  generateWalletLimit}
                    />   
                  </div>
                  <form className='w-full grid grid-cols-2 ExtraXL:grid-cols-1 ExtraMedium:grid-cols-1 gap-6 ExtraMedium:gap-6 bg-pinkDashboard/30 p-4 rounded-3xl'>
                    {/* Wallet Name */}
                    <label className="daisyform-control w-full">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "ชื่อกระเป๋าสตางค์" : "Wallet name"}</span>
                      </div>
                      <input placeholder={lang == "th_th" ? "ชื่อกระเป๋าสตางค์" : "Wallet name"}
                      onChange={(e) => setGenerateWalletName(e.target.value)} required 
                      type="text" name="walletName" id="walletName"
                      value={generateWalletName}
                      className="daisyinput daisyinput-bordered w-full" />
                    </label>
                    {/* <div className="flex relative mt-2">
                        <input className={"daisyinput"} placeholder="Wallet Name" 
                         onChange={(e) => setGenerateWalletName(e.target.value)} required
                         type="text" name="walletName" id="walletName"
                         value={generateWalletName}
                        />
                        <label className={""}>Wallet Name</label>
                    </div> */}
                    {/* Wallet Icon */}
                    <label className="daisyform-control w-full max-w-xs">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "ไอคอนกระเป๋าเงิน" : "Wallet Icon"}</span>
                      </div>
                      <div className='flex flex-row gap-2 mt-3 items-center'>
                            <div onClick={()=>{
                              setIsShowIconSelectorWallet(!isShowIconSelectorWallet);
                            }} className='w-max py-1 px-4 hover:bg-golden-800 cursor-pointer bg-golden-700 rounded-full text-white'>
                              <i className='far fa-pencil' /> {lang == "th_th" ? "ไอคอน" : "Icon"}
                            </div>
                            <div className='flex flex-row gap-2 bg-red-900 rounded-full px-3 py-1'>
                              <div className='text-white'>{lang == "th_th" ? "ไอคอนปัจจุบัน :" : "Current Icon :"}</div>
                              <div className='text-white'>
                                <i className={generateWalletIcon} />
                              </div>
                            </div>
                        </div>
                    </label>

                    <label className="daisyform-control w-full col-span-2 ExtraXL:col-span-1">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "สีกระเป๋าสตางค์" : "Wallet Color"}</span>
                      </div>
                      <div className='grid grid-cols-3 gap-5 sm:grid-cols-4 afterMS:grid-cols-1'>
                        {/* Wallet Background Color */}
                        <div className="relative h-10 w-full sm:col-span-2">
                        <ColorPicker color={generateWalletBackgroundColor} onChange={setGenerateWalletBackgroundColor} text={"Background color"} />
                        </div>
                        {/* Wallet Pattern Color */}
                        <div className="relative h-10 w-full sm:col-span-2">
                        <ColorPicker color={generateWalletPatternColor} onChange={setGenerateWalletPatternColor} text={"Pattern Color"} />
                        </div>
                        <div className="hidden sm:block afterMS:hidden" />
                        {/* Wallet Text Color */}
                        {/* <div className="relative h-10 w-full sm:col-span-2">
                          <ColorPicker color={generateWalletTextColor} onChange={setGenerateWalletTextColor} text={"Text Color"} />
                        </div> */}
                      </div>
                    </label>
                    {/* Wallet Pattern */}
                    <label className="daisyform-control w-full">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "รูปแบบกระเป๋าสตางค์" : "Wallet Pattern"}</span>
                      </div>
                      <select defaultValue={generateWalletPattern} onChange={(e)=> setGenerateWalletPattern(e.target.value)}
                         className={`daisyinput`} id="walletPattern" name='walletPattern'>
                            <option value="default" disabled className='text-gray-500 dark:text-gray-500'>{lang == "th_th" ? "เลือกรูปแบบกระเป๋าเงิน" : "Choose Wallet Pattern"}</option>
                            {
                              Object.keys(WalletPatternList).map((i,j)=>{
                                return (
                                  <option key={"patternAddWalletSelector_"+i} value={i} className='text-black first-letter:uppercase dark:text-white'>{i}</option>
                                )
                              })
                            }
                        </select>
                    </label>
                    <div className='w-full grid grid-cols-2 sm:grid-cols-1'>
                    <label className="daisyform-control w-full">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "สถานะล็อค" : "Lock status"}</span>
                      </div>
                      <label className="cursor-pointer flex gap-4 justify-start">
                        <input type="checkbox" className="daisytoggle daisytoggle-black" checked={generateWalletIsLock} onChange={()=>{
                          setGenerateWalletIsLock(!generateWalletIsLock);
                        }} />
                        <span className="label-text text-black dark:text-white">{generateWalletIsLock ? (lang == "th_th" ? "ล็อคแล้ว" :"Locked") : (lang == "th_th" ? "ปลดล็อคแล้ว" : "Unlocked")}</span> 
                      </label>
                    </label>
                      <label className="daisyform-control w-full">
                        <div className="daisylabel">
                          <span className="daisylabel-text">{lang == "th_th" ? "เป้าหมาย" : "Goal"}</span>
                        </div>
                        <label className="cursor-pointer flex gap-4 justify-start">
                          <input type="checkbox" className="daisytoggle daisytoggle-black" checked={generateWalletIsHasLimit} onChange={()=>{
                            setGenerateWalletIsHasLimit(!generateWalletIsHasLimit);
                          }} />
                          <span className="label-text text-black dark:text-white">{generateWalletIsHasLimit ? (lang == "th_th" ? "เปิดใช้งานแล้ว" : "Enabled") : (lang == "th_th" ? "ปิดใช้งานแล้ว" : "Disabled")}</span> 
                        </label>
                      </label>
                      <label className={`${generateWalletIsHasLimit ? "" : "hidden"} daisyform-control w-full col-span-2 sm:col-span-1`}>
                        <div className="daisylabel">
                          <span className="daisylabel-text">{lang == "th_th" ? "เป้าหมาย" : "Goal"}</span>
                        </div>
                        <input placeholder={lang == "th_th" ? "เป้าหมายกระเป๋าเงิน (บาท)" : "Wallet Goal (THB)"}
                        onChange={(e) => setGenerateWalletLimit(e.target.value)} required 
                        type="text" name="walletName" id="walletName"
                        value={generateWalletLimit}
                        className="daisyinput daisyinput-bordered w-full" />
                      </label>
                    </div>
                    {/* <div className='relative w-full min-w-[200px]'>
                    <label className="w-auto h-auto leading-normal whitespace-nowrap cursor-pointer inline-flex items-center">
            <input type="checkbox" onChange={(e)=>{setGenerateWalletIsLock(!generateWalletIsLock)}}
            checked={generateWalletIsLock}
            className="peer sr-only" />
            <span className={`inline-flex
            items-center text-sm w-11 h-4 bg-gray-200 rounded-full
            peer-checked:justify-end duration-500 transition-all
            `}>
              <span className={`flex w-6 rounded-full justify-center items-center aspect-square ${
                generateWalletIsLock == true ? "bg-blue-500" : "bg-red-500"

              }`}>{
                generateWalletIsLock == true ? <i className='far fa-check' /> : <i className='far fa-times' />
              }</span>
            </span>
          </label>
                    </div> */}
                    <div className='flex flex-row gap-4'>

                    <div onClick={handleAddWallet} className='w-max py-2 -translate-y-3 px-4 -mb-3 hover:bg-golden-800 cursor-pointer bg-golden-700 rounded-full text-white'> 
                        {lang == "th_th" ? "เพิ่มกระเป๋าเงินใหม่" : "Add new Wallet"}
                    </div>
                    <div onClick={handleCancelAddWallet} className='w-max py-2 -translate-y-3 px-4 -mb-3 hover:bg-red-800 cursor-pointer bg-red-700 rounded-full text-white'> 
                        {lang == "th_th" ? "ยกเลิก" : "cancel"}
                    </div>
                    </div>
                </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }else if(editingState == true){
    //หน้าแก้ไข Wallet
    return (
      <>
        <div className='relative col-span-2 md:col-span-1'>
          <div className=' -z-130 fixed w-full h-full'></div>
          <div className='w-full h-full bg-glassDashboard/10 px-4 pt-8'>
            <div className='w-full h-full pt-8 flex flex-col items-center pr-6 md:pr-0'>
              <h1  className='text-[2em] px-4 font-bold w-full md:text-center mb-10 md:mb-0'>{lang == "th_th" ? "แก้ไข" : "Edit"} &ldquo;{generateDefaultWalletName}&rdquo; {lang == "th_th" ? "กระเป๋าสตางค์" : "Wallet"}</h1>
              <div className='w-full xl:w-[639px] sm:w-[70vw] md:w-[90vw] !aspect-[1011/638] ms:w-[75vw]'>
                <div className='flex flex-row xl:flex-col gap-2 md:items-center'>
                  <div className={`w-[768px] xl:w-full md:w-[80vw] ExtraXL:justify-center flex flex-col bg-pinkDashboard/30 rounded-3xl p-8 md:p-8 sm:p-6 ms:p-4 items-center`}>
                    <WalletWrapperGrid
                      WalletBackgroundColor  = {                  generateWalletBackgroundColor}
                      WalletName             = {                  generateWalletName}
                      WalletBalance          = {                  cacheData[3] == null ? 0 : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance[generateWalletId]}
                      WalletTotalIncome      = {                  generateWalletTotalIncome}
                      WalletTotalExpense     = {                  generateWalletTotalExpense}
                      WalletIcon             = {                  generateWalletIcon}
                      // WalletTextColor        = {                  generateWalletTextColor}
                      WalletPattern          = {WalletPatternList[generateWalletPattern]}
                      WalletPatternColor     = {                  generateWalletPatternColor}
                      WalletIsLock           = {                  generateWalletIsLock}
                      WalletIsHasLimit       = {                  generateWalletIsHasLimit}
                      WalletLimit            = {                  generateWalletLimit}
                    />   
                  </div>
                  <form className='w-full grid grid-cols-2 ExtraXL:grid-cols-1 ExtraMedium:grid-cols-1 gap-6 ExtraMedium:gap-6 bg-pinkDashboard/30 p-4 rounded-3xl'>
                    {/* Wallet Name */}
                    <label className="daisyform-control w-full">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "ชื่อกระเป๋าสตางค์" : "Wallet name"}</span>
                      </div>
                      <input placeholder={lang == "th_th" ? "ชื่อกระเป๋าสตางค์" : "Wallet name"}
                      onChange={(e) => setGenerateWalletName(e.target.value)} required 
                      type="text" name="walletName" id="walletName"
                      value={generateWalletName}
                      className="daisyinput daisyinput-bordered w-full" />
                    </label>
                    {/* <div className="flex relative mt-2">
                        <input className={"daisyinput"} placeholder="Wallet Name" 
                         onChange={(e) => setGenerateWalletName(e.target.value)} required
                         type="text" name="walletName" id="walletName"
                         value={generateWalletName}
                        />
                        <label className={""}>Wallet Name</label>
                    </div> */}
                    {/* Wallet Icon */}
                    <label className="daisyform-control w-full max-w-xs">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "ไอคอนกระเป๋าเงิน" : "Wallet Icon"}</span>
                      </div>
                      <div className='flex flex-row gap-2 mt-3 items-center'>
                            <div onClick={()=>{
                              setIsShowIconSelectorWallet(!isShowIconSelectorWallet);
                            }} className='w-max py-1 px-4 hover:bg-golden-800 cursor-pointer bg-golden-700 rounded-full text-white'>
                              <i className='far fa-pencil' /> {lang == "th_th" ? "ไอคอน" : "Icon"}
                            </div>
                            <div className='flex flex-row gap-2 bg-red-900 rounded-full px-3 py-1'>
                              <div className='text-white'>{lang == "th_th" ? "ไอคอนปัจจุบัน : " : "Current Icon :"}</div>
                              <div className='text-white'>
                                <i className={generateWalletIcon} />
                              </div>
                            </div>
                        </div>
                    </label>

                    <label className="daisyform-control w-full col-span-2 ExtraXL:col-span-1">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "สถานะล็อค" : "Wallet Color"}</span>
                      </div>
                      <div className='grid grid-cols-3 gap-5 sm:grid-cols-4 afterMS:grid-cols-1'>
                        {/* Wallet Background Color */}
                        <div className="relative h-10 w-full sm:col-span-2">
                        <ColorPicker color={generateWalletBackgroundColor} onChange={setGenerateWalletBackgroundColor} text={"Background color"} />
                        </div>
                        {/* Wallet Pattern Color */}
                        <div className="relative h-10 w-full sm:col-span-2">
                        <ColorPicker color={generateWalletPatternColor} onChange={setGenerateWalletPatternColor} text={"Pattern Color"} />
                        </div>
                        <div className="hidden sm:block afterMS:hidden" />
                        {/* Wallet Text Color */}
                        {/* <div className="relative h-10 w-full sm:col-span-2">
                          <ColorPicker color={generateWalletTextColor} onChange={setGenerateWalletTextColor} text={"Text Color"} />
                        </div> */}
                      </div>
                    </label>
                    {/* Wallet Pattern */}
                    <label className="daisyform-control w-full">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "รูปแบบกระเป๋าสตางค์" : "Wallet Pattern"}</span>
                      </div>
                      <select defaultValue={generateWalletPattern} onChange={(e)=> setGenerateWalletPattern(e.target.value)}
                         className={`daisyinput`} id="walletPattern" name='walletPattern'>
                            <option value="default" disabled className='text-gray-500 dark:text-gray-500'>{lang == "th_th" ? "เลือกรูปแบบกระเป๋าเงิน" : "Choose Wallet Pattern"}</option>
                            {
                              Object.keys(WalletPatternList).map((i,j)=>{
                                return (
                                  <option key={"patternAddWalletSelector_"+i} value={i} className='text-black first-letter:uppercase dark:text-white'>{i}</option>
                                )
                              })
                            }
                        </select>
                    </label>
                    <div className='w-full grid grid-cols-2 sm:grid-cols-1'>
                    <label className="daisyform-control w-full">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "สถานะล็อค" : "Lock status"}</span>
                      </div>
                      <label className="cursor-pointer flex gap-4 justify-start">
                        <input type="checkbox" className="daisytoggle daisytoggle-black" checked={generateWalletIsLock} onChange={()=>{
                          setGenerateWalletIsLock(!generateWalletIsLock);
                        }} />
                        <span className="label-text text-black dark:text-white">{generateWalletIsLock ? (lang == "th_th" ? "ล็อค" : "Locked") : (lang == "th_th" ? "ปลดล็อค" : "Unlocked")}</span> 
                      </label>
                    </label>
                      <label className="daisyform-control w-full">
                        <div className="daisylabel">
                          <span className="daisylabel-text">{lang == "th_th" ? "เป้าหมาย" : "Goal"}</span>
                        </div>
                        <label className="cursor-pointer flex gap-4 justify-start">
                          <input type="checkbox" className="daisytoggle daisytoggle-black" checked={generateWalletIsHasLimit} onChange={()=>{
                            setGenerateWalletIsHasLimit(!generateWalletIsHasLimit);
                          }} />
                          <span className="label-text text-black dark:text-white">{generateWalletIsHasLimit ? (lang == "th_th" ? "เปิดใช้งานแล้ว" : "Enabled") : (lang == "th_th" ? "ไม่เปิดใช้งาน" : "Disabled")}</span> 
                        </label>
                      </label>
                      <label className={`${generateWalletIsHasLimit ? "" : "hidden"} daisyform-control w-full col-span-2 sm:col-span-1`}>
                        <div className="daisylabel">
                          <span className="daisylabel-text">{lang == "th_th" ? "เป้าหมาย" : "Goal"}</span>
                        </div>
                        <input placeholder={lang == "th_th" ? "เป้าหมายกระเป๋าเงิน (บาท)" : "Wallet Goal (THB)"} 
                        onChange={(e) => setGenerateWalletLimit(e.target.value)} required 
                        type="text" name="walletName" id="walletName"
                        value={generateWalletLimit}
                        className="daisyinput daisyinput-bordered w-full" />
                      </label>
                    </div>
                    {/* <div className='relative w-full min-w-[200px]'>
                    <label className="w-auto h-auto leading-normal whitespace-nowrap cursor-pointer inline-flex items-center">
            <input type="checkbox" onChange={(e)=>{setGenerateWalletIsLock(!generateWalletIsLock)}}
            checked={generateWalletIsLock}
            className="peer sr-only" />
            <span className={`inline-flex
            items-center text-sm w-11 h-4 bg-gray-200 rounded-full
            peer-checked:justify-end duration-500 transition-all
            `}>
              <span className={`flex w-6 rounded-full justify-center items-center aspect-square ${
                generateWalletIsLock == true ? "bg-blue-500" : "bg-red-500"

              }`}>{
                generateWalletIsLock == true ? <i className='far fa-check' /> : <i className='far fa-times' />
              }</span>
            </span>
          </label>
                    </div> */}
                    <div className='flex flex-row gap-4'>

                    <div onClick={handleEditWallet} className='w-max py-2 -translate-y-3 px-4 -mb-3 hover:bg-golden-800 cursor-pointer bg-golden-700 rounded-full text-white'> 
                    {lang == "th_th" ? "แก้ไขกระเป๋าเงินนี้" : "Edit this Wallet"}
                    </div>
                    <div onClick={handleCancelAddWallet} className='w-max py-2 -translate-y-3 px-4 -mb-3 hover:bg-red-800 cursor-pointer bg-red-700 rounded-full text-white'> 
                    {lang == "th_th" ? "ยกเลิก" : "cancel"}
                    </div>
                    </div>
                </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }else{
    return (
      <div className='relative col-span-2 md:col-span-1'>
        <div className=' -z-130 fixed w-full h-full'></div>
        <div className='w-full h-full bg-glassDashboard/10 px-4 pt-8'>
          <div className='w-full h-full pt-8 flex flex-col items-center pr-6 md:pr-0'>
            <div className='text-[2em] px-4 font-bold w-full md:justify-center mb-10 md:mb-5 flex flex-row gap-4'>
              <div>{lang == "th_th" ? "กระเป๋าสตางค์" : "Wallets"}</div>
              <div className="flex flex-row text-xl gap-3">
              <div onClick={()=>{
                setDisplayType("grid");
              }} className={`${displayType == "swap" ? `flex flex-col items-center justify-center bg-pink-200 text-black hover:brightness-90 cursor-pointer
               shadow-black dark:shadow-white shadow-sm p-2 aspect-square w-10 h-10 rounded-xl` : `hidden`}`}>
                <i className='far fa-grid-2' />
              </div>
              <div onClick={()=>{
                setDisplayType("swap");
                setActiveDisplayWallet(0);
              }} className={`${displayType == "grid" ? `flex flex-col items-center justify-center bg-pink-200 text-black hover:brightness-90 cursor-pointer
               shadow-black dark:shadow-white shadow-sm p-2 aspect-square w-10 h-10 rounded-xl` : `hidden`}`}>
                <i className='far fa-layer-group' />
              </div>
              </div>
            </div>
            <div className={`flex flex-row gap-2 xl:flex-col ${displayType == "grid" ? "w-full" : ""}`}>
              <div className={`${displayType == "swap" ? "w-[650px] md:w-[90vw] flex flex-col bg-pinkDashboard/30 rounded-3xl pb-12" : "hidden"} ${totalWallet == 0 ? "items-center pt-5" : "pt-20"}`}>
                {totalWallet == 0 ?
                displayType == "swap" ?
                <div className='w-[500px] sm:w-[430px] !aspect-[1011/638] ms:w-[80vw]'>
                  <div className='!w-full rounded-2xl !aspect-[1011/638] bg-red-700 shadow-red-700 shadow-md hover:shadow-none cursor-normal'>
                    <div className="w-full h-full flex items-center justify-center text-3xl sm:text-2xl xs:text-xl text-white font-bold tracking-tight">{lang == "th_th" ? "คุณไม่มีกระเป๋าสตางค์" : "You don't have a wallet."}</div>
                  </div>
                </div> : 
                
                ""
                
                :
                displayType == "swap" ?
                <>
                <div>
                <Swiper ref={sliderRef}
                  pagination={{ type: 'fraction'}}
                  onSlideChange={(swiper) => { handleSlideChange(swiper); }}
                  effect={'cards'}
                  // navigation
                  direction='vertical'
                  modules={[Controller, EffectCards]}
                  className="mySwiper w-[500px] sm:w-[430px] !aspect-[1011/638] ms:w-[75vw]">
                  {
                    sortByCreated(cacheData[0].wallet.data).map((card,j)=>{
                      return (
                        <SwiperSlide 
                          key={card.id}
                        className='!w-full rounded-2xl !aspect-[1011/638] bg-red-400'>
                        <WalletWrapper
                WalletName = {card.wallet_name}
                WalletBalance = {cacheData[3] == null ? 0 : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance[card.id]}
                WalletIncome = {"0"}
                WalletExpense = {"0"}
                WalletIcon = {card.wallet_icon}
                WalletBackgroundColor = {card.wallet_bg_color}
                // WalletTextColor = {card.wallet_text_color}
                WalletPattern = {WalletPatternList[card.wallet_pattern]} 
                WalletPatternColor={card.wallet_pattern_color}
                WalletIsLock={card.wallet_isLock}
                WalletIsHasLimit = {card.wallet_isLimit}
                WalletLimit = {card.wallet_limit}
              />
                  </SwiperSlide>
                      )
                    })
                  }
                </Swiper>
                </div>
                <div className='flex flex-row justify-between px-10 mt-20 sxs:mt-14 sxs:grid sxs:grid-cols-2'>
                  <div className={`daisybtn daisybtn-success sxs:order-2 
                  sxs:place-self-start
                   rounded-xl w-10 aspect-square 
                   font-bold text-2xl
                   ${activeDisplayWallet == 0 ? 
                          "daisybtn-disabled !text-black bg-gray-700 border-gray-700 dark:bg-gray-400" : 
                          "bg-golden-400 border-golden-400 hover:bg-golden-500 hover:border-golden-500"}`} onClick={handlePrev}>&lt;</div>
                  <div className='flex flex-col items-center sxs:order-1 sxs:w-full sxs:col-span-2'>
                    <span className='font-semibold dark:text-white text-xl'>{lang == "th_th" ? "เงินสดคงเหลือ" : "Remaining cash"}</span>
                    {/* <span className='font-bold dark:text-white text-xl'>Wallet #{activeDisplayWallet + 1}</span> */}
                    <span className='font-bold dark:text-white text-2xl'>{cacheData[3] == null ? "0.00" : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance[activeDisplayWalletData.id]} {
                      activeDisplayWalletData?.wallet_isLimit ? " / "+activeDisplayWalletData.wallet_limit : ""
                    } {lang == "th_th" ? "บาท" : "THB"}</span>
                  </div>
                  <div className={`daisybtn daisybtn-success sxs:order-3 
                  sxs:place-self-end
                    rounded-xl w-10 aspect-square
                    font-bold text-2xl
                   ${activeDisplayWallet + 1 == totalWallet ? 
                          "daisybtn-disabled !text-black  bg-gray-700 border-gray-700 dark:bg-gray-400" : 
                          "bg-golden-400 border-golden-400 hover:bg-golden-500 hover:border-golden-500"}
                    `} onClick={handleNext}>&gt;</div>
                </div>
                </> : 
                
                ""
                }
                {displayType == "swap" ?
                <div className={`grid px-10 gap-3 mt-10 ${totalWallet == 0 ? "grid-cols-1 afterSmall:grid-cols-1" : "grid-cols-2 afterSmall:grid-cols-1"} afterSmall:grid ms:grid-cols-1`}>
                  {totalWallet == 0 ? "" :
                  <div className="daisybtn daisybtn-success bg-green-400 border-green-400 hover:bg-green-500 
                  hover:border-green-500 rounded-xl flex flex-row w-auto" onClick={()=>{
                    handleEditWalletSetup(activeDisplayWallet);
                  }}>
                    <div><i className='far fa-pencil' /></div>
                    <div>{lang == "th_th" ? "แก้ไขกระเป๋าเงินนี้" : "Edit this wallet"}</div>
                  </div> }
                  <div className="daisybtn daisybtn-success bg-golden-400 border-golden-400 hover:bg-golden-500 
                  hover:border-golden-500 rounded-xl flex flex-row w-auto" onClick={()=>{
                    if(session.user.statusUser == "premium"){
                      setAddingState(!addingState);
                    }else{
                      if(cacheData[0].wallet.data.length >= 10){
                        MySwal.fire("Limit Exceeded.","Need an upgrade to create more wallet.","warning");
                      }else{
                        setAddingState(!addingState);
                      }
                    }
                  }}>
                    <div><i className='far fa-plus' /></div>
                    <div>{totalWallet == 0 ? (lang == "th_th" ? "เพิ่มกระเป๋าสตางค์ใบแรก" : "Add first wallet") : (lang == "th_th" ? "เพิ่มกระเป๋าสตางค์ใหม่" : "Add new wallet")}</div>
                  </div>
                </div> : ""
                }
              </div>
              <div className={`${displayType == "grid" ? "flex flex-col w-full pl-4 md:pl-0" : "hidden"}`}>
                <div className="flex flex-row justify-between items-center">
                  <div className="font-semibold text-lg">{lang == "th_th" ? "กระเป๋าสตางค์" : "Wallets"}</div>
                  <div onClick={()=>{
                    setAddingState(!addingState);
                  }} className="bg-green-400 hover:bg-green-500 cursor-pointer text-black gap-2 px-4 py-1 rounded-xl flex flex-row items-center justify-center">
                    <i className='far fa-plus text-xl' /> 
                    <span>{totalWallet == 0 ? (lang == "th_th" ? "เพิ่มกระเป๋าสตางค์ใบแรก" : "Add first wallet") : (lang == "th_th" ? "เพิ่มกระเป๋าสตางค์ใหม่" : "Add new wallet")}</span>
                  </div>
                </div>
                <div className='daisydivider'></div>
                <div className='grid grid-cols-4 ExtraXL:grid-cols-3 afterLarge:grid-cols-2 gap-3 ExtraXL:gap-6 md:gap-4'>
                {
                    cacheData[0].wallet.data.length == 0 ? <div>{lang == "th_th" ? "ไม่มีการสร้างกระเป๋าเงิน" : "No wallet created."}</div> : sortByCreated(cacheData[0].wallet.data).map((card,j)=>{
                      return (
                        <div
                        key={card.id}
                        className="w-full cursor-pointer hover:scale-[1.01]"
                        onClick={()=>{
                          handleEditWalletSetup(j);
                        }}
                        >
                        <div 
                        className='!w-full !text-base rounded-2xl !aspect-[1011/638] bg-red-400'>
                          <WalletWrapperGrid
                            WalletName = {card.wallet_name}
                            WalletBalance = {cacheData[3] == null ? 0 : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance[card.id]}
                            WalletIncome = {"0"}
                            WalletExpense = {"0"}
                            WalletIcon = {card.wallet_icon}
                            WalletBackgroundColor = {card.wallet_bg_color}
                            // WalletTextColor = {card.wallet_text_color}
                            WalletPattern = {WalletPatternList[card.wallet_pattern]} 
                            WalletPatternColor={card.wallet_pattern_color}
                            WalletIsLock={card.wallet_isLock}
                            WalletIsHasLimit = {card.wallet_isLimit}
                            WalletLimit = {card.wallet_limit}
                          />
                        </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              {/* <div className='w-[400px] h-64 bg-red-500'></div> */}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Wallets