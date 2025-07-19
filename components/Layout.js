import { Footer } from './Footer'
import { Header } from './Header'

export function Layout({ children }) {
  return (
    <div className='flex min-h-screen flex-col overflow-x-hidden'>
      <Header />
      <main className='flex-1 overflow-x-hidden pt-16 md:pt-20'>{children}</main>
      <Footer />
    </div>
  )
}
