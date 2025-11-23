"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default function Loader() {
  const pathname = usePathname();

  useEffect(() => {
    NProgress.configure({
      showSpinner: false,
      trickleSpeed: 200,
      minimum: 0.08,
    });
  }, []);

  useEffect(() => {
    NProgress.start();
    NProgress.done();
  }, [pathname]);

  return null;
}
