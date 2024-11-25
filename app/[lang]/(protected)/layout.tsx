// app/[lang]/(protected)/layout.tsx

import { AuthStateListener } from "@components/auth-state-listener/AuthStateListener";
import { FlipProvider } from "@providers/flip-provider";
import Header from "@components/header/Header";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthStateListener>
      <FlipProvider>
        <Header />
        <main className="container mx-auto">
          <div className="m-8">{children}</div>
        </main>
      </FlipProvider>
    </AuthStateListener>
  );
}
