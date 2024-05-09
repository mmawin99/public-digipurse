import { useSessionStorage } from '@uidotdev/usehooks';
import React, { useState } from 'react'
import TransactionAdd from './test.TransactionAdd';
import { CategoryPrint, MySwal, TXNPrint, getStringDate, writeAnUpdate } from './ModuleCentralClass';
import TransactionCategoryAdd from './test.TransactionCategoryAdd';
import useThemeSwitcher from './hooks/useThemeSwitcher';
import TransactionCategoryEdit from './test.TransactionCategoryEdit';
import TransactionEdit from './test.TransacitonEdit';
import { deleteData } from '@/firebase/firestore/CRUD';
import { getDatabaseName } from './MainConfig';
import ReactPaginate from 'react-paginate';
function getPageBorder(perPageSize, totalItem, currentPage) {
    // Calculate total pages
    // console.log("perPageSize, totalItem, currentPage : ",perPageSize, totalItem, currentPage);
    const totalPages = Math.ceil(totalItem / perPageSize);
  
    // Ensure currentPage is within valid range
    currentPage = Math.max(1, Math.min(currentPage, totalPages));
  
    // Calculate start and end indices
    let startIndex = (currentPage - 1) * perPageSize;
    let endIndex = Math.min(startIndex + perPageSize - 1, totalItem - 1);
    
    // Calculate maximum page next from endIndex
    // const totalPages = Math.ceil(totalItem / perPageSize);
    // console.log("startIndex, endIndex, totalPages",startIndex, endIndex, totalPages,);
    return { startIndex, endIndex, totalPages };
}

