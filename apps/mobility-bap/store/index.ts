import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userInfoReducer from './user-slice'
import DiscoveryReducer from './discovery-slice'
import SelectRideReducer from './selectRide-slice'
import { api, feedbackReducer, geoMapLocationSearchReducer } from '@beckn-ui/common'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['selectRide', 'discovery']
}

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  userInfo: userInfoReducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer,
  discovery: DiscoveryReducer,
  selectRide: SelectRideReducer,
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
