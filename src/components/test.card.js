import { AnimateSharedLayout, LayoutGroup, motion } from 'framer-motion';
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import { Flat } from '@alptugidin/react-circular-progress-bar';
const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const Card = (props) => {
    const [expanded, setExpanded] = useState(false);
    return (
      // <LayoutGroup>
        // {expanded ? (
          // <ExpandedCard param={props} setExpanded={() => setExpanded(false)} />
        // ) : (
          <CompactCard param={props} setExpanded={() => setExpanded(true)} />
        // )}
      // </LayoutGroup>
    );
  };
  
  // Compact Card
  function CompactCard({ param, setExpanded }) {
    const Png = param.png;
    return (
      <motion.div
        className="flex flex-[1] h-[9rem] rounded-[.7rem] text-white p-[1rem] relative cursor-pointer hover:contrast-125 hover:brightness-75"
        style={{
          background: param.color.backGround,
        }}
        layout
        transition={{
          layout:{
            duration: 1.5,
          }
        }}
        // onClick={setExpanded}
      >
        <div className="flex-1_1 flex flex-col justify-end gap-[1rem]">
          <div className='z-[8] w-[70px] h-[70px] mt-5 drop-shadow-radialProcess'>
            <div className="daisyradial-progress" style={{"--value":param.barValue}} role="progressbar">{param.barValue}%</div>
          </div>
          <span className='text-[17px] font-bold'>{param.title}</span>
        </div>
        <div className="flex-[1] flex flex-col items-end justify-between">
          <div className='w-[20px] h-[20px] text-2xl'>
          <i className={Png} />
          </div>
          <span className='text-[22px] font-bold'>{lang == "th_th" ? "บาท" : "THB"} {param.value}</span>
          <span className='text-[12px]'>Last 24 hours</span>
        </div>
      </motion.div>
    );
  }
  
  // Expanded Card
  function ExpandedCard({ param, setExpanded }) {
    const data = {
      options: {
        chart: {
          type: "area",
          height: "auto",
        },
  
        dropShadow: {
          enabled: false,
          enabledOnSeries: undefined,
          top: 0,
          left: 0,
          blur: 3,
          color: "#000",
          opacity: 0.35,
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
          colors: ["white"],
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
          categories: [
            "2018-09-19T00:00:00.000Z",
            "2018-09-19T01:30:00.000Z",
            "2018-09-19T02:30:00.000Z",
            "2018-09-19T03:30:00.000Z",
            "2018-09-19T04:30:00.000Z",
            "2018-09-19T05:30:00.000Z",
            "2018-09-19T06:30:00.000Z",
          ],
        },
      },
    };
    const containerVariants = {
      hidden: { scale: 0, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    };
    return (
      <motion.div
        className="ExpandedCard absolute w-[60%] h-[70vh] z-[9] left-[13rem] rounded-[1rem] flex flex-col items-center justify-around p-[1rem]
         semiExtraLarge:top-[2rem] semiExtraLarge:h-[45vh]
         semiExtraLarge:left-[6rem]
         md:top-[8rem] md:h-[50%]
         md:left-[25px] md:w-[80%]
        "
        transition={{
          layout:{
            duration: 1.5,
          }
        }}
        style={{
          background: param.color.backGround,
          boxShadow: param.color.boxShadow,
        }}
        layout
      >
        <div style={{ alignSelf: "flex-end", cursor: "pointer", color: "white" }}>
          <i className='far fa-times' onClick={setExpanded} />
        </div>
          <span>{param.title}</span>
        <div className="chartContainer">
          <ApexCharts options={data.options} series={param.series} type="area" />
        </div>
        <span>Last 24 hours</span>
      </motion.div>
    );
  }
  
  export default Card;