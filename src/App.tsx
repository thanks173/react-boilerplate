import React from 'react'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import configureStore from './store/configureStore'
import createRoutes from '@/routes'

export const getLibrary = (provider: any): Web3Provider => {
  const library = new ethers.providers.Web3Provider(provider, 'any')
  library.pollingInterval = 10000
  return library
}

function App() {
  const { store, persistor } = configureStore()

  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <PersistGate loading={null} persistor={persistor}>
          {createRoutes()}
        </PersistGate>
      </Web3ReactProvider>
    </Provider>
  )
}

export default App
