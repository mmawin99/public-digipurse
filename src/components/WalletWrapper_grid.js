import React from 'react'
import { CloudPattern } from './background';
import useThemeSwitcher from './hooks/useThemeSwitcher';
import useLanguageSwitcher from './hooks/useLanguageSwitcher';
function formatNumberWithCommas(number) {
  if(typeof number == "undefined"){
    number = 0;
  }
  const parts = parseFloat(number).toFixed(2).split('.');
  // console.log(parts,number);
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

const GENIncomeExpense = ({total,type})=>{
  return (
    <div className={`flex shadow-sm shadow-white ${type == "income" ? "bg-[#2d8a24]" : "bg-[#912626]"}
     flex-row items-center gap-2 p-3 rounded-xl`}>
      <div className={`w-10 aspect-square 
      ${type == "income" ? "bg-green-700" : "bg-red-700"} text-white
       shadow-xl shadow-black
      flex justify-center items-center rounded-full`}>
        <i className={`far ${type == "income" ? "fa-arrow-up" : "fa-arrow-down"}`} />
      </div>
      <div className={`text-white`}>
        <div className='text-lg font-bold betweenExtraSmall2:text-base'>
          {type == "income" ? "Income" : "Expense"}</div>
        <div className='text-base betweenExtraSmall2:text-sm'>{formatNumberWithCommas(total)} ฿</div>
      </div>
    </div>
  )
}
const WalletWrapperGrid = ({
          WalletBackgroundColor,
          WalletName,
          WalletIcon,
          WalletTextColor,
          WalletPattern,
          WalletPatternColor,
          WalletBalance = 0,
          WalletIsHasLimit,
          WalletLimit,
          WalletIsLock,
          WalletClass = null
        }) => {
          const [lang,setLang] = useLanguageSwitcher();
          const [theme,setTheme] = useThemeSwitcher();
          // console.log(WalletClass,WalletBalance, WalletIncome, WalletExpense);
          const classForThisWallet = Math.random().toString(36).substring(2).split("").map(
            item=>{
                if(item != '1' && item != '2' && item != '8' && item != '9' &&
                  item != '6' && item != '3' && item != '7' && item != '0' &&
                  item != '5' && item != '4'){
                    return item;
                  }else{ return ''; }
            }
        ).join('')
          const currentPatternBackground = WalletPattern.svg.replace(/currentColor/g, WalletPatternColor);
  return (
    <div 
    className={`relative overflow-hidden ${classForThisWallet} w-full aspect-[1011/638] rounded-2xl
    flex flex-col justify-center bg-black/50 z-100 dark:shadow-sm dark:shadow-white
    `}>
      <style dangerouslySetInnerHTML={{
        __html: [
           '.'+ classForThisWallet +':before {',
           '  z-index:-200;',
           '  border-radius:1rem;',
           '  content: "";',
           '  position: absolute;',
           '  top: 0px;',
           '  right: 0px;',
           '  bottom: 0px;',
           '  left: 0px;',
           '  background-position: center;',
           '  background-color: '+WalletBackgroundColor.replaceAll('rgb','rgba').replaceAll(")",",0.95)")+';',
           '  background-image: '+currentPatternBackground+';',
           '  filter: brightness(0.8) blur(1px) contrast(1.5);',
           '}'
          ].join('\n')
        }}>
      </style>
      <div className="absolute w-full h-full rounded-xl -z-10 sm:translate-y-5 beforeSM:translate-y-2 afterMS:translate-y-2 ms:translate-y-4" style={{
        backgroundPosition: "center",
        // backgroundColor: "#ffffff",
        backgroundSize: "contain",
        backgroundImage: theme == "dark" ? CloudPattern("afafaf") : CloudPattern("303030")
      }} />
      <div className='z-10 w-full h-full flex flex-col justify-between p-6 rounded-b-2xl afterMS:p-3 xs:p-2'>
        <div className="flex flex-row gap-2 items-center">
          <div className='text-black bg-white shadow-sm shadow-black w-max p-2 rounded-xl aspect-square text-xl flex
          items-center justify-center sm:text-lg ms:text-base xs:text-sm'>
            <i className={`${WalletIcon}`} />
          </div>

            <div className="font-bold text-black bg-white shadow-white shadow-sm px-4 afterMS:px-3 afterMS:py-1 rounded-full py-2 text-sm xs:text-xs sxs:text-[0.6rem]">{WalletName}</div>
        </div>
        <div className='flex flex-row justify-between'>
          <div className='text-base xs:text-sm dark:text-black text-white sxs:text-xs font-bold flex flex-row items-center gap-4 '>
            { WalletIsLock? <i className='far fa-lock-keyhole' /> : <i className='far fa-lock-keyhole-open' /> } 
            <div className="font-bold text-lg ms:text-base xs:text-sm sxs:text-xs dark:text-black text-white">{WalletBalance}{WalletIsHasLimit ? " / "+WalletLimit : ""} {lang == "th_th" ? "บาท" : "THB"}</div>
          </div>
        </div>
      </div>
      {/* <div className='flex flex-col z-10 justify-center items-center gap-4'>
        <div style={{color:WalletTextColor}} className={`text-8xl sm:text-7xl ms:text-6xl`}>
          
        </div>
        <div style={{color:WalletTextColor}} className={`font-bold text-3xl xl:text-2xl md:text-xl sm:text-lg`}>{WalletName}</div>
      </div>
      <div style={{color:WalletTextColor}} className='absolute bottom-3 font-bold text-lg pl-4'>{
        WalletIsLock? <i className='far fa-lock-keyhole' /> : <i className='far fa-lock-keyhole-open' />
      }
      </div> */}
    </div>
  )
}

export default WalletWrapperGrid