import { combineReducers } from 'redux'
import { walletReducer } from './wallet'
import { appNetworkReducer, connectorReducer } from './appNetwork'

const rootReducer = combineReducers({
  wallet: walletReducer,
  appNetwork: appNetworkReducer,
  connector: connectorReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
