import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import specialOfferProductsReducer from './specialOfferProducts-slice'
import newestProductReducer from './newestProduct-slice'
import SortedProductsListReducer from './sortedProductList-slice'
import cartUiReducer from './cartUI-slice'
import cartSliceReducer from './cart-slice'
import userInfoReducer from './user-slice'
import feedbackReducer from './ui-feedback-slice'
import sideNavBarReducer from './sideNavBar-slice'
import megaMenuReducer from './megaMenu-slice'
import settingBoxReducer from './settingBox-slice'
import scholarshipCartReducer from './scholarshipCart-slice'
import favoriteReducer from './favorite-slice'
import responseDataReducer from './responseData-slice'
import storage from 'redux-persist/lib/storage'
import { api, authReducer } from '@beckn-ui/common'

const persistConfig = {
  key: 'root',
  storage
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  specialOfferProductsList: specialOfferProductsReducer,
  newestProductsList: newestProductReducer,
  sortedProductsList: SortedProductsListReducer,
  cartUi: cartUiReducer,
  cart: cartSliceReducer,
  userInfo: userInfoReducer,
  sideNavBar: sideNavBarReducer,
  megaMenu: megaMenuReducer,
  feedback: feedbackReducer,
  settingBox: settingBoxReducer,
  favorite: favoriteReducer,
  transactionId: responseDataReducer,
  quoteResponse: responseDataReducer,
  customerDetails: responseDataReducer,
  initResponse: responseDataReducer,
  scholarshipCart: scholarshipCartReducer
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
    }).concat(api.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store
