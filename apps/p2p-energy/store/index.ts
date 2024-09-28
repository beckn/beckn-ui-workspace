import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {
  authReducer,
  api,
  checkoutReducer,
  statusReducer,
  DiscoveryReducer,
  OrderReducer,
  feedbackReducer,
  cartSliceReducer
} from '@beckn-ui/common'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['discovery', 'checkout', 'orders', 'status']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  cart: cartSliceReducer,
  checkout: checkoutReducer,
  status: statusReducer,
  discovery: DiscoveryReducer,
  orders: OrderReducer,
  feedback: feedbackReducer
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
    }).concat(api.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store
