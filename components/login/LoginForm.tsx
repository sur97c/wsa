// components/login/LoginForm.tsx

"use client";

import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "@hooks/useTranslations";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { loginUser, setShowLogin } from "@lib/redux/slices/authSlice";
import { useFlip } from "@providers/flip-provider";
import LoadingButton from "@components/loading-button/LoadingButton";
import { useSafeRouter } from "@hooks/useSafeRouter";
import { X } from "lucide-react";

interface LoginFormProps {
  onClose?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const { t, translations } = useTranslations();
  const { safeNavigate } = useSafeRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const { loading, error, auth } = useAppSelector((state) => state.auth);
  const { toggleFlip } = useFlip();

  useEffect(() => {
    if (auth?.isAuthenticated) {
      dispatch(setShowLogin(false));
      if (onClose) onClose();
      if (auth.customClaims?.roles?.includes("dashboard"))
        safeNavigate("/dashboard");
      else {
        const role = auth.customClaims?.roles[0]
          ? auth.customClaims?.roles[0]
          : "";
        safeNavigate(`/${role}`);
      }
    }
  }, [auth?.isAuthenticated, dispatch, onClose, safeNavigate, auth?.customClaims?.roles]);

  const handleLoginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser({ email, password, rememberMe }));
  };

  const handleFlip = (e: React.MouseEvent) => {
    e.preventDefault();
    if (toggleFlip) {
      toggleFlip();
    }
  };

  const handleCloseLogin = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="front">
      <button
        onClick={handleCloseLogin}
        className="absolute top-4 right-4 text-gray-500 hover:text-[#FF8C00]
      transition-colors duration-300 z-10"
      >
        <X size={24} />
      </button>
      <div className="bg-white p-2 rounded-md border-b">
        <form onSubmit={handleLoginUser} className="p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-auto w-full">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-dark"
                  >
                    {t(translations.loginForm.email)}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input px-3 py-2 border border-light rounded md:w-auto w-full
                      focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00]
                      transition-all duration-300"
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-dark"
                  >
                    {t(translations.loginForm.password)}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input px-3 py-2 border border-light rounded md:w-auto w-full
                      focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00]
                      transition-all duration-300"
                  />
                </div>
                {/* Checkbox para pantallas pequeñas */}
                <div className="flex justify-center md:justify-start md:flex-1 md:hidden">
                  <label className="cursor-pointer md:flex-none text-primary hover:text-primary-hover">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="form-checkbox text-[#FF8C00] border-gray-300 rounded
                        focus:ring-[#FF8C00]/20 transition-all duration-300"
                    />
                    <span className="ml-2 text-sm">
                      {t(translations.loginForm.rememberMe)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Botón de Sign In para pantallas pequeñas */}
              <div className="mt-4 md:hidden w-full">
                <LoadingButton
                  type="submit"
                  aria-label={
                    loading
                      ? t(translations.loginForm.signingIn)
                      : t(translations.loginForm.signIn)
                  }
                  className="bg-[#1A237E] text-white py-2 px-4 rounded hover:bg-[#FF8C00] w-full
                    transition-all duration-300 
                    [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                    hover:shadow-lg transform hover:-translate-y-0.5
                    shadow-md hover:shadow-[#FF8C00]/20"
                  faIcon={faSignInAlt}
                  loading={loading}
                />
              </div>

              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 md:mt-4 mt-0">
                {/* Checkbox para pantallas medianas y grandes */}
                <div className="hidden md:flex md:flex-1 md:m-2 justify-center md:justify-start">
                  <label className="cursor-pointer md:flex-none text-primary hover:text-primary-hover">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="form-checkbox text-[#FF8C00] border-gray-300 rounded
                        focus:ring-[#FF8C00]/20 transition-all duration-300"
                    />
                    <span className="ml-2 text-sm">
                      {t(translations.loginForm.rememberMe)}
                    </span>
                  </label>
                </div>
                <div className="flex justify-center md:justify-start md:flex-1">
                  <div className="md:flex-none md:mt-2">
                    <span
                      onClick={handleFlip}
                      className="cursor-pointer text-sm text-[#1A237E] hover:text-[#FF8C00]
                        transition-all duration-300 flex items-center"
                    >
                      {t(translations.loginForm.recoveryAccess)}
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 hover:text-[#FF8C00]"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Botón de Sign In para pantallas medianas y grandes */}
            <div className="hidden md:flex md:flex-1 md:m-2 md:justify-center">
              <LoadingButton
                type="submit"
                aria-label={
                  loading
                    ? t(translations.loginForm.signingIn)
                    : t(translations.loginForm.signIn)
                }
                className="bg-[#1A237E] text-white py-2 px-4 rounded hover:bg-[#FF8C00] md:w-auto
                  transition-all duration-300 
                  [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                  hover:shadow-lg transform hover:-translate-y-0.5
                  shadow-md hover:shadow-[#FF8C00]/20"
                faIcon={faSignInAlt}
                loading={loading}
              />
            </div>
          </div>
        </form>
        {/* {error && (
          <p className="text-red-500 text-sm text-center mt-2 px-4">{error}</p>
        )} */}
      </div>
    </div>
  );
};

export default LoginForm;
