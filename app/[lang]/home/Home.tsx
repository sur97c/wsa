// app/[lang]/home/Home.tsx

// "use client"

import React, { useState } from "react"
import clsx from "clsx"
import { FlipCard } from "@components/flip-card/FlipCard"
import { useFlip } from "@providers/flip-provider"
import { useTranslations } from "@hooks/useTranslations"
import LoginForm from "@components/login/LoginForm"
import RecoveryForm from "@components/login/RecoveryForm"
import Header from "./Header"
import FeatureSection from "./FeatureSection"

const Home: React.FC = () => {
  const { t, translations } = useTranslations()
  const [showLogin, setShowLogin] = useState(false)
  const { setIsFlipped } = useFlip()
  const [isTransitioning, setIsTransitioning] = useState(false)

  const handleLoginClick = () => {
    setIsFlipped(false)
    setShowLogin(true)
    requestAnimationFrame(() => {
      setIsTransitioning(true)
    })
  }

  const handleCloseLogin = () => {
    setIsTransitioning(false)
    setTimeout(() => {
      setShowLogin(false)
      setIsFlipped(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen relative">
      <Header />
      <main className="flex flex-col">
        <section
          className="flex flex-col items-center justify-center px-4 md:px-6 
            text-center mb-32"
        >
          {" "}
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

        <div className="relative">
          <FeatureSection />
        </div>
      </main>

      {showLogin && (
        <div
          className={clsx(
            "fixed inset-0 bg-black transition-all duration-1000",
            isTransitioning ? "bg-opacity-50" : "bg-opacity-0"
          )}
          style={{ marginTop: "-150px" }}
        >
          <div className="flex items-center justify-center min-h-screen px-4">
            <div
              className={clsx(
                "transform transition-all duration-1000 w-full",
                isTransitioning
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
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
                    frontContent={<LoginForm onClose={handleCloseLogin} />}
                    backContent={<RecoveryForm onClose={handleCloseLogin} />}
                    extraWidth={90}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
