import FormAuthen from '@/components/FormAuthen'
import HeadElement from '@/components/HeadElement'
import { useSession, signIn, signOut } from "next-auth/react"
import { MySwal } from '@/components/ModuleCentralClass'
import { useAuthContext } from '@/context/AuthContext'
import { signInWithGoogle } from '@/firebase/auth/signInWithGoogle'
// import signIn from '@/firebase/auth/signin'
import { signInWithCredential } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import Image from 'next/image'
import DiGiPurseLogo from '../../public/guard.png'
const Login = () => {
    const router = useRouter();
    const {data} = useSession();
    console.log(router.query);
    let [ERR_DISPLAY,setERR_DISPLAY] = useState(false);
    let [ERR_MSG, setERR_MSG] = useState("");
    // const {user,setUser} = useAuthContext();
    const swalReact = MySwal;
    const [userEmail,setUserEmail] = useState(null);
    const [userPassword,setUserPassword] = useState(null);
    useEffect(()=>{
        // console.log(data);
        if (data != null){
            router.push("/dashboard")
        }else{
            // router.push("/api/auth/signin")
        }
        if(typeof router.query.error != "undefined"){
            let errorCode = {
            default: "Unable to sign in.",
            Signin: "Try signing in with a different account.",
            OAuthSignin: "Try signing in with a different account.",
            OAuthCallbackError: "Try signing in with a different account.",
            OAuthCreateAccount: "Try signing in with a different account.",
            EmailCreateAccount: "Try signing in with a different account.",
            Callback: "Try signing in with a different account.",
            OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
            EmailSignin: "The e-mail could not be sent.",
            CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
            SessionRequired: "Please sign in to access this page."
            };
            setERR_DISPLAY(true);
            if(typeof errorCode[router.query.error] == "undefined"){
                setERR_MSG(errorCode["default"]);
            }else{
                setERR_MSG(errorCode[router.query.error]);
            }
        }
    },[data,router]);
    // const handleForm = async (event) => {
    //     event.preventDefault()

    //     const { result, error,code } = await signIn(userEmail, userPassword);

    //     if (error) {
    //         if (code === "auth/user-not-found") {
    //             // Handle the "user-not-found" error
    //             swalReact.fire("User Not Found", "Please check your email or register a new account.", "error");
    //         } else if (code === "auth/wrong-password") {
    //             // Handle the "wrong-password" error
    //             swalReact.fire("Wrong Password", "Please enter the correct password.", "error");
    //         } else if (code === "auth/invalid-login-credentials") {
    //             //Wrong Credentials
    //             swalReact.fire("Email not registered", "Please go to Sign up page.", "error");
    //         } else {
    //             // Handle other Firebase authentication esrror
    //             swalReact.fire("Error Occurred", "Please try again in a few minutes.", "error");
    //         }
    //         console.log(error);
    //         return null;
    //     }
    //     // else successful
    //     swalReact.fire("Sign in successfully.", "We're taking you to the Dashboard.", "success");
    //     console.log(result)
    //     return router.push("/dashboard")
    // }
    // const handleGoogleSignIn = async (e)=>{
    //     e.preventDefault();
    //     const { result, error } = await signInWithGoogle();
    //     console.log(result,error);
    //     if (!error) {
    //         try {
    //             const credential = result.credential; // Extract the credential from the result
    //             const signInResult = await signInWithCredential(auth, credential);
    //             console.log("Google Sign-In Successful:", signInResult.user);
    //             swalReact.fire("Google Linked successfully.", "We're taking you to the Dashboard.", "success");
    //             // Handle successful Google sign-in
    //             router.push("/dashboard");
    //         } catch (e) {
    //             console.error("Google Sign-In Error:", e);
    //             swalReact.fire("Failed #02.", "Please report this to administrator.", "error");
    //         }
    //     } else {
    //         swalReact.fire("Failed #01.", "Please report this to administrator.", "error");
    //         console.error("Google Sign-In Error:", error);
    //     }
    // }
    return (
    <>
        <HeadElement />
        <div className='w-full h-screen flex justify-center items-center bg-gray-200'>
            <div className='daisycard w-[400px] 2xs:w-[80vw] p-8 text-primary-content bg-white rounded-[2rem] shadow-lg'>
                <div className='flex flex-col items-center gap-10 mb-6'>
                    <div className='w-16 h-16 relative'>
                        <Image alt={"Pursify Logo"} src={DiGiPurseLogo} fill={true} />
                    </div>
                    <div className='font-bold text-xl'>
                        Sign in to continue to Pursify
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    {
                        ERR_DISPLAY ?
                        <div role="alert" className="daisyalert daisyalert-warning">
                            <i className="far text-2xl fa-circle-xmark"></i>
                            <span className='font-bold tracking-tighter'>{ERR_MSG}</span>
                        </div> : ""
                    }
                    <div className='cursor-pointer hover:scale-[1.01] bg-red-300 hover:bg-red-400 text-black p-4 flex items-center gap-4 justify-start text-bold text-lg rounded-xl' onClick={()=>{ signIn('google'); }}>
                        <div className='w-max'><i className='text-2xl fab fa-google' /></div>
                         <div className='w-full text-center font-medium'>Continue with Google</div>
                    </div>
                    <div className='cursor-pointer hover:scale-[1.01] bg-blue-600 hover:bg-blue-700 text-white p-4 flex items-center gap-4 justify-start text-bold text-lg rounded-xl' onClick={()=>{ signIn('discord');}}>
                        <div className='w-max'><i className='text-2xl fab fa-discord' /></div>
                         <div className='w-full text-center font-medium'>Continue with Discord</div>
                    </div>
                    <div className='cursor-pointer hover:scale-[1.01] bg-gray-900 hover:bg-black text-white p-4 flex items-center gap-4 justify-start text-bold text-lg rounded-xl' onClick={()=>{ signIn('github'); }}>
                        <div className='w-max'><i className='text-2xl fab fa-github' /></div>
                         <div className='w-full text-center font-medium'>Continue with Github</div>
                    </div>
                    {/* <div className='cursor-pointer hover:scale-105 bg-green-500 text-white p-4 flex items-center gap-4 justify-start text-bold text-lg rounded-xl' 
                    onClick={()=>{ signIn('line');}}>
                        <i className='text-2xl fab fa-line' />
                         <div className='w-full text-center font-bold'>Sign In with Line</div>
                    </div> */}
                </div>
            </div>
        </div>
    </>
    );
}

export default Login