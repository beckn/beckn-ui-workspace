import { configureStore } from '@reduxjs/toolkit'
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
import { api } from '@services/api'
import favoriteReducer from './favorite-slice'
import responseDataReducer from './responseData-slice'
import geoMapLocationSearchReducer from './geoMapLocationSearch-slice'
import authReducer from './authslice'

const store = configureStore({
  reducer: {
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
    activeMenuItem: activeMenuItemReducer,
    settingBox: settingBoxReducer,
    favorite: favoriteReducer,
    transactionId: responseDataReducer,
    quoteResponse: responseDataReducer,
    customerDetails: responseDataReducer,
    initResponse: responseDataReducer,
    geoLocationSearchPageUI: geoMapLocationSearchReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(api.middleware)
})

export type RootState = ReturnType<typeof store.getState>

export default store
