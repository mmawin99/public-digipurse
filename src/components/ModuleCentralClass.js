import React, { useState } from "react";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { formatDateWithTokens, formatNumberWithPrefix, getDatabaseName } from "./MainConfig"
import CryptoJS from "crypto-js";
import { getData, updateData, writeData } from "@/firebase/firestore/CRUD";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const ModuleCryptoFunction = CryptoJS;
const PINPassword = "P@ssw0rdT03ncryp1P1N0fus3rExpensify";
export const MySwal = withReactContent(Swal);
export const ModuleEncryptPIN = (item)=>{
  return ModuleCryptoFunction.HmacSHA256(item, PINPassword).toString();
}
export const CryptoFunc = require("crypto-js");
export const GetFullyDataUncalculate = ({uid,handlingFunction})=>{
  console.log("UID: IN function:", uid);
  // console.log(DBName);
  // saveDrawing(DBName); 
  // console.log(drawing);
}
export function findObjectById(array, idToFind) {
  return array.find(obj => obj.id === idToFind);
}
export function findObjectBySpecific(spec, array, idToFind) {
  return array.find(obj => obj[spec] === idToFind);
}
export const writeAnUpdate = async(uid,cacheData,callback=()=>{})=>{
  const DBNAME = getDatabaseName(uid)["pref"];
  const DBVALUE = cacheData[0] == null ? null : findObjectBySpecific('meta',cacheData[0].pref.data,'update_available');
  const transactionUpdate = {
    "meta":"update_available",
    "meta_value":new Date().getTime() +"_"+ Math.random().toString(36).substring(2)+"_"+Math.random().toString(36).substring(2)
  }
  if(DBVALUE == null){
    writeData(DBNAME,transactionUpdate).then(()=>{
      // console.log("New updated has been written, on your other device will be update automatically."); 
      callback();
    })
  }else{
    updateData(DBNAME,DBVALUE.id,transactionUpdate).then(()=>{
      // console.log("New updated has been updated, on your other device will be update automatically."); 
      callback();
    })
  }
}
export const CheckUpdateAvailable = async (uid, cacheData)=>{
  // console.log("Entering CheckUpdate");
  // const [isCheck,setIsCheck] = useSessionStorage("expensify_checkUpdate",false);
  // const [isCheckHasUpdate,setIsCheckHasUpdate] = useSessionStorage("expensify_checkUpdate",false);
    // console.log("This is prevent check update multiple times.");
    // console.log("Exiting CheckUpdate");
    const DBNAME = getDatabaseName(uid)["pref"];
    const DBVALUE = cacheData[0] == null ? null : findObjectBySpecific('meta',cacheData[0].pref.data,'update_available');
    const fetchData = await getData(DBNAME);
    const fetchValue = (fetchData.data == null || JSON.stringify(fetchData.data) == "[]") ? null : findObjectBySpecific('meta',fetchData.data,'update_available');
    console.log("Update checking function: ",DBVALUE, fetchValue, cacheData);
    if((DBVALUE == null && fetchValue == null)){
      // setStateIsUpdate(!stateIsUpdate);
      // console.log("Data update is handled, No Update available.");
      // console.log("Handling With: ",(DBVALUE == null && fetchValue == null));
      // console.log("Handling With: ",DBVALUE.meta_value == fetchValue.meta_value)
      // console.log("Exiting CheckUpdate");
      return false;
    }else{
      if(DBVALUE?.meta_value == fetchValue?.meta_value){
        return false;
      }
      return true;
      // cacheData[2]().then(respCache=>{
      //   if(respCache.success == true){
      //     // setStateIsUpdate(!stateIsUpdate);
      //       // console.log("Retrieve new update of user data successfully!");
      //       // console.log("Exiting CheckUpdate");
      //   }
      // });
    }
}
const TransactionPrintDummy = ({title,date,icon,tagColorBg,tagColor,walletColor,type,amount,walletName})=>{
  // console.log(title,date,icon,tagColorBg,tagColor);
  const [isShow,setIsShow] = useState(false);
  return (
    <div className={`flex flex-row gap-2 justify-between
    bg-gradient-to-r select-none cursor-pointer
    from-gray-600/40 via-blue-300/10 to-gray-600/10 items-center rounded-xl pl-3 w-full h-20 3xs:h-16 shadow-black/30 shadow-md`}>
      <div className='flex flex-row gap-2 items-center'>
        <div style={{backgroundColor:tagColorBg,color:tagColor}} className='w-16 h-16 shadow-md shadow-white/10 betweenExtraSmall3:w-14 betweenExtraSmall3:h-14 3xs:w-12 3xs:h-12 flex flex-row justify-center
        items-center rounded-full text-4xl 3xs:text-2xl'><i className={`${icon}`} /></div>
        <div className='text-white font-dmsans'>
          <div className='text-[16px] betweenExtraSmall3:tracking-tight betweenExtraSmall3:text-[15px] 3xs:text-[13px] text-left'>{title}</div>
          <div className='text-[13px] betweenExtraSmall3:tracking-tight betweenExtraSmall3:text-[12px] 3xs:text-[10px] text-left'>{formatDateWithTokens(date,"d/m/Y")}</div>
        </div>
      </div>
      <div className='flex flex-row h-20 3xs:h-16 items-center gap-2 relative'>
        <div className={`w-24 text-base mr-4 2xs:w-20 2xs:text-sm 3xs:text-xs 3xs:w-16 h-10 col-span-4 border-white/50 border-[1px] rounded-full text-white 
        bg-gradient-to-r ${type == "e" ? "from-red-600/10 to-red-500/40" : type == "i" ? "from-gray-600/10 to-blue-500/40" : "from-black/10 to-black/40"} 
      flex flex-row justify-center items-center`}>{formatNumberWithPrefix(amount)}</div>
        <div style={{backgroundColor:walletColor}} className={`absolute flex flex-row justify-center items-center cursor-pointer right-0 w-2 h-full rounded-r-xl ${isShow ? "w-60" : ""}`}>
          <div className={`${isShow ? "" : "hidden"} shadow-black shadow-sm px-2 py-2 rounded-lg bg-white`}>{walletName}</div>
        </div>
      </div>
    </div>
  )
}
const TfTxnPrintDummy = ({from,to,amt,date})=>{
  return (
    <div className={`grid grid-cols-1 justify-between
    bg-gradient-to-r 
    from-gray-600/40 via-blue-300/10 to-gray-600/10 items-center rounded-t-xl rounded-b-lg px-3 w-full 
    shadow-black/30 shadow-md relative`}>
      <div className="flex flex-row gap-2">
        <div className='w-full flex flex-row gap-2 items-center'>
          <div style={{backgroundColor:"#000000",color:"#ffffff"}} className='w-16 h-16 shadow-md shadow-white/10 betweenExtraSmall3:w-14 betweenExtraSmall3:h-14 3xs:w-12 3xs:h-12 flex flex-row justify-center
          items-center rounded-full text-4xl 3xs:text-2xl'><i className={`fad fa-money-bill-transfer`} /></div>
          <div className='text-white font-dmsans'>
            <div className='text-[16px] betweenExtraSmall3:tracking-tight betweenExtraSmall3:text-[15px] 3xs:text-[13px] text-left'>
              Wallet Transfer</div>
            <div className='text-[13px] betweenExtraSmall3:tracking-tight betweenExtraSmall3:text-[12px] 3xs:text-[10px] text-left'>
              {formatDateWithTokens(date,"d/m/Y")}</div>
          </div>
        </div>
        <div className='flex flex-row h-20 3xs:h-16 items-center gap-2'>
          <div className={`w-24 text-base 2xs:w-20 2xs:text-sm 3xs:text-xs 3xs:w-16 h-10 col-span-4 border-white/50 border-[1px] rounded-full text-white 
          bg-gradient-to-r "from-gray-600/10 to-red-500/40 
        flex flex-row justify-center items-center`}>{formatNumberWithPrefix(amt)}</div>
        </div>
      </div>
      <div className="h-[1px] bg-white"></div>
      <div className="h-2"></div>
      <div className="grid grid-cols-3">
        <div className='flex flex-col gap-2 items-start'>
          <div className="text-white font-semibold">From</div>
          <div className="text-xs text-white font-medium">{from == null ? "" : from.wallet_name}</div>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <div><i className="far fa-arrow-right text-white"/></div>
          <div className="text-sm text-white font-bold">{formatNumberWithPrefix(amt)} {lang == "th_th" ? "บาท" : "THB"}</div>
        </div>
        <div className='flex flex-col gap-2 items-end'>
          <div className="text-white font-semibold">To</div>
          <div className="text-xs text-white font-medium">{to == null ? "" : to.wallet_name}</div>
        </div>
        <div className="absolute w-full h-2 bottom-0 left-0 grid grid-cols-2">
          <div style={{backgroundColor:from == null ? "" : from.wallet_bg_color}} className="w-full rounded-bl-2xl"></div>
          <div style={{backgroundColor:to == null ? "" : to.wallet_bg_color}} className="w-full rounded-br-2xl"></div>
        </div>
      </div>
      <div className="h-1 my-1"></div>
      {/* <div className="absolute w-1/2 h-2 bg-white bottom-0 left-0 rounded-bl-xl"> */}

      {/* </div> */}
      {/* <div className="absolute w-1/2 h-2 bg-red-500 bottom-0 right-0 rounded-br-xl"> */}

      {/* </div> */}
    </div>
  )
}
export const TransferTransactionPrint = ({fromWallet,toWallet,amount,date = new Date().toISOString(),mode = "light"})=>{
  if(mode == "dark"){
    return (<div className="w-full rounded-xl bg-[#060533]">
      <TfTxnPrintDummy from={fromWallet} to={toWallet} amt={amount} date={new Date(date)} />
    </div>)
  }
    return (
      <TfTxnPrintDummy from={fromWallet} to={toWallet} amt={amount} date={new Date(date)} />
    )
  }
