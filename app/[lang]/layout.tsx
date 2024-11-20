// app/[lang]/layout.tsx
import { FlipProvider } from "@providers/flip-provider";
import { redirect } from "next/navigation"

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  // Validar el idioma
  if (params.lang !== 'es' && params.lang !== 'en') {
    redirect('/es');
  }

  return (
    <main className="min-h-screen">
      <FlipProvider>
        {children}
      </FlipProvider>
    </main>
  );
}
