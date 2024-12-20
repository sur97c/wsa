// lib/firebase/adapters/authAdapter.ts

import {
    User,
    UserCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from 'firebase/auth'
import { auth } from '@lib/firebase/firebase'
import { setUserClaims, getUserStatus } from '@actions/authActions'
import { IUserClaims } from '@models/IUserClaims'

export interface AuthAdapter {
    signUp: (email: string, password: string) => Promise<User>;
    signIn: (email: string, password: string) => Promise<User>;
    signOut: () => Promise<void>;
    getCurrentUser: () => Promise<User | null>;
    onAuthStateChange: (callback: (user: User | null) => void) => () => void;
    getUserClaims: (userId: string) => Promise<IUserClaims>;
    setUserClaims: (userId: string, claims: IUserClaims) => Promise<void>;
}

export const authAdapter: AuthAdapter = {
    async signUp(email: string, password: string): Promise<User> {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
        return userCredential.user
    },

    async signIn(email: string, password: string): Promise<User> {
        const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user
    },

    async signOut(): Promise<void> {
        await firebaseSignOut(auth)
    },

    getCurrentUser(): Promise<User | null> {
        return new Promise((resolve) => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                unsubscribe()
                resolve(user)
            })
        })
    },

    onAuthStateChange(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(auth, callback)
    },

    async getUserClaims(userId: string): Promise<IUserClaims> {
        const claims = (await getUserStatus(userId)).customClaims
        return claims
    },

    async setUserClaims(userId: string, claims: IUserClaims): Promise<void> {
        await setUserClaims(userId, claims)
    }
}