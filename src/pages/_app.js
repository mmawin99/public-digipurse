import { AuthContextProvider } from '@/context/AuthContext';
import { SessionProvider } from "next-auth/react"
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import "../../public/flatpickr.css";
import './../../public/react-datepicker.css';
// import 'swiper/swiper.min.css';
import './../styles/swiper-bundle.min.css';
import TrackingCode from '@/components/TrackingCode';
export default function App({ Component, session, ...pageProps}) {
  const router = useRouter();
  return (
    <>
    <TrackingCode />
    <main className={`font-mont w-full min-h-screen`}>
      <SessionProvider session={session}>
        <AuthContextProvider>
          <Component key={router.asPath} {...pageProps} />
        </AuthContextProvider>
      </SessionProvider>
    </main>
    </>
  )
}
