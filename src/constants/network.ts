export const CHAIN_ID = process.env.REACT_APP_CHAIN_ID
export const NETWORK_URL = process.env.REACT_APP_NETWORK_URL

export const BSC_CHAIN_ID = '56'

export enum ChainId {
  GOERLI = 5,
  BSC_TESTNET = 97,
  BSC_MAINNET = 56,
}

export type chainId = Extract<ChainId, ChainId.GOERLI | ChainId.BSC_MAINNET | ChainId.BSC_TESTNET>

export const ChainIdNameMapping: { [key in ChainId]: string } = {
  [ChainId.GOERLI]: 'Goerli',
  [ChainId.BSC_MAINNET]: 'BSC Mainnet',
  [ChainId.BSC_TESTNET]: 'BSC Testnet',
}

export const NETWORK_NAME_MAPPINGS: any = {
  '5': 'Goerli',
  '56': 'BSC Mainnet',
  '97': 'BSC Testnet',
}

export interface NetworkInfo {
  name: string
  id?: string | undefined
  currency?: string
  [k: string]: any
}

export const APP_NETWORKS_SUPPORT: { [key: number]: NetworkInfo } = {
  [BSC_CHAIN_ID]: {
    name: 'BSC Mainnet',
    id: BSC_CHAIN_ID,
    currency: 'BNB',
    networkName: NETWORK_NAME_MAPPINGS[BSC_CHAIN_ID],
    details: {
      chainId: `0x${(+BSC_CHAIN_ID).toString(16)}`,
      chainName: NETWORK_NAME_MAPPINGS[BSC_CHAIN_ID],
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [process.env.REACT_APP_BSC_RPC_URL],
      blockExplorerUrls: [process.env.REACT_APP_BSCSCAN_BASE_URL],
    },
  },
}
