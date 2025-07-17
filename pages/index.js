import Head from 'next/head'
import { CTA } from '../components/home/CTA'
import { Features } from '../components/home/Features'
import { Hero } from '../components/home/Hero'
import { Security } from '../components/home/Security'
import { SupportedChains } from '../components/home/SupportedChains'

export default function Home() {
  return (
    <>
      <Head>
        <title>SSP Wallet - Secure, Simple, Powerful Crypto Wallet</title>
        <meta
          name='description'
          content='SSP Wallet is a true 2-of-2 multisignature wallet using BIP48 derivation, requiring both browser extension and mobile device. Features WalletConnect v2, ERC-4337 Account Abstraction with Schnorr signatures, and 13+ blockchain support.'
        />
        <meta
          name='keywords'
          content='crypto wallet, bitcoin wallet, ethereum wallet, BIP48 multi-signature, browser extension, self-custody, blockchain, DeFi, Web3, Account Abstraction, ERC-4337, Schnorr signatures, WalletConnect v2'
        />

        {/* Open Graph */}
        <meta property='og:title' content='SSP Wallet - Secure, Simple, Powerful Crypto Wallet' />
        <meta
          property='og:description'
          content='Experience the future of crypto with SSP Wallet. Multi-signature security, seamless DApp integration, and support for multiple blockchains.'
        />
        <meta property='og:url' content='https://sspwallet.io' />
        <meta property='og:image' content='https://sspwallet.io/logo.svg' />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />

        {/* Twitter */}
        <meta name='twitter:title' content='SSP Wallet - Secure, Simple, Powerful Crypto Wallet' />
        <meta
          name='twitter:description'
          content='Experience the future of crypto with SSP Wallet. Multi-signature security, seamless DApp integration, and support for multiple blockchains.'
        />
        <meta name='twitter:image' content='https://sspwallet.io/logo.svg' />

        {/* Additional SEO */}
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='canonical' href='https://sspwallet.io' />
      </Head>

      <Hero />
      <Features />
      <Security />
      <SupportedChains />
      <CTA />
    </>
  )
}