export const TransactionPrint = ({title,date,icon,mode,tagColorBg,tagColor,walletColor,type,amount,walletName})=>{
  if(mode == "dark"){
    return (<div className="w-full rounded-xl bg-[#060533]">
      <TransactionPrintDummy title={title} date={new Date(date)} icon={icon} 
      tagColor={tagColor} tagColorBg={tagColorBg} walletColor={walletColor}
      type={type} amount={amount} walletName={walletName}
      />
    </div>)
  }
    return (
      <TransactionPrintDummy title={title} date={new Date(date)} icon={icon} 
      tagColor={tagColor} tagColorBg={tagColorBg} walletColor={walletColor}
      type={type} amount={amount} walletName={walletName}
      />
    )
  }
export const TransactionTagPrint = ({icon,name,textColor,color,className=""})=>{
    return (
        <div className={`w-20 h-20 aspect-square rounded-full ${className}`}>
            <div style={{backgroundColor:color,color:textColor}} className='text-4xl mb-2 h-full w-full shadow-md shadow-black
             aspect-square flex justify-center items-center rounded-full'>
                <i className={`${icon}`} />
            </div>
        </div>
    )
}
export const TransactionTagPrintSelector = ({icon,name,textColor,color,className="",customSelected="text-black"})=>{
    return (
      <>
        <div className="flex flex-row gap-2 items-center">
          <div className={`w-10 h-10 aspect-square rounded-full ${className}`}>
              <div style={{backgroundColor:color,color:textColor}} className='text-2xl mb-2 h-full w-full shadow-sm shadow-black
               aspect-square flex justify-center items-center rounded-full'>
                  <i className={`${icon}`} />
              </div>
          </div>
          <div className={`text-lg font-medium ${customSelected}`}>
            {name}
          </div>
        </div>
      </>
    )
}
export const findStartAndEndDate = (transactions) =>{
  let startDate = null;
  let startDateCompare;
  let endDate = null;
  let endDateCompare;
  if(typeof transactions == "undefined") return null;
  transactions.forEach((i,j)=>{
    let msThis = new Date(i.txn_date).getTime();
    if(!startDate){
      startDate = i.txn_date;
      startDateCompare = msThis;
    }else{
      if(startDateCompare > msThis){
        startDate = i.txn_date
        startDateCompare = msThis;
      }
    }
    if(!endDate){
      endDate = i.txn_date;
      endDateCompare = msThis;
    }else{
      if(endDate < msThis){
        startDate = i.txn_date
        startDateCompare = msThis;
      }
    }
  })
  return [startDate,endDate];
}
export function toISOLocal(d) {
  var z  = n =>  ('0' + n).slice(-2);
  var zz = n => ('00' + n).slice(-3);
  var off = d.getTimezoneOffset();
  var sign = off > 0? '-' : '+';
  off = Math.abs(off);

  return d.getFullYear() + '-'
         + z(d.getMonth()+1) + '-' +
         z(d.getDate()) + 'T' +
         z(d.getHours()) + ':'  + 
         z(d.getMinutes()) + ':' +
         z(d.getSeconds()) + '.' +
         zz(d.getMilliseconds()) +
         sign + z(off/60|0) + ':' + z(off%60); 
}
export const transactionsProcess = (walletId,transactions, startDate, endDate) => {
  if(JSON.stringify(walletId) == "[]" || JSON.stringify(transactions) == "[]" || startDate == null || endDate == null){
    return null;
  }
  function deepCopy(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      const copy = [];
      for (let i = 0; i < obj.length; i++) {
        copy[i] = deepCopy(obj[i]);
      }
      return copy;
    }
    const copy = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepCopy(obj[key]);
      }
    }
    return copy;
  }
  transactions.sort((a, b) => new Date(a.txn_date) - new Date(b.txn_date))
  // const startingDate = new Date(startDate);
  const currentDate = new Date(startDate);
  // currentDate.setDate(startingDate.getDate() - 1);
  const endDateObj = new Date();
  endDateObj.setMonth(11);
  endDateObj.setDate(31);
  endDateObj.setHours(23,59,59,999);
  // const endDateObj = new Date(endDateObjTest.getFullYear()+"-12-31");
  const daySummaries = {};
  let previousDayRemainingBalances = {};
  let walletList = {};
  walletId.forEach((i,j)=>{
    walletList[i.id] = 0;
  })
  console.log("End Date Initialize: ",endDateObj);
  // Initialize day summaries for the specified date range
  while (currentDate <= endDateObj) {
    const dateString = currentDate.toISOString().split('T')[0];
    daySummaries[dateString] = {
      income_total: 0,
      income_group: {},
      expense_total: 0,
      totalTransaction: 0,
      expense_group: {},
      remainingBalance: 0,
      summaries:0,
      prevSummaries: 0,
      walletBalance: deepCopy(walletList),
      meta: {
        callingID: dateString,
        startDate: dateString,
        endDate: dateString,
      },
    };
    currentDate.setDate(currentDate.getDate() + 1); // Increment the date by one day
  }
  console.log("Date Summaries Initalize: ",daySummaries);
  // Process each transaction
  // const groupResetID = groupId.map((i)=>{
  //   if(i.name.toLocaleLowerCase() == "reset"){
  //     return i.id;
  //   }else{
  //     return null;
  //   }
  // }).filter((i)=>i !== null);
  // let groupResetCheck = null;
  // if(typeof groupResetID[0] !== "undefined"){
  //   groupResetCheck = groupResetID[0];
  // }
  // console.log("Date Summaries Timezone Offset: ",groupResetID);
  console.log("Transactions: before: ",transactions);
  transactions.forEach((transaction) => {
    const txnAmt = parseFloat(parseFloat(transaction.txn_amount).toFixed(2));
    const txnDate = new Date(new Date(transaction.txn_date).getTime() - (new Date(transaction.txn_date).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
    // const daySummaries[txnDate] = ;
    // console.log(txnDate, new Date(transaction.txn_date).getTime(), getTimezoneOffsetInSeconds() * -1, new Date(new Date(transaction.txn_date).getTime() + (getTimezoneOffsetInSeconds() * -1)), transaction);
    if(typeof daySummaries[txnDate].totalTransaction == "undefined"){
      console.log("Total transaction on ",txnDate," is undefined");
    }
    daySummaries[txnDate].totalTransaction++;
    if(transaction.txn_method_type == "payout_recieve"){
    // Calculate income and expense totals
    if (transaction.txn_type === "i") {
      daySummaries[txnDate].income_total = parseFloat(parseFloat(daySummaries[txnDate].income_total + txnAmt).toFixed(2));
    } else if (transaction.txn_type === "e") {
      daySummaries[txnDate].expense_total = parseFloat(parseFloat(daySummaries[txnDate].expense_total + txnAmt).toFixed(2));
    }

    // Calculate income and expense by group
    const txnTag = transaction.txn_tag;
    // if(groupResetCheck !== txnTag){
      if (transaction.txn_type === "i") {
        if (!daySummaries[txnDate].income_group[txnTag]) {
          daySummaries[txnDate].income_group[txnTag] = 0;
        }
        daySummaries[txnDate].income_group[txnTag] = parseFloat(parseFloat(daySummaries[txnDate].income_group[txnTag] + txnAmt).toFixed(2));
      } else if (transaction.txn_type === "e") {
        if (!daySummaries[txnDate].expense_group[txnTag]) {
          daySummaries[txnDate].expense_group[txnTag] = 0;
        }
        daySummaries[txnDate].expense_group[txnTag] = parseFloat(parseFloat(daySummaries[txnDate].expense_group[txnTag] + txnAmt).toFixed(2));
      }
    // }

    // Calculate wallet balances
    const txnWallet = transaction.txn_wallet;
    if (!daySummaries[txnDate].walletBalance[txnWallet]) {
      daySummaries[txnDate].walletBalance[txnWallet] = 0;
    }
    if(transaction.txn_type === "e"){
      daySummaries[txnDate].walletBalance[txnWallet] = parseFloat(parseFloat(daySummaries[txnDate].walletBalance[txnWallet] - txnAmt).toFixed(2));
    }else if(transaction.txn_type === "i"){
      daySummaries[txnDate].walletBalance[txnWallet] = parseFloat(parseFloat(daySummaries[txnDate].walletBalance[txnWallet] + txnAmt).toFixed(2));
    }

    // Calculate remaining balance
    daySummaries[txnDate].summaries = parseFloat(parseFloat(daySummaries[txnDate].income_total).toFixed(2)) - parseFloat(parseFloat(daySummaries[txnDate].expense_total).toFixed(2));
    daySummaries[txnDate].prevSummaries = (previousDayRemainingBalances[txnDate] || 0);
    // daySummaries[txnDate].remainingBalance = parseFloat(parseFloat(
    //   daySummaries[txnDate].income_total -
    //   daySummaries[txnDate].expense_total +
    //   (previousDayRemainingBalances[txnDate] || 0)
    // ).toFixed(2));

    // Update previous day's remaining balance for the current wallet
    // previousDayRemainingBalances[txnDate] = daySummaries[txnDate].remainingBalance;
    }else if(transaction.txn_method_type == "transfer"){
        // console.log(transaction)
        if (!daySummaries[txnDate].walletBalance[transaction.txn_transfer_wallet]) {
            daySummaries[txnDate].walletBalance[transaction.txn_transfer_wallet] = 0;
        }
        daySummaries[txnDate].walletBalance[transaction.txn_transfer_wallet] = parseFloat(parseFloat(daySummaries[txnDate].walletBalance[transaction.txn_transfer_wallet] - txnAmt).toFixed(2));
        if (!daySummaries[txnDate].walletBalance[transaction.txn_reciever_wallet]) {
            daySummaries[txnDate].walletBalance[transaction.txn_reciever_wallet] = 0;
         }
        daySummaries[txnDate].walletBalance[transaction.txn_reciever_wallet] = parseFloat(parseFloat(daySummaries[txnDate].walletBalance[transaction.txn_reciever_wallet] + txnAmt).toFixed(2));
    }
  });
  let pdrbc = {};
  let pdrbid = 0;
  let pdrbidColl = false;
  console.log("beforeProcess: ",daySummaries);
  Object.keys(daySummaries).forEach((i,j)=>{
    if(daySummaries[i].income_total != 0 || daySummaries[i].expense_total != 0){
      if(pdrbid != 0){
        daySummaries[i].remainingBalance = parseFloat(parseFloat(parseFloat(parseFloat(daySummaries[i].summaries).toFixed(2)) + parseFloat(parseFloat(pdrbc[pdrbid].remainingBalance).toFixed(2))).toFixed(2));
        Object.keys(daySummaries[i].walletBalance).forEach((x,l)=>{
          daySummaries[i].walletBalance[x] = parseFloat(parseFloat(daySummaries[i].walletBalance[x] + pdrbc[pdrbid].walletBalance[x]).toFixed(2));
        })
      }else if(pdrbidColl == false){
        pdrbidColl = true;
        daySummaries[i].remainingBalance = parseFloat(parseFloat(daySummaries[i].summaries).toFixed(2));
      }
      pdrbc[i] = daySummaries[i];
      pdrbid = i;
    }else{
      daySummaries[i].remainingBalance = parseFloat(parseFloat(pdrbc[pdrbid].remainingBalance).toFixed(2));
      Object.keys(daySummaries[i].walletBalance).forEach((x,l)=>{
        daySummaries[i].walletBalance[x] = parseFloat(parseFloat(daySummaries[i].walletBalance[x] + pdrbc[pdrbid].walletBalance[x]).toFixed(2));
      })
    }
  })
  console.log("afterProcess: ",daySummaries);
  return daySummaries;
}
const calculateMetaBalance = (a,b)=>{
  let returnObj = a;
  Object.keys(b).forEach(i=>{
      if(typeof returnObj[i] == "undefined"){
          returnObj[i] = parseFloat(parseFloat(b[i]).toFixed(2));
      }else{
          returnObj[i] = parseFloat(parseFloat(returnObj[i] + b[i]).toFixed(2));
      }
  })
  return returnObj;
}
export const transactionsProcessWMY = (parsedTXN) => {
  let parsedReturnMonth = {};
  let parsedReturnWeek = {};
  let parsedReturnYear = {};
  let alltime = {};
  function deepCopy(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      const copy = [];
      for (let i = 0; i < obj.length; i++) {
        copy[i] = deepCopy(obj[i]);
      }
      return copy;
    }
    const copy = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        copy[key] = deepCopy(obj[key]);
      }
    }
    return copy;
  }
  let TXN_ITEM = deepCopy(parsedTXN);
  if(TXN_ITEM == null || TXN_ITEM == undefined || TXN_ITEM == "null" || TXN_ITEM == "undefined" || typeof TXN_ITEM == "null" || typeof TXN_ITEM == "undefined"){
    return null;
  }
  console.log("Process WMY:",TXN_ITEM);
  Object.keys(TXN_ITEM).forEach((i)=>{
    let TextWMY = {};
        let currentDateItem = new Date(i).toISOString().split('T')[0];
        TextWMY["WeekText"]  = formatDateWithTokens(new Date(i),"\\Week-W_Y");
        TextWMY["MonthText"] = formatDateWithTokens(new Date(i),"\\Mo\\nt\\h-F_Y");
        TextWMY["YearText"]  = formatDateWithTokens(new Date(i),"\\Year-Y");
        if(typeof parsedReturnWeek[TextWMY["WeekText"]] == "undefined"){
          parsedReturnWeek[TextWMY["WeekText"]]       = deepCopy(TXN_ITEM[i]);
          parsedReturnWeek[TextWMY["WeekText"]].meta  = {
            callingID: TextWMY["WeekText"],
            startDate: currentDateItem,
            endDate: currentDateItem
          }
        }else{
          parsedReturnWeek[TextWMY["WeekText"]].expense_total     = parseFloat(parseFloat(parsedReturnWeek[TextWMY["WeekText"]].expense_total + TXN_ITEM[i].expense_total).toFixed(2));
          parsedReturnWeek[TextWMY["WeekText"]].income_total      = parseFloat(parseFloat(parsedReturnWeek[TextWMY["WeekText"]].income_total + TXN_ITEM[i].income_total).toFixed(2));
          parsedReturnWeek[TextWMY["WeekText"]].remainingBalance  = parseFloat(parseFloat(TXN_ITEM[i].remainingBalance).toFixed(2));
          parsedReturnWeek[TextWMY["WeekText"]].totalTransaction  = parseFloat(parseFloat(parsedReturnWeek[TextWMY["WeekText"]].totalTransaction + TXN_ITEM[i].totalTransaction).toFixed(2));
          parsedReturnWeek[TextWMY["WeekText"]].expense_group     = calculateMetaBalance(parsedReturnWeek[TextWMY["WeekText"]].expense_group,
          deepCopy(TXN_ITEM[i].expense_group))
          parsedReturnWeek[TextWMY["WeekText"]].income_group      = calculateMetaBalance(parsedReturnWeek[TextWMY["WeekText"]].income_group,
          deepCopy(TXN_ITEM[i].income_group))
          parsedReturnWeek[TextWMY["WeekText"]].walletBalance     = deepCopy(TXN_ITEM[i].walletBalance)
          parsedReturnWeek[TextWMY["WeekText"]].meta.callingID    = TextWMY["WeekText"];
          parsedReturnWeek[TextWMY["WeekText"]].meta.endDate      = currentDateItem;
        }

        if(typeof parsedReturnMonth[TextWMY["MonthText"]] == "undefined"){
          parsedReturnMonth[TextWMY["MonthText"]]       = deepCopy(TXN_ITEM[i]);
          parsedReturnMonth[TextWMY["MonthText"]].meta  = {
            callingID: TextWMY["MonthText"],
            startDate: currentDateItem,
            endDate: currentDateItem
          }
        }else{
          parsedReturnMonth[TextWMY["MonthText"]].expense_total     = parseFloat(parseFloat(parsedReturnMonth[TextWMY["MonthText"]].expense_total + TXN_ITEM[i].expense_total).toFixed(2));
          parsedReturnMonth[TextWMY["MonthText"]].income_total      = parseFloat(parseFloat(parsedReturnMonth[TextWMY["MonthText"]].income_total + TXN_ITEM[i].income_total).toFixed(2));
          parsedReturnMonth[TextWMY["MonthText"]].remainingBalance  = parseFloat(parseFloat(TXN_ITEM[i].remainingBalance).toFixed(2));
          parsedReturnMonth[TextWMY["MonthText"]].totalTransaction  = parseFloat(parseFloat(parsedReturnMonth[TextWMY["MonthText"]].totalTransaction + TXN_ITEM[i].totalTransaction).toFixed(2));
          parsedReturnMonth[TextWMY["MonthText"]].expense_group     = calculateMetaBalance(parsedReturnMonth[TextWMY["MonthText"]].expense_group,
          deepCopy(TXN_ITEM[i].expense_group))
          parsedReturnMonth[TextWMY["MonthText"]].income_group      = calculateMetaBalance(parsedReturnMonth[TextWMY["MonthText"]].income_group,
          deepCopy(TXN_ITEM[i].income_group))
          parsedReturnMonth[TextWMY["MonthText"]].walletBalance     = deepCopy(TXN_ITEM[i].walletBalance)
          parsedReturnMonth[TextWMY["MonthText"]].meta.callingID    = TextWMY["MonthText"];
          parsedReturnMonth[TextWMY["MonthText"]].meta.endDate      = currentDateItem;
        }

        if(typeof parsedReturnYear[TextWMY["YearText"]] == "undefined"){
          parsedReturnYear[TextWMY["YearText"]]       = TXN_ITEM[i];
          parsedReturnYear[TextWMY["YearText"]].meta  = {
            callingID: TextWMY["YearText"],
            startDate: currentDateItem,
            endDate: currentDateItem
          }
        }else{
          parsedReturnYear[TextWMY["YearText"]].expense_total     = parseFloat(parseFloat(parsedReturnYear[TextWMY["YearText"]].expense_total + TXN_ITEM[i].expense_total).toFixed(2));
          parsedReturnYear[TextWMY["YearText"]].income_total      = parseFloat(parseFloat(parsedReturnYear[TextWMY["YearText"]].income_total + TXN_ITEM[i].income_total).toFixed(2));
          parsedReturnYear[TextWMY["YearText"]].remainingBalance  = parseFloat(parseFloat(TXN_ITEM[i].remainingBalance).toFixed(2));
          parsedReturnYear[TextWMY["YearText"]].totalTransaction  = parseFloat(parseFloat(parsedReturnYear[TextWMY["YearText"]].totalTransaction + TXN_ITEM[i].totalTransaction).toFixed(2));
          parsedReturnYear[TextWMY["YearText"]].expense_group     = calculateMetaBalance(parsedReturnYear[TextWMY["YearText"]].expense_group,
          deepCopy(TXN_ITEM[i].expense_group))
          parsedReturnYear[TextWMY["YearText"]].income_group      = calculateMetaBalance(parsedReturnYear[TextWMY["YearText"]].income_group,
          deepCopy(TXN_ITEM[i].income_group))
          parsedReturnYear[TextWMY["YearText"]].walletBalance     = deepCopy(TXN_ITEM[i].walletBalance)
          parsedReturnYear[TextWMY["YearText"]].meta.callingID    = TextWMY["YearText"];
          parsedReturnYear[TextWMY["YearText"]].meta.endDate      = currentDateItem;
        }
        if(typeof alltime["alltime"] == "undefined"){
          alltime["alltime"] = deepCopy(TXN_ITEM[i]);
          alltime["alltime"].meta = {
            callingID: "ALLTIME",
            startDate: currentDateItem,
            endDate: currentDateItem
          }
        }else{
          alltime["alltime"].expense_total    = parseFloat(parseFloat(alltime["alltime"].expense_total + TXN_ITEM[i].expense_total).toFixed(2));
          alltime["alltime"].income_total     = parseFloat(parseFloat(alltime["alltime"].income_total + TXN_ITEM[i].income_total).toFixed(2));
          alltime["alltime"].remainingBalance = parseFloat(parseFloat(TXN_ITEM[i].remainingBalance).toFixed(2));
          alltime["alltime"].totalTransaction = parseFloat(parseFloat(alltime["alltime"].totalTransaction + TXN_ITEM[i].totalTransaction).toFixed(2));
          alltime["alltime"].expense_group    = calculateMetaBalance(alltime["alltime"].expense_group, deepCopy(TXN_ITEM[i].expense_group))
          alltime["alltime"].income_group     = calculateMetaBalance(alltime["alltime"].income_group, deepCopy(TXN_ITEM[i].income_group))
          alltime["alltime"].walletBalance    = deepCopy(TXN_ITEM[i].walletBalance)
          alltime["alltime"].meta.callingID   = "ALLTIME";
          alltime["alltime"].meta.endDate     = currentDateItem;
        }
  });

  return {
    "day":parsedTXN,
    "week": parsedReturnWeek,
    "month": parsedReturnMonth,
    "year": parsedReturnYear,
    "alltime": alltime
  }
}
export const transactionsProcessCate = (groupId,txn)=>{
  if(JSON.stringify(groupId) == "[]"){
    return null;
  }
  // console.log("Transaction Process Category: ",txn);
  let objectTive = {};
  const groupResetID = groupId.map((i)=>{
    if(i.name.toLocaleLowerCase() == "reset"){
      return i.id;
    }else{
      return null;
    }
  }).filter((i)=>i !== null);
  let groupResetCheck = null;
  if(typeof groupResetID[0] !== "undefined"){
    groupResetCheck = groupResetID[0];
  }
  txn.forEach((i,j)=>{
    if(i.txn_method_type =='transfer'){
      
    }else if(i.txn_method_type == "payout_recieve"){
      if(i.txn_tag != ""){
        if(typeof objectTive[i.txn_tag] == "undefined"){
          objectTive[i.txn_tag] = {
            expense: 0,
            income: 0
          };
        }
        if(i.txn_type == "i"){
          objectTive[i.txn_tag].income = parseFloat(parseFloat(objectTive[i.txn_tag].income + i.txn_amount).toFixed(2));
        }else{
          objectTive[i.txn_tag].expense = parseFloat(parseFloat(objectTive[i.txn_tag].expense + i.txn_amount).toFixed(2));
        }
      }
    }
  })
  return objectTive;
}
export const CategoryPrint = ({icon,name,textColor,bgcolor,className="",onClick, showEdit,isCustomIcon = false, customIcon = "fad fa-pencil"})=>{
  return (
    <div onClick={()=>{
      if(showEdit){
        onClick();
      }
    }} className={`rounded-xl p-4 flex flex-row gap-2 hover:scale-[1.001] shadow-xl dark:shadow-white dark:shadow-sm cursor-pointer ${showEdit ? "justify-between items-center" : ""}`} style={{backgroundColor:bgcolor,color:textColor}}>
      {
        !showEdit ? <div><i className={icon} /></div> : "" }
      {
        !showEdit ? <div>{name}</div> : "" }
        {
          showEdit ? 
          <div className="flex flex-row gap-2">
            <div className="text-lg"><i className={icon} /></div>
            <div className="font-semibold">{name}</div>
          </div> : ""
        }
      {/* {
        showEdit ? <div className="rounded-full bg-green-400 aspect-square w-8 flex flex-col items-center justify-center text-black">
          {
            isCustomIcon ? <i className={customIcon} /> : <i className="far fa-pencil" />
          }</div> : ""
      } */}
    </div>
  )
}
export const TXNPrint = ({editClick = ()=>{}, deleteClick = ()=>{}, showInteract = false, cacheData, cardData,showDate = true,resize = false,lang = "en_us"})=>{
  // console.log(cardData);
  
  if(cardData.txn_method_type == "transfer"){
    return (
      <div className={`w-full rounded-xl p-4 flex flex-row justify-between items-center border-[2px] border-purple-400
      afterMS:justify-normal afterMS:gap-4
      `}>
        <div className="flex flex-row gap-2 items-center afterMS:w-full">
          {
            resize ?
          <div className="flex flex-row items-center justify-center aspect-square
           bg-purple-600 text-white rounded-full w-14 h-14 text-3xl">
            <i className={"far fa-money-bill-transfer"} />
          </div>
            :
          <div className="flex flex-row items-center justify-center aspect-square
           bg-purple-600 text-white rounded-full w-20 h-20 text-3xl">
            <i className={"far fa-money-bill-transfer"} />
          </div>
          }
          <div className="text-left">
            <div className="text-lg font-bold sm:tracking-tighter ms:tracking-normal ms:text-base">{lang == "th_th" ? "การโอนเงิน" : "Transferring"} {cardData.txn_amount} {lang == "th_th" ? "บาท" : "THB"}</div>
            <div className="text-base ms:text-sm">From: {findObjectById(cacheData[0].wallet.data,cardData.txn_transfer_wallet).wallet_name}</div>
            <div className="text-base ms:text-sm">To: {findObjectById(cacheData[0].wallet.data,cardData.txn_reciever_wallet).wallet_name}</div>
            {
              showDate ?
              <div className="text-base ms:text-sm">{new Date(cardData.txn_date).toLocaleDateString("th-TH")}</div>
              : ""
            }
          </div>
        </div>
        {
          showInteract ? <div className="flex flex-row gap-2 afterMS:flex-col">
            <div onClick={editClick} className="!w-12 min-h-0 !aspect-square text-lg daisybtn daisybtn-success"><i className="far fa-pencil" /></div>
            <div onClick={deleteClick} className="!w-12 min-h-0 !aspect-square text-lg daisybtn daisybtn-error"><i className="far fa-trash-alt" /></div>
          </div> : ""
        }
      </div>
    )
  }else if(cardData.txn_method_type == "payout_recieve"){
    // console.log("customTag: ", cardData.customtag);
    let cate = cardData?.isCustomtag ? null : findObjectById(cacheData[0].group.data,cardData.txn_tag);
    return (
      <div className={`w-full rounded-xl p-4 flex flex-row justify-between items-center border-[2px] ${cardData.txn_type == "i" ? "border-green-400" : cardData.txn_type == "e" ? "border-red-700" : "border-black"}
       afterMS:justify-normal afterMS:gap-4
      `}>
        <div className="flex flex-row gap-2 items-center afterMS:w-full">
          {
            resize ?
          <div 
          style={{ backgroundColor: cate == null ? cardData.customTag.bgColor : cate.bgColor, color: cate == null ? cardData.customTag.textColor : cate.textColor }}
          className="flex flex-row shadow-sm shadow-white items-center justify-center aspect-square rounded-full w-14 h-14 text-3xl">
            <i className={ cate == null ? customTag.icon : cate.icon} />
          </div>
            :
          <div 
          style={{ backgroundColor: cate == null ? cardData.customTag.bgColor : cate.bgColor, color: cate == null ? cardData.customTag.textColor : cate.textColor }}
          className="flex flex-row shadow-sm shadow-white items-center justify-center aspect-square rounded-full w-20 h-20 text-3xl">
            <i className={cate == null ? cardData.customTag.icon : cate.icon} />
          </div>
          }
          <div className="text-left">
            <div className="text-lg font-bold sm:tracking-tighter ms:tracking-normal ms:text-base">{cardData.txn_title} ({cardData.txn_amount}{lang == "th_th" ? " บาท" : " THB"})</div>
            <div className="text-base ms:text-sm">From: {cardData.txn_wallet == null ? "Your Wallet" : findObjectById(cacheData[0].wallet.data,cardData.txn_wallet).wallet_name}</div>
            {
              showDate ?
              <div className="text-base ms:text-sm">{new Date(cardData.txn_date).toLocaleDateString("th-TH")}</div>
              : ""
            }
          </div>
        </div>
        {
          showInteract ? <div className="flex flex-row gap-2 afterMS:flex-col">
            <div onClick={editClick} className="!w-12 min-h-0 !aspect-square text-lg daisybtn daisybtn-success"><i className="far fa-pencil" /></div>
            <div onClick={deleteClick} className="!w-12 min-h-0 !aspect-square text-lg daisybtn daisybtn-error"><i className="far fa-trash-alt" /></div>
          </div> : ""
        }
      </div>
    )
  }
}

