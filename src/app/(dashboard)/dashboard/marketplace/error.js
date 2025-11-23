// app/marketplace/error.js (or wherever your page is)
"use client";

import EmptyState from "@/component/shared/EmptyState";
import { Button } from "primereact/button";
import { useState } from "react";

export default function Error({ error, reset }) {
  const [isResetting, setIsResetting] = useState(false);
  const handleReset = async () => {
    setIsResetting(true);
    try {
      await reset();
    } finally {
      // Reset will navigate away if successful, so this might not run
      setIsResetting(false);
    }
  };
  return (
    <div className="min-h-screen p-4">
      <div className="  card bg-white p-2 rounded-lg shadow-sm border border-gray-200 mt-12">
        <EmptyState
          message={error.message || "Failed to load marketplace data"}
          actionText="Something went wrong"
          onAction={handleReset}
          disabled={isResetting}
        />
      </div>
    </div>
  );
}
