import Script from 'next/script'
import React from 'react'

const TrackingCode = () => {
  return (
    <>
    <Script id="clarity_analytics" type="text/javascript">
    {`
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);
          t.async=1;
          t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "joxymg02v4");
    `}
    </Script>
    {/* <!-- Cloudflare Web Analytics --> */}
    <Script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "f1ddc987adf04a0887066074efc17063"}'></Script>
    {/* <!-- End Cloudflare Web Analytics --> */}
    {/* <!-- Google tag (gtag.js) กำลังสร้าง Instance ของ Google analytics ใหม่อยู่ --> */}
    {/* <Script id="gtag_analytics" async src="https://www.googletagmanager.com/gtag/js?id="></Script>
    <Script id="google_analytics">
        {`        
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '');
        `}
    </Script> */}
    </>
  )
}

export default TrackingCode