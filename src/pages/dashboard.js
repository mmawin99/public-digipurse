import { SidebarData } from '@/Data/Data'
import { useSession, signIn, signOut } from "next-auth/react"
import HeadElement from '@/components/HeadElement'
import { GlowingSVGIcon } from '@/components/Icon'
// import { LoadingScreenError } from '@/components/LoadingScreen'
import MenuBar, { Addmenu } from '@/components/MenuBar'
import { MySwal, findObjectBySpecific, writeAnUpdate } from '@/components/ModuleCentralClass'
import { useFetchDatabase } from '@/components/hooks/useFetchDatabase'
import BottomBar from '@/components/test.bottomBar'
import Cards from '@/components/test.cards'
import Profiles from '@/components/test.profile'
import RightSide from '@/components/test.rightSide'
import Settings from '@/components/test.settings'
import SideBar from '@/components/test.sidebar'
import Table from '@/components/test.table'
import Wallets from '@/components/test.wallet'
import { useAuthContext } from '@/context/AuthContext'
import { useSessionStorage } from '@uidotdev/usehooks'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Logout from './signout'
import { checkFirebaseUserExists } from '@/firebase/auth/authorizeNextAuthToFirebase'
import signInFirebase from '@/firebase/auth/signin'
import signUp from '@/firebase/auth/signup'
import signOutUser from '@/firebase/auth/signout'
import DashboardHome from '@/components/test.DashboardHome'
import useThemeSwitcher from '@/components/hooks/useThemeSwitcher'
import useSettingSync from '@/components/hooks/useSettingSync'
import useLanguageSwitcher from '@/components/hooks/useLanguageSwitcher'
import TransactionsMain from '@/components/test.TransactionHome'
import Premium from '@/components/test.premium'
import { writeData } from '@/firebase/firestore/CRUD'
import { getDatabaseName } from '@/components/MainConfig'
import Analytics from '@/components/test.analytics'

