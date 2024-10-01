// providers/client-provider.tsx
'use client'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { makeStore } from '@lib/redux/store'
import { useRef } from 'react'

export function ClientProviders({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<ReturnType<typeof makeStore>>()
    if (!storeRef.current) {
        storeRef.current = makeStore()
    }

    return (
        <Provider store={storeRef.current.store}>
            <PersistGate loading={null} persistor={storeRef.current.persistor}>
                {children}
            </PersistGate>
        </Provider>
    )
}
