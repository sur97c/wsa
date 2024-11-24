// app/not-found.tsx

import ServerErrorPage from "@components/error/ServerErrorPage"

export default async function RootNotFound() {
  return (
    <ServerErrorPage lang="es" />
  );
}
