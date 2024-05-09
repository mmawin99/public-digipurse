import React, { useState } from 'react'
import Logo from '../imgs/logo.png';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { SidebarData } from '@/Data/Data';
import Link from 'next/link';
const SideBar = ({lang, selected,setSelected}) => {
    const [expanded, setExpaned] = useState(true);
    const sidebarVariants = {
        true: {
          left : '0'
        },
        false:{
          left : '-60%'
        }
      }
  return (
    <>
    <div className="
    hidden
    md:hidden
    md:fixed md:top-[2rem]
    md:left-[60%]
    md:bg-[#ccb6b6]
    md:p-[10px]
    md:rounded-[10px]
    md:z-[9] cursor-pointer" 
    style={{left: '5%'}}
    onClick={()=> {
        setExpaned(!expanded)
    }}>
      <i className="fa-solid fa-bars"></i>
    </div>
  <motion.div className='flex flex-col relative
   pt-[4rem] transition-all duration-300 ease-in-out
   bg-pink-500/10
   dark:bg-transparent
   md:hidden md:z-[9] md:bg-[rgb(255,224,224)]
   md:w-[55%] md:pr-[1rem] md:h-[100%]
  '
  >

    {/* logo */}
    <div className="flex flex-col font-bold text-[22px]
     gap-2 items-center md:flex">
      {/* <Image className='w-[3rem] h-[3rem]' src={Logo} alt="logo" /> */}
      <span className='BeforeAfterXL:hidden'>
      Pur<span className=' text-pink-500'>sify</span>
      </span>
      <span className='text-sm BeforeAfterXL:hidden'>
        1.0
      </span>
      {/* <span className='text-blackDashboard dark:text-white semiExtraLarge:flex semiExtraLarge:flex-row semiExtraLarge:-translate-x-3 semiExtraLarge:justify-center'><i className='fad fa-crown' /></span> */}
      {/* <span className=' text-orangeDashboard'><i className='fad fa-crown' /></span> */}
    </div>

    <div className="mt-[4rem] flex flex-col gap-[2rem]">
      {SidebarData.map((item, index) => {
        return (
          <div
            className={`
            flex items-center gap-[1rem] h-[2.5rem]
            relative transition-all duration-300 ease-in-out
            rounded-[.7rem]
            hover:cursor-pointer
            ${selected === index ? 
                "bg-activeItemDashboard ml-0 activeClassSidebar" :
                "ml-[2rem]"}`}
            key={index}
            onClick={() => setSelected(index)}
          >
            <span className='text-[19px] w-[24px] h-[24px] flex justify-center'>
                <i className={`${item.icon}`} />
            </span>
            <span className='text-[15px] BeforeAfterXL:hidden md:block'>{lang == "th_th" ? item.headingThai : item.heading}</span>
          </div>
        );
      })}
      {/* signoutIcon */}
      {/* <Link href="/signout" className="
      flex items-center gap-[.75rem] h-[2.5rem]
      ml-[2rem] transition-all duration-300 ease-in-out
      rounded-[.7rem] text-[20px]
      hover:cursor-pointer
      absolute bottom-[2.3rem] w-[100%]
      md:relative md:mt-[6rem]
      ">
      <i className="fa-solid fa-right-from-bracket"></i>
      </Link> */}
    </div>
  </motion.div>
  </>
  )
}

export default SideBar