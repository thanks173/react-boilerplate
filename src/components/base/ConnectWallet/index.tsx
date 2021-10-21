import React, { useEffect, useContext, useState } from 'react'
import { useSelector } from 'react-redux'
import { AppContext } from '@/components/base/AppContext'
import { WalletConnectionState } from '@/store/reducers/wallet'
import { ConnectorName, connectorsByName, SUPPORTED_WALLETS } from '@/constants/connectors'
import { MECH_TOKEN_CONTRACT } from '@/constants/contract'
import { maskWalletAddress, beautifyNumber } from '@/utils'
import { ethers } from 'ethers'
import useAuth from '@/hooks/useAuth'
import Modal from '@/components/base/Modal'

function ConnectWallet() {
  const walletsInfo = useSelector((state: any) => state.wallet).entities
  const { connectedAccount } = useAuth()

  const [openModal, setOpenModal] = useState(false)
  const {
    handleProviderChosen,
    currentConnector,
    walletName,
    logout,
    setWalletName,
    currentConnectedWallet,
    setCurrentConnectedWallet,
  } = useContext(AppContext)

  const currencyBalance =
    currentConnectedWallet && currentConnectedWallet.balances
      ? currentConnectedWallet.balances[ethers.constants.AddressZero]
      : '0'
  const tokenBalance =
    currentConnectedWallet && currentConnectedWallet.balances
      ? currentConnectedWallet.balances[MECH_TOKEN_CONTRACT]
      : '0'

  useEffect(() => {
    if (!connectedAccount) {
      return
    }

    setOpenModal(false)
  }, [connectedAccount])

  useEffect(() => {
    if (walletsInfo && walletName) {
      let currentWalletsName: string[] = []
      let isFound = false

      Object.keys(walletsInfo).forEach((key) => {
        const wallet = walletsInfo[key]

        if (wallet.addresses.length > 0 && wallet.connectionState === WalletConnectionState.CONNECTED && !isFound) {
          isFound = true
          setCurrentConnectedWallet && setCurrentConnectedWallet(wallet)
          currentWalletsName.push(key)
        }
      })

      if (currentWalletsName.length && walletName.length === 0 && !currentConnector) {
        const chooseWallet = currentWalletsName[0] as ConnectorName

        setWalletName && setWalletName(currentWalletsName)
        handleProviderChosen && handleProviderChosen(chooseWallet, connectorsByName[chooseWallet])
      }
    }
  }, [walletsInfo, walletName])

  return (
    <>
      {!connectedAccount ? (
        <button
          onClick={() => {
            setOpenModal(true)
            // handleProviderChosen && handleProviderChosen('MetaMask', connectorsByName['MetaMask'])
          }}
          className="btn btn-sm btn-primary normal-case rounded-full h-9"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-sm btn-primary normal-case rounded-full h-9">
            BNB {beautifyNumber(currencyBalance)} | MECH {beautifyNumber(tokenBalance)}
            {' | '}
            {maskWalletAddress(connectedAccount)}
          </div>
          <ul tabIndex={0} className="mt-2 shadow dropdown-content rounded-box w-40">
            <button
              onClick={() => {
                logout && logout()
              }}
              className="btn btn-sm px-2 py-1 text-sm w-full focus:outline-none"
            >
              Disconnect
            </button>
          </ul>
        </div>
      )}

      <Modal open={openModal} setOpen={setOpenModal}>
        <div className="bg-blue-gray-700 rounded-lg p-3 flex flex-col lg:flex-row gap-3 w-full">
          {Object.keys(SUPPORTED_WALLETS).map((k) => (
            <div
              key={k}
              onClick={() => {
                const choosen = SUPPORTED_WALLETS[k].name as ConnectorName
                handleProviderChosen && handleProviderChosen(choosen, connectorsByName[choosen])
              }}
              className="btn flex flex-col w-48 border-none h-auto py-4"
              css={{ '--n': '222 13.4% 19%;', '--nf': '223 13.7% 10%' }}
            >
              <img src={SUPPORTED_WALLETS[k].icon?.default} className="w-16 h-16" />
              <span className="normal-case text-lg font-semibold mt-2">{SUPPORTED_WALLETS[k].name}</span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

export default ConnectWallet
