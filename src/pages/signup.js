import FormAuthen from '@/components/FormAuthen'
import HeadElement from '@/components/HeadElement'
import { MySwal } from '@/components/ModuleCentralClass'
import { useAuthContext } from '@/context/AuthContext'
import { signInWithGoogle } from '@/firebase/auth/signInWithGoogle'
import signUp from '@/firebase/auth/signup'
import { signInWithCredential } from 'firebase/auth'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Signup = () => {
    const router = useRouter();
    const {user,setUser} = useAuthContext();
    const swalReact = MySwal;
    const [userEmail,setUserEmail] = useState(null);
    const [userPassword,setUserPassword] = useState(null);
    useEffect(()=>{
        if (user != null) router.push("/dashboard")
    },[user,router]);
    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signUp(userEmail, userPassword);

        if (error) {
            return console.log(error)
        }

        // else successful
        swalReact.fire("Sign up successfully.", "We're taking you to the Dashboard.", "success");
        console.log(result)
        return router.push("/dashboard")
    }
    const handleGoogleSignIn = async (e)=>{
        e.preventDefault();
        const { result, error } = await signInWithGoogle();
        console.log(result,error);
        if (!error) {
            try {
                const credential = result.credential; // Extract the credential from the result
                const signInResult = await signInWithCredential(auth, credential);
                console.log("Google Sign-In Successful:", signInResult.user);
                swalReact.fire("Google Linked successfully.", "We're taking you to the Dashboard.", "success");
                // Handle successful Google sign-in
                router.push("/dashboard");
            } catch (e) {
                console.error("Google Sign-In Error:", e);
                swalReact.fire("Failed #02.", "Please report this to administrator.", "error");
            }
        } else {
            swalReact.fire("Failed #01.", "Please report this to administrator.", "error");
            console.error("Google Sign-In Error:", error);
        }
    }
    return (
    <>
        <div className='w-full h-screen flex justify-center items-center'>
            <div className='daisycard w-[70vw] lg:w-[80vw] p-4 text-primary-content rounded-2xl shadow-lg'>
                <div className='text-6xl pb-3 font-bold w-full text-center'>
                    Sign Up
                </div>
                <div>
                <form onSubmit={handleForm} className="flex flex-col gap-1 w-full">
                    <div className="daisyform-control w-full">
                        <label className="daisylabel">
                        <span className="daisylabel-text">Email</span>
                        </label>
                        <input 
                        onChange={(e) => setUserEmail(e.target.value)} required 
                        type="email" name="email" id="email" placeholder="example@mail.com"
                        autoComplete='off' className={`daisyinput daisyinput-bordered w-full`} />
                    </div>
                    <div className="daisyform-control w-full">  
                        <label className="daisylabel">
                        <span className="daisylabel-text">Password</span>
                        </label>
                        <input 
                        onChange={(e) => setUserPassword(e.target.value)} required
                        type="password" name="password" id="password" placeholder="***********" 
                        autoComplete='off' className={`daisyinput daisyinput-bordered w-full`} />
                    </div>
                    <div className="flex flex-col w-full border-opacity-50 mt-3">
                        <button className='daisybtn daisybtn-success w-full' type="submit">Sign Up</button>
                        <div className="daisydivider">OR</div>
                        <button onClick={handleGoogleSignIn} className='daisybtn daisybtn-error' type="button">
                            <i className='fab fa-google'></i>
                            <span className='text-center'>Continue with Google</span>
                        </button>
                    </div>
                    <div className='flex flex-row gap-2 justify-center mt-3'>
                    <span className='text-firstColor-800'>
                    Already have an account?
                    </span>
                    <Link className='font-bold text-firstColor-900 hover:dropshadow-md
                    hover:underline hover:underline-offset-8 transition-all duration-500 cursor-pointer' 
                    href="/signin">
                        Sign In
                    </Link>
                    </div>
                    <div className='font-bold text-center text-firstColor-900 hover:dropshadow-md
                    hover:underline hover:underline-offset-8 transition-all duration-500 cursor-pointer'>
                    <Link href="/">Go Back!</Link>
                    </div>
                </form>
                </div>
            </div>
        </div>
    </>
    );
}

export default Signup