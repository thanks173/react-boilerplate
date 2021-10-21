import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter as Router, Route, Switch, withRouter } from 'react-router-dom'

import { AppContext } from '@/components/base/AppContext'
import { useWeb3React } from '@web3-react/core'
import useProviderConnect from '@/hooks/useProviderConnect'
import { settingAppNetwork, NetworkUpdateType } from '@/store/actions/appNetwork'

import Header from '@/layouts/default/Header'
import ErrorBoundary from '@/components/base/ErrorBoundary'

import Fallback from '@/pages/About'
import Account from '@/pages/Account'

/**
 * Main App routes.
 */
function Routes() {
  const dispatch = useDispatch()

  const { deactivate } = useWeb3React()
  const [binanceAvailable, setBinanceAvailable] = useState(false)
  const [openConnectWallet, setOpenConnectWallet] = useState<boolean>(false)
  const [currentConnectedWallet, setCurrentConnectedWallet] = useState<any>(undefined)

  const {
    handleProviderChosen,
    connectWalletLoading,
    currentConnector,
    walletName,
    setWalletName,
    loginError,
    appNetworkLoading,
    handleConnectorDisconnect,
  } = useProviderConnect(setOpenConnectWallet, binanceAvailable)

  const logout = () => {
    deactivate()
    dispatch(settingAppNetwork(NetworkUpdateType.Wallet, undefined))
    setCurrentConnectedWallet(undefined)
    handleConnectorDisconnect()
  }

  useEffect(() => {
    document.onreadystatechange = function () {
      if (document.readyState == 'complete') {
        setBinanceAvailable(true)
      }
    }
  }, [])

  return (
    <AppContext.Provider
      value={{
        binanceAvailable,
        handleProviderChosen,
        connectWalletLoading,
        walletName,
        setWalletName,
        loginError,
        appNetworkLoading,
        handleConnectorDisconnect,
        currentConnector,
        logout,
        setCurrentConnectedWallet,
        openConnectWallet,
        setOpenConnectWallet,
        currentConnectedWallet,
      }}
    >
      <div className="h-full min-h-screen w-full">
        <Header />
        <div className="py-20 px-4 md:px-8 lg:px-40">
          <Switch>
            <Route path={'/marketplace'} component={Fallback} />
            <Route path={'/account'} component={Account} />
            <Route path={'/'} component={Fallback} />
          </Switch>
        </div>
      </div>
    </AppContext.Provider>
  )
}

const RoutesHistory = withRouter(Routes)

const routing = function createRouting() {
  return (
    <>
      <Router>
        <ErrorBoundary>
          <RoutesHistory />
        </ErrorBoundary>
      </Router>
    </>
  )
}

export default routing
