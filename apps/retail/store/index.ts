import { configureStore, combineReducers } from '@reduxjs/toolkit'
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
import favoriteReducer from './favorite-slice'
import responseDataReducer from './responseData-slice'
import geoMapLocationSearchReducer from './geoMapLocationSearch-slice'

// Combine all reducers
const appReducer = combineReducers({
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
  geoLocationSearchPageUI: geoMapLocationSearchReducer
})

// Root reducer with state reset on logout
const rootReducer = (state: any, action: any) => {
  // When logout action is dispatched, reset all state except userInfo (which is handled in its own reducer)
  if (action.type === 'userInfo/userLogout') {
    // Return a fresh state
    state = undefined
  }

  return appReducer(state, action)
}

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export default store
