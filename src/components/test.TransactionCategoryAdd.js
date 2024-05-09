import React, { useState } from 'react'
import { ColorPicker } from './ColorPicker';
import { CategoryPrint, MySwal, TXNPrint, TransactionPrint, TransactionTagPrint, writeAnUpdate } from './ModuleCentralClass';
import IconFinder from './IconFinder';
import { getDatabaseName } from './MainConfig';
import { writeData } from '@/firebase/firestore/CRUD';

const TransactionCategoryAdd = ({lang, user,cacheData,backFunction=()=>{}}) => {
    const [isIconSelectorGroupTxnShow,setIsIconSelectorGroupTxnShow] = useState(false);
    const [GroupTxnAddIcon,setGroupTxnAddIcon] = useState("");
    const [GroupTxnAddName,setGroupTxnAddName] = useState("");
    const [GroupTxnAddColor,setGroupTxnAddColor] = useState("rgb(0,0,0)");
    const [GroupTxnAddColorIcon,setGroupTxnAddColorIcon] = useState("rgb(255,255,255)");
    const handleAddGroup = ()=>{
        if(GroupTxnAddIcon == "" || GroupTxnAddName == ""){
            MySwal.fire({
                title: (lang == "th_th" ? "ตรวจไม่พบชื่อหรือไอคอน" :"Name or Icon is not detected."),
                text:(lang == "th_th" ? "คุณไม่ได้ป้อนชื่อและ/หรือไอคอนของคุณ" : "You not entered your name and/or icon."),
                icon:"error",
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
            })
        }else{
            MySwal.fire({
                title: (lang == "th_th" ? "กำลังเพิ่มหมวดหมู่อยู่ระหว่างดำเนินการ..." : "Adding category in process..."),
                text:(lang == "th_th" ? "รอสักครู่ ขั้นตอนนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
                didOpen: () => {
                    MySwal.showLoading()
                    setTimeout(()=>{
                        MySwal.fire({
                            title:(lang == "th_th" ? "คุณต้องการเพิ่มหมวดหมู่นี้หรือไม่?" : "Do you want to add this category?"),
                            html: <div className='w-full flex items-center flex-col pb-2'>
                                                <CategoryPrint onClick={()=>{
                                                }} icon={GroupTxnAddIcon} name={GroupTxnAddName} showEdit={false} textColor={GroupTxnAddColorIcon} bgcolor={GroupTxnAddColor} />
                            <div className='w-full text-left text-base font-bold mt-3'>{lang == "th_th" ? "รายได้มีลักษณะประมาณนี้ : " : "Income Looks like :"}</div>
                            <div className='my-1' />
                                        <TXNPrint
                                            editClick={()=>{}} 
                                            lang={lang}
                                            deleteClick={()=>{}} 
                                            showInteract={false}
                                            cacheData={cacheData} cardData={
                                                {"id":"UeljmIa3DcxDtPEH5wcX",
                                                 "txn_date":"2023-12-21T04:26:36.187Z",
                                                 "txn_amount":20,
                                                 "txn_method_type":"payout_recieve",
                                                 "txn_wallet":null,
                                                 "txn_type":"i",
                                                 "isCustomtag":true,
                                                 "customTag":{
                                                    "icon": GroupTxnAddIcon,
                                                    "textColor": GroupTxnAddColorIcon,
                                                    "bgColor": GroupTxnAddColor
                                                 },
                                                 "txn_title":lang == "th_th" ? "รายได้" : "Income"
                                            }} />
                            <div className='my-2' />
                            <div className='w-full text-left text-base font-bold'>{lang == "th_th" ? "รายจ่ายมีลักษณะประมาณนี้ : " : "Expense Looks like :"}</div>
                            <div className='my-1' />
                            <TXNPrint
                                            editClick={()=>{}} 
                                            lang={lang}
                                            deleteClick={()=>{}} 
                                            showInteract={false}
                                            cacheData={cacheData} cardData={
                                                {"id":"UeljmIa3DcxDtPEH5wcX",
                                                 "txn_date":"2023-12-21T04:26:36.187Z",
                                                 "txn_amount":20,
                                                 "txn_method_type":"payout_recieve",
                                                 "txn_wallet":null,
                                                 "txn_type":"e",
                                                 "isCustomtag":true,
                                                 "customTag":{
                                                    "icon": GroupTxnAddIcon,
                                                    "textColor": GroupTxnAddColorIcon,
                                                    "bgColor": GroupTxnAddColor
                                                 },
                                                 "txn_title":lang == "th_th" ? "รายจ่าย" : "Expense"
                                            }} />
                            </div>,
                             showDenyButton: true,
                             showCancelButton: true,
                             confirmButtonText: (lang == "th_th" ? "เพิ่ม" : "Add"),
                             denyButtonText: (lang == "th_th" ? "ไม่เพิ่ม" : "Don't Add"),
                             cancelButtonText: (lang == "th_th" ? "ยกเลิก" : "Cancel"),
                        }).then((result) => {
                        if (result.isConfirmed) {
                            let DBName = getDatabaseName(user.uid)["group"];
                            MySwal.fire({
                                title: (lang == "th_th" ? "กำลังเพิ่มหมวดหมู่อยู่ระหว่างดำเนินการ..." : "Adding category in process..."),
                                text:(lang == "th_th" ? "รอสักครู่ ขั้นตอนนี้ใช้เวลาไม่นาน" : "Wait a few seconds, This will not take long."),
                                didOpen: () => {
                                    MySwal.showLoading()
                                    writeData(DBName,{
                                        icon:GroupTxnAddIcon,
                                        name:GroupTxnAddName,
                                        textColor:GroupTxnAddColorIcon,
                                        bgColor:GroupTxnAddColor
                                    }).then((res)=>{
                                        console.log(cacheData);
                                        if(res.success == true){
                                        writeAnUpdate(user.uid,cacheData,()=>{
                                            cacheData[2]().then(respCache=>{
                                                if(respCache.success == true){
                                                    setGroupTxnAddIcon("");
                                                    setGroupTxnAddName("");
                                                    setGroupTxnAddColor("rgb(0,0,0)");
                                                    setGroupTxnAddColorIcon("rgb(255,255,255)");
                                                    backFunction();
                                                    MySwal.fire((lang == "th_th" ? "เพิ่มหมวดหมู่เรียบร้อยแล้ว!" : "Added category Successfully!"), '', "success")
                                                }
                                            }).catch((error)=>{
                                                // console.error(error);
                                                MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #2..." : "Error #2 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                            })
                                        })
                                      }
                                    }).catch((error)=>{
                                        console.log(error);
                                      MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #1..." : "Error #1 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                    })
                                },
                                allowOutsideClick:false,
                                allowEscapeKey:false,
                                allowEnterKey:false
                            })
                            } else if (result.isDenied) {
                                MySwal.fire((lang == "th_th" ? "ยกเลิกสำเร็จ!" : "Cancelled Successfully!"), '', 'success')
                            }
                        })
                    },100);
                },
                allowOutsideClick:false,
                allowEscapeKey:false,
                allowEnterKey:false
            })
        }
    }
    // if(isIconSelectorGroupTxnShow){
    //     return (

    //       )
    // }
  return (
    <div className={`w-full pl-4 md:pl-0`}>
        <h1 className='text-[2em] ms:text-[1.75em] sxs:text-[1.55em] 2xs:text-[1.25em] px-4 font-bold w-full md:text-center mb-10 md:mb-6'>
        <span className="text-blue-500 hover:text-blue-600 cursor-pointer" onClick={()=>{
                if(isIconSelectorGroupTxnShow){
                    setIsIconSelectorGroupTxnShow(!isIconSelectorGroupTxnShow);
                }else{
                    backFunction();
                }
            }}>&lt;{lang == "th_th" ? "ย้อนกลับ" : "Back"} </span>
            {
                lang == "th_th" ? "เพิ่มหมวดหมู่" : "Add Category"
            }
        </h1>
        {isIconSelectorGroupTxnShow ? 
            <IconFinder 

            current={GroupTxnAddColorIcon}
            heightDisabled={true} 
            cancelHandle={()=>{ setIsIconSelectorGroupTxnShow(!isIconSelectorGroupTxnShow); }} 
            successHandle={(icon)=>{ setIsIconSelectorGroupTxnShow(!isIconSelectorGroupTxnShow);
                setGroupTxnAddIcon(icon); }} 
            />
        :
        <div className='bg-pink-400/40 p-5 rounded-3xl'>
            <div className={``}>
                <div className='flex flex-row gap-2 pt-2'>
                    <TransactionTagPrint
                    textColor={GroupTxnAddColorIcon}
                    color={GroupTxnAddColor}
                    icon={GroupTxnAddIcon}
                    name={GroupTxnAddName} />
                    <div className='w-10 h-10 bg-golden-400 shadow-md hover:bg-golden-500 shadow-black
                     flex flex-row justify-center items-center rounded-full text-black
                      -translate-x-6 cursor-pointer
                     ' onClick={()=>{setIsIconSelectorGroupTxnShow(!isIconSelectorGroupTxnShow);}}>
                        <i className='fal fa-pencil' />
                    </div>
                </div>
                <div className={`flex flex-col w-full`}>
                    <form className='flex flex-col gap-8'>   
                        {/* Group Name */}
                        <label className="daisyform-control w-full">
                            <div className="daisylabel">
                                <span className="daisylabel-text">{lang == "th_th" ? "ชื่อหมวดหมู่" : "Category name"}</span>
                            </div>
                            <input placeholder={lang == "th_th" ? "ชื่อหมวดหมู่" : "Category name"}
                            onChange={(e) => setGroupTxnAddName(e.target.value)} required 
                            type="text" name="GroupTxnAddName" id="GroupTxnAddName"
                            value={GroupTxnAddName}
                            className="daisyinput daisyinput-bordered w-full" />
                        </label>
                        <div className='grid grid-cols-2 gap-5 ms:grid-cols-1'>
                            {/* Group Icon Color */}
                            <div className="relative w-full">
                                <ColorPicker color={GroupTxnAddColorIcon} onChange={setGroupTxnAddColorIcon} text={lang == "th_th" ? "สีไอคอน" : "Icon Color"} />
                            </div>
                            {/* Group Background Color */}
                            <div className="relative w-full">
                                <ColorPicker color={GroupTxnAddColor} onChange={setGroupTxnAddColor} text={lang == "th_th" ? "สีพื้นหลัง" : "Background Color"} />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 gap-2'>
                            <div onClick={handleAddGroup} className='daisybtn daisybtn-success'> 
                            {lang == "th_th" ? "เพิ่มหมวดหมู่" : "Add Category"}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div> 
        }
    {/* </div> */}
    </div>
  )
}

export default TransactionCategoryAdd