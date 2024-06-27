import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import specialOfferProductsReducer from './specialOfferProducts-slice'
import newestProductReducer from './newestProduct-slice'
import SortedProductsListReducer from './sortedProductList-slice'
import cartUiReducer from './cartUI-slice'
import cartSliceReducer from './cart-slice'
import checkoutReducer from './checkout-slice'
import statusReducer from './status-slice'
import feedbackReducer from './ui-feedback-slice'
import userInfoReducer from './user-slice'
import sideNavBarReducer from './sideNavBar-slice'
import DiscoveryReducer from './discovery-slice'
import OrderReducer from './order-slice'
import megaMenuReducer from './megaMenu-slice'
import activeMenuItemReducer from './activeMenuItem-slice'
import settingBoxReducer from './settingBox-slice'
import favoriteReducer from './favorite-slice'
import responseDataReducer from './responseData-slice'
import geoMapLocationSearchReducer from './geoMapLocationSearch-slice'
import authReducer from './auth-slice'
import orderObjectUrlReducer from './orderObjectUrl-slice'
import { api } from '@beckn-ui/common'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart', 'discovery', 'checkout', 'orders', 'status']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  specialOfferProductsList: specialOfferProductsReducer,
  newestProductsList: newestProductReducer,
  sortedProductsList: SortedProductsListReducer,
  cartUi: cartUiReducer,
  cart: cartSliceReducer,
  checkout: checkoutReducer,
  status: statusReducer,
  discovery: DiscoveryReducer,
  orders: OrderReducer,
  userInfo: userInfoReducer,
  feedback: feedbackReducer,
  sideNavBar: sideNavBarReducer,
  megaMenu: megaMenuReducer,
  activeMenuItem: activeMenuItemReducer,
  settingBox: settingBoxReducer,
  favorite: favoriteReducer,
  transactionId: responseDataReducer,
  quoteResponse: responseDataReducer,
  customerDetails: responseDataReducer,
  initResponse: responseDataReducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer,
  orderObjectUrl: orderObjectUrlReducer
})

const rootReducer = (state, action) => {
  console.log('Dank action', action.type)
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
