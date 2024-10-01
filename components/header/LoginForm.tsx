// login-form.tsx
"use client";

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "@store/store";
import { loginUser, logoutUser, recoverAccess } from "@store/slices/authSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignInAlt, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import LoadingButton from '@components/common/loading-button/LoadingButton ';
import { FlipCard } from '@components/common/flip-card/FlipCard';
import { useFlip } from '@providers/flip-provider';

interface FlipCardProps {
    onTransitionEnd?: () => void;
}

const LoginForm: React.FC<FlipCardProps> = ({ }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const { toggleFlip } = useFlip();

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const handleLoginUser = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email, password, rememberMe }));
    };

    // const handleLogoutUser = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     dispatch(logoutUser());
    // };

    const handleRecoverAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(recoverAccess(email));
    };

    const handleToggleFlip = () => {
        if (toggleFlip)
            toggleFlip();
    }

    const frontContent = (
        <div className="front">
            <form onSubmit={handleLoginUser}>
                <div className="flex flex-col md:flex-row items-center p-4">
                    <div>
                        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                            <div className="flex-1">
                                <label htmlFor="email" className="block text-sm font-medium text-dark">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-3 py-2 border border-light rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="password" className="block text-sm font-medium text-dark">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-3 py-2 border border-light rounded"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-2">
                            <div className="flex justify-center md:flex md:justify-start md:flex-1 w-full">
                                <label className="cursor-pointer md:flex-none text-primary hover:text-lightsecondary">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                        className="form-checkbox text-primary border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm">Mantener la sesión</span>
                                </label>
                            </div>
                            <div className="flex justify-center md:flex md:justify-start md:flex-1 w-full">
                                <div className="md:flex-none">
                                    <span onClick={handleToggleFlip} className="cursor-pointer text-sm text-primary hover:text-lightsecondary">
                                        Recuperar acceso
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 m-2">
                        <LoadingButton
                            type="submit"
                            aria-label={loading ? "Iniciando sesión" : "Iniciar sesión"}
                            className="bg-primary text-white py-2 px-4 rounded hover:bg-secondary w-full md:w-auto flex items-center justify-center"
                            faIcon={faSignInAlt}
                            loading={loading}
                        />
                    </div>
                </div>
            </form>
        </div>
    );

    const backContent = (
        <div className="back">
            <form>
                <div className="flex flex-col items-center p-4">
                    <label htmlFor="recover-email" className="block text-sm font-medium text-dark">
                        Email registrado, para restablecer el acceso.
                    </label>
                    <div className="flex w-full">
                        <input
                            id="recover-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tuemail@ejemplo.com"
                            className="flex-1 w-full px-3 py-2 border border-light rounded"
                        />
                        <div className="m-2">
                            <LoadingButton
                                type="button"
                                onClick={handleRecoverAccess}
                                aria-label={loading ? "Enviando email" : "Enviar email"}
                                className="bg-primary text-white py-2 px-4 rounded hover:bg-secondary w-full md:w-auto flex items-center justify-center"
                                faIcon={faPaperPlane}
                                loading={loading}
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleToggleFlip}
                        className="text-primary hover:text-lightsecondary flex items-center mt-2"
                        aria-label='Volver al login'
                    >
                        <FontAwesomeIcon
                            icon={faSignInAlt}
                            className="mr-2"
                        />
                        <span>Iniciar sesión</span>
                    </button>
                </div>
            </form>
        </div>
    );

    return (
        <div>
            <FlipCard
                frontContent={frontContent}
                backContent={backContent}
            />
            {error && <p className="flex justify-center mt-2 text-red-500">{error}</p>}
        </div>
    );
};

export default LoginForm;