// app/[lang]/not-found.tsx

// import { useTranslations } from "@hooks/useTranslations";

export default function LocaleNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-xl px-4 py-8 mx-auto text-center">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mt-4">Página no encontrada</p>
      </div>
    </div>
  );
}
