import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './auth-slice'
import userReducer from './user-slice'
import SelectChargerReducer from './chargerSelect-slice'
import cabServiceReducer from './cabService-slice'
import policyReducer from './policy-slice'
import cartSliceReducer from './cart-slice'
import { checkoutBeckn20Reducer, discoverReducer, feedbackReducer, geoMapLocationSearchReducer } from '@beckn-ui/common'
import becknApi from '@beckn-ui/common/src/services/becknApi'
import '@beckn-ui/common/src/services/beckn-2.0/discover'
import api from '@services/api'
import didApi from '@services/didApi'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'cart', 'selectCharger', 'discover']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  [didApi.reducerPath]: didApi.reducer,
  [becknApi.reducerPath]: becknApi.reducer,
  user: userReducer,
  cart: cartSliceReducer,
  checkoutBeckn20: checkoutBeckn20Reducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer,
  discover: discoverReducer,
  selectCharger: SelectChargerReducer,
  feedback: feedbackReducer,
  cabService: cabServiceReducer,
  policy: policyReducer
})

const rootReducer = (state: any, action: any) => {
  if (action.type === 'auth/logout') {
    if (localStorage) {
      localStorage.removeItem('persist:root')
      localStorage.clear()
    }
    state = undefined
  }

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
    }).concat(api.middleware, didApi.middleware, becknApi.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store
