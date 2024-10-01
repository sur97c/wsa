// redux-provider.tsx
"use client";

import { Provider } from "react-redux";
import { makeStore } from "@lib/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { useRef } from "react";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
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