import { cardsData } from '@/Data/Data';
import React from 'react'
import Card from './test.card';

const Cards = () => {
  return (
    <div className="grid grid-cols-4 Extra2xl:grid-cols-3 ExtraXL:grid-cols-2 semiExtraLarge:grid-cols-1 gap-[10px] md:w-[90%]">
      {cardsData.map((card, id) => {
        return (
          <div className="w-[100%] semiExtraLarge:h-[9rem]" key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
            />
          </div>
        );
      })}
    </div>
  )
}

export default Cards