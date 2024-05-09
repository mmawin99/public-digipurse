// import React, { useEffect, useState } from 'react'

// const useThemeSwitcher = () => {

//     const preferDarkQuery = "(prefers-color-scheme: dark)";
//     const [mode, setMode] = useState("");
    
//     useEffect(() => {
//         const metaThemeColor1 = window.document.querySelector('meta[name="msapplication-TileColor"]');
//         const metaThemeColor2 = window.document.querySelector('meta[name="theme-color"]');
//         const mediaQuery = window.matchMedia(preferDarkQuery)
//         const userPref = window.localStorage.getItem('digipurse_theme');

//         const handleChange = () => {
//             if(userPref){
//                 let check = userPref === "dark" ? "dark" : "light"
//                 setMode(check);
//                 if(check === "dark"){
//                     document.documentElement.classList.add("dark")
//                     if(metaThemeColor1){ metaThemeColor1.setAttribute('content','#1b1b1b'); }
//                     if(metaThemeColor2){ metaThemeColor2.setAttribute('content','#1b1b1b'); }
//                 }else{
//                     document.documentElement.classList.remove("dark")
//                     if(metaThemeColor1){ metaThemeColor1.setAttribute('content','#f5f5f5'); }
//                     if(metaThemeColor2){ metaThemeColor2.setAttribute('content','#f5f5f5'); }
		
//                 }
//             }else{
//                 let check = mediaQuery.matches ? "dark" : "light"
//                 setMode(check);

//                 if(check === "dark"){
//                     document.documentElement.classList.add("dark")
//                     if(metaThemeColor1){ metaThemeColor1.setAttribute('content','#1b1b1b'); }
//                     if(metaThemeColor2){ metaThemeColor2.setAttribute('content','#1b1b1b'); }
//                 }else{
//                     document.documentElement.classList.remove("dark")
//                     if(metaThemeColor1){ metaThemeColor1.setAttribute('content','#f5f5f5'); }
//                     if(metaThemeColor2){ metaThemeColor2.setAttribute('content','#f5f5f5'); }
//                 }
//             }
//         }

//         handleChange();

//         mediaQuery.addEventListener("change", handleChange)

//         return () => mediaQuery.removeEventListener("change",handleChange)
//     }, [])
//     useEffect(() => {
//         const metaThemeColor1 = window.document.querySelector('meta[name="msapplication-TileColor"]');
//         const metaThemeColor2 = window.document.querySelector('meta[name="theme-color"]');
//         if(mode === "dark"){
//             window.localStorage.setItem("digipurse_theme","dark")
//             document.documentElement.classList.add("dark")
//             if(metaThemeColor1){ metaThemeColor1.setAttribute('content','#1b1b1b'); }
//             if(metaThemeColor2){ metaThemeColor2.setAttribute('content','#1b1b1b'); }
//         }
//         if(mode === "light"){
//             window.localStorage.setItem("digipurse_theme","light")
//             document.documentElement.classList.remove("dark")
//             if(metaThemeColor1){ metaThemeColor1.setAttribute('content','#f5f5f5'); }
//             if(metaThemeColor2){ metaThemeColor2.setAttribute('content','#f5f5f5'); }
//         }
//     }, [mode])
    

//  return [mode,setMode]
// }

// export default useThemeSwitcher

import React, { useEffect, useState } from 'react';

const useThemeSwitcher = () => {
    const preferDarkQuery = "(prefers-color-scheme: dark)";
    const [theme, setTheme] = useState('');

    useEffect(() => {
        const mediaQuery = window.matchMedia(preferDarkQuery);
        const userPref = window.localStorage.getItem('digipurse_theme');

        const handleChange = () => {
            // console.log("Handle Change:",userPref,mediaQuery.matches);
            let check = userPref ? userPref : mediaQuery.matches ? "dark" : "light";
            // console.log("Handle Change:",check,userPref,mediaQuery.matches);
            setTheme(check);

            if (check === 'dark') {
                document.documentElement.classList.add('dark');
                document.documentElement.setAttribute('data-theme', 'forest');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.setAttribute('data-theme', 'pastel');

            }
        };

        handleChange();

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        // console.log("themeDaFuck:",theme);
        if (theme === 'dark') {
            window.localStorage.setItem('digipurse_theme', 'dark');
            document.documentElement.classList.add('dark');
            document.documentElement.setAttribute('data-theme', 'forest');
        } else if(theme === "light") {
            window.localStorage.setItem('digipurse_theme', 'light');
            document.documentElement.classList.remove('dark');
            document.documentElement.setAttribute('data-theme', 'pastel');
        }    
    }, [theme]);

    return [theme, setTheme];
};

export default useThemeSwitcher;