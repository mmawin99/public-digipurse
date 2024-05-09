import React from 'react'
import HeadElement from '@/components/HeadElement'
import { useRouter } from 'next/router'
const LoadingScene = () => {
    const router = useRouter();
    return (
        <>
            <div className='w-full h-screen flex flex-col justify-center items-center bg-base-100'>
                <div className='LoaderAnimationWrapper w-[50vw] lg:w-[60vw] md:w-[75vw] sm:w-[90vw] ms:w-[95vw]'>
                    <svg className='LoaderAnimation text-8xl ms:text-6xl font-mont'>
    	            	<text x="50%" y="50%" dy=".35em" textAnchor="middle">
    	            		{(router.asPath == "/viewbook" || router.asPath == "viewbook") ? "Viewbook" : "Pursify"}
    	            	</text>
    	            </svg>
                </div>
                <div className={`text-4xl text-firstColor-100 ${(router.asPath == "/viewbook" || router.asPath == "viewbook") ? "hideWhenLoadedViewbook" : "hideWhenLoaded"}`}>
                    {(router.asPath == "/viewbook" || router.asPath == "viewbook") ? "A3 Group | CPE101" : "is loading..."}
                </div>
            </div>
        </>
    )
}

export default LoadingScene;
