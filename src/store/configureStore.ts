import { createStore, applyMiddleware } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

import rootReducer, { RootState } from './reducers'

const initialState = {}

const middlewares = [thunk]

const persistConfig = {
  key: 'mech-marketplace',
  storage,
  blacklist: [],
  whitelist: ['wallet', 'connector', 'appNetwork'],
  transforms: [],
}

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)

let store = createStore(persistedReducer, initialState, applyMiddleware(...middlewares))
let persistor = persistStore(store)

export default () => {
  return { store, persistor }
}
