import { appNetworkActions } from '../constants/appNetwork'
import { AnyAction } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

export enum NetworkUpdateType {
  Wallet = 'Wallet',
  App = 'App',
}

export const settingAppNetwork = (networkType: string, updatedVal: string | undefined) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>, getState: () => any) => {
    dispatch({ type: appNetworkActions.APP_NETWORKS_SETTING_LOADING })

    try {
      const { walletChainID } = getState().appNetwork.data

      if (networkType in NetworkUpdateType) {
        const updatedNetworkData = {
          appChainID: '56',
          walletChainID: networkType === NetworkUpdateType.Wallet ? updatedVal : walletChainID,
        }

        dispatch({
          type: appNetworkActions.APP_NETWORKS_SETTING_SUCCESS,
          payload: updatedNetworkData,
        })
      } else {
        throw new Error('Wrong update network type!')
      }
    } catch (error) {
      dispatch({
        type: appNetworkActions.APP_NETWORKS_SETTING_ERROR,
        payload: error,
      })
    }
  }
}

export const settingCurrentConnector = (connectorName: string | undefined) => {
  return async (dispatch: ThunkDispatch<{}, {}, AnyAction>) => {
    try {
      dispatch({
        type: appNetworkActions.CONNECTOR_SETTING_SUCCESS,
        payload: connectorName,
      })
    } catch (error) {
      dispatch({
        type: appNetworkActions.CONNECTOR_SETTING_ERROR,
        payload: error,
      })
    }
  }
}
