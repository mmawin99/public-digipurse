import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Controller } from 'swiper/modules';
import WalletWrapper from './WalletWrapper';
import { formatDateWithTokens, getDatabaseName, sortByCreated } from './MainConfig';
import { BackgroundPatternsExport } from './background';
import { useSessionStorage } from '@uidotdev/usehooks';
import WalletWrapperGrid from './WalletWrapper_grid';
import { TXNPrint, CheckUpdateAvailable, MySwal } from './ModuleCentralClass';
import dynamic from 'next/dynamic';
import { StringVersionDiGiPurse } from '@/Data/Data';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const WalletPatternList = BackgroundPatternsExport;
function filterObjectByDate(data,filterData = null) {
  if(data == null){
    return null;
  }
  const today = new Date().toISOString().split('T')[0]; // Get today's date in the format "YYYY-MM-DD"

  // Filter the object based on the date
  const filteredObject = Object.keys(data).reduce((result, date) => {
    if (date <= today) {
      if(filterData == null){
        result[date] = data[date];
      }else{
        if(typeof data[date][filterData] == "undefined"){
          result[date] = data[date];
        }else{
          result[date] = data[date][filterData];
        }
      }
    }
    return result;
  }, {});

  return filteredObject;
}
function splitKeysValue(objectsR){
  if(objectsR == null){
    return {
      key:[null],
      value:[null]
    };
  }
  let key = Object.keys(objectsR);
  let value = [];
  key.forEach((i,j)=>{
    value.push(objectsR[i]);
  })
  return {
    key:key,
    value:value
  }
}
const DashboardHome = ({lang, cacheData,user,session,setSelected}) => {
  const sliderRef = useRef(null);
  const [displayMode,setDisplayMode] = useSessionStorage("digipurse_dashboard_display_mode","D");
  // const [activeDisplayWallet, setActiveDisplayWallet] = useState(0);
  // const [activeDisplayWalletData, setActiveDisplayWalletData] = useState(typeof cacheData[0] == null ? null : sortByCreated(cacheData[0].wallet.data)[0]);
  // const [totalWallet, setTotalWallet] = useSessionStorage("digipurse_session_wallet_totalWallet", cacheData[0].wallet.data.length);
  const [cashFlowSeries,setCashFlowSeries] = useState(splitKeysValue(filterObjectByDate(cacheData[3],"remainingBalance")));
  const [cashIncSeries,setCashIncSeries] = useState(splitKeysValue(filterObjectByDate(cacheData[3],"income_total")));
  const [cashExpSeries,setCashExpSeries] = useState(splitKeysValue(filterObjectByDate(cacheData[3],"expense_total")));
  const [isUpdateAvailable, setIsUpdateAvailable] = useSessionStorage("DiGiPurseUpdateAvailableCheckSession",false);
  const [isUpdateAvailableCheck, setIsUpdateAvailableCheck] = useSessionStorage("DiGiPurseUpdateAvailableCheckSessionChecked_q",false);

  useEffect(()=>{
    if(!isUpdateAvailableCheck){
      let upVar = CheckUpdateAvailable(user.uid,cacheData);
      upVar.then(res=>{
        if(res){
          setIsUpdateAvailable(true);
          setIsUpdateAvailableCheck(true);
          console.log((lang == "th_th" ? "อัปเดตพร้อมใช้งาน" : "Update Available"),res);
        }else{
          setIsUpdateAvailable(false);
          setIsUpdateAvailableCheck(true);
          console.log((lang == "th_th" ? "ไม่มีการอัปเดต" : "No Update Available"), res);
        }
      })
    }
    },[cacheData, user, setIsUpdateAvailable, isUpdateAvailableCheck, setIsUpdateAvailableCheck, lang]);

  // console.log(cashFlowSeries);

  const chartSpendingData = {
    series: [
      {
        name: "Income",
        data: cashIncSeries["value"],
      },
      {
        name: "Expense",
        data: cashExpSeries["value"],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ['#77B6EA', '#545454'],
      stroke: {
        curve: "smooth",
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: cashExpSeries["key"],
      },
      yaxis: {
        show: true
      },
      toolbar:{
        show: true
      }
    },
  };
  const chartData = {
    series: [
      {
        name: "Balance",
        data: cashFlowSeries["value"],
      },
    ],
    options: {
      chart: {
        type: "area",
        height: "auto",
      },

      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: "smooth",
        colors: ["#ff929f"],
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm",
        },
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: cashFlowSeries["key"],
      },
      yaxis: {
        show: true
      },
      toolbar:{
        show: true
      }
    },
  };
  return (
    <div className='col-span-2 md:col-span-1'>
    <div className='w-full h-full pt-8 md:flex md:flex-col md:items-center px-4'>
      <div className='flex flex-row justify-between md:grid md:grid-cols-1'>
        <div>
          <h1 className='text-[2em] px-4 font-bold md:text-center'>{lang == "th_th" ? "ยินดีต้อนรับกลับมา!" : "Welcome back!"}</h1>
          <h1 className='text-[1.25em] italic px-4 font-bold md:text-center'>{session.user.name}</h1>
        </div>
        <button
        onClick={()=>{
          cacheData[2]().then(respCache=>{
            if(respCache.success == true){
              setIsUpdateAvailable(false);
              console.log(lang == "th_th" ? "ดึงข้อมูลผู้ใช้ที่อัปเดตใหม่สำเร็จ!" : "Retrieve new update of user data successfully!");
              console.log(lang == "th_th" ? "กำลังออกจากการเช็กอัปเดต" : "Exiting CheckUpdate");
              MySwal.fire(lang == "th_th" ? "อัปเดตข้อมูลเรียบร้อยแล้ว!" : "Update data successfully!","","success");
            }else{
              MySwal.fire((lang == "th_th" ? "อัปเดตข้อมูลผิดพลาด!" : "Update data error!"),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "Please reports to administrator."),"error")
            }
          }).catch(err=>{
            console.error(err);
          });
        }}
        className={`${isUpdateAvailable ? "" : "hidden"} daisybtn daisyjoin-item bg-green-400 hover:bg-green-500 border-green-400 dark:text-black`}>{
          lang == "th_th" ? "อัพเดตข้อมูลใหม่ตอนนี้" : "Data update available!"
        }</button>
        {/* <div>
          <div className="daisyjoin">
            <button onClick={()=>{ setDisplayMode("D"); }} className={`daisybtn daisyjoin-item ${displayMode == "D" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} `}>D</button>
            <button onClick={()=>{ setDisplayMode("W"); }} className={`daisybtn daisyjoin-item ${displayMode == "W" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} `}>W</button>
            <button onClick={()=>{ setDisplayMode("M"); }} className={`daisybtn daisyjoin-item ${displayMode == "M" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} `}>M</button>
            <button onClick={()=>{ setDisplayMode("Y"); }} className={`daisybtn daisyjoin-item ${displayMode == "Y" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} `}>Y</button>
          </div>
        </div> */}
      </div>
      <div className='w-full flex flex-col mt-4 gap-4'>
        <div className='w-full flex flex-row gap-4'>
          <div className='grid grid-cols-4 gap-4 w-full h-full semiExtraLarge:grid semiExtraLarge:grid-cols-3 AfterExtraMedium:grid-cols-2 sxs:grid-cols-1'>
            <div className='border-purple-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-purple-400 rounded-xl text-2xl'>
                <i className='far fa-coins' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : cacheData[3][formatDateWithTokens(new Date(),"Y-m-d")].remainingBalance + (lang == "th_th" ? " บาท" : " THB")}</div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "กล่องเงินสด" : "Cashbox"}</div>
              </div>
            </div>
            <div className='border-green-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-green-400 rounded-xl text-2xl'>
                <i className='far fa-money-bill-wave' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : cacheData[3][formatDateWithTokens(new Date(),"Y-m-d")].income_total + (lang == "th_th" ? " บาท" : " THB")}</div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "รายรับวันนี้" : "Today Income"}</div>
              </div>
            </div>
            <div className='border-red-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-red-400 rounded-xl text-2xl'>
                <i className='far fa-basket-shopping' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : cacheData[3][formatDateWithTokens(new Date(),"Y-m-d")].expense_total + (lang == "th_th" ? " บาท" : " THB")}</div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "รายจ่ายวันนี้" : "Today Expense"}</div>
              </div>
            </div>
            <div className='border-golden-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-golden-400 rounded-xl text-2xl'>
                <i className='far fa-money-simple-from-bracket' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : cacheData[3][formatDateWithTokens(new Date(),"Y-m-d")].totalTransaction}</div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "รายการธุรกรรมในวันนี้" : "Today Transactions"}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='w-full flex flex-row sm:flex-col gap-4'>
          <div className='border-blue-500 border-2 p-4 rounded-xl w-1/2 sm:w-full AfterExtraMedium:w-full max-w-[50vw] sm:max-w-[93vw] overflow-x-auto'>
          <div className='font-bold text-lg text-center mb-6 flex flex-row gap-2 justify-between items-center'>
            <div>{lang == "th_th" ? "กระเป๋าสตางค์" : "Wallets"}</div> 
            <div onClick={()=>{
              setSelected(2);
            }} className="bg-green-500 flex items-center justify-center w-10 h-10 cursor-pointer rounded-full"><i className='far fa-plus' /></div>
          </div>
            <div className='flex flex-row gap-3 ExtraXL:gap-6 md:gap-4 pr-2 overflow-hidden overflow-x-auto scrollbarx pb-2'>
            <div className='flex flex-row gap-2 pr-0 pl-1'>
              {
                    cacheData[0] == null || cacheData[0] == undefined ? <div>{lang == "th_th" ? "ไม่มีข้อมูล" : "No data."}</div> : 
                    cacheData[0].wallet.data.length == 0 ? <div>{lang == "th_th" ? "ไม่มีข้อมูล" : "No data."}</div> : sortByCreated(cacheData[0].wallet.data).map((card,j)=>{
                      return (
                        <div
                        key={card.id}
                        className="w-96 !aspect-[1011/638] cursor-pointer hover:scale-[1.01]">
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
          </div>
          <div className='border-amber-500 border-2 p-4 rounded-xl w-1/2 sm:w-full AfterExtraMedium:w-full'>
          <div className='font-bold text-lg text-center mb-6 flex flex-row gap-2 justify-between items-center'>
            <div>{lang == "th_th" ? "การทำธุรกรรมล่าสุด" : "Recent transactions"}</div> 
            <div onClick={()=>{
              setSelected(1);
            }} className="bg-green-500 flex items-center justify-center w-10 h-10 cursor-pointer rounded-full"><i className='far fa-plus' /></div>
          </div>
            <>
                            <div className="grid grid-cols-1 gap-4">
                                {
                                    cacheData[0] == null || cacheData[0] == undefined ? <div>{lang == "th_th" ? "ไม่มีข้อมูล" : "No data."}</div> : cacheData[0].txn.data.length == 0 ? 
                                    <div>{lang == "th_th" ? "ไม่มีข้อมูล" : "No data."}</div> : cacheData[0].txn.data.map((i,j)=>{
                                        if(j > 2){ return;}
                                        return (
                                            <TXNPrint editClick={()=>{
                                                setLoadPage("transaction_edit");
                                                setEditTxnID(j);
                                            }} 
                                            lang={lang}
                                            showDate={false}
                                            resize={true}
                                            deleteClick={()=>{

                                            }}
                                            showInteract={false}
                                            cacheData={cacheData} cardData={i} key={"txn_"+i.name+"_"+j+"_"+i.id} />
                                            )
                                        })
                                }
                            </div>
                        </>
          </div>
        </div>

      </div>
      <div className='mt-4 h-1'></div>
      <StringVersionDiGiPurse />
      <div className='mb-10 h-1'></div>
    </div>
</div>
  )
}

export default DashboardHome