export const getStringDate = (dateObj)=>{
  let item = { 
    "D":new Date(dateObj).toISOString().split('T')[0],
    "W":formatDateWithTokens(new Date(dateObj), "\\Week-W_Y"),
    "M":formatDateWithTokens(new Date(dateObj), "\\Mo\\nt\\h-F_Y"),
    "Y":formatDateWithTokens(new Date(dateObj), "\\Year-Y"),
    "A":"alltime"
  };
  return item;
}
export const getPreviousTimestamps = (dateObj)=>{
  // Get current date
  const currentDate = new Date(dateObj);

  // Calculate previous day
  const previousDay = new Date(currentDate);
  previousDay.setDate(currentDate.getDate() - 1);

  // Calculate previous month
  const previousMonth = new Date(currentDate);
  previousMonth.setMonth(currentDate.getMonth() - 1);

  // Calculate previous year
  const previousYear = new Date(currentDate);
  previousYear.setFullYear(currentDate.getFullYear() - 1);

  // Calculate previous week
  const previousWeek = new Date(currentDate);
  previousWeek.setDate(currentDate.getDate() - 7);

  // Convert dates to timestamps
  const previousDayTimestamp = previousDay.getTime();
  const previousMonthTimestamp = previousMonth.getTime();
  const previousYearTimestamp = previousYear.getTime();
  const previousWeekTimestamp = previousWeek.getTime();

  return {
    D: getStringDate(previousDayTimestamp)["D"],
    M: getStringDate(previousMonthTimestamp)["M"],
    Y: getStringDate(previousYearTimestamp)["Y"],
    W: getStringDate(previousWeekTimestamp)["W"]
  };
}
