// app/layout.tsx

import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@styles/globals.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { ClientProviders } from "@providers/client-provider";
import { NavigationLoaderProvider } from "@components/navigation-loader/NavigationLoader";
import { Toaster } from "@components/ui/toast/Toaster";

config.autoAddCss = false;
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "WSA Brokers",
  description: "WSA Brokers",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={`${inter.variable} font-sans`}>
      <body>
        <ClientProviders>
          <NavigationLoaderProvider>
            <main>{children}</main>
            <Toaster />
          </NavigationLoaderProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
