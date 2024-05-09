import React from 'react'

const BottomBar = ({lang, dataSidebar = null,selected = null,setSelected = null}) => {
    // console.log(data);
    return (
    <div className='bottom-5 left-0 h-20 w-full hidden md:flex md:fixed flex-col justify-center items-center z-130'>
        {/* <div className='w-full'> */}
            <div className="daisybtm-nav h-20 shadow-inner dark:shadow-gray-700">
                {
                    dataSidebar.map((item, index) => {
                        let className = "";
                        let icon = item.icon;
                        if(selected == index){
                            className +="daisyactive text-blue-700 dark:text-blue-500";
                            icon = icon.replace('far','fas');
                        }else{
                            className +="";
                        }
                        if(item.heading == "Settings" && selected != index){
                            return;
                        }
                        if(item.heading == "Signout" && selected != index){
                            return;
                        }
                        if(item.heading == "Premium" && dataSidebar[selected].heading == "Settings"){
                            return;
                        }
                        if(item.heading == "Premium" && dataSidebar[selected].heading == "Signout"){
                            return;
                        }
                        return (
                            <button className={`${className} text-2xl ms:text-[1.3rem]`} key={item.heading+"_"+index} onClick={()=>{
                                setSelected(index)
                            }}>
                                <i className={`${icon} pt-2 2xs:pt-0`} />
                                <span className="text-sm ms:text-xs sxs:text-[0.675rem] pb-3 2xs:hidden">{lang == "th_th" ? item.headingThai : item.heading}</span>
                            </button>
                        )
                    })
                }
            </div>
        {/* </div> */}
    </div>
  )
}

export default BottomBar