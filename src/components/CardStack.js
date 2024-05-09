// pages/index.js
import Image from 'next/image';
import React, { use, useEffect, useState } from 'react';
import WalletWrapper from './WalletWrapper';
import { TailwindColorList } from './TailwindColorList';
import { BackgroundPatternsExport } from './background';
import { formatNumberWithCommas } from './MainConfig';
import { findObjectById } from './ModuleCentralClass';
import { languageModel } from './test.language';

const CardStack = ({swalReact,isHidden,currentWalletBalance = null,initializeCard = null,mode="v",currentSel=null,currentSelOppo=null,notEdit=false,setCurrentWallet=()=>{},setCancel=()=>{},txnType=null}) => {
  // console.log(initializeCard);
  // console.log(currentWalletBalance);
  const WalletPatternList = BackgroundPatternsExport;
  const WalletPatternColor = TailwindColorList;
    function generateArrayWidth(maxValue, counting) {
      if(maxValue > 9) return false;
      // }else{
      let valueString = [];
      let stringCounter = maxValue;
      let stringCounting = 0;
      let lastIndex = 0;
      for (let index = 0; index < counting; index++) {
          if(stringCounting != stringCounter){
              lastIndex = index;
              valueString.push(100 - (index * 10));
              stringCounting++;
          }else{
              valueString.push(100 - (lastIndex * 10));
          }
      }
      return valueString.sort((a,b)=>{return a-b;});
      // }
    }
    function generateTopSequence(maxValue, counting) {
      if(maxValue > 9) return false;
      // }else{
      let valueString = [];
      let stringCounter = maxValue;
      let stringCounting = 0;
      for (let index = 2; index <= counting + 1; index++) {
           if(stringCounting != stringCounter){                
              valueString.push(index * 12);
              stringCounting++;
          }else{
              valueString.push((2 * 12));
          }
      }

      return valueString.sort((a,b)=>{return a-b;});
      // }
    }
    const [cards, setCards] = useState(null);
    const [currentCard, setCurrentCards] = useState(null);
    const [stateTopWidth,setSateTopWidth] = useState([]);
    // [cards == null ? null : cards[cards.length - 1]] 
    // generateTopAndWidthCards(cards == null ? 0 : cards.length);
    const [currentCardNumber, setCurrentCardNumber] = useState(1);
    const rotateCards = () => {
      const rotatedCards = [...cards];
      const lastCard = rotatedCards.pop();
      rotatedCards.unshift(lastCard);
      setCards(rotatedCards);
      setCurrentCardNumber(currentCardNumber === cards.length ? 1 : currentCardNumber + 1);
      // console.log(rotatedCards[rotatedCards.length - 1],"last");
      setCurrentCards([rotatedCards[rotatedCards.length - 1]]);
    };
    const rotateCardsBack = () => {
      const rotatedCards = [...cards];
      const firstCard = rotatedCards.shift();
      rotatedCards.push(firstCard);
      setCards(rotatedCards);
      setCurrentCardNumber(currentCardNumber === 1 ? cards.length : currentCardNumber - 1);
      setCurrentCards([firstCard]);
      // console.log(firstCard,"first");
    };
    useEffect(() => {
      function generateTopAndWidthCards(noc){
        let returnVariable = [];
        let maxIndex = 3;
        let minWidthValue = noc - maxIndex;
        let countingMinWidthValue = 1;
        let widthArray = generateArrayWidth(maxIndex,noc);
        let topArray = generateTopSequence(maxIndex,noc);
        for (let index = 0; index < noc; index++) {
            let useIndex;
            if(index >= maxIndex){
                useIndex = maxIndex;
            }else{
                useIndex = index;
            }
            let top = topArray[index];
            let width = widthArray[index];
            if(noc == 1){
              returnVariable.push({
                number: index + 1,
                top: top,
                width: 100
              })
            }else{
              returnVariable.push({
                  number: index + 1,
                  top: top,
                  width: width
              })
            }
        }
        return returnVariable;
    }
      setCards(initializeCard);
      // if(currentSel == null){
        setCurrentCards([initializeCard == null ? null : initializeCard[initializeCard.length - 1]]);
      // }else{
        // setCurrentCards([findObjectById(initializeCard,currentSel)])
      // }
      setSateTopWidth(generateTopAndWidthCards(initializeCard == null ? 0 : initializeCard.length));
      // console.log(currentCard);
    }, [initializeCard,currentSel])
    const handleSelectWallet=()=>{
      if(currentCard[0].wallet_isLock == true && txnType == "e"){
        // console.log("Locked",currentCard[0].wallet_isLock);
        swalReact.fire(languageModel[lang]["cardStack:lockedWallet"], mode == "v" ? 
        languageModel[lang]["cardStack:lockedWalletDetails"] : (lang == "th_th" ? "กระเป๋าเงินนี้ถูกล็อคสำหรับการโอนเงินออก" : "This wallet is lock for transfer money out.","error"));
      }else{
        // console.log("Not locked",currentCard,currentCard[0].wallet_isLock);
        if(currentCard[0].id === currentSelOppo){
          swalReact.fire((lang == "th_th" ? "ตรวจพบกระเป๋าเงินเดียวกัน" : "Same Wallet Detected"),(lang == "th_th" ? "ตรวจพบกระเป๋าเงินเดียวกัน" : "You can not transfer or recieve on same wallet.","error"));
        }else{
          // console.log(currentCard[0].id);
          setCurrentCardNumber(1);
          setCurrentWallet(currentCard[0].id);
          setCancel();
        }
      }
    }
    const NoWallet = ()=>{
      return (
        <div className='rounded-2xl w-full bg-gradient-to-br 
          from-yellow-400/30 shadow-sm shadow-white via-pink-300/30 to-amber-100/30 h-max aspect-[1011/637]
          flex flex-row justify-center items-center text-white text-xl font-medium tracking-wide font-dmsans
          '>
            {lang == "th_th" ? "คุณไม่มีกระเป๋าสตางค์เลย" : "You don't have any wallet."}
          </div>
      )
    }
  return (
    <div className={`${isHidden ? "fixed -translate-y-[300rem] opacity-0" : ""} w-[90%] mx-auto mb-5`}>
      {
        // console.log(initializeCard,currentCard,)
      }
      {
        cards != null ?
      <div className={`2xs:hidden`}>
        <ul className={`card-list relative ${
          notEdit == true ?
          cards == null ? 
          `h-[17rem]
          xs:h-[16rem]
          betweenExtraSmall:h-[15rem]
          betweenExtraSmall2:h-[14rem]
          betweenExtraSmall3:h-[13rem]
          2xs:h-[12rem]
          ` : cards.length == 1 ? 
          `h-[18.5rem]
          xs:h-[17rem]
          betweenExtraSmall:h-[16rem]
          betweenExtraSmall2:h-[15.5rem]
          betweenExtraSmall3:h-[15rem]
          2xs:h-[14.75rem]
          ` : cards.length == 2 ? 
          `h-[19rem]
          xs:h-[18rem]
          betweenExtraSmall:h-[17rem]
          betweenExtraSmall2:h-[16.5rem]
          betweenExtraSmall3:h-[16rem]
          2xs:h-[15.5rem]
          ` : 
          `h-[20rem] xs:h-[18.5rem]
          betweenExtraSmall:h-[18rem]
          betweenExtraSmall2:h-[17rem]
          betweenExtraSmall3:h-[16.5rem]
          2xs:h-[15.75rem] `
          :
          cards == null ? 
          `h-[21rem]
          xs:h-[20rem]
          betweenExtraSmall:h-[19rem]
          betweenExtraSmall2:h-[18rem]
          betweenExtraSmall3:h-[17rem]
          2xs:h-[16rem]
          ` : cards.length == 1 ? 
          `h-[22.5rem]
          xs:h-[21rem]
          betweenExtraSmall:h-[20rem]
          betweenExtraSmall2:h-[19.5rem]
          betweenExtraSmall3:h-[19rem]
          2xs:h-[18.75rem]
          ` : cards.length == 2 ? 
          `h-[23rem]
          xs:h-[22rem]
          betweenExtraSmall:h-[21rem]
          betweenExtraSmall2:h-[20.5rem]
          betweenExtraSmall3:h-[20rem]
          2xs:h-[19.5rem]
          ` : 
          `h-[24rem] xs:h-[22.5rem]
          betweenExtraSmall:h-[22rem]
          betweenExtraSmall2:h-[21rem]
          betweenExtraSmall3:h-[20.5rem]
          2xs:h-[19.75rem] `} flex flex-row justify-center`}>
          {cards != null ? cards.length == 0 ? <NoWallet /> : cards.map((card, index) => (
            <li
              key={index}
              className={`absolute card w-80 aspect-video rounded-2xl shadow-md shadow-white`}
              style={{top: stateTopWidth[index].top+"px",width:stateTopWidth[index].width+"%" }}
            >
              <WalletWrapper
                WalletName = {card.wallet_name}
                WalletBalance = {"0"}
                WalletIncome = {"0"}
                WalletExpense = {"0"}
                WalletIcon = {card.wallet_icon}
                WalletBackgroundColor = {card.wallet_bg_color}
                WalletTextColor = {card.wallet_text_color}
                WalletPattern = {WalletPatternList[card.wallet_pattern]} 
                WalletPatternColor={card.wallet_pattern_color}
                WalletIsLock={card.wallet_isLock}
              />
            </li>
          )) : 
          <NoWallet />
          }
        </ul>
      </div>:""
      }
            {
        notEdit == false && cards != null ?
      <div className={`hidden 2xs:block`}>
        <ul className={`card-list relative ${
         cards == null ? 
         `h-[17rem]
         xs:h-[16rem]
         betweenExtraSmall:h-[15rem]
         betweenExtraSmall2:h-[14rem]
         betweenExtraSmall3:h-[13rem]
         2xs:h-[12rem]
         ` : cards.length == 1 ? 
         `h-[18.5rem]
         xs:h-[17rem]
         betweenExtraSmall:h-[16rem]
         betweenExtraSmall2:h-[15.5rem]
         betweenExtraSmall3:h-[15rem]
         2xs:h-[14.75rem]
         ` : cards.length == 2 ? 
         `h-[19rem]
         xs:h-[18rem]
         betweenExtraSmall:h-[17rem]
         betweenExtraSmall2:h-[16.5rem]
         betweenExtraSmall3:h-[16rem]
         2xs:h-[15.5rem]
         ` : 
         `h-[20rem] xs:h-[18.5rem]
         betweenExtraSmall:h-[18rem]
         betweenExtraSmall2:h-[17rem]
         betweenExtraSmall3:h-[16.5rem]
         2xs:h-[15.75rem] `} flex flex-row justify-center`}>
          {cards != null ? cards.length == 0 ? <NoWallet /> : cards.map((card, index) => (
            <li
              key={index}
              className={`absolute card w-80 aspect-video rounded-2xl shadow-md shadow-white`}
            >
              <WalletWrapper
                WalletName = {card.wallet_name}
                WalletBalance = {"0"}
                WalletIncome = {"0"}
                WalletExpense = {"0"}
                WalletIcon = {card.wallet_icon}
                WalletBackgroundColor = {card.wallet_bg_color}
                WalletTextColor = {card.wallet_text_color}
                WalletPattern = {WalletPatternList[card.wallet_pattern]} 
                WalletPatternColor={card.wallet_pattern_color}
                WalletIsLock={card.wallet_isLock}
              />
            </li>
          )) : 
          <NoWallet />
          }
        </ul>
      </div>:""
      }
      {
        cards != null ? cards.length == 0 ? "" :
      <div className='w-full flex flex-row justify-between items-center'>
      <button
          className={`left-0 bg-golden-500 text-white font-semibold bg-opacity-50 
          rounded-full w-10 h-10 flex justify-center items-center text-2xl`}
          onClick={rotateCardsBack}
        >
          &lt;
        </button>
        <div className='text-white font-dmsans'>{currentCardNumber} / {cards.length}</div>
        <button
          className={`right-0 bg-golden-500 text-white font-semibold bg-opacity-50 
          rounded-full w-10 h-10 flex justify-center items-center text-2xl`}
          onClick={rotateCards}
        >
          &gt;
        </button>
      </div> : ""
      }
      {
        // console.log()
        cards == null ? "" : cards.length == 0 ? "" : (notEdit == true && mode == "v") ? "" :
        <div className='flex flex-col w-full items-center mt-4'>
          <div className='text-white font-bold text-lg'>{lang == "th_th" ? "ยอดเงินคงเหลือ" : "Available Balance"}</div>
          <div className='text-white font-bold text-4xl'>{formatNumberWithCommas(currentWalletBalance[currentCard[0].id])} {lang == "th_th" ? "บาท" : "THB"}</div>
        </div>
      }
      {
        notEdit == true ?
        <div className='grid grid-cols-2 gap-2 mt-6'>
          <div onClick={setCancel} className='text-center w-full py-1 -translate-y-3 px-3 -mb-3
               hover:bg-red-800 cursor-pointer bg-red-700 rounded-full text-white'> 
              {lang == "th_th" ? "ยกเลิก" : "cancel"}
          </div>
          <div onClick={handleSelectWallet} className='w-full text-center py-1 -translate-y-3 px-3 -mb-3 hover:bg-golden-800 
          cursor-pointer bg-golden-700 rounded-full text-white'> 
              {lang == "th_th" ? "ใช้สิ่งนี้" : "Use this"}
          </div>
      </div>
      : ""
      }
    </div>
  );
};

export default CardStack;