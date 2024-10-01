// app/layout.tsx
import type { Metadata } from "next"
import { config } from '@fortawesome/fontawesome-svg-core'
import { Inter } from 'next/font/google'
import "@styles/globals.scss"
import '@fortawesome/fontawesome-svg-core/styles.css'
// import { AuthStateListener } from "@components/auth-state-listener/AuthStateListener"
// import { FlipProvider } from "@providers/flip-provider"
// import { RootState, useAppSelector } from "@lib/redux/store"
import { ClientProviders } from "@providers/client-provider"
import { AuthStateListener } from "@components/auth-state-listener/AuthStateListener"
import { FlipProvider } from "@providers/flip-provider"
import Header from '@components/header/Header'
// import Navigation from "@components/navigation/Navigation"

config.autoAddCss = false;

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "WSA Brokers",
  description: "WSA Brokers BackOffice",
  icons: {
    icon: '/images/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);

  return (
    <html lang="es" className={`${inter.variable} font-sans`}>
      <body>
        <ClientProviders>
          <AuthStateListener>
            <div>
              <FlipProvider>
                <Header
                  setIsLoginOpen={setIsLoginOpen}
                  isLoginOpen={isLoginOpen}
                  title={activePage.title} />
              </FlipProvider>
              {/* 
              {isAuthenticated && <Navigation />} */}
            </div>
          </AuthStateListener>
          <main className="container mx-auto mt-4">
            {children}
          </main>
        </ClientProviders>
      </body >
    </html >
  );
}
