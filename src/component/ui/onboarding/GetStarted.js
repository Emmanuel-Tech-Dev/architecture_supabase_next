"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import "primereact/resources/themes/lara-light-indigo/theme.css";

const AccountSetup = () => {
  const router = useRouter();
  const [isStarted, setIsStarted] = useState(false);

  const handleGetStarted = () => {
    setIsStarted(true);
    console.log("Getting started with setup");
    // Navigate to next step
    router.push("/onboarding/payment_gateway");
  };

  const handleHelp = () => {
    console.log("Opening help");
    // Open help modal or navigate to help page
  };

  const handleSaveForLater = () => {
    console.log("Saving progress for later");
    // Save progress and navigate away
  };

  const handleNext = () => {
    if (isStarted) {
      console.log("Navigate to next step");
      router.push("/onboarding/step-2");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col ">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <Card className="w-full max-w-4xl !shadow-sm !p-0 overflow-hidden !rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Content */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 md:w-1/2">
              <div>
                {/* Progress Bar */}
                <div className="mb-8">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Step 1 of 5
                  </p>
                  <ProgressBar
                    value={20}
                    showValue={false}
                    className="!h-1.5"
                  />
                </div>

                {/* Headline */}
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                  Let&apos;s get your account set up
                </h1>

                {/* Description */}
                <p className="text-gray-600">
                  In just 5 quick steps, you&apos;ll be ready to integrate with
                  our platform and unlock powerful tools for your business. The
                  setup process is quick and easy.
                </p>
              </div>

              {/* Get Started Button */}
              <div className="mt-10">
                <Button
                  label="Get Started"
                  onClick={handleGetStarted}
                  className="w-full !bg-indigo-600 hover:!bg-indigo-700 !border-none shadow-sm"
                  size="small"
                />
              </div>
            </div>

            {/* Right Section - Image */}
            <div className="hidden md:flex md:w-1/2 items-center justify-center p-4">
              <div
                className="aspect-square w-full h-full max-h-[400px] rounded-lg bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC5e53l4X8aBNGIpQAQl-M8PpqgKxp0K3Dwjn0ntx1m0aRW4aRltOW5DbEYEx1M_xvjC5Kh0BBmGb1cL9htKppTtpJLZZaT443vzPG96JJq546RiVp-KVD0IlgkR4_PHdhFUtkncQX27lkX0odiDw9iEkAiDef80Dzde7-wbn3v-4YLj2CVM5BBtSPoKqcrH6xiz-TpI_opz_3q2HnmQMFATbo0dNIIdY5Y-bQpMG7dmSZij-LMM8Cf6-mI_5zBJ2o2KzakbgYWyeXb")',
                }}
                role="img"
                aria-label="Abstract gradient of blue and purple shapes in a circular motion"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 w-full border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between p-4 sm:p-6">
          {/* Help Button */}
          <Button
            label="Help"
            icon="pi pi-question-circle"
            text
            onClick={handleHelp}
            className="!text-gray-600 hover:!bg-gray-100"
          />

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4">
            <Button
              label="Save for later"
              text
              onClick={handleSaveForLater}
              className="!text-gray-600 hover:!bg-gray-100"
              size="small"
            />
            <Button
              label="Next"
              onClick={handleNext}
              disabled={!isStarted}
              className="!bg-indigo-600 hover:!bg-indigo-700 !border-none disabled:!opacity-50 disabled:!bg-gray-200 disabled:!text-gray-400"
              size="small"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AccountSetup;
