import { useAuthContext } from '@/context/AuthContext';
import { signInWithFacebook } from '@/firebase/auth/signInWithFacebook';
import { auth, signInWithGoogle } from '@/firebase/auth/signInWithGoogle';
import firebase_app from '@/firebase/config';
import { getAuth, getRedirectResult } from 'firebase/auth';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import LogoExpensify from './../../public/image/icon/ExpensifyLogoFull.svg'

const FormAuthen = ({type,setemail,setpassword,handleForm}) => {
    const router = useRouter();
    const {user,setUser} = useAuthContext();
    useEffect(()=>{
        if (user != null) router.push("/dashboard")
    },[user,router]);
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        const { result, error } = await signInWithGoogle();
        console.log(result,error);
        if (!error) {
            try {
                const credential = result.credential; // Extract the credential from the result
                const signInResult = await signInWithCredential(auth, credential);
                console.log((lang == "th_th" ? "การลงชื่อเข้าใช้ Google สำเร็จ :" : "Google Sign-In Successful :"), signInResult.user);
                // Handle successful Google sign-in
                router.push("/dashboard");
            } catch (e) {
                console.error((lang == "th_th" ? "ข้อผิดพลาดในการลงชื่อเข้าใช้ Google :" : "Google Sign-In Error :"), e);
            }
        } else {
            console.error((lang == "th_th" ? "ข้อผิดพลาดในการลงชื่อเข้าใช้ Google :" : "Google Sign-In Error :"), error);
        }
    };
    // const handleFacebookSignIn = async (e) => {
    //     e.preventDefault();
    //     const { result, error } = await signInWithFacebook();
    //     console.log(result, error);
    //     if (!error) {
    //         try {
    //             const credential = result.credential; // Extract the credential from the result
    //             const signInResult = await signInWithCredential(auth, credential);
    //             console.log("Facebook Sign-In Successful:", signInResult.user);
    //             // Handle successful Facebook sign-in
    //             router.push("/dashboard");
    //         } catch (e) {
    //             console.error("Facebook Sign-In Error:", e);
    //         }
    //     } else {
    //         console.error("Facebook Sign-In Error:", error);
    //     }
    // };
    
  const classInput = `text-sm shadow appearance-none border border-primary-800 
  rounded-full w-[18rem] py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`;
  return (
    <>
        <div className='h-screen w-full
        flex justify-center items-center flex-col gap-2
        '>
             <div className='relative w-24 h-24'>
                    <Image src={LogoExpensify} fill alt={"Expensify Logo"} />
                </div>
                <div className='text-6xl pb-3 font-bold text-transparent bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text'>
                    {lang == "th_th" ? "ใช้จ่าย" : "Expensify"}
                </div>
                <div className='text-white text-lg font-dmsans'>
                 {type == "signup" ? 
                 <>{lang == "th_th" ? "สวัสดี ยินดีต้อนรับสู่" : "Hi, Welcome to"} <span className='pb-3 font-bold text-transparent bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text'>{lang == "th_th" ? "ใช้จ่าย" : "Expensify"}</span>.</> : 
                 <>{lang == "th_th" ? "สวัสดี ยินดีต้อนรับกลับสู๋" : "Hi, Welcome back to"} <span className='pb-3 font-bold text-transparent bg-gradient-to-r from-pink-400 to-amber-400 bg-clip-text'>{lang == "th_th" ? "ใช้จ่าย" : "Expensify"}</span>.</>
                 }
                </div>
            {/* <h1 className='text-3xl font-semibold w-full text-center text-white'>Expensify | {type == "signup" ? "Sign up" : "Sign in"}</h1> */}
            {/* <h3 className='text-lg font-medium text-center text-white'><span className='font-bold font-dmsans'>Expensify</span> is on maintainance mode.</h3> */}
            {/* <h5 className='text-lg font-medium text-center text-white'><span className='font-bold font-dmsans'>Expensify</span> not accept any {type == "signup" ? "Sign up" : "Sign in"} request.</h5> */}
            {/* <Link className='font-semibold bg-amber-300 hover:bg-amber-500 cursor-pointer px-5 py-2 rounded-md' href={"/"}>Go Back</Link> */}
            <div>
            <form onSubmit={handleForm} className="flex flex-col gap-1 w-full">
                <label htmlFor="email">
                    <p className='text-white'>{lang == "th_th" ?"อีเมล" : "Email"}</p>
                </label>
                <input 
                onChange={(e) => setemail(e.target.value)} required 
                type="email" name="email" id="email" placeholder="example@mail.com"
                autoComplete='off'
                className={`${classInput} w-full`}
                />
                <label htmlFor="password">
                    <p className='text-white'>{lang == "th_th" ?"รหัสผ่าน" : "Password"}</p>
                </label>
                <input 
                onChange={(e) => setpassword(e.target.value)} required
                type="password" name="password" id="password" placeholder="***********" 
                autoComplete='off'
                className={`${classInput} w-full`}
                />
                <>
                <button
                className='py-2 bg-blue-700
                hover:bg-blue-900 shadow-inner rounded-full font-bold text-white'
                type="submit">{type == "signup" ? (lang == "th_th" ? "สร้างบัญชี" : "Create an account") : (lang == "th_th" ? "เข้าสู่ระบบ" : "Sign in")}</button>
                    {
                        type == "signup" ? 
                        <>
                        <div className='grid grid-cols-7 place-items-center'>
                    <div className='col-span-3 w-full h-[1px] bg-white'></div>
                    <div className='text-white w-full text-center'>{lang == "th_th" ? "หรือ" : "OR"}</div>
                    <div className='col-span-3 w-full h-[1px] bg-white'></div>
                </div>
                <button
                onClick={handleGoogleSignIn}
                className='py-2 bg-red-500 hover:bg-red-600 shadow-inner 
                flex justify-between px-3 items-center
                rounded-full font-bold text-white'
                type="button">
                    <i className='fab fa-google'></i>
                    <span className='text-center'>{lang == "th_th" ? "ดำเนินการต่อด้วย Google" : "Continue with Google"}</span>
                    <i className=''></i>
                </button>
                        </> 
                        : ""
                    }
                </>
                {/* <button
                onClick={handleFacebookSignIn}
                className='py-2 bg-blue-700 hover:bg-blue-900 shadow-inner 
                flex justify-between px-3 items-center
                rounded-full font-bold text-white'
                type="button">
                    <i className='fab fa-facebook-f'></i>
                    <span className='text-center'>Continue with Facebook</span>
                    <i className=''></i>
                </button> */}
                {/* <div className='flex flex-row gap-2 pl-3'>
                    <span className='text-white'>
                    {type == "signup" ? 
                    <div className='text-left text-xs flex flex-col'>
                        <span>By clicking Sign Up, you agree to our</span>
                        <span><Link href={"/tos/tos"}>Terms</Link> and <Link href={"/tos/policy"}>Privacy Policy</Link>.</span>
                    </div> : ""}
                    </span>
                </div> */}
                <div className='flex flex-row gap-2 justify-center mt-3'>
                <span className='text-white'>
                {type == "signup" ? "Already have an account?" : "Not have an account?"}
                </span>
                <Link className='font-bold text-amber-400 hover:text-amber-600 
                hover:underline hover:underline-offset-8 transition-all duration-500 cursor-pointer' 
                href={type == "signin" ? (lang == "th_th" ? "ลงชื่อ" : "signup") : (lang == "th_th" ? "เข้าสู่ระบบ" : "signin")}>
                    {type == "signin" ? (lang == "th_th" ? "ลงชื่อ" : "Sign up") : (lang == "th_th" ? "เข้าสู่ระบบ" : "Sign In")}
                </Link>
                </div>
                <div className='font-bold text-center text-amber-400 hover:text-amber-600 
                hover:underline hover:underline-offset-8 transition-all duration-500 cursor-pointer'>
                <Link href="/">{lang == "th_th" ? "กลับไป!" : "Go Back!"}</Link>
                </div>
             </form>
            </div>
        </div>
    </>
  )
}

export default FormAuthen