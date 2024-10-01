// components/auth-state-listener/AuthStateListener.tsx
'use client'

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RootState, useAppSelector } from '@lib/redux/store';
import { auth } from '@lib/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { login, logout, updateLastActivity } from '@lib/redux/slices/authSlice';
import { getDocumentData } from '@actions/firestoreActions';
import styles from './AuthStateListener.module.scss';
import classNames from 'classnames';
import { IProfile } from '@models/IProfile';

export function AuthStateListener({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { isAuthenticated, rememberMe, lastActivity } = useAppSelector((state: RootState) => state.auth);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const shouldRemember = localStorage.getItem('rememberMe') === 'true';
                const userProfile = await getDocumentData<IProfile>('users', user.uid);
                const token = await user.getIdTokenResult();
                dispatch(login({
                    user: {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName
                    },
                    customClaims: token.claims,
                    profile: userProfile,
                    rememberMe: shouldRemember
                }));
            } else {
                dispatch(logout());
            }
        });
        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        const checkSessionTimeout = () => {
            if (isAuthenticated && !rememberMe) {
                const currentTime = Date.now();
                const timeSinceLastActivity = currentTime - (lastActivity ?? currentTime);

                if (timeSinceLastActivity > Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) - Number(process.env.NEXT_PUBLIC_DIALOG_TIMEOUT)) {
                    setIsDialogVisible(true);
                    setTimeLeft(Math.floor((Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) - timeSinceLastActivity) / 1000));
                }

                if (timeSinceLastActivity > Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT)) {
                    dispatch(logout());
                    auth.signOut();
                }
            }
        };

        const intervalId = setInterval(checkSessionTimeout, 1000);
        return () => clearInterval(intervalId);
    }, [dispatch, isAuthenticated, rememberMe, lastActivity]);

    useEffect(() => {
        let countdownInterval: NodeJS.Timeout;

        if (isDialogVisible && timeLeft > 0) {
            countdownInterval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        }

        if (timeLeft === 0 && isDialogVisible) {
            dispatch(logout());
            auth.signOut();
            if (isDialogVisible) {
                setIsDialogVisible(false);
            }
        }

        return () => clearInterval(countdownInterval);
    }, [isDialogVisible, timeLeft, dispatch]);

    useEffect(() => {
        const handleActivity = () => {
            if (isAuthenticated) {
                dispatch(updateLastActivity());
            }
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [dispatch, isAuthenticated, isDialogVisible]);

    return (
        <>
            {isDialogVisible && (
                <div className={classNames(styles['session-dialog'], 'bg-lightsecondary text-white flex flex-col justify-center items-center')}>
                    <p>La sesión está por expirar en {timeLeft} segundos.</p>
                    <div className='flex justify-between'>
                        <button onClick={() => setIsDialogVisible(false)} className={'m-4 p-2 rounded bg-primary text-light hover:bg-secondary'}>Extender sesión</button>
                        <button onClick={() => {
                            dispatch(logout());
                            auth.signOut();
                            setIsDialogVisible(false);
                        }} className={'m-4 p-2 rounded bg-primary text-white hover:bg-secondary'}>Cerrar sesión</button>
                    </div>
                </div>
            )
            }
            {children}
        </>
    );
}
