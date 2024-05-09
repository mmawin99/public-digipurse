import { useSessionStorage } from '@uidotdev/usehooks';
import React, { useState } from 'react'
import { MySwal } from './ModuleCentralClass';
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);
const Premium = ({lang, user,cacheData, setStripeSession, stripeSession, userSession}) => {
    const router = useRouter();
    const handleCheckout = async () => {
      try {
        const stripe = await stripePromise;
        const productData = {
            payment_method_types: ["card"],
            line_items: [
              {
                price_data: {
                  currency: "thb",
                  product_data: {
                    name: (lang == "th_th" ? "Pursify แพ็คเกจพรีเมียม" : "Pursify Premium Package"),
                    description: (lang == "th_th" ? "อัปเกรดบัญชีของคุณบน Pursify ตลอดชีวิต" : "Lifetime Upgrading your account on Pursify."),
                    images:["https://i.postimg.cc/fWgcH0zM/Untitled-design-1.png"]  
                  },
                  unit_amount: 29900,
                },
                quantity: 1,
              },
            ],
            mode: "payment",
            success_url: `${window.location.origin}/dashboard?premiumPurchase=success`,
            cancel_url: `${window.location.origin}/dashboard?premiumPurchase=cancel`,
            client_reference_id: user.uid
          };
        const response = await fetch("/api/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productData)
        });
  
        const { sessionId } = await response.json();
        setStripeSession(sessionId);
        const { error } = await stripe.redirectToCheckout({
          sessionId,
        });
  
        if (error) {
          MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด (e001)" : "Error occoured (e001)."),"","error");
        }
      } catch (err) {
        console.error((lang == "th_th" ? "เกิดข้อผิดพลาดในการสร้างเซสชันการชำระเงิน :" : "Error in creating checkout session :"), err);
        MySwal.fire((lang == "th_th" ? "เกิดข้อผิดพลาด (e001)" : "Error occoured (e001)."),"","error");
      }
    };
  return (
        <div className='relative col-span-2 md:col-span-1'>
            <div className=' -z-130 fixed w-full h-full'></div>
            <div className='w-full h-full bg-glassDashboard/10 px-4 pt-8'>
                <div className='w-full h-full pt-8 flex flex-col md:justify-center md:pb-5 items-center pr-6 md:pr-0'>
                    <h1  className='text-[2em] px-4 font-bold w-full md:text-center mb-10 md:mb-0 sxs:px-2 sxs:text-[1.5em] md:pb-6'>
                      Pursify {lang == "th_th" ? "พรีเมี่ยม" : "Premium"}
                    </h1>
                    <section className="gap-[32px] flex flex-wrap flex-row justify-center w-full p-[64px] sm:p-[32px] xs:p-[16px] sxs:p-0">
                        <div className="relative min-w-[360px] 3xs:min-w-[90vw] p-[32px] pb-[96px] rounded-3xl border-[1px] border-[#262626] bg-white text-center
                        hover:bg-[#fefefe] dark:bg-black dark:hover:bg-[#101010] transition-all duration-150 hover:scale-[1.01]
                            hover:border-blue-500 cursor-pointer">
                            <div className="mb-[32px] heading">
                                <h4 className='pb-[12px] text-blue-500 text-[24px] font-bold'>{lang == "th_th" ? "ธรรมดา" : "Regular"}</h4>
                                <p className='text-black dark:text-white  text-[14px] font-semibold'>{lang == "th_th" ? "แพคเกจเริ่มต้น" : "Starter plan"}</p>
                            </div>
                            <p className="mb-[32px] text-3xl font-bold">
                            0 {lang == "th_th" ? "บาท" : "THB"}
                            </p>
                            <ul className="mb-[32px] features">
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">10</strong> {lang == "th_th" ? "กระเป๋าสตางค์" : "Wallets"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">30</strong> {lang == "th_th" ? "หมวดหมู่" : "Category"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">2,000</strong> {lang == "th_th" ? "รายการ/เดือน" : "transactions / month"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">2 {lang == "th_th" ? "ปี" : "years"}</strong> {lang == "th_th" ? "การวิเคราะห์ย้อนหลัง" : "backward analytics"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-times pr-6"></i>
                                    <strong className="pr-2">{lang == "th_th" ? "ใช้ฟีเจอร์ใหม่ก่อนใคร" : "Access to new feature"}</strong>
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-times pr-6"></i>
                                    <strong className="pr-2">{lang == "th_th" ? "สนับสนุนผู้สร้าง" : "Support creators"}</strong>
                                </li>
                            </ul>
                            <button className="daisybtn daisybtn-success daisybtn-disabled !text-black dark:!text-white">{lang == "th_th" ? "ซื้อไปแล้ว" : "Purchased"}</button>
                            <div className={`font-medium mt-4 italic text-sm
                            ${userSession.user.statusUser == "premium" ? "hidden" : ""}
                            `}>{lang == "th_th" ? "กำลังใช้แพคเกจนี้อยู่" : "Currently activate this plan"}</div>
                        </div>
                        <div className="relative min-w-[360px] 3xs:min-w-[90vw] p-[32px] pb-[48px] rounded-3xl border-[1px] border-[#262626] bg-white text-center
                        hover:bg-[#fefefe] dark:bg-black dark:hover:bg-[#101010] transition-all duration-150 hover:scale-[1.01]
                            hover:border-golden-600 cursor-pointer">
                            <div className="mb-[32px] heading">
                                <h4 className='pb-[12px] text-golden-600 text-[24px] font-bold'>{lang == "th_th" ? "พรีเมี่ยม" : "Premium"}</h4>
                                <p className='text-black dark:text-white text-[14px] font-semibold'>{lang == "th_th" ? "แพคเกจเพิ่มเติม" : "Additional plan"}</p>
                            </div>
                            <p className={`mb-[32px] text-3xl font-bold`}>
                            <span className={`${userSession.user.statusUser == "premium" ? "line-through" : ""}`}>299 {lang == "th_th" ? "บาท" : "THB"}</span>
                            <sub className={`text-base ${userSession.user.statusUser == "premium" ? "line-through" : ""}`}>/{lang == "th_th" ? "ตลอดชีพ" : "Lifetime"}</sub>
                            </p>
                            <ul className="mb-[32px] features">
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">{lang == "th_th" ? "ไม่จำกัด" : "Unlimited"}</strong> {lang == "th_th" ? "กระเป๋าสตางค์" : "Wallets"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">{lang == "th_th" ? "ไม่จำกัด" : "Unlimited"}</strong> {lang == "th_th" ? "หมวดหมู่" : "Category"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">200,000</strong> {lang == "th_th" ? "รายการ/เดือน" : "transactions / month"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">5 {lang == "th_th" ? "ปี" : "years"}</strong> {lang == "th_th" ? "การวิเคราะห์ย้อนหลัง" : "backward analytics"}
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">{lang == "th_th" ? "ใช้ฟีเจอร์ใหม่ก่อนใคร" : "Access to new feature"}</strong>
                                </li>
                                <li className="text-left flex flex-row">
                                    <i className="fa-solid fa-check pr-6"></i>
                                    <strong className="pr-2">{lang == "th_th" ? "สนับสนุนผู้สร้าง" : "Support creators"}</strong>
                                </li>
                            </ul>
                            <button
                            onClick={()=>{
                                if(userSession.user.statusUser == "premium"){

                                }else{
                                  handleCheckout();
                                }
                            }}
                            className={`daisybtn daisybtn-success bg-golden-400 border-golden-400 hover:bg-golden-500 hover:border-golden-500 ${userSession.user.statusUser == "premium" ? "daisybtn-disabled !text-black dark:!text-white" : ""}`}>
                              {lang == "th_th" ? "ซื้อ" : "Purchase"}
                              {userSession.user.statusUser == "premium" ? 
                                (lang == "th_th" ? "ไปแล้ว" : "d") 
                              : ""}
                            </button>
                            <div className={`font-medium mt-4 italic text-sm
                            ${userSession.user.statusUser == "premium" ? "" : "hidden"}
                            `}>{lang == "th_th" ? "กำลังใช้แพคเกจนี้อยู่" : "Currently activate this plan"}</div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
  )
}

export default Premium