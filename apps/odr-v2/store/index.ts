import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import cartSliceReducer from './cart-slice'
import sideNavBarReducer from './sideNavBar-slice'
import megaMenuReducer from './megaMenu-slice'
import favoriteReducer from './favorite-slice'
// import geoMapLocationSearchReducer from './geoMapLocationSearch-slice'
import {
  authReducer,
  checkoutReducer,
  statusReducer,
  DiscoveryReducer,
  OrderReducer,
  feedbackReducer,
  geoMapLocationSearchReducer,
  settingBoxReducer,
  api
} from '@beckn-ui/common'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'discovery', 'checkout', 'orders', 'status']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  cart: cartSliceReducer,
  checkout: checkoutReducer,
  status: statusReducer,
  feedback: feedbackReducer,
  discovery: DiscoveryReducer,
  orders: OrderReducer,
  sideNavBar: sideNavBarReducer,
  megaMenu: megaMenuReducer,
  settingBox: settingBoxReducer,
  favorite: favoriteReducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer
})

const rootReducer = (state, action) => {
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
    }).concat(api.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store
