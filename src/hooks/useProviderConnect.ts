import { useState, useEffect, SetStateAction, Dispatch, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'

import usePrevious from '@/hooks/usePrevious'
import { useTypedSelector } from '@/hooks/useTypedSelector'
import { ConnectorNames } from '@/constants/connectors'
import { CHAIN_ID } from '@/constants/network'
import { MECH_TOKEN_CONTRACT } from '@/constants/contract'
import { requestSupportNetwork } from '@/components/base/ConnectWallet/setupNetwork'
import { connectWalletSuccess, disconnectWallet } from '@/store/actions/wallet'
import { settingAppNetwork, NetworkUpdateType, settingCurrentConnector } from '@/store/actions/appNetwork'
import { getCurrencyBalance, getTokenBalance } from '@/utils'
import { ethers } from 'ethers'

const useProviderConnect = (setOpenConnectDialog?: Dispatch<SetStateAction<boolean>>, binanceAvailable?: boolean) => {
  const dispatch = useDispatch()

  const { appChainID, walletChainID } = useTypedSelector((state) => state.appNetwork).data

  const [account, setAccount] = useState<string | undefined>(undefined)
  const [appNetworkLoading, setAppNetworkLoading] = useState(false)
  const [walletNameSuccess, setWalletNameSuccess] = useState<string | undefined>(undefined)
  const [walletName, setWalletName] = useState<(undefined | string)[]>([])
  const [currentConnector, setCurrentConnector] = useState<undefined | AbstractConnector>(undefined)
  const [connectWalletLoading, setConnectWalletLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  const { activate, active, connector, chainId, error, account: connectedAccount, deactivate } = useWeb3React()

  const previousAccount = usePrevious(account)
  const activePrevious = usePrevious(active)
  const previousConnector = usePrevious(connector)

  useEffect(() => {
    if (
      connectWalletLoading &&
      ((active && !activePrevious) || (connector && connector !== previousConnector && !error))
    ) {
      setConnectWalletLoading(false)
      setOpenConnectDialog && setOpenConnectDialog(false)
    }
  }, [
    active,
    connector,
    error,
    previousAccount,
    previousConnector,
    activePrevious,
    connectWalletLoading,
    setOpenConnectDialog,
    setConnectWalletLoading,
  ])

  const handleConnectorDisconnect = useCallback(() => {
    dispatch(disconnectWallet())
    dispatch(settingCurrentConnector(undefined))
    dispatch(settingAppNetwork(NetworkUpdateType.Wallet, undefined))

    localStorage.removeItem('walletconnect')

    deactivate()
    setAccount(undefined)
    setWalletName([])
    setWalletNameSuccess(undefined)
    setCurrentConnector(undefined)
    setConnectWalletLoading(false)
    setLoginError('')
  }, [])

  useEffect(() => {
    if (currentConnector && currentConnector.on && !active && !error) {
      const handleWeb3ReactUpdate = (updated: any) => {
        if (updated.account) {
          setAccount(updated.account)
        } else {
          setAccount(undefined)
        }

        if (updated.chainId) {
          const chainId = Number(updated.chainId).toString()
          chainId && dispatch(settingAppNetwork(NetworkUpdateType.Wallet, chainId.toString()))
        }
      }

      const handleWeb3ReactError = (err: any) => {
        if (err === 'NaN ChainId') {
          dispatch(settingAppNetwork(NetworkUpdateType.Wallet, undefined))
          setLoginError(
            `App network (${appChainID}) doesn't mach to network selected in wallet: NaN. Learn how to change network in wallet or`
          )
        }
      }

      currentConnector.on('Web3ReactUpdate', handleWeb3ReactUpdate)
      currentConnector.on('Web3ReactError', handleWeb3ReactError)
      currentConnector.on('Web3ReactDeactivate', handleConnectorDisconnect)

      return () => {
        if (currentConnector && currentConnector.removeListener && active) {
          currentConnector.removeListener('Web3ReactUpdate', handleWeb3ReactUpdate)
          currentConnector.removeListener('Web3ReactError', handleWeb3ReactError)
          currentConnector.removeListener('Web3ReactDeactivate', handleConnectorDisconnect)
        }
      }
    }

    return
  }, [currentConnector, connectedAccount])

  useEffect(() => {
    currentConnector && setAppNetworkLoading(true)
  }, [appChainID])

  // UseEffect for watching change app network loading
  useEffect(() => {
    if (!appNetworkLoading) {
      setOpenConnectDialog && setOpenConnectDialog(false)
      setConnectWalletLoading(false)
    }
  }, [appNetworkLoading])

  const tryActivate = useCallback(
    async (connector: AbstractConnector, appChainID: string, wallet: string) => {
      try {
        if (!connectWalletLoading) {
          setConnectWalletLoading(true)

          if (wallet === ConnectorNames.MetaMask || wallet === ConnectorNames.BSC) {
            await requestSupportNetwork(appChainID, wallet)
          }

          if (connector instanceof WalletConnectConnector && connector.walletConnectProvider?.wc?.uri) {
            connector.walletConnectProvider = undefined
          }

          if (connector && walletName) {
            await activate(connector, undefined, true)
              .then(() => {
                dispatch(settingCurrentConnector(wallet))
                setWalletNameSuccess(wallet)
              })
              .catch(async (error) => {
                if (error instanceof UnsupportedChainIdError) {
                  console.debug('tryActivate', error.message)
                  dispatch(disconnectWallet())
                  setCurrentConnector(undefined)
                  setConnectWalletLoading(false)
                  setWalletName([])
                  localStorage.removeItem('walletconnect')

                  await activate(connector)
                  // const currentChainId = await connector?.getChainId()
                  // const b = connector?.supportedChainIds

                  // dispatch(alertFailure(`App network (${NETWORK_NAME_MAPPINGS[appChainID]}) doesn\'t mach to network selected in wallet: ${NETWORK_NAME_MAPPINGS[currentChainId]}. Please change network in wallet  or  change app network.`))

                  return
                } else {
                  dispatch(disconnectWallet())
                  setConnectWalletLoading(false)
                  setWalletName(walletName.filter((name) => wallet !== name))
                  console.debug('tryActivate', error.message)
                  return
                }
              })
          }
        }
      } catch (error: any) {
        setLoginError(error.message)
        setCurrentConnector(undefined)
      }

      setAppNetworkLoading(false)
    },
    [connector, appChainID, walletName]
  )

  // UseEffect for trying login after fullfilled app chain id and connector
  useEffect(() => {
    const tryLoginAfterSwitch = async () => {
      if (!currentConnector) {
        return
      }

      await tryActivate(currentConnector, CHAIN_ID as string, walletName[walletName.length - 1] as string)
    }
    currentConnector && appChainID && walletName.length > 0 && tryLoginAfterSwitch()
  }, [currentConnector, appChainID, walletName, binanceAvailable])

  // UseEffect for setting wallet id after login success
  useEffect(() => {
    if (!connectWalletLoading) {
      chainId && dispatch(settingAppNetwork(NetworkUpdateType.Wallet, chainId.toString()))
      connectedAccount && setAccount(connectedAccount)
    }
  }, [connectWalletLoading, connectedAccount, chainId])

  // Handle select provider
  const handleProviderChosen = (name: string, connector: AbstractConnector) => {
    setCurrentConnector(connector)
    walletName.indexOf(name) < 0 && setWalletName([...walletName, name])
  }

  useEffect(() => {
    const getAccountDetails = async () => {
      if (appChainID && connectedAccount && walletNameSuccess) {
        const currencyBalance = await getCurrencyBalance(appChainID, walletChainID, connectedAccount as string)
        const tokenBalance = await getTokenBalance(
          appChainID,
          walletChainID,
          connectedAccount as string,
          MECH_TOKEN_CONTRACT
        )

        dispatch(
          connectWalletSuccess(walletNameSuccess, [connectedAccount], {
            [ethers.constants.AddressZero]: currencyBalance,
            [MECH_TOKEN_CONTRACT]: tokenBalance,
          })
        )
        setConnectWalletLoading(false)
      }
    }
    getAccountDetails()
  }, [walletNameSuccess, connectedAccount, appChainID, walletChainID])

  return {
    handleProviderChosen,
    setWalletName,
    walletName,
    connectWalletLoading,
    walletNameSuccess,
    loginError,
    currentConnector,
    appNetworkLoading,
    handleConnectorDisconnect,
  }
}

export default useProviderConnect
