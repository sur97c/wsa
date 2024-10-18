// app/layout.tsx

import { Inter } from 'next/font/google'
import type { Metadata } from "next"
import { config } from '@fortawesome/fontawesome-svg-core'
import "@styles/globals.scss"
import '@fortawesome/fontawesome-svg-core/styles.css'
import { ClientProviders } from "@providers/client-provider"
import { AuthStateListener } from "@components/auth-state-listener/AuthStateListener"
import { FlipProvider } from "@providers/flip-provider"
import Header from '@components/header/Header'

config.autoAddCss = false

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: "WSA Brokers",
  description: "WSA Brokers BackOffice",
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang} className={`${inter.variable} font-sans`}>
      <body>
        <ClientProviders>
          <AuthStateListener>
            <div>
              <FlipProvider>
                <Header />
              </FlipProvider>
            </div>
            <main className="container mx-auto">
              <div className="m-4">
                {children}
              </div>
            </main>
          </AuthStateListener>
        </ClientProviders>
      </body>
    </html>
  )
}
