import CookieConsent from '../components/CookieConsent'
import { Layout } from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <CookieConsent />
    </ThemeProvider>
  )
}
