import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ColorPicker } from './ColorPicker';
import { CategoryPrint, MySwal, TXNPrint, TransactionPrint, TransactionTagPrint, findObjectById, writeAnUpdate } from './ModuleCentralClass';
import IconFinder from './IconFinder';
import { formatDateWithTokens, getDatabaseName, sortByCreated } from './MainConfig';
import { writeData } from '@/firebase/firestore/CRUD';
import { useSessionStorage } from '@uidotdev/usehooks';
import ReactDatePicker from 'react-datepicker';
import en from 'date-fns/locale/en-US'
import th from 'date-fns/locale/th'
import WalletWrapperGrid from './WalletWrapper_grid';
import { BackgroundPatternsExport } from './background';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Controller } from 'swiper/modules';
import WalletWrapper from './WalletWrapper';
const WalletPatternList = BackgroundPatternsExport;
const TransactionAdd = ({lang, user, backFunction, cacheData}) => {
  const [isIconSelectorGroupTxnShow,setIsIconSelectorGroupTxnShow] = useState(false);
  const [transactionName,setTransactionName] = useState("");
  const [transactionmethod,setTransactionMethod] = useState(null);
  const [txnDate, setTxnDate] = useState(new Date());
  const [customDate, setCustomDate] = useState(false);
  // payout_recieve
  const [txnMethodCHK,setTxnMethodCHK] = useState(false);
  const [txnMethod,setTxnMethod] = useState("i");
  const [txnAmount,setTxnAmount] = useState("0.00");
  const [txnGroup,setTxnGroup] = useState(null);
  const [txnWallet,setTxnWallet] = useState(null);
  
  const [txnTFAmount,setTxnTFAmount] = useState("0.00");
  const [TFRTxnWallet,setTFRTxnWallet] = useState(null);
  const [TFTTxnWallet,setTFTTxnWallet] = useState(null);
  
  //handleGroup
  const [isShowSelectGroup,setIsShowSelectGroup] = useState(false);
  const [isShowSelectWallet,setIsShowSelectWallet] = useState(false);
  const [selectWalletTitle,setSelectedWalletTitle] = useState(null);
  const [selectWalletMode,setSelectedWalletMode] = useState(null);
  const [activeDisplayWallet,setActiveDisplayWallet] = useState(0);
  const [activeDisplayWalletData,setActiveDisplayWalletData] = useState(sortByCreated(cacheData[0].wallet.data)[0]);
  const [totalWallet, setTotalWallet] = useState(cacheData[0].wallet.data.length);
  useEffect(()=>{
    setTotalWallet(cacheData[0].wallet.data.length);
  },[setTotalWallet,cacheData]);
  const handleCancelSelectWallet = ()=>{
    setIsShowSelectWallet(!isShowSelectWallet);
    setSelectedWalletTitle(null);
    setActiveDisplayWallet(0);
    setSelectedWalletMode(null);
  }
  const sliderRef = useRef(null);
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);
  const handleSlideChange = (swiper) => {
    // console.log(swiper);
    if(typeof swiper?.activeIndex !== "undefined"){
      // console.log("Active index change from "+activeDisplayWallet+" to "+swiper.activeIndex);
      setActiveDisplayWallet(swiper.activeIndex);
      let walletData = sortByCreated(cacheData[0].wallet.data)[swiper.activeIndex];
      console.log("Wallet current data:",walletData);
      setActiveDisplayWalletData(walletData);
    }
  };
  const handleAddTransactionPayoutRecieve = ()=>{
    if(transactionName == "" || transactionName == null || txnAmount == "0" || txnAmount == "0.00" || txnAmount == "" ||
    txnAmount == null || txnGroup == null || txnWallet == null){
      MySwal.fire((lang == "th_th" ? "ตรวจพบข้อมูลพลาด" : "Miss information detected"),(lang == "th_th" ? "คุณกรอกข้อมูลไม่ครบ" : "You didn't fill all information"),'warning')
      return;
    }
    MySwal.fire({
      title: (lang == "th_th" ? "การเพิ่มธุรกรรม" : "Adding Transaction."),
      text:(lang == "th_th" ? "รอสักครู่ การดำเนินการนี้ใช้เวลาไม่นาน": "Wait a few seconds, This will not take long."),
      didOpen: () => {
          MySwal.showLoading()
          setTimeout(()=>{
              MySwal.fire({
                  title:(lang == "th_th" ? "ต้องการเพิ่มธุรกรรมนี้หรือไม่?" : "Want to add this transaction?"),
                  html: <div className='flex flex-col pb-2'>
                  <TXNPrint
                    editClick={()=>{}} 
                    lang={lang}
                    deleteClick={()=>{}} 
                    showInteract={false}
                    cacheData={cacheData} cardData={
                        {
                          txn_date:txnDate.toISOString(),
                          txn_title:transactionName,
                          txn_type:txnMethod,
                          txn_method_type:"payout_recieve",
                          txn_amount:parseFloat(""+txnAmount+""),
                          txn_tag:txnGroup,
                          txn_wallet:txnWallet,
                    }} />
                  </div>,
                   showDenyButton: true,
                   showCancelButton: false,
                   confirmButtonText:lang == "th_th" ? "ใช่ เพิ่มเลย!" : 'Yes, Add this!',
                   denyButtonText:lang == "th_th" ? "ไม่เพิ่ม!" : "No, not add.",
                   allowOutsideClick:false,
                   allowEscapeKey:false,
                   allowEnterKey:false
              }).then((result) => {
              if (result.isConfirmed) {
                    let DBName = getDatabaseName(user.uid)["txn"];
                    MySwal.fire({
                      title: (lang == "th_th" ?"กำลังเพิ่มธุรกรรมระหว่างดำเนินการ..." : "Adding Transaction in process..."),
                      text:(lang == "th_th" ? "รอสักครู่ การดำเนินการนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
                      didOpen: () => {
                          MySwal.showLoading()
                          writeData(DBName,{
                            txn_date:txnDate.toISOString(),
                            txn_title:transactionName,
                            txn_type:txnMethod,
                            txn_method_type:"payout_recieve",
                            txn_amount:parseFloat(""+txnAmount+""),
                            txn_tag:txnGroup,
                            txn_wallet:txnWallet,
                          }).then((res)=>{
                            if(res.success == true){
                              writeAnUpdate(user.uid,cacheData,()=>{
                                cacheData[2]().then(respCache=>{
                                  if(respCache.success == true){
                                    MySwal.fire((lang == "th_th" ? "เพิ่มธุรกรรมสำเร็จ!" : "Add transaction successfully!"),'','success');
                                    backFunction();
                                  }
                                }).catch((error)=>{
                                  MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #2..." : "Error #2 occoured..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                })
                              })
                            }
                          }).catch((error)=>{
                            MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #1..." : "Error #1 occoured..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
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
  const handleAddTransactionTransfer = ()=>{
    


    if(TFTTxnWallet == null ||
      TFRTxnWallet == null ||
      txnTFAmount == "0" || txnTFAmount == "" || txnTFAmount == null || txnTFAmount == "0.00"){
      MySwal.fire((lang == "th_th" ? "ตรวจพบข้อมูลพลาด" : "Miss information detected"),(lang == "th_th" ? "คุณไม่ได้กรอกข้อมูลทั้งหมด" : "You didn't fill all information"),'error')
      return;
    }
    MySwal.fire({
      title: (lang == "th_th" ? "การเพิ่มธุรกรรม" : "Adding Transaction."),
      text:(lang == "th_th" ? "รอสักครู่ ขั้นตอนนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
      didOpen: () => {
          MySwal.showLoading()
          setTimeout(()=>{
              MySwal.fire({
                  title:(lang == "th_th" ? "ต้องการเพิ่มธุรกรรมนี้หรือไม่?" : "Want to add this transaction?"),
                  html: <div className='flex flex-col pb-2'>
                    <TXNPrint
                    editClick={()=>{}} 
                    lang={lang}
                    deleteClick={()=>{}} 
                    showInteract={false}
                    cacheData={cacheData} cardData={
                        {"id":"UeljmIa3DcxDtPEH5wcX",
                         "txn_date":txnDate.toISOString(),
                         "txn_amount":parseFloat(""+txnTFAmount+""),
                         "txn_method_type":"transfer",
                         "txn_transfer_wallet" :TFTTxnWallet,
                         "txn_reciever_wallet" :TFRTxnWallet,
                    }} />
                  </div>,
                   showDenyButton: true,
                   showCancelButton: false,
                   confirmButtonText: (lang == "th_th" ? "ใช่, เพิ่ม" : "Yes, Add this!"),
                   denyButtonText: (lang == "th_th" ? "ไม่, ไม่เพิ่ม" : "No, not add."),
                   cancelButtonText: (lang == "th_th" ? "ยกเลิก" : "Cancel"),
                   allowOutsideClick:false,
                   allowEscapeKey:false,
                   allowEnterKey:false
              }).then((result) => {
              if (result.isConfirmed) {
                    let DBName = getDatabaseName(user.uid)["txn"];
                    MySwal.fire({
                      title: (lang == "th_th" ? "กำลังเพิ่มธุรกรรมระหว่างดำเนินการ...":"Adding transaction in process..."),
                      text:(lang == "th_th" ? "รอสักครู่ ขั้นตอนนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
                      didOpen: () => {
                          MySwal.showLoading()
                          writeData(DBName,{
                            txn_date:txnDate.toISOString(),
                            txn_method_type:"transfer",
                            txn_amount:parseFloat(""+txnTFAmount+""),
                            txn_transfer_wallet:TFTTxnWallet,
                            txn_reciever_wallet:TFRTxnWallet,
                          }).then((res)=>{
                            if(res.success == true){
                              writeAnUpdate(user.uid,cacheData,()=>{
                                cacheData[2]().then(respCache=>{
                                  if(respCache.success == true){
                                    MySwal.fire((lang == "th_th" ? "เพิ่มธุรกรรมสำเร็จ!" : "Add transaction successfully!"),'','success');
                                    backFunction();
                                  }
                                }).catch((error)=>{
                                  MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #2..." : "Error #2 occoured..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                })
                              })
                            }
                          }).catch((error)=>{
                            MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #1..." : "Error #1 occoured..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
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
  // if(isShowSelectGroup){
  //   return (
    
  //   )
  // }
  // if(isShowSelectWallet){
  //   return (
      
  //   )
  // }
  return (
  <div className={`w-full pl-4 md:pl-0`}>
        <h1 className='text-[2em] ms:text-[1.75em] sxs:text-[1.55em] 2xs:text-[1.25em] px-4 font-bold w-full md:text-center mb-10 md:mb-6'>
        <span className="text-blue-500 hover:text-blue-600 cursor-pointer" onClick={()=>{
                if(isShowSelectGroup){
                  // setIsIconSelectorGroupTxnShow(!isIconSelectorGroupTxnShow);
                  setIsShowSelectGroup(!isShowSelectGroup);
                }else if(isShowSelectWallet){
                  setIsShowSelectWallet(!isShowSelectWallet);
                }else{
                  backFunction();
                }
            }}>&lt;{lang == "th_th" ? "ย้อนกลับ" : "Back"} </span>
            {
                lang == "th_th" ? "เพิ่มรายการธุรกรรม" : "Add Transaction"
            }
        </h1>
      {isShowSelectGroup ? 
        <div className={`w-full pl-4 md:pl-0`}>
          <div className='p-5 bg-pink-400/40 rounded-3xl'>
            <div className="flex flex-row gap-2 items-center">
              <h1 className='font-bold text-black dark:text-white text-xl md:text-center'>{lang == "th_th" ? "เลือกหมวดหมู่" : "Select category"}</h1>
            </div>
            <div className='daisydivider' />
            <div className='grid grid-cols-4 xl:grid-cols-3 beforeAfterSemiLarge:grid-cols-2 md:grid-cols-3 afterSmall:grid-cols-2 afterMS:grid-cols-1 gap-2'>
            {
              cacheData[0].group.data.map((i,j)=>{
              return (
                  <CategoryPrint onClick={()=>{
                    setTxnGroup(i.id);
                    setIsShowSelectGroup(!isShowSelectGroup);
                  }} icon={i.icon} name={i.name} showEdit={true} isCustomIcon={true} customIcon={"far fa-check"} textColor={i.textColor} bgcolor={i.bgColor} key={"category_"+i.name+"_"+j+"_"+i.id} />
                  )
              })
            }
            </div>
          </div>
        </div>
      
      : isShowSelectWallet ? 
      <div className={`w-full pl-4 md:pl-0`}>
      <div className='p-5 bg-pink-400/40 rounded-3xl'>
        <div className="flex flex-row gap-2 items-center">
          <h1 className='font-bold text-black dark:text-white text-xl md:text-center'>{selectWalletTitle}</h1>
        </div>
        <div className='daisydivider' />
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
              WalletBalance = {"0"}
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
                        "daisybtn-disabled !text-black bg-gray-700 dark:bg-gray-400 border-gray-700" : 
                        "bg-golden-400 border-golden-400 hover:bg-golden-500 hover:border-golden-500"}`} onClick={handlePrev}>&lt;</div>
                <div className='flex flex-col items-center sxs:order-1 sxs:w-full sxs:col-span-2'>
                  <span className='font-semibold dark:text-white text-xl'>{lang == "th_th" ? "เงินสดคงเหลือ" : "Remaining cash"}</span>
                  {/* <span className='font-bold dark:text-white text-xl'>Wallet #{activeDisplayWallet + 1}</span> */}
                  <span className='font-bold dark:text-white text-2xl'>{cacheData[3] == null ? "0.00" : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance[activeDisplayWalletData.id]} {
                    activeDisplayWalletData.wallet_isLimit ? " / "+activeDisplayWalletData.wallet_limit : ""
                  } {lang == "th_th" ? "บาท" : "THB"}</span>
                </div>
                <div className={`daisybtn daisybtn-success sxs:order-3 
                sxs:place-self-end
                  rounded-xl w-10 aspect-square
                  font-bold text-2xl
                 ${activeDisplayWallet + 1 == totalWallet ? 
                        "daisybtn-disabled !text-black bg-gray-700 dark:bg-gray-400 border-gray-700" : 
                        "bg-golden-400 border-golden-400 hover:bg-golden-500 hover:border-golden-500"}
                  `} onClick={handleNext}>&gt;</div>
              </div>
              <div className={`grid px-10 gap-3 mt-10 grid-cols-1 afterSmall:grid-cols-1 ms:grid-cols-1`}>
                <div className="daisybtn daisybtn-success bg-green-400 border-green-400 hover:bg-green-500 
                hover:border-green-500 rounded-xl flex flex-row w-auto" onClick={()=>{
                  if(selectWalletMode == "pr_wallet"){
                    if(txnMethod == "e" && sortByCreated(cacheData[0].wallet.data)[activeDisplayWallet].wallet_isLock == true){
                      MySwal.fire((lang == "th_th" ? "กระเป๋าเงินที่ถูกล็อค" : "Locked wallet"),(lang == "th_th" ? "คุณไม่สามารถทำธุรกรรมค่าใช้จ่ายในกระเป๋าเงินนี้ได้" : "You can't make expense transaction on this wallet."),"warning");
                    }else{
                      setTxnWallet(sortByCreated(cacheData[0].wallet.data)[activeDisplayWallet].id);
                      handleCancelSelectWallet();
                    }
                  }else if(selectWalletMode == "tf_t_wallet"){
                    if(sortByCreated(cacheData[0].wallet.data)[activeDisplayWallet].wallet_isLock == true){
                      MySwal.fire((lang == "th_th" ? "กระเป๋าเงินที่ถูกล็อค" : "Locked wallet"),(lang == "th_th" ? "คุณไม่สามารถใช้กระเป๋าเงินนี้เป็นกระเป๋าเงินโอนในธุรกรรมนี้ได้" : "You can't use this wallet as transfer wallet on this transaction."),"warning");
                    }else{
                      const selectedWalletID = sortByCreated(cacheData[0].wallet.data)[activeDisplayWallet].id;
                      if(selectedWalletID == TFRTxnWallet){
                        MySwal.fire((lang == "th_th" ? "ไม่สามารถโอนไปยังกระเป๋าเงินเดียวกันได้" : "Cannot Transfer to same wallet."),"","warning");
                      }else{
                        setTFTTxnWallet(selectedWalletID);
                        handleCancelSelectWallet();
                      }
                    }
                  }else if(selectWalletMode == "tf_r_wallet"){
                    const selectedWalletID = sortByCreated(cacheData[0].wallet.data)[activeDisplayWallet].id;
                    if(selectedWalletID == TFTTxnWallet){
                      MySwal.fire((lang == "th_th" ? "ไม่สามารถรับด้วยกระเป๋าเงินเดียวกันได้" : "Cannot Recieve with same wallet."),"","warning");
                    }else{
                      setTFRTxnWallet(selectedWalletID);
                      handleCancelSelectWallet();
                    }
                  }
                }}>
                  <div><i className='far fa-check' /></div>
                  <div>{lang == "th_th" ? "เลือกกระเป๋าสตางค์ใบนี้" : "Choose this wallet"}</div>
                </div>
                <div className="daisybtn daisybtn-success bg-red-500 border-red-500 hover:bg-red-600 
                hover:border-red-600 rounded-xl flex flex-row w-auto" onClick={()=>{
                  handleCancelSelectWallet();
                }}>
                  <div><i className='far fa-times' /></div>
                  <div>{lang == "th_th" ? "ยกเลิก" : "Cancel"}</div>
                </div>
              </div>
              </>
      </div>
    </div>
      :
      <div className='bg-pink-400/40 p-5 rounded-3xl'>
          <div className={``}>
            <div className="flex flex-row gap-4 items-center md:flex-col">
              <div className="daisyjoin daisyjoin-horizontal lg:daisyjoin-horizontal rounded-full">
                <button onClick={()=>{
                  setTransactionMethod("payout_recieve")
                }} className={`${transactionmethod == "payout_recieve" ? "daisybtn-disabled !text-gray-700 dark:!text-gray-500 !bg-gray-400 dark:!bg-gray-300" : "daisybtn-success !bg-green-500 !border-green-500"} daisybtn daisyjoin-item flex flex-row items-center`}>
                  <i className="far fa-cart-shopping"></i>
                  <span>{lang == "th_th" ? "การชำระเงิน" : "Payments"}</span>
                </button>
                <button onClick={()=>{
                  setTransactionMethod("transfer")
                }} className={`${transactionmethod == "transfer" ? "daisybtn-disabled !text-gray-700 dark:!text-gray-500 !bg-gray-400 dark:!bg-gray-300" : "daisybtn-success !bg-green-500 !border-green-500"} daisybtn daisyjoin-item flex flex-row items-center`}>
                  <i className="far fa-money-bill-transfer"></i>
                  <span>{lang == "th_th" ? "โอนเงิน" : "Transfer"}</span>
                </button>
              </div>
              <div className="text-black dark:text-white font-bold text-lg">
                {transactionmethod == "transfer" ? (lang == "th_th" ? "โหมดการโอน" : "Transferring mode") : 
                transactionmethod == "payout_recieve" ? (lang == "th_th" ? "โหมดการใช้จ่าย" : "Spending mode") : 
                ""}
              </div>
            </div>
            {
              transactionmethod == null ? "" :<div className='daisydivider'/>
            }
            <div className={`flex flex-col w-full`}>
                {/* payout_recieve */}
                {
                  transactionmethod == "payout_recieve" ?
                <form className='flex flex-col gap-8'>   
                    {/* TxnType */}
                    <label className="daisyform-control w-full">
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "ประเภทธุรกรรม" : "Transferring mode"}</span>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        <div className="daisyjoin daisyjoin-horizontal lg:daisyjoin-horizontal rounded-full">
                          <div onClick={()=>{
                            setTxnMethod("i")
                          }} className={`${txnMethod == "i" ? "daisybtn-disabled !text-gray-700 dark:!text-gray-500 !bg-gray-400 dark:!bg-gray-300" : "daisybtn-success !bg-green-500 !border-green-500"} daisybtn daisyjoin-item flex flex-row items-center`}>
                            {/* <i className="far fa-cart-shopping"></i> */}
                            <span>{lang == "th_th" ? "รายรับ" : "Income"}</span>
                          </div>
                          <div onClick={()=>{
                            setTxnMethod("e")
                          }} className={`${txnMethod == "e" ? "daisybtn-disabled !text-gray-700 dark:!text-gray-500 !bg-gray-400 dark:!bg-gray-300" : "daisybtn-success !bg-green-500 !border-green-500"} daisybtn daisyjoin-item flex flex-row items-center`}>
                            {/* <i className="far fa-money-bill-transfer"></i> */}
                            <span>{lang == "th_th" ? "รายจ่าย" : "Expense"}</span>
                          </div>
                        </div>
                        <div className='font-bold'>
                        ({txnMethod == "i" ? (lang == "th_th" ? "รายรับ" : "Income") : txnMethod == "e" ? (lang == "th_th" ? "รายจ่าย" : "Expense") : (lang == "th_th" ? "โปรดเลือก" : "Please select")})
                        </div>
                      </div>
                    </label>
                    {/* TXN NAME */}
                    <label className="daisyform-control w-full">
                        <div className="daisylabel">
                            <span className="daisylabel-text">{lang == "th_th" ? "ชื่อธุรกรรม" : "Transaction name"}</span>
                        </div>
                        <input placeholder= {lang == "th_th" ? "ชื่อธุรกรรม" : "Transaction name"}
                        onChange={(e) => setTransactionName(e.target.value)} required 
                        type="text" name="transactionName" id="transactionName"
                        value={transactionName}
                        className="daisyinput daisyinput-bordered w-full" />
                    </label>
                    {/* TXN AMOUNT */}
                    <label className="daisyform-control w-full">
                        <div className="daisylabel">
                            <span className="daisylabel-text">{lang == "th_th" ? "จำนวนธุรกรรม" : "Transaction amount"}</span>
                        </div>
                        <input placeholder= {lang == "th_th" ? "จำนวนธุรกรรม" : "Transaction amount"}
                        onChange={(e) => setTxnAmount(e.target.value)} required 
                        type="number" min={"0.01"} step={"0.01"} name="transactionamount" id="transactionamount"
                        value={txnAmount}
                        className="daisyinput daisyinput-bordered w-full" />
                    </label>
                    {/* TXN DATE, SELECT WALLET, SELECT GROUP */}
                    <div className="flex flex-row items-end gap-3 justify-between md:justify-start md:items-start md:flex-col">
                      <label className="daisyform-control w-max">
                        <div className="daisylabel w-max">
                          <span className="daisylabel-text">{lang == "th_th" ? "วันที่ทำธุรกรรมที่กำหนดเอง" : "Custom transaction date"}</span>
                        </div>
                        <div className="cursor-pointer flex gap-4 justify-start">
                          <input type="checkbox" className="daisytoggle daisytoggle-black" checked={customDate} onChange={()=>{
                            setCustomDate(!customDate); }} />
                          <span className="label-text text-black dark:text-white">{customDate ? (lang == "th_th" ? "เปิดการใช้งาน(ใช้เวลาปัจจุบัน)" : "Enabled (Using current time)") : (lang == "th_th" ? "ปิดการใช้งาน(ใช้เวลาปัจจุบัน)" : "Disabled (Using current time)")}</span> 
                        </div>
                      </label>
                    </div>
                    <label className={`daisyform-control w-full ${customDate ? "" : "hidden"} `}>
                      <div className="daisylabel">
                        <span className="daisylabel-text">{lang == "th_th" ? "วันที่ทำธุรกรรม" : "Transaction date"}</span>
                      </div>
                      <ReactDatePicker
                        className={"daisyinput daisyinput-bordered w-full"}
                        selected={txnDate}
                        locale={th}
                        onChange={(date) => setTxnDate(date)}
                        showTimeInput
                        timeFormat="HH:mm"
                        dateFormat="dd/MM/yyyy HH:mm"
                        timeCaption="Time"
                        popperPlacement="top-end"
                        timeInputLabel="Time:"/>
                    </label>
                     
                      <div className={`daisyalert ${txnWallet == null ? "daisyalert-warning" : "daisyalert-info afterMS:flex-col"} justify-between flex flex-row`}>
                        <div className="flex flex-row gap-2 items-center">
                          <i className='far fa-blanket' />
                          <span className="font-semibold tracking-tighter sxs:text-sm">{ txnWallet == null ? 
                          (lang== "th_th" ? "ไม่ได้เลือกกระเป๋าเงิน" : "No wallet selected")
                          : `${lang === "th_th" ? "เลือกกระเป๋าสตางค์ : " : "Select wallet : "} ${findObjectById(cacheData[0].wallet.data, txnWallet)["wallet_name"]}`

                          }</span>
                        </div>
                        <div
                          onClick={()=>{
                            setIsShowSelectWallet(!isShowSelectWallet);
                            setSelectedWalletTitle(lang == "th_th" ? "เลือกกระเป๋าเงินการชำระเงิน" : "Select payment wallet");
                            setSelectedWalletMode("pr_wallet");
                          }}
                        className={`${txnWallet == null ? "bg-red-600 hover:bg-red-700" : "bg-green-400 hover:bg-green-500"} sxs:text-sm cursor-pointer px-4 py-1 text-black rounded-full w-max h-max font-semibold`}>
                           { txnWallet == null ? (lang == "th_th" ? "เลือกกระเป๋าเงิน" : "Select Wallet") : (lang == "th_th" ? "เปลี่ยนกระเป๋าเงิน" : "Change Wallet") }
                        </div>
                      </div>
                      <div className={`daisyalert ${txnGroup == null ? "daisyalert-warning" : "daisyalert-info afterMS:flex-col"} justify-between flex flex-row`}>
                        <div className="flex flex-row gap-2 items-center">
                          <i className='far fa-blanket' />
                          <span className="font-semibold tracking-tighter sxs:text-sm">{ txnGroup == null ? 
                          (lang == "th_th" ? "ไม่ได้เลือกหมวดหมู่" : "No category selected")
                          : `${lang === "th_th" ? "เลือกหมวดหมู่ : " : "Select Category : "} ${findObjectById(cacheData[0].group.data, txnGroup)["name"]}`
                          }</span>
                        </div>
                        <div
                          onClick={()=>{
                            setIsShowSelectGroup(!isShowSelectGroup);
                          }}
                        className={`${txnGroup == null ? "bg-red-600 hover:bg-red-700" : "bg-green-400 hover:bg-green-500"} sxs:text-sm cursor-pointer px-4 py-1 text-black rounded-full w-max h-max font-semibold`}>
                           { txnGroup == null ? (lang == "th_th" ? "เลือกหมวดหมู่" : "Select category") : (lang == "th_th" ? "เปลี่ยนหมวดหมู่" : "Change category") }
                        </div>
                      </div>
                    <div className='grid grid-cols-1 gap-2'>
                        <div onClick={handleAddTransactionPayoutRecieve} className='daisybtn daisybtn-success'> 
                           {lang == "th_th" ? "เพิ่มธุรกรรม" : "Add Transaction"}
                        </div>
                    </div>
                </form>
                : ""}
                {/* transfer */}
                {
                  transactionmethod == "transfer" ? 
                  <form className='flex flex-col gap-8'>   
                  {/* TXN AMOUNT */}
                  <label className="daisyform-control w-full">
                      <div className="daisylabel">
                          <span className="daisylabel-text">{lang == "th_th" ? "จำนวนธุรกรรม" : "Transaction amount"}</span>
                      </div>
                      <input placeholder={lang == "th_th" ? "จำนวนธุรกรรม" : "Transaction amount"}
                      onChange={(e) => setTxnTFAmount(e.target.value)} required 
                      type="number" min={"0.01"} step={"0.01"} name="transactionamount" id="transactionamount"
                      value={txnTFAmount}
                      className="daisyinput daisyinput-bordered w-full" />
                  </label>
                  {/* TXN DATE, SELECT WALLET, SELECT GROUP */}
                  <div className="flex flex-row items-end gap-3 justify-between md:justify-start md:items-start md:flex-col">
                    <label className="daisyform-control w-max">
                      <div className="daisylabel w-max">
                        <span className="daisylabel-text">{lang == "th_th" ? "วันที่ทำธุรกรรมที่กำหนดเอง" : "Custom transaction date"}</span>
                      </div>
                      <div className="cursor-pointer flex gap-4 justify-start">
                        <input type="checkbox" className="daisytoggle daisytoggle-black" checked={customDate} onChange={()=>{
                          setCustomDate(!customDate); }} />
                        <span className="label-text text-black dark:text-white">{customDate ? (lang == "th_th" ? "เปิดการใช้งาน(ใช้เวลาปัจจุบัน)" : "Enabled (Using current time)") : (lang == "th_th" ? "ปิดการใช้งาน(ใช้เวลาปัจจุบัน)" : "Disabled (Using current time)")}</span> 
                      </div>
                    </label>
                  </div>
                  <label className={`daisyform-control w-full ${customDate ? "" : "hidden"} `}>
                    <div className="daisylabel">
                      <span className="daisylabel-text">{lang == "th_th" ? "วันที่ทำธุรกรรม" : "Transaction date"}</span>
                    </div>
                    <ReactDatePicker
                      className={"daisyinput daisyinput-bordered w-full"}
                      selected={txnDate}
                      locale={th}
                      onChange={(date) => setTxnDate(date)}
                      showTimeInput
                      timeFormat="HH:mm"
                      dateFormat="dd/MM/yyyy HH:mm"
                      timeCaption="Time"
                      popperPlacement="top-end"
                      timeInputLabel="Time:"/>
                  </label>
                   
                    <div className={`daisyalert ${TFTTxnWallet == null ? "daisyalert-warning afterMS:flex-col" : "daisyalert-info afterMS:flex-col"} justify-between flex flex-row`}>
                      <div className="flex flex-row gap-2 items-center">
                        <i className='far fa-blanket' />
                        <span className="font-semibold tracking-tighter sxs:text-sm">{ 
                        TFTTxnWallet == null ? 
                        (lang == "th_th" ? "ไม่ได้เลือกกระเป๋าสำหรับโอนเงิน" : "No transfer wallet selected")
                        : `${lang === "th_th" ? "กระเป๋าเงินโอน : " : "Select transfer wallet : "} ${findObjectById(cacheData[0].wallet.data, TFTTxnWallet)["wallet_name"]}`
                        }
                        
                        {/* {TFTTxnWallet == null ? "" : findObjectById(cacheData[0].wallet.data,TFTTxnWallet)["wallet_name"]} */}
                        </span>
                      </div>
                      <div
                        onClick={()=>{
                          setIsShowSelectWallet(!isShowSelectWallet);
                          setSelectedWalletTitle(lang == "th_th" ? "เลือกกระเป๋าสตางค์สำหรับการโอนเงิน" : "Select Transferring wallet");
                          setSelectedWalletMode("tf_t_wallet");
                        }}
                      className={`${TFTTxnWallet == null ? "bg-red-600 hover:bg-red-700" : "bg-green-400 hover:bg-green-500"} sxs:text-sm cursor-pointer px-4 py-1 text-black rounded-full w-max h-max font-semibold`}>
                         { TFTTxnWallet == null ? (lang == "th_th" ? "เลือกกระเป๋าเงิน" : "Select Wallet") : (lang == "th_th" ? "เปลี่ยนกระเป๋าเงิน" : "Change Wallet") }
                      </div>
                    </div>
                    <div className={`daisyalert ${TFRTxnWallet == null ? "daisyalert-warning afterMS:flex-col" : "daisyalert-info afterMS:flex-col"} justify-between flex flex-row`}>
                      <div className="flex flex-row gap-2 items-center">
                        <i className='far fa-blanket' />
                        <span className="font-semibold tracking-tighter sxs:text-sm">{ TFRTxnWallet == null ? 
                         (lang == "th_th" ? "ไม่ได้เลือกกระเป๋าสำหรับรับเงิน" : "No receive wallet selected")
                         :`${lang === "th_th" ? "กระเป๋าเงินรับ : " : "Select receive wallet : "} ${findObjectById(cacheData[0].wallet.data, TFRTxnWallet)["wallet_name"]}`
                        } 
                        {/* {TFRTxnWallet == null ? "" : findObjectById(cacheData[0].wallet.data, TFRTxnWallet)["wallet_name"]} */}
                        </span>
                      </div>
                      <div
                        onClick={()=>{
                          setIsShowSelectWallet(!isShowSelectWallet);
                          setSelectedWalletTitle(lang == "th_th" ? "เลือกกระเป๋าสตางค์สำหรับการรับเงิน" : "Select Receiving wallet");
                          setSelectedWalletMode("tf_r_wallet");
                        }}
                      className={`${TFRTxnWallet == null ? "bg-red-600 hover:bg-red-700" : "bg-green-400 hover:bg-green-500"} sxs:text-sm cursor-pointer px-4 py-1 text-black rounded-full w-max h-max font-semibold`}>
                         { TFRTxnWallet == null ? (lang == "th_th" ? "เลือกกระเป๋าเงิน" : "Select Wallet") : (lang == "th_th" ? "เปลี่ยนกระเป๋าเงิน" : "Change Wallet") }
                      </div>
                    </div>

                  <div className='grid grid-cols-1 gap-2'>
                      <div onClick={handleAddTransactionTransfer} className='daisybtn daisybtn-success'> 
                          {lang == "th_th" ? "เพิ่มธุรกรรม" : "Add Transaction"}
                      </div>
                  </div>
              </form> : ""
                }
            </div>
          </div>
      </div>
      }
  {/* </div> */}
  </div>
)
}

export default TransactionAdd