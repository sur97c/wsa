// app/[lang]/page.tsx

"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import clsx from "clsx";
import { Globe, Menu, X } from "lucide-react";
import { FlipCard } from "@components/flip-card/FlipCard";
import { useFlip } from "@providers/flip-provider";
import { useLanguage } from "@hooks/useLanguage";
import { useTranslations } from "@hooks/useTranslations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import LoadingButton from "@components/loading-button/LoadingButton";
import LoginForm from "@components/header/LoginForm";
import { recoverAccess } from "@lib/redux/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@lib/redux/store";

interface FeatureCardProps {
  title: string;
  description: string;
}

// Definición del Header con menú de navegación y selector de idioma
const Header: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { t, translations } = useTranslations();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Definimos un tipo para las claves del menú
  type MenuKey = keyof typeof translations.header.menu;

  // Especificamos el tipo de los items del menú
  const menuItems: { key: MenuKey; href: string }[] = [
    { key: "about", href: "#" },
    { key: "services", href: "#" },
    { key: "contact", href: "#" },
  ];

  const toggleLanguage = () => {
    changeLanguage(language === "es" ? "en" : "es");
  };

  // Helper function para obtener la traducción del menú
  const getMenuTranslation = (key: MenuKey): string => {
    return t(translations.header.menu[key]);
  };

  return (
    <header className="w-full py-4 px-4 md:py-6 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          <Image
            src="/images/WSA-logo.png"
            alt="WSA Logo"
            width={16}
            height={16}
            priority={true}
            className="transition-all duration-500 w-16 h-16 md:w-24 md:h-24
            [filter:grayscale(100%)_brightness(0.8)_contrast(1.2)]
            hover:[filter:grayscale(0%)]"
          />
        </div>

        <button
          className="md:hidden p-2 text-gray-600 hover:text-[#FF8C00] transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex items-center space-x-6">
          {menuItems.map((item) => (
            <Link key={item.key} href={item.href} legacyBehavior>
              <a
                className="text-gray-600 transition-all duration-300 
                hover:text-[#FF8C00] [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                relative after:content-[''] after:absolute after:w-0 after:h-0.5 
                after:bg-[#FF8C00] after:left-0 after:-bottom-1 after:transition-all 
                hover:after:w-full"
              >
                {getMenuTranslation(item.key)}
              </a>
            </Link>
          ))}

          <div className="relative">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-full
                transition-all duration-300
                [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                text-gray-600 hover:text-[#FF8C00]
                bg-gray-100 hover:bg-gray-200"
            >
              <Globe className="w-5 h-5" />
              <span className="text-sm font-medium">
                {language === "es"
                  ? t(translations.home.spanish)
                  : t(translations.home.english)}
              </span>
            </button>
          </div>
        </nav>

        <div
          className={clsx(
            "fixed inset-0 bg-white z-50 transition-transform duration-300 md:hidden",
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          <div className="p-4">
            <button
              className="absolute top-4 right-4 p-2 text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </button>
            <nav className="flex flex-col space-y-4 mt-16">
              {menuItems.map((item) => (
                <Link key={item.key} href={item.href} legacyBehavior>
                  <a className="text-gray-600 text-lg py-2 transition-colors hover:text-[#FF8C00]">
                    {getMenuTranslation(item.key)}
                  </a>
                </Link>
              ))}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 py-2 text-gray-600"
              >
                <Globe className="w-5 h-5" />
                <span>
                  {language === "es"
                    ? t(translations.home.spanish)
                    : t(translations.home.english)}
                </span>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

// Componente de tarjeta de características
const FeatureCard: React.FC<FeatureCardProps> = ({ title, description }) => (
  <div
    className="p-4 md:p-6 bg-white rounded-lg shadow-md transition-all duration-500 
    border border-transparent hover:border-[#FF8C00]
    [filter:grayscale(100%)_brightness(0.95)] hover:[filter:grayscale(0%)_brightness(1)]
    hover:shadow-lg hover:-translate-y-1 transform group"
  >
    <h3
      className="text-base md:text-lg font-semibold mb-2 text-gray-800 
      group-hover:text-[#1A237E] transition-colors duration-300"
    >
      {title}
    </h3>
    <p
      className="text-sm md:text-base text-gray-600 group-hover:text-[#1A237E]/80 
      transition-colors duration-300"
    >
      {description}
    </p>
  </div>
);

// Componente de sección de características
const FeatureSection: React.FC = () => {
  const { translations } = useTranslations();

  const features = translations.home.cards.map((card) => ({
    title: card.title || "",
    description: card.description || "",
  }));

  return (
    <section className="px-4 md:px-6 lg:px-8 max-w-4xl mx-auto mb-20">
      {" "}
      {/* Quitamos position absolute */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

// Componente RecoveryForm
const RecoveryForm: React.FC<{ onClose: () => void }> = ({
  onClose,
}) => {
  const { t, translations } = useTranslations();
  const { toggleFlip } = useFlip();
  const [email, setEmail] = useState("");
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  const handleRecoverAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(recoverAccess(email));
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
    <div className="back">
      <button
        onClick={handleCloseLogin}
        className="absolute top-4 right-4 text-gray-500 hover:text-[#FF8C00]
      transition-colors duration-300 z-10"
      >
        <X size={24} />
      </button>
      <div className="bg-white p-2 rounded-md border-b">
        <form className="p-2">
          <div className="flex flex-col">
            <div className="w-full">
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
                    className="bg-[#1A237E] text-white py-2 px-4 rounded hover:bg-[#FF8C00] w-full
                    transition-all duration-300 md:mt-12
                    [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
                    hover:shadow-lg transform hover:-translate-y-0.5
                    shadow-md hover:shadow-[#FF8C00]/20"
                    faIcon={faPaperPlane}
                    loading={loading}
                  />
                </div>
              </div>
              <div className="md:mt-2 mt-4 text-center">
                <span className="block text-sm font-medium text-dark">
                  {t(translations.loginForm.recoveryAccessInfo)}
                </span>
              </div>
            </div>
            <div className="flex justify-center mb-2 mt-4">
              <button
                type="button"
                aria-label={t(translations.loginForm.signIn)}
                onClick={handleFlip}
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
};

// Componente principal NewHome
const NewHome: React.FC = () => {
  const { t, translations } = useTranslations();
  const [showLogin, setShowLogin] = useState(false);
  const { setIsFlipped } = useFlip();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleLoginClick = () => {
    setIsFlipped(false);
    setShowLogin(true);
    requestAnimationFrame(() => {
      setIsTransitioning(true);
    });
  };

  const handleCloseLogin = () => {
    setIsTransitioning(false);
    setTimeout(() => {
      setShowLogin(false);
      setIsFlipped(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="flex flex-col">
        <section
          className="flex flex-col items-center justify-center px-4 md:px-6 
          text-center mb-32"
        >
          {" "}
          {/* Ajustamos márgenes */}
          <h1
            className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 
            transition-all duration-500 max-w-4xl
            [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
            hover:text-[#1A237E]"
          >
            {t(translations.home.welcome)}
          </h1>
          <p
            className="text-base md:text-lg lg:text-xl mb-8 text-gray-600 
            transition-all duration-300 max-w-2xl px-4
            hover:text-[#1A237E]/80"
          >
            {t(translations.home.message)}
          </p>
          <button
            onClick={handleLoginClick}
            className="px-6 py-2 bg-gray-800 text-white rounded transition-all duration-500
              [filter:grayscale(100%)] hover:[filter:grayscale(0%)]
              hover:bg-[#FF8C00] hover:shadow-lg transform hover:-translate-y-0.5
              shadow-md hover:shadow-[#FF8C00]/20"
          >
            {t(translations.home.login)}
          </button>
        </section>

        {/* FeatureSection - Ajustamos el posicionamiento */}
        <div className="relative">
          <FeatureSection />
        </div>
      </main>

      {showLogin && (
        <div
          className={clsx(
            "fixed inset-0 bg-black transition-all duration-1000",
            isTransitioning ? "bg-opacity-50" : "bg-opacity-0" // Fondo gradual
          )}
          style={{ marginTop: "-150px" }}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className={clsx(
                "transform transition-all duration-1000 w-full",
                isTransitioning
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0" // Slide y fade inicial
              )}
            >
              <div
                className={clsx(
                  "bg-white rounded-lg shadow-lg",
                  "transition-all duration-1000",
                  "[filter:grayscale(100%)] hover:[filter:grayscale(0%)]",
                  "hover:shadow-xl hover:shadow-[#FF8C00]/20",
                  "border-transparent hover:border-[#FF8C00]",
                  "relative"
                )}
              >
                <div className="relative">
                  <FlipCard
                    frontContent={
                      <LoginForm
                        onClose={handleCloseLogin}
                      />
                    }
                    backContent={
                      <RecoveryForm
                        onClose={handleCloseLogin}
                      />
                    }
                    extraWidth={90}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Home() {
  return <NewHome />;
}
