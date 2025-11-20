"use client";

import { PrimeReactProvider } from "primereact/api";
import { useLayoutEffect, useState } from "react";

export default function PrimeReactWrapper({ children }) {
  const [mount, setMount] = useState(false);
  useLayoutEffect(() => {
    setMount(true);
  }, []);

  if (!mount) return null;
  return (
    <PrimeReactProvider value={{ ripple: true, unstyled: false }}>
      {children}
    </PrimeReactProvider>
  );
}
