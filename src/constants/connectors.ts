import { BscConnector } from '@binance-chain/bsc-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { CHAIN_ID, NETWORK_URL } from './network'

export const injected = new InjectedConnector({})
export const injectedBinance = new BscConnector({})

export const walletConnect = new WalletConnectConnector({
  rpc: {
    [Number(CHAIN_ID)]: NETWORK_URL || 'https://bsc-dataseed.binance.org/',
  },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 10000,
})

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  description: string
  href: string | null
  primary?: true
  mobile?: true
  mobileOnly?: true
  disableIcon: string
  icon: any
  deepLink?: string
}

export enum ConnectorNames {
  MetaMask = 'MetaMask',
  BSC = 'BSC Wallet',
  WalletConnect = 'Wallet Connect',
}

export type ConnectorName = Extract<
  ConnectorNames,
  ConnectorNames.MetaMask | ConnectorNames.BSC | ConnectorNames.WalletConnect
>

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: ConnectorNames.MetaMask,
    icon: require('@/assets/images/connectors/MetaMask.svg'),
    disableIcon: '/images/metamask-disabled.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    mobile: true,
  },
  BSC_WALLET: {
    connector: injectedBinance,
    name: ConnectorNames.BSC,
    icon: require('@/assets/images/connectors/BSC.svg'),
    description: 'Connect to Binance Chain Wallet',
    disableIcon: '/images/injected-binance-disabled.svg',
    href: null,
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: ConnectorNames.WalletConnect,
    icon: require('@/assets/images/connectors/WalletConnect.svg'),
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    disableIcon: '/images/wallet-connect-disabled.svg',
    href: null,
  },
}

export const connectorsByName: { [key in ConnectorNames]: AbstractConnector } = {
  [ConnectorNames.MetaMask]: injected,
  [ConnectorNames.BSC]: injectedBinance,
  [ConnectorNames.WalletConnect]: walletConnect,
}
