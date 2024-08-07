import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './auth-slice'
import riderReducer from './rider-slice'
import { geoMapLocationSearchReducer, feedbackReducer } from '@beckn-ui/common'
import api from '@services/api'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'rider']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  rider: riderReducer,
  geoLocationSearchPageUI: geoMapLocationSearchReducer,
  feedback: feedbackReducer
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
