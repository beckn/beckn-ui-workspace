import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './auth-slice'
import userReducer from './user-slice'
import DiscoveryReducer from './discovery-slice'
import SelectChargerReducer from './chargerSelect-slice'
import cabServiceReducer from './cabService-slice'
import policyReducer from './policy-slice'
import cartSliceReducer from './cart-slice'
import { checkoutReducer, feedbackReducer, geoMapLocationSearchReducer } from '@beckn-ui/common'
import api from '@services/api'
import didApi from '@services/didApi'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'cart', 'selectCharger', 'checkout', 'discovery']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  [didApi.reducerPath]: didApi.reducer,
  user: userReducer,
  cart: cartSliceReducer,
  checkout: checkoutReducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer,
  discovery: DiscoveryReducer,
  selectCharger: SelectChargerReducer,
  feedback: feedbackReducer,
  cabService: cabServiceReducer,
  policy: policyReducer
})

const rootReducer = (state: any, action: any) => {
  return appReducer(state, action)
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(api.middleware, didApi.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store
