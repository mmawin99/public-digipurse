import React, { cache, useCallback, useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Controller } from 'swiper/modules';
import WalletWrapper from './WalletWrapper';
import { formatDateWithTokens, getDatabaseName, sortByCreated } from './MainConfig';
import { BackgroundPatternsExport } from './background';
import { useSessionStorage } from '@uidotdev/usehooks';
import WalletWrapperGrid from './WalletWrapper_grid';
import { TXNPrint, findObjectById, getPreviousTimestamps, getStringDate } from './ModuleCentralClass';
import dynamic from 'next/dynamic';
import { StringVersionDiGiPurse } from '@/Data/Data';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });
const WalletPatternList = BackgroundPatternsExport;
function filterObjectByDate(data, filterData = null, isPremium = false) {
  if (data == null) {
    console.log("Data is null",data,filterData, isPremium);
    return null;
  }else{
    console.log("Data is not null",data,filterData, isPremium);
  }

  const today = new Date().toISOString().split('T')[0]; // Get today's date in the format "YYYY-MM-DD"
  const maxYears = isPremium ? 5 : 2;

  // Calculate the maximum allowed date based on isPremium
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - maxYears);
  const maxDateString = maxDate.toISOString().split('T')[0];

  // Filter the object based on the date
  const filteredObject = Object.keys(data).reduce((result, date) => {
    if (date <= today && date >= maxDateString) {
      if (filterData == null) {
        result[date] = data[date];
      } else {
        if (typeof data[date][filterData] === "undefined") {
          result[date] = data[date];
        } else {
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
    value.push(parseFloat(parseFloat(objectsR[i]).toFixed(2)));
  })
  return {
    key:key,
    value:value
  }
}
function toWalletDetails(cacheData, walletData){
  if(walletData == null){
    return {
      key:[null],
      value:[null]
    };
  }
  let key = Object.keys(walletData);
  let value = [],keyReturn = [];
  key.forEach((i,j)=>{
    keyReturn.push(findObjectById(cacheData,i).wallet_name);
    value.push(walletData[i]);
  })
  return {
    key:keyReturn,
    value:value
  }
}
function toCateDetails(cacheData, walletData){
  if(walletData == null){
    return {
      key:[null],
      value:[null]
    };
  }
  let key = Object.keys(walletData);
  let value = [],keyReturn = [];
  key.forEach((i,j)=>{
    keyReturn.push(findObjectById(cacheData,i).name);
    value.push(walletData[i]);
  })
  return {
    key:keyReturn,
    value:value
  }
}
function cateFill(whatToGet,toCateDetailsReturned = null){
  if(toCateDetailsReturned == null){
    return {
      key:[null],
      value:[null]
    }
  }
  if(typeof toCateDetailsReturned?.value[0] == 'undefined' || toCateDetailsReturned?.value[0] == null){
    return {
      key:[null],
      value:[null]
    }
  }else{
    // console.log("TYPE:", typeof toCateDetailsReturned?.value[0], toCateDetailsReturned?.value[0]);
  }
  if(typeof toCateDetailsReturned?.value[0][whatToGet] == "undefined"){
    return {
      key:[null],
      value:[null]
    }
  }

  toCateDetailsReturned.value = toCateDetailsReturned.value.map(i=>i[whatToGet]);
  return toCateDetailsReturned;
}
const callDiff = (prev,current,type)=>{
  // console.log("CalDiff: ",prev[type], current[type]);
  let prevCal = parseFloat(prev ? prev[type] ? prev[type] : "0.00" : "0.00");
  let currCal = parseFloat(current ? current[type] ? current[type] : "0.00" : "0.00");
  return callDiffHelper(prevCal, currCal);
}
const callDiffHelper = (previousHelper, currentHelper)=>{
  if(previousHelper == currentHelper){
    return "+0%";
  }else if(previousHelper > currentHelper){
    let diff = previousHelper - currentHelper;
    let perc = parseFloat(parseFloat((diff / currentHelper) * 100).toFixed(2));
    if(perc == Infinity) return "-100%";
    return "-"+perc+"%";
  }else if(previousHelper < currentHelper){
    let diff = currentHelper - previousHelper;
    let perc = parseFloat(parseFloat((diff / currentHelper) * 100).toFixed(2));
    return "+"+perc+"%";
  }
  return "ukn%";
}
const Analytics = ({lang, cacheData,user,theme,session,setSelected}) => {
  const sliderRef = useRef(null);
  const dateCurrent = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0];
  const [currentDateString,setCurrentDateString] = useState(getStringDate(dateCurrent));
  const [currentPrevDateString, setCurrentPrevDateString] = useState(getPreviousTimestamps(dateCurrent));
  // console.log("Date: ",currentPrevDateString);
  const [monthTotalTxn,setMonthTotalTxn] = useState(0);
  const [displayMode,setDisplayMode] = useSessionStorage("digipurse_dashboard_display_mode","D");
  const [displayingData,setDisplayingData] = useSessionStorage("digipurse_session_analytics_displayData",cacheData[4] == null ? null : cacheData[4]["day"][currentDateString["D"]]);
  const [displayingPrevData,setDisplayingPrevData] = useSessionStorage("digipurse_session_analytics_displayPrevData",
  cacheData[4] == null ? null : cacheData[4]["day"][currentPrevDateString["D"]]);
  const [activeDisplayWallet, setActiveDisplayWallet] = useState(0);
  const [activeDisplayWalletData, setActiveDisplayWalletData] = useState(sortByCreated(cacheData[0].wallet.data)[0]);
  const [totalWallet, setTotalWallet] = useSessionStorage("digipurse_session_wallet_totalWallet", cacheData[0].wallet.data.length);
  const [cashFlowSeries,setCashFlowSeries] = useSessionStorage("session_digipurse_analytic_cashFlowSeries",splitKeysValue(null));
  const [cashIncSeries,setCashIncSeries] = useSessionStorage("session_digipurse_analytic_cashIncSeries",splitKeysValue(null));
  const [cashExpSeries,setCashExpSeries] = useSessionStorage("session_digipurse_analytic_cashExpSeries",splitKeysValue(null));
  const [walletRatioSeries,setWalletRatioSeries] = useSessionStorage("session_digipurse_analytic_walletRatioSeries",splitKeysValue(null));
  const [cateRatioExpenseSeries,setCateRatioExpenseSeries] = useSessionStorage("session_digipurse_analytic_cateRatioExpenseSeries",splitKeysValue(null));
  const [cateRatioIncomeSeries,setCateRatioIncomeSeries] = useSessionStorage("session_digipurse_analytic_cateRatioIncomeSeries",splitKeysValue(null));
  const [isShowingGraph, setIsShowingGraph] = useState(false);
  const [walletLockList, setWalletLockList] = useState(null);
  const wallet_locked_list = cacheData[0].wallet.data.filter(i=>{ return i.wallet_isLock; }).map(i=>{ return i.id; });
  const [currentViewBalance,setCurrentViewBalance] = useSessionStorage("session_viewAvailableBalanceCurrent", 0);
  const [prevCurrentViewBalance,setPrevCurrentViewBalance] = useSessionStorage("session_viewAvailableBalancePrevOfCurrent", 0);
  function refreshGraph(){
    setCurrentDateString(getStringDate(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000))));
    setCashFlowSeries(splitKeysValue(filterObjectByDate(cacheData[3],"remainingBalance", session.user.statusUser == "premium")));
    setCashIncSeries(splitKeysValue(filterObjectByDate(cacheData[3],"income_total", session.user.statusUser == "premium")));
    setCashExpSeries(splitKeysValue(filterObjectByDate(cacheData[3],"expense_total", session.user.statusUser == "premium")));
    setWalletRatioSeries(cacheData[3] == null ? null : toWalletDetails(cacheData[0].wallet.data,cacheData[3] == null ? null : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance));
    // setCateRatioExpenseSeries(toCateDetails(cacheData[0].group.data,cacheData[5]));
    // setCateRatioIncomeSeries(toCateDetails(cacheData[0].group.data,cacheData[5]));
    setCateRatioExpenseSeries(cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
    setCateRatioIncomeSeries(cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
    // console.log(cacheDate[5]);
  }
  useEffect(()=>{
    // setTotalWallet(cacheData[0].wallet.data.length);

    setCurrentViewBalance(displayingData ? Object.keys(displayingData?.walletBalance).map(i=>{
      if(wallet_locked_list.includes(i)) return 0;
      return displayingData.walletBalance[i];
    }).reduce((total, num) => total + num, 0) : null);
    
    setPrevCurrentViewBalance(displayingData ? Object.keys(displayingPrevData?.walletBalance).map(i=>{
      if(wallet_locked_list.includes(i)) return 0;
      return displayingPrevData.walletBalance[i];
    }).reduce((total, num) => total + num, 0) : null);

    const fetchData = (cb)=>{
      console.log("graph fetch");
      setMonthTotalTxn(cacheData[4] == null ? 0 : cacheData[4].month[currentDateString["M"]].totalTransaction);
      if(cashFlowSeries == null){
        console.log("cashFlowSeries is null");
        setCashFlowSeries(splitKeysValue(filterObjectByDate(cacheData[3],"remainingBalance",session.user.statusUser == "premium")));
      }else if(cashFlowSeries.key[0] == null){
        console.log("cashFlowSeries is null");
        setCashFlowSeries(splitKeysValue(filterObjectByDate(cacheData[3],"remainingBalance",session.user.statusUser == "premium")));
      }
      if(cashIncSeries == null){
        console.log("cashIncSeries is null");
        setCashIncSeries(splitKeysValue(filterObjectByDate(cacheData[3],"income_total",session.user.statusUser == "premium")));
      }else if(cashIncSeries.key[0] == null){
      console.log("cashIncSeries is null");
        setCashIncSeries(splitKeysValue(filterObjectByDate(cacheData[3],"income_total",session.user.statusUser == "premium")));
      }
      if(cashExpSeries == null){
        console.log("cashExpSeries is null");
        setCashExpSeries(splitKeysValue(filterObjectByDate(cacheData[3],"expense_total",session.user.statusUser == "premium")));
      }else if(cashExpSeries.key[0] == null){
        console.log("cashExpSeries is null");
        setCashExpSeries(splitKeysValue(filterObjectByDate(cacheData[3],"expense_total",session.user.statusUser == "premium")));
      }
      if(walletRatioSeries == null){
        console.log("walletRatioSeries is null");
        setWalletRatioSeries(cacheData[3] == null ? null : toWalletDetails(cacheData[0].wallet.data,cacheData[3] == null ? null : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance));
      }else if(walletRatioSeries.key[0] == null){
        console.log("walletRatioSeries is null");
        setWalletRatioSeries(cacheData[3] == null ? null : toWalletDetails(cacheData[0].wallet.data,cacheData[3] == null ? null : cacheData[3][formatDateWithTokens(new Date(cacheData[1]),"Y-m-d")].walletBalance));
      }
      if(cateRatioExpenseSeries == null){
        // console.log("cateRatioSeries is null e",cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
        // console.log("cateRatioSeries is null i",cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
        console.log("cateRatioExpenseSeries is null",cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
        setCateRatioExpenseSeries(cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
      }else if(cateRatioExpenseSeries.key[0] == null){
        setCateRatioExpenseSeries(cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
        console.log("cateRatioExpenseSeries is null",cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
        // console.log("cateRatioSeries is null e",cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
        // console.log("cateRatioSeries is null i",cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
      //   setCateRatioSeries(toCateDetails(cacheData[0].group.data,cacheData[5]));
      }
      if(cateRatioIncomeSeries == null){
        // console.log("cateRatioSeries is null e",cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
        // console.log("cateRatioSeries is null i",cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
        console.log("cateRatioIncomeSeries is null",cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
        setCateRatioIncomeSeries(cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
      }else if(cateRatioIncomeSeries.key[0] == null){
        setCateRatioIncomeSeries(cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
        console.log("cateRatioIncomeSeries is null",cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
        // console.log("cateRatioSeries is null e",cateFill("expense",toCateDetails(cacheData[0].group.data,cacheData[5])));
        // console.log("cateRatioSeries is null i",cateFill("income",toCateDetails(cacheData[0].group.data,cacheData[5])));
      //   setCateRatioSeries(toCateDetails(cacheData[0].group.data,cacheData[5]));
      }
      setTimeout(()=>{
        setIsShowingGraph(true);
      },200);
      }
      fetchData();
  },
  [setTotalWallet, cacheData, currentDateString, session, setCashExpSeries, setCashFlowSeries, setWalletRatioSeries, setCashIncSeries, 
    setCateRatioIncomeSeries, setCateRatioExpenseSeries, setPrevCurrentViewBalance, setCurrentViewBalance,
    cashFlowSeries, cashIncSeries, cashExpSeries, walletRatioSeries, cateRatioExpenseSeries, cateRatioIncomeSeries, 
    displayingData, displayingPrevData, wallet_locked_list]);
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
        theme: theme == "dark" ? "dark" : "light",
      },
      fill: {
        colors: ["#fff"],
        type: "gradient",
      },
      grid: {
        show: true,
        borderColor: '#90A4AE',
      },
      xaxis: {
        type: "datetime",
        categories: cashExpSeries["key"],
        labels: {
          style:{
            colors: cashExpSeries["key"].map((i,j)=>{return theme == "dark" ? "#fff" : "#000";})
          }
        }
      },
      yaxis: {
        show: true,
        labels: {
          style:{
            colors: theme == "dark" ? ["#fff","#fff"] : ["#000","#000"]
          }
        }
      },
      toolbar: {
        show: true
      },
      legend:{
        position: 'bottom',
        labels: {
          colors: theme == "dark" ? ["#fff","#fff"] : ["#000","#000"]
        }
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
        theme: theme == "dark" ? "dark" : "light",
      },
      grid: {
        show: true,
      },
      xaxis: {
        type: "datetime",
        categories: cashFlowSeries["key"],
        labels: {
          style:{
            colors: cashFlowSeries["key"].map((i,j)=>{return theme == "dark" ? "#fff" : "#000";})
          }
        }
      },
      yaxis: {
        show: true,
        labels: {
          style:{
            colors: theme == "dark" ? ["#fff","#fff"] : ["#000","#000"]
          }
        }
      },
      toolbar:{
        show: true
      }
    },
  };
  const cateRatioIncomeData = {   
    series: cateRatioIncomeSeries["value"],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      dataLabels: {
        enabled:false
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                color: theme == "dark" ? "#fff" : "#000",
                showAlways: true,
                show: true,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                },
              },
              value:{
                color: theme == "dark" ? "#fff" : "#000",
              }
            }
          }
        }
      },
      tooltip: {
        theme: theme == "dark" ? "dark" : "light",
      },
      labels: cateRatioIncomeSeries["key"],
      legend:{
        position: 'bottom',
        labels: {
          colors: cateRatioIncomeSeries["key"].map((i,j)=>{return theme == "dark" ? "#fff" : "#000";})
        }
      }
    },
  };
  const cateRatioExpenseData = {   
    series: cateRatioExpenseSeries["value"],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      dataLabels: {
        enabled:false
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                color: theme == "dark" ? "#fff" : "#000",
                showAlways: true,
                show: true,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                },
              },
              value:{
                color: theme == "dark" ? "#fff" : "#000",
              }
            }
          }
        }
      },
      tooltip: {
        theme: theme == "dark" ? "dark" : "light",
      },
      labels: cateRatioExpenseSeries["key"],
      legend:{
        position: 'bottom',
        labels: {
          colors: cateRatioExpenseSeries["key"].map((i,j)=>{return theme == "dark" ? "#fff" : "#000";})
        }
      }
    },
  };
  const chartRatioData = {   
    series: walletRatioSeries["value"],
    options: {
      chart: {
        width: 380,
        type: 'donut',
      },
      dataLabels: {
        enabled:false
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                color: theme == "dark" ? "#fff" : "#000",
                showAlways: true,
                show: true,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0).toFixed(2);
                },
              },
              value:{
                color: theme == "dark" ? "#fff" : "#000",
              }
            }
          }
        }
      },
      tooltip: {
        theme: theme == "dark" ? "dark" : "light",
      },
      labels: walletRatioSeries["key"],
      legend:{
        position: 'bottom',
        labels: {
          colors: walletRatioSeries["key"].map((i,j)=>{return theme == "dark" ? "#fff" : "#000";})
        }
      }
    },
  };
  return (
    <div className='col-span-2 md:col-span-1'>
    <div className='w-full h-full pt-8 md:flex md:flex-col md:items-center px-4'>
      <div className='flex flex-row justify-between md:grid md:grid-cols-1'>
        <div>
          <h1 className='text-[2em] px-4 font-bold md:text-center flex flex-row gap-2'>
            {lang == "th_th" ? "การวิเคราะห์" : "Analytics"}
          <div className="daisybtn daisybtn-success" onClick={refreshGraph}><i className='far fa-arrows-rotate-reverse' /></div>
          </h1>
          <h1 className='text-[1.25em] px-4 font-medium md:text-center md:justify-center flex flex-row gap-2'>{
          displayMode == "D" ? (lang == "th_th" ? "ภาพรวมของวันนี้" : "Today overview") :
          displayMode == "W" ? (lang == "th_th" ? "ภาพรวมของสัปดาห์นี้" : "This week overview") :
          displayMode == "M" ? (lang == "th_th" ? "ภาพรวมของเดือนนี้" : "This month overview") :
          displayMode == "Y" ? (lang == "th_th" ? "ภาพรวมของปีนี้" : "This year overview") :
          displayMode == "A" ? (lang == "th_th" ? "ภาพรวมของทุกเวลา" : "All time overview") : 
                               (lang == "th_th" ? "ภาพรวมของทุกเวลา" : "All time overview")
          }
          </h1>
        </div>
        <div>
          <div className="daisyjoin">
            <button 
                onClick={()=>{ setDisplayMode("D");
                               setDisplayingData(cacheData[4] == null ? null : cacheData[4]["day"][currentDateString["D"]]);
                               setDisplayingPrevData(cacheData[4] == null ? null : typeof cacheData[4]["day"][currentPrevDateString["D"]] == "undefined" ? null : cacheData[4]["day"][currentPrevDateString["D"]]);
                               console.log(currentDateString);
                             }} 
                className={`daisybtn daisyjoin-item dark:text-black 
                            ${displayMode == "D" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} 
                            ${lang == "th_th" ? "tracking-tighter" : ""} `}>{lang == "th_th" ? "วัน" : "D"}</button>
            <button 
                onClick={()=>{ setDisplayMode("W");
                               setDisplayingData(cacheData[4] == null ? null : cacheData[4]["week"][currentDateString["W"]]);
                               setDisplayingPrevData(cacheData[4] == null ? null : typeof cacheData[4]["week"][currentPrevDateString["W"]] == "undefined" ? null : cacheData[4]["week"][currentPrevDateString["W"]]);
                             }} 
                className={`daisybtn daisyjoin-item dark:text-black 
                            ${displayMode == "W" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} 
                            ${lang == "th_th" ? "tracking-tighter" : ""} `}>{lang == "th_th" ? "สัปดาห์" : "W"}</button>
            <button 
                onClick={()=>{ setDisplayMode("M");
                               setDisplayingData(cacheData[4] == null ? null : cacheData[4]["month"][currentDateString["M"]]);
                               setDisplayingPrevData(cacheData[4] == null ? null : typeof cacheData[4]["month"][currentPrevDateString["M"]] == "undefined" ? null : cacheData[4]["month"][currentPrevDateString["M"]]);
                             }} 
                className={`daisybtn daisyjoin-item dark:text-black 
                            ${displayMode == "M" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} 
                            ${lang == "th_th" ? "tracking-tighter" : ""} `}>{lang == "th_th" ? "เดือน" : "M"}</button>
            <button 
                onClick={()=>{ setDisplayMode("Y");
                               setDisplayingData(cacheData[4] == null ? null : cacheData[4]["year"][currentDateString["Y"]]);
                               setDisplayingPrevData(cacheData[4] == null ? null : typeof cacheData[4]["year"][currentPrevDateString["Y"]] == "undefined" ? null : cacheData[4]["year"][currentPrevDateString["Y"]]);
                             }} 
                className={`daisybtn daisyjoin-item dark:text-black 
                            ${displayMode == "Y" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} 
                            ${lang == "th_th" ? "tracking-tighter" : ""} `}>{lang == "th_th" ? "ปี" : "Y"}</button>
            <button 
                onClick={()=>{ setDisplayMode("A");
                               setDisplayingData(cacheData[4] == null ? null : cacheData[4]["alltime"][currentDateString["A"]]);
                               setDisplayingPrevData(null);
                             }} 
                className={`daisybtn daisyjoin-item dark:text-black 
                            ${displayMode == "A" ? "bg-green-400 hover:bg-green-500 border-green-400" : "bg-gray-300 hover:bg-gray-400 border-gray-300"} 
                            ${lang == "th_th" ? "tracking-tighter" : ""} `}>{lang == "th_th" ? "ทุกเวลา" : "A"}</button>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-col mt-4 gap-4'>
        <div className='w-full flex flex-row gap-4'>
          <div className='grid grid-cols-4 gap-4 w-full h-full semiExtraLarge:grid semiExtraLarge:grid-cols-3 AfterExtraMedium:grid-cols-2 sxs:grid-cols-1'>
            <div className='border-purple-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-purple-400 rounded-xl text-2xl'>
                <i className='far fa-sack-dollar' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>
                  {cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : displayingData.remainingBalance + (lang == "th_th" ? " บาท" : " THB")}</div>
                <div className={`${displayMode == "A" ? "hidden" : "text-xs"}`}>{callDiff(displayingPrevData,displayingData,"remainingBalance")} {
          displayMode == "D" ? (lang == "th_th" ? "จากเมื่อวาน" : "from yesterday") :
          displayMode == "W" ? (lang == "th_th" ? "จากสัปดาห์ที่แล้ว" : "from last week") :
          displayMode == "M" ? (lang == "th_th" ? "จากเดือนที่แล้ว" : "from last month") :
          displayMode == "Y" ? (lang == "th_th" ? "จากปีที่แล้ว" : "from last year") :
          displayMode == "A" ? (lang == "th_th" ? "จากทุกเวลา" : "from all time") : 
                               (lang == "th_th" ? "จากทุกเวลา" : "from all time")
          }
          </div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "เงินทั้งหมด" : "Cash"}</div>
              </div>
            </div>
            <div className='border-cyan-600 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-cyan-600 rounded-xl text-2xl'>
                <i className='far fa-coins' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>
                  {cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : currentViewBalance + (lang == "th_th" ? " บาท" : " THB")}</div>
                <div className={`${displayMode == "A" ? "hidden" : "text-xs"}`}>{callDiffHelper(prevCurrentViewBalance, currentViewBalance)} {
          displayMode == "D" ? (lang == "th_th" ? "จากเมื่อวาน" : "from yesterday") :
          displayMode == "W" ? (lang == "th_th" ? "จากสัปดาห์ที่แล้ว" : "from last week") :
          displayMode == "M" ? (lang == "th_th" ? "จากเดือนที่แล้ว" : "from last month") :
          displayMode == "Y" ? (lang == "th_th" ? "จากปีที่แล้ว" : "from last year") :
          displayMode == "A" ? (lang == "th_th" ? "จากทุกเวลา" : "from all time") : 
                               (lang == "th_th" ? "จากทุกเวลา" : "from all time")
          }
          </div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "เงินที่พร้อมใช้งาน" : "Available Balance"}</div>
              </div>
            </div>
            <div className='border-green-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-green-400 rounded-xl text-2xl'>
                <i className='far fa-money-bill-wave' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : displayingData.income_total + (lang == "th_th" ? " บาท" : " THB")}</div>
                <div className={`${displayMode == "A" ? "hidden" : "text-xs"}`}>{callDiff(displayingPrevData,displayingData,"income_total")} {
          displayMode == "D" ? (lang == "th_th" ? "จากเมื่อวาน" : "from yesterday") :
          displayMode == "W" ? (lang == "th_th" ? "จากสัปดาห์ที่แล้ว" : "from last week") :
          displayMode == "M" ? (lang == "th_th" ? "จากเดือนที่แล้ว" : "from last month") :
          displayMode == "Y" ? (lang == "th_th" ? "จากปีที่แล้ว" : "from last year") :
          displayMode == "A" ? (lang == "th_th" ? "จากทุกเวลา" : "from all time") : 
                               (lang == "th_th" ? "จากทุกเวลา" : "from all time")
          }
          </div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "รายได้รวม" : "Total Income"}</div>
              </div>
            </div>
            <div className='border-red-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-red-400 rounded-xl text-2xl'>
                <i className='far fa-basket-shopping' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : displayingData.expense_total + (lang == "th_th" ? " บาท" : " THB")}</div>
                <div className={`${displayMode == "A" ? "hidden" : "text-xs"}`}>{callDiff(displayingPrevData,displayingData,"expense_total")} {
          displayMode == "D" ? (lang == "th_th" ? "จากเมื่อวาน" : "from yesterday") :
          displayMode == "W" ? (lang == "th_th" ? "จากสัปดาห์ที่แล้ว" : "from last week") :
          displayMode == "M" ? (lang == "th_th" ? "จากเดือนที่แล้ว" : "from last month") :
          displayMode == "Y" ? (lang == "th_th" ? "จากปีที่แล้ว" : "from last year") :
          displayMode == "A" ? (lang == "th_th" ? "จากทุกเวลา" : "from all time") : 
                               (lang == "th_th" ? "จากทุกเวลา" : "from all time")
          }
          </div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "รายจ่ายรวม" : "Total Expense"}</div>
              </div>
            </div>
            <div className='border-golden-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-golden-400 rounded-xl text-2xl'>
                <i className='far fa-money-simple-from-bracket' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>
                  {cacheData[3] == null ? (lang == "th_th" ? "ไม่มีข้อมูล" : "No data") : displayingData.totalTransaction}
                  </div>
                  <div className={`${displayMode == "A" ? "hidden" : "text-xs"}`}>{callDiff(displayingPrevData,displayingData,"totalTransaction")} {
          displayMode == "D" ? (lang == "th_th" ? "จากเมื่อวาน" : "from yesterday") :
          displayMode == "W" ? (lang == "th_th" ? "จากสัปดาห์ที่แล้ว" : "from last week") :
          displayMode == "M" ? (lang == "th_th" ? "จากเดือนที่แล้ว" : "from last month") :
          displayMode == "Y" ? (lang == "th_th" ? "จากปีที่แล้ว" : "from last year") :
          displayMode == "A" ? (lang == "th_th" ? "จากทุกเวลา" : "from all time") : 
                               (lang == "th_th" ? "จากทุกเวลา" : "from all time")
          }
          </div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "รายการธุรกรรม" : "Transactions"}</div>
              </div>
            </div>
            <div className='border-stone-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-stone-400 rounded-xl text-2xl'>
                <i className='far fa-wallet' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[0].wallet.data.length}</div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "กระเป๋าสตางค์" : "Wallets"}</div>
              </div>
            </div>
            <div className='border-amber-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-amber-400 rounded-xl text-2xl'>
                <i className='far fa-icons' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[0].group.data.length}</div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "หมวดหมู่" : "Category"}</div>
              </div>
            </div>
            {session.user.statusUser == "premium" ? "" : <div className='border-zinc-400 border-2 rounded-xl h-max w-full flex flex-row items-center gap-4 p-4'>
              <div className='aspect-square flex flex-row justify-center items-center w-16 h-full bg-zinc-400 rounded-xl text-2xl'>
                <i className='far fa-crown' />
              </div>
              <div className='w-max'>
                <div className='font-bold text-xl 2xl:text-lg ExtraXL:text-base ms:text-sm sxs:text-base'>{cacheData[4] == null ? "" : <>
                {monthTotalTxn}
                </> } / {process.env.NEXT_PUBLIC_DIGIPURSE_REGULAR_TRANSACTION_LIMIT}</div>
                <div className='ms:text-sm sxs:text-base'>{lang == "th_th" ? "รายการธุรกรรมในเดือนนี้" : "This month transactions"}</div>
              </div>
            </div> }
          </div>
        </div>
        <div className='w-full grid grid-cols-3 semiExtraLarge:grid-cols-2 afterAfterMS:grid-cols-1 gap-4'>
          <div className='border-blue-500 p-2 border-2 rounded-xl w-full md:order-1 afterAfterMS:col-span-1 beforeAfterSemiLarge:w-full'>
            <div className='font-bold text-lg text-center mb-6 flex flex-row gap-2 justify-start items-center'>
              <div>{lang == "th_th" ? "เงินสดคงเหลือ" : "Cash Remaining"}</div> 
            </div>
            {
              cacheData[3] == null ? <div>{lang == "th_th" ? "ไม่มีข้อมูลธุรกรรม" : "No Transaction data."}</div> :
              isShowingGraph == false ? <div className="font-medium italic">{lang == "th_th" ? "กำลังโหลด..." : "Loading..."}</div> :
              <ApexCharts options={chartRatioData.options} series={chartRatioData.series} type="donut" />
            }
          </div>
          <div className='border-green-500 p-2 border-2 rounded-xl w-full md:order-2 afterAfterMS:col-span-1 beforeAfterSemiLarge:w-full'>
            <div className='font-bold text-lg text-center mb-6 flex flex-row gap-2 justify-start items-center'>
              <div>{lang == "th_th" ? "หมวดหมู่เงินเข้า" : "Incoming Category"}</div> 
            </div>
            {
              cacheData[3] == null ? <div>{lang == "th_th" ? "ไม่มีข้อมูลธุรกรรม" : "No Transaction data."}</div> :
              isShowingGraph == false ? <div className="font-medium italic">{lang == "th_th" ? "กำลังโหลด..." : "Loading..."}</div> :
              <ApexCharts options={cateRatioIncomeData.options} series={cateRatioIncomeData.series} type="donut" />
            }
          </div>
          <div className='border-red-500 p-2 border-2 rounded-xl w-full md:order-3 afterAfterMS:col-span-1 beforeAfterSemiLarge:w-full'>
            <div className='font-bold text-lg text-center mb-6 flex flex-row gap-2 justify-start items-center'>
              <div>{lang == "th_th" ? "หมวดหมู่เงินออก" : "Spending Category"}</div> 
            </div>
            {
              cacheData[3] == null ? <div>{lang == "th_th" ? "ไม่มีข้อมูลธุรกรรม" : "No Transaction data."}</div> :
              isShowingGraph == false ? <div className="font-medium italic">{lang == "th_th" ? "กำลังโหลด..." : "Loading..."}</div> :
              <ApexCharts options={cateRatioExpenseData.options} series={cateRatioExpenseData.series} type="donut" />
            }
            {/* {
              console.log("EXP: ", cateRatioExpenseData.series)
            } */}
          </div>
          <div className='border-golden-500 p-2 border-2 rounded-xl w-full md:order-4 afterAfterMS:col-span-1 beforeAfterSemiLarge:w-full'>
            <div className='font-bold text-lg text-center mb-6 flex flex-row gap-2 justify-start items-center'>
              <div>{lang == "th_th" ? "กระแสเงินสด" : "Cashflow"}</div> 
            </div>
            {
              cacheData[3] == null ? <div>{lang == "th_th" ? "ไม่มีข้อมูลธุรกรรม" : "No Transaction data."}</div> :
              isShowingGraph == false ? <div className="font-medium italic">{lang == "th_th" ? "กำลังโหลด..." : "Loading..."}</div> :
              <ApexCharts options={chartData.options} series={chartData.series} type="area" />
            }
          </div>
          <div className='border-green-500 p-2 border-2 rounded-xl w-full md:order-5 afterAfterMS:col-span-1 beforeAfterSemiLarge:w-full'>
            <div className='font-bold text-lg text-center mb-6 flex flex-row gap-2 justify-start items-center'>
              <div>{lang == "th_th" ? "การใช้จ่ายรายวัน" : "Daily Spending"}</div> 
            </div>
            {
              cacheData[3] == null ? <div>{lang == "th_th" ? "ไม่มีข้อมูลธุรกรรม" : "No Transaction data."}</div> :
              isShowingGraph == false ? <div className="font-medium italic">{lang == "th_th" ? "กำลังโหลด..." : "Loading..."}</div> :
              <ApexCharts options={chartSpendingData.options} series={chartSpendingData.series} type="area" />
            }
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

export default Analytics
