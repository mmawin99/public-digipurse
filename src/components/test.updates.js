import { UpdatesData } from '@/Data/Data';
import Image from 'next/image';
import React from 'react'

const Updates = () => {
  return (
    <div className="Updates
    w-[85%] bg-white rounded-[o.7rem]
    p-[1rem] gap-[1rem] flex flex-col text-[13px]
    ">
    {UpdatesData.map((update) => {
      return (
        <div key={update.name} className="update
        flex gap-[0.5rem]
        ">
          <Image src={update.img} alt="profile" className='
          w-[3.2rem] h-[3.2rem]
          ' />
          <div className="noti">
            <div style={{marginBottom: '0.5rem'}}>
              <span className='font-bold'>{update.name}</span>
              <span> {update.noti}</span>
            </div>
              <span>{update.time}</span>
          </div>
        </div>
      );
    })}
  </div>
  )
}

export default Updates