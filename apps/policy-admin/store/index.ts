import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './auth-slice'
import api from '@services/api'
import policyReducer from './policy.slice'
import { feedbackReducer } from '@beckn-ui/common'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'policy']
}

const appReducer = combineReducers({
  auth: authReducer,
  [api.reducerPath]: api.reducer,
  feedback: feedbackReducer,
  policy: policyReducer
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
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.store = store
}
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export default store
