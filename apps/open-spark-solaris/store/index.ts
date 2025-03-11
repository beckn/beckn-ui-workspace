import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './auth-slice'
import userReducer from './user-slice'
import navigationReducer from './navigation-slice'
import discoveryEmiPlanReducer from './discoveryEmiPlan-slice'
import emiFormReducer from './emiForm-slice'
import selectedEmiReducer from './emiSelect-slice'
import rentalReducer from './rental-slice'
import {
  geoMapLocationSearchReducer,
  feedbackReducer,
  cartSliceReducer,
  checkoutReducer,
  DiscoveryReducer
} from '@beckn-ui/common'
import api from '@services/api'
import didApi from '@services/didApi'

const persistConfig = {
  key: 'solaris-root',
  storage,
  whitelist: ['auth', 'user', 'discovery', 'cart', 'checkout', 'discoveryEmiPlan', 'selectedEmi']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  [didApi.reducerPath]: didApi.reducer,
  user: userReducer,
  cart: cartSliceReducer,
  checkout: checkoutReducer,
  discovery: DiscoveryReducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer,
  feedback: feedbackReducer,
  discoveryEmiPlan: discoveryEmiPlanReducer,
  emiForm: emiFormReducer,
  selectedEmi: selectedEmiReducer,
  navigation: navigationReducer,
  rental: rentalReducer
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
    }).concat(api.middleware, didApi.middleware)
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store
