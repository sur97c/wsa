// app/[lang]/home/Header.tsx

"use client"

import Link from "next/link"
import Image from "next/image"
import React, { useState } from "react"
import clsx from "clsx"
import { Globe, Menu, X } from "lucide-react"
import { useLanguage } from "@hooks/useLanguage"
import { useTranslations } from "@hooks/useTranslations"

const Header: React.FC = () => {
  const { language, changeLanguage } = useLanguage()
  const { t, translations } = useTranslations()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Definimos un tipo para las claves del menú
  type MenuKey = keyof typeof translations.header.menu

  // Especificamos el tipo de los items del menú
  const menuItems: { key: MenuKey; href: string }[] = [
    { key: "about", href: "#" },
    { key: "services", href: "#" },
    { key: "contact", href: "#" },
  ]

  const toggleLanguage = () => {
    changeLanguage(language === "es" ? "en" : "es")
  }

  // Helper function para obtener la traducción del menú
  const getMenuTranslation = (key: MenuKey): string => {
    return t(translations.header.menu[key])
  }

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
                  <a className="text-gray-600 transition-colors hover:text-[#FF8C00]">
                    {getMenuTranslation(item.key)}
                  </a>
                </Link>
              ))}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-gray-600"
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
  )
}

export default Header