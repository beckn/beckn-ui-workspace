import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
import specialOfferProductsReducer from './specialOfferProducts-slice'
import newestProductReducer from './newestProduct-slice'
import SortedProductsListReducer from './sortedProductList-slice'
import cartUiReducer from './cartUI-slice'
import cartSliceReducer from './cart-slice'
import userInfoReducer from './user-slice'
import sideNavBarReducer from './sideNavBar-slice'
import megaMenuReducer from './megaMenu-slice'
import activeMenuItemReducer from './activeMenuItem-slice'
import settingBoxReducer from './settingBox-slice'
import scholarshipCartReducer from './scholarshipCart-slice'
import favoriteReducer from './favorite-slice'
import responseDataReducer from './responseData-slice'
import storage from './storage'

const persistConfig = {
  key: 'root',
  storage
}

const rootReducer = combineReducers({
  specialOfferProductsList: specialOfferProductsReducer,
  newestProductsList: newestProductReducer,
  sortedProductsList: SortedProductsListReducer,
  cartUi: cartUiReducer,
  cart: cartSliceReducer,
  userInfo: userInfoReducer,
  sideNavBar: sideNavBarReducer,
  megaMenu: megaMenuReducer,
  activeMenuItem: activeMenuItemReducer,
  settingBox: settingBoxReducer,
  favorite: favoriteReducer,
  transactionId: responseDataReducer,
  quoteResponse: responseDataReducer,
  customerDetails: responseDataReducer,
  initResponse: responseDataReducer,
  scholarshipCart: scholarshipCartReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export const persistor = persistStore(store)
