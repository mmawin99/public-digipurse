import React from 'react'
import Updates from './test.updates'
import CustomerReview from './test.customerReview'

const RightSide = () => {
  return (
    <div className="RightSide flex flex-col w-[95%] mt-[4.5rem] 
     semiExtraLarge:justify-start semiExtraLarge:mt-[3rem]
     md:w-[100%] md:mt-0
    ">
        <div className='flex flex-col items-center'>
            <h3 className='block text-[1.17em] font-bold w-full md:text-center' style={{
                marginBlockEnd:'1em',
                marginBlockStart:'1em',
                marginInlineEnd:"0px",
                marginInlineStart:"0px"
            }}>Wallet Balance</h3>
            <Updates />
        </div>
        {/* <div className='flex flex-col items-center'>
            <h3 className='block text-[1.17em] font-bold w-full md:text-center' style={{
                marginBlockEnd:'1em',
                marginBlockStart:'1em',
                marginInlineEnd:"0px",
                marginInlineStart:"0px"
            }}>Customer Review</h3>
            <CustomerReview />
        </div> */}
    </div>
  )
}

export default RightSide