const TransactionsMain = ({lang, userSession, user, cacheData}) => {
  const [loadPage,setLoadPage] = useSessionStorage("digipurse_transaction_page","main");
  const [editCateID,setEditCateID] = useSessionStorage("digipurse_transaction_cate_edit_id",null);
  const [editTxnID,setEditTxnID] = useSessionStorage("digipurse_transaction_txn_edit_id",null);
  const [cateShow,setCateShow] = useSessionStorage("digipurse_transaction_page_showCategory",true);
  const [txnShow,setTxnShow] = useSessionStorage("digipurse_transaction_page_showTransactions",true);
  const [txnFilterType,setTxnFilterType] = useSessionStorage("digipurse_transaction_page_filter_type","all");
  const [txnFilterCate,setTxnFilterCate] = useSessionStorage("digipurse_transaction_page_filter_cate","all");
  const [txnFilterPerPage,setTxnFilterPerPage] = useSessionStorage("digipurse_transaction_page_filter_perpage","10");
  const [txnFilterTotalItem,setTxnFilterTotalItem] = useSessionStorage("digipurse_transaction_page_filter_itemlength", cacheData[0].txn.data.length);
  const [txnFilterCurrentPage,setTxnFilterCurrentPage] = useSessionStorage("digipurse_transaction_page_filter_totalItem", 1);
//   const [txnFilterCurrentPageBorder,setTxnFilterCurrentPageBorder] = useSessionStorage("digipurse_transaction_page_filter_currentPageBorder", getPageBorder(10, cacheData[0].txn.data.length, 1));
  const [theme,setTheme] = useThemeSwitcher();
  async function updatePage(t,p,c){
    setTxnFilterCurrentPage(1);
    // console.log("Type, perpage, cate",t,p,c);
    // setTimeout(()=>{
        let itemLength = cacheData[0].txn.data.filter((i)=>{
            if(c !== "all"){
                if(typeof i.txn_tag == "undefined") return false;
                if(i.txn_tag !== c) return false;
            }
            if(t !== "all"){
                if(t == "transfer"){
                    if(i.txn_method_type !== "transfer") return false;
                }else if(t == "income"){
                    if(i.txn_method_type == "transfer") return false;
                    if(i.txn_type == "e") return false;
                }else if(t == "expense"){
                    if(i.txn_method_type == "transfer") return false;
                    if(i.txn_type == "i") return false;
                }else{
                    return false;
                }
            }
            return true;
        }).length;
        setTxnFilterTotalItem(itemLength);
        console.log("new itemLength", itemLength);
    // }, 200);
  }
  return (
        <div className='relative col-span-2 md:col-span-1'>
            <div className=' -z-130 fixed w-full h-full'></div>
            <div className='w-full h-full bg-glassDashboard/10 px-4 pt-8'>
                <div className='w-full h-full pt-8 flex flex-col md:justify-start md:pb-5 items-center pr-6 md:pr-0'>
                    {
                        loadPage == "main" ?
                        <h1 className='text-[2em] ms:text-[1.75em] sxs:text-[1.55em] 2xs:text-[1.25em] px-4 font-bold w-full md:text-center mb-10 md:mb-6'>
                        {
                            lang == "th_th" ? "การทำธุรกรรม" : "Transactions"
                        }
                    </h1> : "" 
                    }
                    {
                        loadPage == "main" ?
                    <>
                    <div className={`flex flex-col w-full`}>
                        <div className="flex flex-row justify-between items-center">
                            <div className='flex flex-row gap-2 items-center cursor-pointer select-none' onClick={()=>{
                                    setCateShow(!cateShow);
                                }}>
                                <div className="font-semibold text-lg xs:text-sm">{lang == "th_th" ? "หมวดหมู่" : "Category"}</div>
                                <div className="text-lg sm:text-base ms:text-sm xs:text-xs">
                                    {
                                        cateShow ? <i className='far fa-angle-down' /> : <i className='far fa-angle-up' />
                                    }
                                </div>
                            </div>
                            <div
                            onClick={()=>{
                                if(userSession.user.statusUser == "premium"){
                                    setLoadPage("category_add");
                                }else{
                                    if(cacheData[0].group.data.length >= 30){
                                        MySwal.fire((lang == "th_th" ? "เกินขีดจำกัดแล้ว" : "Limit Exceeded."),(lang == "th_th" ? "ต้องการการอัพเกรดเพื่อสร้างหมวดหมู่เพิ่มเติม" : "Need an upgrade to create more category."),"warning");
                                    }else{
                                        setLoadPage("category_add");
                                    }
                                }
                            }}
                            className="daisybtn daisybtn-success m-1">
                                <i className='far fa-plus text-xl' /> 
                                {/* <span>{lang == "th_th" ? "เพิ่มหมวดหมู่" : "Add Category"}</span> */}
                            </div>
                        </div>
                        {cateShow ? <>
                            <div className="daisydivider" />
                            <div className="grid grid-cols-4 xl:grid-cols-3 beforeAfterSemiLarge:grid-cols-2 md:grid-cols-3 afterSmall:grid-cols-2 afterMS:grid-cols-1 gap-2">
                                {
                                    cacheData[0].group.data.length == 0 ? 
                                    <div>{lang == "th_th" ? "ไม่มีการสร้างหมวดหมู่" : "No category created."}</div> : cacheData[0].group.data.map((i,j)=>{
                                        return (
                                            <CategoryPrint onClick={()=>{
                                                setLoadPage("category_edit");
                                                setEditCateID(j);
                                            }} icon={i.icon} name={i.name} showEdit={true} textColor={i.textColor} bgcolor={i.bgColor} key={"category_"+i.name+"_"+j+"_"+i.id} />
                                            )
                                        })
                                    }
                            </div>
                        </> : "" }
                        <div className="daisydivider" />
                        <div className="flex flex-row justify-between items-center">
                            <div className='flex flex-row gap-2 items-center cursor-pointer select-none beforeAfterMS:h-12' onClick={()=>{
                                    setTxnShow(!txnShow);
                                }}>
                                <div className="font-semibold text-lg xs:text-sm">{lang == "th_th" ? "รายการธุรกรรม" : "Transactions"}</div>
                                <div className="text-lg sm:text-base ms:text-sm xs:text-xs">
                                    {
                                        txnShow ? <i className='far fa-angle-down' /> : <i className='far fa-angle-up' />
                                    }
                                </div>
                            </div>
                            <div className='flex flex-row gap-2'>
                                <div className="daisydropdown daisydropdown-bottom daisydropdown-end">
                                    <div tabIndex={0} role="button" className="daisybtn daisybtn-success m-1">
                                        <i className='far fa-filter text-xl' /> 
                                        {/* Filter */}
                                    </div>
                                    {/* daisydropdown-content */}
                                    <div tabIndex={0} className="daisydropdown-content z-[1] daisycard daisycard-compact 
                                    w-max p-1 shadow bg-blue-600 text-white dark:shadow-blue-500 dark:shadow-sm md:translate-x-8 2xs:translate-x-16">
                                        <div className="daisycard-body">
                                            <h3 className="daisycard-title font-semibold">Filter</h3>
                                            <div>
                                                <div className="text-white mb-2 font-medium">
                                                    Transaction type
                                                </div>
                                                <div className="daisyjoin">
                                                    <input className="py-1 px-3 daisyjoin-item daisybtn daisybtn-warning font-bold" onChange={()=>{
                                                       setTxnFilterType("all");
                                                       updatePage("all", parseInt(txnFilterPerPage), txnFilterCate);
                                                    }} checked={txnFilterType == "all" ? true : false} type="radio" name="TxnTypeOptions" aria-label="All" />
                                                    <input className="py-1 px-3 daisyjoin-item daisybtn daisybtn-warning font-bold" onChange={()=>{
                                                       setTxnFilterType("expense");
                                                       updatePage("expense", parseInt(txnFilterPerPage), txnFilterCate);
                                                    }} checked={txnFilterType == "expense" ? true : false} type="radio" name="TxnTypeOptions" aria-label="Expense" />
                                                    <input className="py-1 px-3 daisyjoin-item daisybtn daisybtn-warning font-bold" onChange={()=>{
                                                       setTxnFilterType("income");
                                                       updatePage("income", parseInt(txnFilterPerPage), txnFilterCate);
                                                    }} checked={txnFilterType == "income" ? true : false} type="radio" name="TxnTypeOptions" aria-label="Income" />
                                                    <input className="py-1 px-3 daisyjoin-item daisybtn daisybtn-warning font-bold" onChange={()=>{
                                                       setTxnFilterType("transfer");
                                                       updatePage("transfer", parseInt(txnFilterPerPage), txnFilterCate);
                                                    }} checked={txnFilterType == "transfer" ? true : false} type="radio" name="TxnTypeOptions" aria-label="Transfer" />
                                                </div>
                                                <div className="text-white my-2 font-medium">
                                                    Category
                                                </div>
                                                <div className="daisyjoin">
                                                    <select defaultValue={txnFilterCate} onChange={(e)=>{
                                                        setTxnFilterCate(e.target.value);
                                                        updatePage(txnFilterType, parseInt(txnFilterPerPage), e.target.value);
                                                    }} className="daisyselect daisyselect-secondary text-black font-bold dark:text-white">
                                                        <option value="all">All</option>
                                                        {
                                                            cacheData[0].group.data.length == 0 ? "" : 
                                                            cacheData[0].group.data.map((i,j)=>{
                                                                return (
                                                                    <option value={i.id} key={"filter_txn_cate_"+i.id}>{i.name}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className="text-white my-2 font-medium">
                                                    Transactions per page
                                                </div>
                                                <div className="daisyjoin">
                                                    <select defaultValue={txnFilterPerPage} onChange={(e)=>{
                                                        setTxnFilterPerPage(e.target.value);
                                                        // setTxnFilterType("all");
                                                        updatePage(txnFilterType, parseInt(e.target.value), txnFilterCate);
                                                        // updatePage();
                                                    }} className="daisyselect daisyselect-secondary text-black font-bold dark:text-white">
                                                        <option value="10">10</option>
                                                        <option value="20">20</option>
                                                        <option value="30">30</option>
                                                        <option value="40">40</option>
                                                        <option value="50">50</option>
                                                    </select>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                onClick={
                                    ()=>{
                                    if(cacheData[0].group.data.length > 0 && cacheData[0].wallet.data.length > 1){
                                        if(userSession.user.statusUser == "premium"){
                                            setLoadPage("transaction_add");
                                        }else{
                                            console.log(cacheData);
                                            if(cacheData[4] == null){
                                                setLoadPage("transaction_add")
                                            }else if(cacheData[4].month[getStringDate(new Date())["M"]].totalTransaction >= 2000){
                                                MySwal.fire((lang == "th_th" ? "เกินขีดจำกัดแล้ว" : "Limit Exceeded."),(lang == "th_th" ? "ต้องการการอัพเกรดเพื่อสร้างธุรกรรมเพิ่มเติมในเดือนนี้" : "Need an upgrade to create more transaction on this month."),"warning");
                                            }else{
                                                setLoadPage("transaction_add");
                                            }
                                        }
                                    }else{
                                        MySwal.fire(
                                            lang === "th_th"
                                            ? {
                                                title: "คุณไม่ตรงตามข้อกำหนด",
                                                text: "คุณต้องมีอย่างน้อย 1 หมวดหมู่และ 2 กระเป๋าเงินจึงจะเพิ่มธุรกรรม",
                                                icon: "warning"
                                                }
                                            : {
                                                title: "You're not meeting the requirements",
                                                text: "You need at least 1 category and 2 wallets to add a transaction.",
                                                icon: "warning"
                                                }
                                        );         
                                    }
                                    }
                                }
                                className="daisybtn daisybtn-success m-1">
                                    <i className='far fa-plus text-xl' /> 
                                    {/* <span>{lang == "th_th" ? "เพิ่มธุรกรรม" : "Add Transaction"}</span> */}
                                </div>
                            </div>
                        </div>
                        <div className="daisydivider" />
                        {txnShow ? <>
                            <div className="grid grid-cols-1 gap-4">
                                {
                                    cacheData[0].txn.data.length == 0 ? 
                                    <div>{lang == "th_th" ? "ไม่มีการสร้างธุรกรรม" : "No transaction created."}</div> : 
                                    <>
                                    <div className="w-full flex flex-col items-center gap-3">
                                        <div>
                                            <div className="daisyjoin">
                                                <button className="daisyjoin-item daisybtn daisybtn-success text-xl" onClick={()=>{
                                                    getPageBorder(parseInt(txnFilterPerPage), txnFilterTotalItem, txnFilterCurrentPage);
                                                    if(txnFilterCurrentPage == 1){
                                                        return;
                                                    }else{
                                                        let toPage = 1;
                                                        setTxnFilterCurrentPage(toPage);
                                                    }
                                                }}>«</button>
                                                <button className="daisyjoin-item daisybtn daisybtn-success text-xl" onClick={()=>{
                                                    getPageBorder(parseInt(txnFilterPerPage), txnFilterTotalItem, txnFilterCurrentPage);
                                                    if(txnFilterCurrentPage == 1){
                                                        return;
                                                    }else{
                                                        let toPage = txnFilterCurrentPage - 1;
                                                        setTxnFilterCurrentPage(toPage);
                                                    }
                                                }}>‹</button>
                                                <button className="daisyjoin-item daisybtn daisybtn-info daisybtn-disabled !bg-green-400 !text-black font-bold">Page {txnFilterCurrentPage} / {getPageBorder(parseInt(txnFilterPerPage), txnFilterTotalItem, txnFilterCurrentPage)["totalPages"]}</button>
                                                <button className="daisyjoin-item daisybtn daisybtn-success text-xl" onClick={()=>{
                                                    
                                                    if(txnFilterCurrentPage == getPageBorder(parseInt(txnFilterPerPage), txnFilterTotalItem, txnFilterCurrentPage)["totalPages"]){
                                                        return;
                                                    }else{
                                                        let toPage = txnFilterCurrentPage + 1;
                                                        setTxnFilterCurrentPage(toPage);
                                                    }
                                                }}>›</button>
                                                <button className="daisyjoin-item daisybtn daisybtn-success text-xl" onClick={()=>{
                                                    
                                                    if(txnFilterCurrentPage == getPageBorder(parseInt(txnFilterPerPage), txnFilterTotalItem, txnFilterCurrentPage)["totalPages"]){
                                                        return;
                                                    }else{
                                                        let toPage = getPageBorder(parseInt(txnFilterPerPage), txnFilterTotalItem, txnFilterCurrentPage)["totalPages"];
                                                        setTxnFilterCurrentPage(toPage);
                                                    }
                                                }}>»</button>
                                            </div>
                                        </div>
                                        <div className="font-bold">Total Show Transaction: {
                                            cacheData[0].txn.data.filter((i)=>{
                                                    if(txnFilterCate !== "all"){
                                                        if(typeof i.txn_tag == "undefined") return false;
                                                        if(i.txn_tag !== txnFilterCate) return false;
                                                    }
                                                    if(txnFilterType !== "all"){
                                                        if(txnFilterType == "transfer"){
                                                            if(i.txn_method_type !== "transfer") return false;
                                                        }else if(txnFilterType == "income"){
                                                            if(i.txn_method_type == "transfer") return false;
                                                            if(i.txn_type == "e") return false;
                                                        }else if(txnFilterType == "expense"){
                                                            if(i.txn_method_type == "transfer") return false;
                                                            if(i.txn_type == "i") return false;
                                                        }else{
                                                            return false;
                                                        }
                                                    }
                                                    return true;
                                                }).length
                                        }</div>
                                    </div>
                                        {
                                            cacheData[0].txn.data.length == 0 ? "No transaction found." : cacheData[0].txn.data.map((i,j)=>{
                                                let iv = i;
                                                iv["jID"] = j;
                                                return iv;
                                            }).filter((i)=>{
                                                    if(txnFilterCate !== "all"){
                                                        if(typeof i.txn_tag == "undefined") return false;
                                                        if(i.txn_tag !== txnFilterCate) return false;
                                                    }
                                                    if(txnFilterType !== "all"){
                                                        if(txnFilterType == "transfer"){
                                                            if(i.txn_method_type !== "transfer") return false;
                                                        }else if(txnFilterType == "income"){
                                                            if(i.txn_method_type == "transfer") return false;
                                                            if(i.txn_type == "e") return false;
                                                        }else if(txnFilterType == "expense"){
                                                            if(i.txn_method_type == "transfer") return false;
                                                            if(i.txn_type == "i") return false;
                                                        }else{
                                                            return false;
                                                        }
                                                    }
                                                    return true;
                                                }).map((i,j)=>{
                                                    // console.log(i.id, j);
                                                    let pageIndex = getPageBorder(parseInt(txnFilterPerPage), txnFilterTotalItem, txnFilterCurrentPage);
                                                    if(!(j >= pageIndex.startIndex && j <= pageIndex.endIndex)){
                                                        return;
                                                    }
                                                    return (
                                                    <TXNPrint editClick={()=>{
                                                        setLoadPage("transaction_edit");
                                                        setEditTxnID(i.jID);
                                                    }} 
                                                    lang={lang}
                                                    deleteClick={()=>{
                                                        MySwal.fire({
                                                            title: (lang == "th_th" ? "คุณแน่ใจไหม?" : "Are you sure?"),
                                                            text: (lang == "th_th" ? "คุณจะไม่สามารถย้อนกลับสิ่งนี้ได้!" : "You won't be able to revert this!"),
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                            confirmButtonColor: "#3085d6",
                                                            cancelButtonColor: "#d33",
                                                            confirmButtonText: (lang == "th_th" ? "ใช่ ลบมัน!" : "Yes, delete it!"),
                                                        }).then((result) => {
                                                            if (result.isConfirmed) {
                                                                let DBName = getDatabaseName(user.uid)["txn"];
                                                                deleteData(DBName,i.id).then((res)=>{
                                                                    if(res.success == true){
                                                                    writeAnUpdate(user.uid,cacheData,()=>{
                                                                        cacheData[2]().then(respCache=>{
                                                                        if(respCache.success == true){
                                                                            MySwal.fire((lang == "th_th" ? "ลบธุรกรรมสำเร็จ!" : "Delete transaction successfully!"),'','success');
                                                                        }
                                                                        }).catch((error)=>{
                                                                            console.log(error);
                                                                        MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #2..." : "Error #2 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                                                        })
                                                                    })
                                                                    }else{
                                                                        console.log(res);
                                                                        MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #3..." : "Error #3 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                                                    }
                                                                }).catch((error)=>{
                                                                    console.log(error);
                                                                    MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด #1..." : "Error #1 occurred..."),(lang == "th_th" ? "กรุณารายงานต่อผู้ดูแลระบบ" : "please reports to Administrator"),'error');
                                                                })
                                                            }
                                                        });
                                                    }} 
                                                    showInteract={true}
                                                    cacheData={cacheData} cardData={i} key={"txn_"+i.id} />
                                                )
                                            })
                                        }
                                        <div className='h-1 w-full my-3'></div>
                                    </>
                                }
                            </div>
                        </> : "" }
                    </div>
                    </>
                    : "" }
                    {
                        loadPage == "transaction_edit" ? <TransactionEdit lang={lang} user={user} backFunction={()=>{
                            setLoadPage("main");
                        }} cacheData={cacheData} editID={editTxnID} /> : ""
                    }
                    {
                        loadPage == "transaction_add" ? <TransactionAdd lang={lang} user={user} backFunction={()=>{
                            setLoadPage("main");
                        }} cacheData={cacheData} /> : ""
                    }
                    {
                        loadPage == "category_add" ? <TransactionCategoryAdd lang={lang} user={user} backFunction={()=>{
                            setLoadPage("main");
                        }} cacheData={cacheData} /> : ""
                    }
                    {
                        loadPage == "category_edit" ? <TransactionCategoryEdit lang={lang} user={user} backFunction={()=>{
                            setLoadPage("main");
                            setEditCateID(null);
                        }} cacheData={cacheData} editID={editCateID} /> : ""
                    }
                </div>
            </div>
        </div>
  )
}

export default TransactionsMain