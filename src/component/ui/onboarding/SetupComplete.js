"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-green/theme.css";

const SetupComplete = () => {
  const router = useRouter();

  const handleGoToDashboard = () => {
    console.log("Navigating to dashboard");
    router.push("/dashboard");
  };

  const handleHelpCenter = () => {
    console.log("Opening help center");
    // Open help center or navigate to help page
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg flex flex-col items-center">
        {/* Progress Bar */}
        <div className="w-full px-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-medium text-gray-600">
              Step 5 of 5: Complete
            </p>
          </div>
          <ProgressBar
            value={100}
            showValue={false}
            className="!h-2 bg-green-500"
          />
        </div>

        {/* Main Content Card */}
        <Card className="w-full !shadow-sm text-center">
          <div className="flex flex-col items-center py-4 sm:py-8">
            {/* Success Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-200">
                <i className="pi pi-check text-4xl text-green-600"></i>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              You&apos;re all set!
            </h1>

            {/* Body Text */}
            <p className="text-base text-gray-600 max-w-md mb-8">
              Congratulations! You&apos;ve successfully connected your account
              and are ready to start using the platform.
            </p>

            {/* Primary Button */}
            <div className="w-full flex justify-center mb-8">
              <Button
                label="Go to Dashboard"
                onClick={handleGoToDashboard}
                className="w-full max-w-xs !bg-green-600 hover:!bg-green-700 !border-none"
                size="small"
              />
            </div>

            {/* Secondary Link */}
            <Button
              label="Explore our Help Center"
              link
              onClick={handleHelpCenter}
              className="!text-gray-600 hover:!text-green-600"
              size="small"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SetupComplete;
