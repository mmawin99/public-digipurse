import Head from 'next/head'
import Image from 'next/image';
import React, { useEffect } from 'react'
import TrackingCode from './TrackingCode';

const HeadElement = () => {
  useEffect(() => {
    const config = {
      "asyncLoading": {"enabled": true},
      "autoA11y": {"enabled": true},
      "baseUrl": "https://ka-f.fontawesome.com",
      "baseUrlKit": "https://kit.fontawesome.com",
      "detectConflictsUntil": null,
      "iconUploads": {},
      "id": "901910244242324232492324",
      "license": "pro",
      "method": "js",
      "minify": {"enabled": true},
      "token": "b076de539a",
      "v4FontFaceShim": {"enabled": false},
      "v4shim": {"enabled": false},
      "version": "6.5.1"
    };

    function addCssLink(url) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    }

    // function addFontCss() {
    //   const fontCssUrl = `${config.baseUrlKit}/${config.token}/${config.id}/kit-upload.css`;
    //   addCssLink(fontCssUrl);
    // }

    function addMainCss() {
      const mainCssUrl = `${config.baseUrl}/releases/v${config.version}/css/pro${config.minify.enabled ? '.min' : ''}.css?token=${config.token}`;
      addCssLink(mainCssUrl);
    }

    // addFontCss();
    addMainCss();

    if (config.autoA11y.enabled) {
      const icons = document.querySelectorAll('.fa, .fab, .fas, .far, .fal, .fad, .fak');
      icons.forEach(icon => {
        const title = icon.getAttribute('title');
        icon.setAttribute('aria-hidden', 'true');
        if (title && !icon.nextElementSibling?.classList.contains('sr-only')) {
          const span = document.createElement('span');
          span.innerHTML = title;
          span.classList.add('sr-only');
          icon.parentNode.insertBefore(span, icon.nextSibling);
        }
      });
    }
  }, []);

  
  return (
    <>
        <Head>
        <title>Pursify</title>
        <meta name="title" content="Pursify" />
        <meta name="description" content="Pursify, A Web application to help you to manage your balance." />
        {/* OG  */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pursify.mwn99.com" />
        <meta property="og:title" content="Pursify" />
        <meta property="og:description" content="Pursify, A Web application to help you to manage your balance." />
        <meta property="og:image" content="/image/poster.PNG?v=1.0.1" />
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://pursify.mwn99.com" />
        <meta property="twitter:title" content="Pursify" />
        <meta property="twitter:description" content="Pursify, A Web application to help you to manage your balance." />
        <meta property="twitter:image" content="/image/poster.PNG?v=1.0.1" />

        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1, maximum-scale=1, minimal-ui" />
        {/* <meta name="viewport" content="viewport-fit=cover" /> */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Pursify" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="/image/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="/image/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="/image/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="/image/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="/image/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="/image/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/iPhone_11__iPhone_XR_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" href="/image/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/12.9__iPad_Pro_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/11__iPad_Pro__10.5__iPad_Pro_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/10.9__iPad_Air_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/10.5__iPad_Air_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/10.2__iPad_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" href="/image/splash_screens/8.3__iPad_Mini_landscape.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/image/splash_screens/iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/image/splash_screens/iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/image/splash_screens/iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/image/splash_screens/iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/image/splash_screens/iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/image/splash_screens/iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/iPhone_11__iPhone_XR_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" href="/image/splash_screens/iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/4__iPhone_SE__iPod_touch_5th_generation_and_later_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/12.9__iPad_Pro_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/11__iPad_Pro__10.5__iPad_Pro_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/10.9__iPad_Air_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/10.5__iPad_Air_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/10.2__iPad_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/9.7__iPad_Pro__7.9__iPad_mini__9.7__iPad_Air__9.7__iPad_portrait.png" />
        <link rel="apple-touch-startup-image" media="screen and (device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" href="/image/splash_screens/8.3__iPad_Mini_portrait.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/image/icon/apple-touch-icon.png?v=1.0.1" />
        <link rel="icon" type="image/png" sizes="32x32" href="/image/icon/favicon-32x32.png?v=1.0.1" />
        <link rel="icon" type="image/png" sizes="194x194" href="/image/icon/favicon-194x194.png?v=1.0.1" />
        <link rel="icon" type="image/png" sizes="192x192" href="/image/icon/android-chrome-192x192.png?v=1.0.1" />
        <link rel="icon" type="image/png" sizes="144x144" href="/image/icon/android-chrome-144x144.png?v=1.0.1" />
        <link rel="icon" type="image/png" sizes="16x16" href="/image/icon/favicon-16x16.png?v=1.0.1" />
        <link rel="manifest" href="/image/icon/site.webmanifest?v=1.0.1" />
        <link rel="mask-icon" href="/image/icon/safari-pinned-tab.svg?v=1.0.1" color="#ceaaaa" />
        <link rel="shortcut icon" href="/image/icon/favicon.ico?v=1.0.1" />
        <meta name="application-name" content="Pursify" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/image/icon/mstile-144x144.png?v=1.0.1" />
        <meta name="theme-color" content="#ffffff" />
        {/* <TrackingCode /> */}
        </Head>
    </>
  )
}

export default HeadElement