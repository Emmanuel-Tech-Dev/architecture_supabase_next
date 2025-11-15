// components/ToastProvider.js
"use client"; // This makes it a client component

import { toastRef } from "@/libs/toastRef";
import { Toast } from "primereact/toast";

export default function ToastProvider() {
  return <Toast ref={toastRef} />;
}
