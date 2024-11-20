// lib/redux/store.ts

import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import authReducer from './slices/authSlice'
import mockConfigReducer from './slices/mockConfigSlice'

const authPersistConfig = {
    key: "auth",
    storage,
    whitelist: ["auth"],
}

const mockConfigPersistConfig = {
    key: 'mockConfig',
    storage,
    whitelist: ['useMockData', 'mockEntities']
}

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, authReducer),
    mockConfig: persistReducer(mockConfigPersistConfig, mockConfigReducer)
})

export const makeStore = () => {
    const store = configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                },
            }),
    })

    const persistor = persistStore(store)

    return { store, persistor }
}

// Tipos inferidos de makeStore
export type AppStore = ReturnType<typeof makeStore>['store']
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector