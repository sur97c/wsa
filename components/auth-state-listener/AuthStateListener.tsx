// components/auth-state-listener/AuthStateListener.tsx
'use client'

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { RootState, useAppSelector } from '@lib/redux/store';
import { logout, updateLastActivity } from '@lib/redux/slices/authSlice';
import styles from './AuthStateListener.module.scss';
import classNames from 'classnames';
import { useAuthListener } from '@hooks/useAuthListener.ts';
import { auth } from '@lib/firebase/firebase';

export function AuthStateListener({ children }: { children: React.ReactNode }) {
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);

    const authState = useAppSelector((state: RootState) => state.auth.auth);
    const dispatch = useDispatch();

    useAuthListener();

    useEffect(() => {
        const checkSessionTimeout = () => {
            if (authState && authState?.isAuthenticated && !authState?.rememberMe) {
                const currentTime = Date.now();
                const timeSinceLastActivity = currentTime - (authState?.lastActivity ?? currentTime);

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
    }, [dispatch, authState]);

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
            if (authState && authState?.isAuthenticated) {
                dispatch(updateLastActivity());
            }
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);

        return () => {
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keydown', handleActivity);
        };
    }, [dispatch, authState?.isAuthenticated, isDialogVisible]);

    return (
        <>
            {isDialogVisible && (
                <div className={classNames(styles['session-dialog'], 'bg-secondary-light text-white flex flex-col justify-center items-center')}>
                    <p>La sesión está por expirar en {timeLeft} segundos.</p>
                    <div className='flex justify-between'>
                        <button onClick={() => setIsDialogVisible(false)} className={'m-4 p-2 rounded bg-primary text-light hover:bg-primary-hover'}>Extender sesión</button>
                        <button onClick={() => {
                            dispatch(logout());
                            auth.signOut();
                            setIsDialogVisible(false);
                        }} className={'m-4 p-2 rounded bg-primary text-white hover:bg-primary-hover'}>Cerrar sesión</button>
                    </div>
                </div>
            )
            }
            {children}
        </>
    );
}
