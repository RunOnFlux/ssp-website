import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import CookieConsent from '../components/CookieConsent'
import { Layout } from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'
import { pageview } from '../lib/gtag'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = url => {
      pageview(url)
    }

    // Track page views on route changes
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>{/* Google Analytics will be loaded by CookieConsent component after consent */}</Head>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        <CookieConsent />
      </ThemeProvider>
    </>
  )
}
