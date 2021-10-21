import { ethers, BigNumber } from 'ethers'
import { CHAIN_ID, NETWORK_URL } from '@/constants/network'
import ERC20_ABI from '@/abi/ERC20.json'

export const beautifyNumber = (num: string | number | null | undefined, dec: number = 2) => {
  if (isNaN(Number(num))) {
    return '0'
  }

  const calcDec = Math.pow(10, dec)
  return (Math.trunc(Number(num || 0) * calcDec) / calcDec).toLocaleString('en-US', {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  })
}

export const maskWalletAddress = (wallet: string | null | undefined) => {
  if (!wallet || wallet.length < 10) {
    return ''
  }

  let r = wallet.substr(5, wallet.length - 9)
  wallet = wallet.replace(r, '***')

  return wallet
}

export const getCurrencyBalance = async (appChainID: string, walletChainID: string, connectedAccount: string) => {
  if (!appChainID || !connectedAccount) {
    return '0'
  }

  const exactNetwork = appChainID === walletChainID && BigNumber.from(appChainID).eq(BigNumber.from(CHAIN_ID))
  if (!exactNetwork) {
    return '0'
  }

  const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL)

  return ethers.utils.formatEther((await provider.getBalance(connectedAccount)) || '0')
}

export const getTokenBalance = async (
  appChainID: string,
  walletChainID: string,
  connectedAccount: string,
  tokenAddress: string
) => {
  if (!appChainID || !connectedAccount) {
    return '0'
  }

  const exactNetwork = appChainID === walletChainID && BigNumber.from(appChainID).eq(BigNumber.from(CHAIN_ID))
  if (!exactNetwork) {
    return '0'
  }

  const provider = new ethers.providers.JsonRpcProvider(NETWORK_URL)
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider)

  return ethers.utils.formatEther((await tokenContract.balanceOf(connectedAccount)) || '0')
}
