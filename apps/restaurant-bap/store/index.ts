import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {
  authReducer,
  cartSliceReducer,
  checkoutReducer,
  statusReducer,
  DiscoveryReducer,
  OrderReducer,
  feedbackReducer,
  geoMapLocationSearchReducer,
  settingBoxReducer,
  api,
  searchReducer
} from '@beckn-ui/common'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart', 'discovery', 'checkout', 'orders', 'status']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  cart: cartSliceReducer,
  checkout: checkoutReducer,
  status: statusReducer,
  discovery: DiscoveryReducer,
  orders: OrderReducer,
  feedback: feedbackReducer,
  settingBox: settingBoxReducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer,
  search: searchReducer
})

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: { type: string }) => {
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

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(api.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
