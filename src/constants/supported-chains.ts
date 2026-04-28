export interface SupportedChain {
  symbol: string
  name: string
  network: 'utxo' | 'evm'
}

export const SUPPORTED_CHAINS: readonly SupportedChain[] = [
  { symbol: 'BTC', name: 'Bitcoin', network: 'utxo' },
  { symbol: 'ETH', name: 'Ethereum', network: 'evm' },
  { symbol: 'LTC', name: 'Litecoin', network: 'utxo' },
  { symbol: 'ZEC', name: 'Zcash', network: 'utxo' },
  { symbol: 'RVN', name: 'Ravencoin', network: 'utxo' },
  { symbol: 'DOGE', name: 'Dogecoin', network: 'utxo' },
  { symbol: 'BCH', name: 'Bitcoin Cash', network: 'utxo' },
  { symbol: 'FLUX', name: 'Flux', network: 'utxo' },
  { symbol: 'MATIC', name: 'Polygon', network: 'evm' },
  { symbol: 'BSC', name: 'BNB Smart Chain', network: 'evm' },
  { symbol: 'AVAX', name: 'Avalanche', network: 'evm' },
  { symbol: 'BASE', name: 'Base', network: 'evm' },
] as const
