"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const Connect = () => {
  const router = useRouter();
  const [connectionState, setConnectionState] = useState("default"); // 'default', 'loading', 'success'

  const handleConnect = () => {
    setConnectionState("loading");

    // Simulate Stripe OAuth connection
    setTimeout(() => {
      setConnectionState("success");
      console.log("Stripe connected successfully");
      // In a real app, redirect to Stripe OAuth URL
      // window.location.href = "https://connect.stripe.com/oauth/authorize?...";
    }, 2000);
  };

  const handleBack = () => {
    console.log("Navigate back");
    router.back();
  };

  const handleNext = () => {
    if (connectionState === "success") {
      console.log("Navigate to next step");
      router.push("/onboarding/brand_url_setup");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl flex flex-col">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Step 2 of 5: Connect Payments
              </p>
            </div>
            <ProgressBar value={40} showValue={false} className="!h-2" />
          </div>

          {/* Card Container */}
          <Card className="!shadow-sm text-center p-8">
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-indigo-100 text-indigo-600">
                <i className="pi pi-wallet !text-3xl"></i>
              </div>

              {/* Headline */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-3">
                Connect your Stripe account
              </h1>

              {/* Description */}
              <p className="max-w-lg text-base leading-relaxed text-gray-600">
                To securely process payments and receive payouts, connect your
                Stripe account. This will enable credit card payments,
                subscription management, and automated invoicing. Your financial
                data is handled securely by Stripe.
              </p>

              {/* Button and State Section */}
              <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-xs">
                {/* Default State Button */}
                {connectionState === "default" && (
                  <Button
                    label="Connect with Stripe"
                    icon="pi pi-check"
                    onClick={handleConnect}
                    className="w-full !bg-[#635bff] hover:!bg-[#5469d4] !border-none"
                    size="small"
                  />
                )}

                {/* Loading State Button */}
                {connectionState === "loading" && (
                  <Button
                    label="Connecting..."
                    icon="pi pi-spin pi-spinner"
                    disabled
                    className="w-full !bg-[#5469d4] !opacity-80 !border-none"
                    size="small"
                  />
                )}

                {/* Success State Message */}
                {connectionState === "success" && (
                  <div className="w-full">
                    <Message
                      severity="success"
                      text="Stripe account connected successfully"
                      className="w-full justify-start"
                      icon="pi pi-check-circle"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 z-10 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Button
            label="Back"
            onClick={handleBack}
            text
            className="!text-gray-700 hover:!bg-gray-100"
            size="small"
          />
          <Button
            label="Next"
            onClick={handleNext}
            disabled={connectionState !== "success"}
            className="!bg-indigo-600 hover:!bg-indigo-700 !border-none disabled:!opacity-50"
            size="small"
          />
        </div>
      </footer>
    </div>
  );
};

export default Connect;
