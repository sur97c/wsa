// hooks/useAuthListener.ts

import { useEffect } from 'react';
import { useAppDispatch } from "@lib/redux/store";
import { login, logout } from "@lib/redux/slices/authSlice";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { getFirestoreData } from "@actions/getFirestoreData";
import { IProfile } from "@models/IProfile";
import { auth } from "@lib/firebase/firebase";

export function useAuthListener() {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const shouldRemember = localStorage.getItem('rememberMe') === 'true';
                const userProfile = await getFirestoreData<IProfile>('users', user.uid, true);

                dispatch(login({
                    uid: user.uid,
                    email: user.email || '',
                    displayName: user.displayName || '',
                    disabled: userProfile?.disabled || true,
                    firebaseId: userProfile?.firebaseId || '',
                    lastName: userProfile?.lastName || '',
                    name: userProfile?.name || '',
                    roles: userProfile?.roles || [],
                    isAuthenticated: true,
                    rememberMe: shouldRemember,
                    lastActivity: Date.now(),
                    customClaims: userProfile?.customClaims
                }));
            } else {
                dispatch(logout());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);
}