import { Footer } from './Footer'
import { Header } from './Header'

export function Layout({ children }) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Header />
      <main className='flex-1 pt-16 md:pt-20'>{children}</main>
      <Footer />
    </div>
  )
}
