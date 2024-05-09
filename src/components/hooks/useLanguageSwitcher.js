import React, { useEffect, useState } from 'react'

const useLanguageSwitcher = () => {

    const [lang, setLang] = useState("");
    
    useEffect(() => {
        const userPref = window.localStorage.getItem('digipurse_lang');

        const handleChange = () => {
            if(userPref){
                let check = userPref === "th_th" ? "th_th" : "en_us"
                setLang(check);
            }else{
                let check = "en_us";
                setLang(check);
            }
        }

        handleChange();

        return () => {}
    }, [])
    useEffect(() => {
        if(lang === "th_th"){
            window.localStorage.setItem("digipurse_lang","th_th")
            // document.documentElement.classList.add("dark")
        }
        if(lang === "en_us"){
            window.localStorage.setItem("digipurse_lang","en_us")
            // document.documentElement.classList.remove("dark")
        }
    }, [lang])
    

 return [lang,setLang]
}

export default useLanguageSwitcher