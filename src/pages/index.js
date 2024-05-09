import React, { useEffect } from 'react'
import HeadElement from '@/components/HeadElement'
import { AuthContextProvider, useAuthContext } from '@/context/AuthContext'
import Image from 'next/image';
import testImage from '../components/images/Logo.png'
import walletImage from '../components/images/wallet.PNG'
import transactionImage from '../components/images/TransactionItem.png'
import calculatorImage from '../components/images/Calculator.png'
import NavBar from '@/components/NavBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useThemeSwitcher from '@/components/hooks/useThemeSwitcher';

const Home = () => {
    // const {user, isLoaded} = useAuthContext();
    const [theme,setTheme] = useThemeSwitcher();
    const { data } = useSession();
    const router = useRouter();
    useEffect(()=>{
        // console.log(data);
        if (data != null){
            // CheckUpdateAvailable(isUpdate,setIsUpdate,user.uid,cacheData,swalReact);
            router.push("/dashboard")
        } 
    },[data,router]);
    return (
        <>
            <HeadElement />
            <NavBar />
            
            <div className="daisyhero min-h-screen bg-base-100">
                <div className='flex flex-row gap-3 items-center md:flex-col'>
                    <div className="daisyhero-content text-center md:order-2">
                        <div className="max-w-md">
                            <div className='text-2xl font-black'>Welcome you to</div>
                            <svg className='LoaderAnimationLoop text-8xl semiLarge:text-8xl
                             md:text-7xl ms:text-6xl font-mont dark:hidden'>
                                <text x="50%" y="50%" dy=".35em" textAnchor="middle">
                                    Pursify
                                </text>
                            </svg>
                            <svg className='hidden LoaderAnimationLoopDark text-8xl semiLarge:text-8xl
                             md:text-7xl ms:text-6xl font-mont dark:block'>
                                <text x="50%" y="50%" dy=".35em" textAnchor="middle">
                                    Pursify
                                </text>
                            </svg>
                            <p className="py-6">A tool for easily recording and summarizing your everyday
                             transactions.</p>
                            <div className='flex flex-row gap-2 justify-center'>
                                {/* <button className="daisybtn daisybtn-success">Get Started</button> */}
                                <Link href="/signin">
                                    <button className="daisybtn daisybtn-success rounded-lg bg-golden-400 border-golden-400 shadow-lg hover:shadow-none hover:border-golden-500 hover:bg-golden-500">Get Started</button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className='flex md:order-1 semiLarge:hidden'>
                        <Image alt='test' className="daisymask daisymask-squircle w-60 h-60 semiLarge:w-48 semiLarge:h-48 md:w-60 md:h-60" src={testImage} />
                    </div>
                </div>
            </div>
            <div className="daisyhero min-h-[60vh] bg-accent text-black dark:bg-base-300 dark:text-white">
                <div className='flex flex-row gap-3 items-center md:flex-col'>
                    <div className='flex md:order-1'>
                        <Image alt='walletFeature' className="daisymask daisymask-squircle w-60 h-60 semiLarge:w-48 semiLarge:h-48 md:w-60 md:h-60" src={walletImage} />
                    </div>
                    <div className="daisyhero-content text-center md:order-2">
                        <div className="max-w-md">
                            <span className='text-2xl ms:text-xl font-bold font-mont'>
                                Wallet
                            </span>
                            <p className="py-6">Organize your money into wallets, 
                            Now easier than ever to manage.</p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="daisyhero min-h-[60vh] bg-base-100">
                <div className='flex flex-row gap-3 items-center md:flex-col'>
                    <div className="daisyhero-content text-center md:order-2">
                        <div className="max-w-md">
                            <span className='text-2xl ms:text-xl font-bold font-mont'>
                                Classify Transactions
                            </span>
                            <p className="py-6"> 
                            It makes financial issues easier. 
                            We&apos;ve made a tools for handling expenses in categories. 
                            No longer need to calculate your expenses.</p>
                        </div>
                    </div>
                    <div className='flex md:order-1'>
                        <Image alt='walletFeature' className="daisymask daisymask-hexagon w-64 h-64 semiLarge:w-52 semiLarge:h-52 md:w-60 md:h-60" src={transactionImage} />
                    </div>

                </div>
            </div>
            <div className="daisyhero min-h-[60vh] bg-accent text-black dark:bg-base-300 dark:text-white">
                <div className='flex flex-row gap-3 items-center md:flex-col'>
                    <div className='flex md:order-1'>
                        <Image alt='walletFeature' className="daisymask daisymask-hexagon-2 w-64 h-64 semiLarge:w-52 semiLarge:h-52 md:w-60 md:h-60" src={calculatorImage} />
                    </div>
                    <div className="daisyhero-content text-center md:order-2">
                        <div className="max-w-md">
                            <span className='text-2xl ms:text-xl font-bold font-mont'>
                                Spending Trends
                            </span>
                            <p className="py-6">Trends in spending is easy to manage and plan expense. 
                            Review to determine when any expenses have increased or decreased. 
                            You may also take actions to improve the way you handle cash as necessary.</p>
                        </div>
                    </div> 
                </div>
            </div>
            <div className="daisyhero min-h-[60vh] bg-base-100">
                    <div className="daisyhero-content text-center md:order-2">
                        <div className="max-w-md">
                            <span className='text-2xl ms:text-xl font-bold font-mont'>
                                Start Journey today!
                            </span>
                            <p className="py-6">Keep monitor along with categorize your transactions. We&apos;ll handle everything else. We&apos;ll help you with calculating your balance remaining. Your weekly, monthly, and yearly spending trends. Create an in-app wallet for organizing the cash in real-life wallets, among more features.</p>
                            <div className='flex flex-row gap-2 justify-center'>
                                <Link href="/signin">
                                    <button className="daisybtn daisybtn-success">Get Started</button>
                                </Link>
                            </div>
                        </div>
                    </div>
            </div>
            {/* Footer */}
            <footer className="daisyfooter p-10 bg-firstColor-800 text-base-content lg:grid lg:grid-cols-2 ms:grid-cols-1 ms:place-content-center ms:text-center">
                <aside className="text-firstColor-100 ms:place-self-center ms:text-left ms:gap-4 
                ms:flex ms:justify-center ms:items-center">
                    <i className="fa-duotone fa-hashtag text-7xl"></i>
                    <div>
                        <p className="font-bold text-lg">Pursify</p>
                        <p className="font-bold text-lg">Record your expense</p>
                        {/* <Link href="https://sites.google.com/mail.kmutt.ac.th/viewbook-cpe101/" className="text-blue-700 dark:text-blue-500 hover:underline">Viewbook</Link> */}
                    </div>
                </aside> 
                <nav className='md:order-3 md:col-span-2 ms:order-2 ms:col-span-1 ms:flex ms:flex-col ms:items-center ms:w-full'>
                    {/* <header className="daisyfooter-title text-white">A3 Group Member</header> 
                    <span className="daisytext cursor-pointer text-white">66070501003 กัญญ์ญาพัชร</span>
                    <span className="daisytext cursor-pointer text-white">66070501021 ตรีธวัฒน์</span>
                    <span className="daisytext cursor-pointer text-white">66070501029 นาวิน</span>
                    <span className="daisytext cursor-pointer text-white">66070501036 พรประทาน</span> */}
                </nav>
                <nav className='ms:flex ms:flex-col ms:items-center ms:w-full md:order-2 ms:order-3'>
                    {/* <header className="daisyfooter-title text-white">Development Tools</header> 
                    <span className="daisytext cursor-pointer text-white">VS Code</span>
                    <span className="daisytext cursor-pointer text-white">Firebase</span>
                    <span className="daisytext cursor-pointer text-white">Github</span> */}
                </nav>
            </footer>
        </>
    )
}

export default Home
