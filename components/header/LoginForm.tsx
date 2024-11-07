// components/header/LoginForm.tsx

"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";
import { loginUser, recoverAccess } from "@lib/redux/slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faPaperPlane,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { FlipCard } from "@components/flip-card/FlipCard";
import { useFlip } from "@providers/flip-provider";
import { useTranslations } from "@hooks/useTranslations";
import LoadingButton from "@components/loading-button/LoadingButton";
import "@fortawesome/fontawesome-svg-core/styles.css";
import useMaxDimensions from "@hooks/useMaxDimensions";

interface FlipCardProps {
  showLogin: boolean;
  onTransitionEnd?: () => void;
}

const LoginForm: React.FC<FlipCardProps> = ({ showLogin }) => {
  const { t, translations } = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { toggleFlip } = useFlip();
  const { ref, dimensions } = useMaxDimensions<HTMLDivElement>();
  const { loading, error } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLoginUser = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password, rememberMe }));
  };

  const handleRecoverAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(recoverAccess(email));
  };

  const handleToggleFlip = () => {
    if (toggleFlip) toggleFlip();
  };

  const frontContent = (
    <div className="front">
      <div className="bg-white p-2 rounded-md border-b">
        <form onSubmit={handleLoginUser} className="p-4">
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
                    className="form-input px-3 py-2 border border-light rounded md:w-auto w-full"
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
                    className="form-input px-3 py-2 border border-light rounded md:w-auto w-full"
                  />
                </div>
                {/* Checkbox para pantallas pequeñas */}
                <div className="flex justify-center md:justify-start md:flex-1 md:hidden">
                  <label className="cursor-pointer md:flex-none text-primary hover:text-primary-hover">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="form-checkbox text-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">
                      {t("loginForm.rememberMe")}
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
                  className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover w-full"
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
                      className="form-checkbox text-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm">
                      {t("loginForm.rememberMe")}
                    </span>
                  </label>
                </div>
                <div className="flex justify-center md:justify-start md:flex-1">
                  <div className="md:flex-none md:mt-2">
                    <span
                      onClick={handleToggleFlip}
                      className="cursor-pointer text-sm text-primary hover:text-primary-hover"
                    >
                      {t(translations.loginForm.recoveryAccess)}
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="ml-2 hover:text-primary-hover"
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
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover md:w-auto"
                faIcon={faSignInAlt}
                loading={loading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  const backContent = (
    <div className="back">
      <div className="bg-white p-2 rounded-md border-b">
        <form className="p-2">
          <div className="flex flex-col">
            <div className="w-full">
              <div className="text-center">
                <span className="block text-sm font-medium text-dark">
                  {t(translations.loginForm.recoveryAccessInfo)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb:ml-2 mb:mr-2">
                <div className="w-full sm:flex-grow">
                  <label
                    htmlFor="recover-email"
                    className="block text-sm font-medium text-dark mb-2 sm:mb-0 sm:mr-2"
                  >
                    {t(translations.loginForm.emailToRecoveryAccess)}
                  </label>
                  <input
                    id="recover-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input w-full px-3 py-2 border border-light rounded"
                  />
                </div>
                <div className="w-full sm:w-auto">
                  <LoadingButton
                    type="button"
                    onClick={handleRecoverAccess}
                    aria-label={
                      loading
                        ? t(translations.loginForm.sendingEmail)
                        : t(translations.loginForm.sendEmail)
                    }
                    className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-hover w-full sm:w-auto"
                    faIcon={faPaperPlane}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mb-2 mt-4">
              <button
                type="button"
                aria-label={t(translations.loginForm.signIn)}
                onClick={handleToggleFlip}
                className="text-primary hover:text-primary-hover flex items-center"
              >
                <FontAwesomeIcon
                  icon={faArrowLeft}
                  className="mr-2 hover:text-primary-hover"
                />
                <span>{t(translations.loginForm.signIn)}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div
      ref={ref}
      className={`absolute duration-700 ease-in-out overflow-hidden right-0 transition-all`}
      style={{
        height: showLogin ? `${dimensions.maxHeight || 0}px` : "0",
        width: showLogin ? `${dimensions.maxWidth || 0}px` : "0",
        marginRight: "-18px",
        zIndex: 40,
      }}
    >
      <FlipCard frontContent={frontContent} backContent={backContent} />
      {error && (
        <p className="flex justify-center mt-2 text-red-500">{error}</p>
      )}
    </div>
  );
};

export default LoginForm;