const Dashboard = () => {
  const [selected, setSelected] = useSessionStorage("digipurse_dash_viewing_page",0);
  const { data } = useSession();
  const {user,setUser} = useAuthContext();
  const router = useRouter();
  useEffect(()=>{
    if (data == null) router.push("/")
  },[data,router]);
  const [UserEmail,SetEmail] = useState("Unknown.");
  const [canuseState,setCanuseState] = useState(null);
  const [theme,setTheme] = useThemeSwitcher();
  const [lang,setLang] = useLanguageSwitcher();
  const cacheData = useFetchDatabase(canuseState, user?.uid);
  const [sessionReference,setSessionReference] = useSessionStorage("stripe_session",null);
  // const [theme,setTheme] = useSettingSync(user?.uid,"digipurse_theme","light",cacheData,()=>{
  //   writeAnUpdate(user?.uid,cacheData);
  //   cacheData[2]().then(respCache=>{
  //     if(respCache.success == true){
  //       // setStateIsUpdate(!stateIsUpdate);
  //         // console.log("Retrieve new update of user data successfully!");
  //         // console.log("Exiting CheckUpdate");
  //     }
  //   });
  // })
  // const [lang,setLang] = useSettingSync(user?.uid,"digipurse_language","ENG",cacheData,()=>{
  //   writeAnUpdate(user?.uid,cacheData);
  //   cacheData[2]().then(respCache=>{
  //     if(respCache.success == true){
  //       // setStateIsUpdate(!stateIsUpdate);
  //         // console.log("Retrieve new update of user data successfully!");
  //         // console.log("Exiting CheckUpdate");
  //     }
  //   });
  // })
  // const [symbolCurrency,setSymbolCurrency] = useSettingSync(user?.uid,"digipurse_symbolCurrency","THB",cacheData,()=>{
  //   writeAnUpdate(user?.uid,cacheData);
  //   cacheData[2]().then(respCache=>{
  //     if(respCache.success == true){
  //       // setStateIsUpdate(!stateIsUpdate);
  //         // console.log("Retrieve new update of user data successfully!");
  //         // console.log("Exiting CheckUpdate");
  //     }
  //   });
  // })
  useEffect(()=>{
    async function fetchPremiumData(e,s){

      const response = await fetch("/api/stripeCheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session: s,
          email:e
        })
      });
      const { status, code, msg, errortext} = await response.json();
      const statusCode = {
        "001":"Payment successfully! \nRefresh this page or Signin again to use benefit!.\n",
        "002":"Payment successfully! \nRefresh this page or Signin again to use benefit!.\n",
        "003":"Error occoured 003.",
        "004":"Error occoured 004.",
        "005":"Error occoured 005.",
        "default":"Error occoured 009."
      }
      let codeD = "";
      if(typeof statusCode[code] == "undefined"){
        codeD = statusCode["default"]+" (Reference: "+sessionReference+")";
      }else{
        codeD = statusCode[code] + " (Reference: "+sessionReference+")";
      }
      if(status == true){
        router.push("/dashboard?refresh");
        // setSelected(7);
      }
      MySwal.fire("Purchased Premium",codeD,status == true ? "success" : "error");
      return ()=>{
        setSessionReference(null);
      }
    }
    if(typeof router.query.premiumPurchase !== "undefined"){
      fetchPremiumData(user.email,sessionReference);
    }
  },[router, user, sessionReference, setSessionReference,setSelected])
  // console.log(cacheData,theme);
  const AuthorizeFunction = async(session)=>{
    const { result, error } = await signUp(session.user.email,session.uniqueEncodeEmail);
    
    if (error) {
      return console.log(error)
    }

  // else successful
    if(typeof result.user.uid != "undefined"){
      MySwal.fire("Authorizing...", "Please wait a few minutes.", "info");
      // console.log("Authorize result: ",result.user.uid)
      let DB = getDatabaseName(result.user.uid);
      if(DB != null && typeof DB["pref"] != "undefined"){
        MySwal.fire("Setting up...", "Please wait a few minutes.", "info");
        writeData(DB["pref"],{
          "meta":"currency",
          "meta_value":"THB"
        }).then((res)=>{
          console.log(res);
          if(res.success == true){
            writeData(DB["pref"],{
              "meta":"createAccount",
              "meta_value": new Date().getTime()
            }).then((res)=>{
              console.log(res);
              if(res.success == true){
                writeAnUpdate(result.user.uid,cacheData,()=>{
                  cacheData[2]().then(respCache=>{
                    if(respCache.success == true){
                      setCanuseState(true);
                      setSelected(0);
                      MySwal.fire("Successfully.", "Pursify is ready!", "success");
                    }
                  }).catch((error)=>{
                    MySwal.fire('Error #2 occoured...','please reports to Administrator','error');
                  })
                })
              }else{ 
                console.info(res);
                MySwal.fire("Setting up failed (e003)", "We can not settings up Pursify for you.", "error");
              }
            }).catch((err)=>{
              console.error(err);
              MySwal.fire("Setting up failed (e002)", "We can not settings up Pursify for you.", "error");
            })
          }else{ 
            console.info(res);
            MySwal.fire("Setting up failed (e001)", "We can not settings up Pursify for you.", "error");
          }
        }).catch((err)=>{
          console.error(err);
          MySwal.fire("Setting up failed (e002)", "We can not settings up Pursify for you.", "error");
        })
      }else{
        MySwal.fire("Setting up failed (e000)", "We can not settings up Pursify for you.", "error");
      }
    }
  }
  useEffect(()=>{
    if (data == null) router.push("/")
    // console.log(data,user);
    if(typeof data?.user?.email !== "undefined"){
      checkFirebaseUserExists(data.user.email,data.uniqueEncodeEmail).then((res)=>{
        // console.log(res);
        if(res.status){
          if(canuseState == null){
            if(typeof user?.uid == "undefined"){
              console.log("NEED to sign in again.");
              signInFirebase(data.user.email,data.uniqueEncodeEmail);
            }
            // signOutUser();
            // setUser(null);
            setCanuseState(true);
          }
        }else{
          setCanuseState(false);
        }
      });
    }else{
      if(data == null){

      }else{
        MySwal.fire("The provider doesn't provided email.","","error");
      }
      // router.push("/");
    }
  // "ya29.a0AfB_byAgdpye4KJOFuMazRtGX6ynDZiHXus1E7mmBHjAcGwiYegwUcnE7KNiQX5BEi5KKpHviED0WaV96HE0TD71XqGUMs4AhKnPPUUM7yAuBCTsyoHKJ6cAv3pAeEWfarorfFfM0915um_TJYYQxuApWphGs3xhz_Y7aCgYKAagSARISFQHGX2MiLibrxWjgLmmYCNEscV1ssg0171"
  //"ya29.a0AfB_byCpFrDFPi69DBQ0gkXO2341twBgAId2k3XEFTFtquZ7blHf9WqOqHo2in2NyJCj9R8eIavFXV-l0jo5Mgup2HKSy41z6ZgqLTr_IXYCW0nyEAfPu3N6r-mZ9QcCPS1uL0vT80GvFC2bi9l8DgMLnIXVILFJGHhaaCgYKAZ0SARISFQHGX2MilssiKgwRGhGNL2g6t-w0YA0171"
},[data,user,router,canuseState,setUser]);
  if(canuseState){
  return (
    <>
    <HeadElement />
    <div className=" text-blackDashboard h-[100vh] -z-110 w-full flex items-center justify-center fixed">
    </div>
    <div className="grid h-[100vh] w-[100vw]
     overflow-hidden 
    grid-cols-appGlass
    BeforeAfterXL:grid-cols-appGlassSemiExtraLarge
    md:grid-cols-appGlassMedium
    overflow-y-auto overflow-x-hidden 
    md:rounded-[0.5rem]
    scrollbar md:pb-20
    ">
      <SideBar lang={lang} selected={selected} setSelected={setSelected}/>
      {
        SidebarData[selected].heading == "Dashboard" ?
        <DashboardHome lang={lang} cacheData={cacheData} user={user} setSelected={setSelected} session={data} />
        : ""
      }
      {
        SidebarData[selected].heading == "Analytic" ?
        <Analytics lang={lang} theme={theme} cacheData={cacheData} user={user} setSelected={setSelected} session={data} />
        : ""
      }
      {
        SidebarData[selected].heading == "Settings" ? 
        <Settings lang={lang} setLang={setLang} cacheData={cacheData} theme={theme} setTheme={setTheme} />
        : ""
      }
      {
        SidebarData[selected].heading == "Transactions" ? 
        <TransactionsMain lang={lang} userSession={data} user={user} cacheData={cacheData} />
        : ""
      }
      {
        SidebarData[selected].heading == "Premium" ? 
        <Premium lang={lang} userSession={data} user={user} cacheData={cacheData} setStripeSession={setSessionReference} stripeSession={sessionReference} />
        : ""
      }
      {
        SidebarData[selected].heading == "Profile" ? 
        <Profiles lang={lang} data={SidebarData} authorize={true} authorizeFunction={()=>{
          console.log("ERROR OCCOURED.");
        }} setSelected={setSelected} />
        : ""
      }
      {
        SidebarData[selected].heading == "Wallets" ? 
        <Wallets lang={lang} user={user} cacheData={cacheData} session={data} />
        : ""
      }
      {
        SidebarData[selected].heading == "Signout" ? 
        <Logout lang={lang} setSelected={setSelected} dataSidebar={SidebarData} />
        : ""
      }
    </div>
    <BottomBar lang={lang} dataSidebar={SidebarData} selected={selected} setSelected={setSelected} />
    </>
  );
  }else{
    //Not Authorize Returned
    //Do not edit if not known
    return (
      <>
      <HeadElement />
      <div className=" text-blackDashboard h-[100vh] -z-110 w-full flex items-center justify-center fixed">
      </div>
      <div className="grid h-[100vh] w-[100vw]
       overflow-hidden 
      grid-cols-appGlass
      semiExtraLarge:grid-cols-appGlassSemiExtraLarge
      md:grid-cols-appGlassMedium
      overflow-y-auto overflow-x-hidden 
      md:rounded-[0.5rem]
      scrollbar md:pb-20
      ">
        <SideBar lang={lang} selected={selected} setSelected={setSelected}/>
        {
          SidebarData[selected].heading == "Profile" ? 
          <Profiles lang={lang} data={SidebarData} authorize={false} authorizeFunction={()=>{
            AuthorizeFunction(data);
          }} setSelected={setSelected} />
          : SidebarData[selected].heading == "Signout" ? 
          <Logout lang={lang} setSelected={setSelected} dataSidebar={SidebarData} />
          : <div className="flex flex-col
          semiExtraLarge:justify-start semiExtraLarge:mt-[2rem] md:items-center place-self-center col-span-2">
          <h1 className='text-[2em] font-bold text-center'
          style={{
            marginBlockStart:"0.67em",
            marginBlockEnd:"0.67em"
          }}
          >Pursify</h1>
          <div className="px-6 w-full">
            <div className={`daisyalert ${canuseState == null ? 'daisyalert-info' : 'daisyalert-warning'}`}>
            {canuseState == null ? 

              <i className='far fa-info-circle text-3xl' />
              :
              <i className='far fa-triangle-exclamation text-3xl' />}
              {canuseState == null ?
              <span className='font-bold'>Wait a few seconds....</span>
              :
              <span className='font-bold'>Please Authorize at profile tab before using our application.</span>}
            </div>
          </div>
          {/* <Cards /> */}
          {/* <Table /> */}
        </div>
        }
      </div>
      <BottomBar lang={lang} dataSidebar={SidebarData} selected={selected} setSelected={setSelected} />
      </>
    );
  }
}
export default Dashboard