"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";

import "primereact/resources/themes/lara-light-indigo/theme.css";

const BrandUrlSetup = () => {
  const router = useRouter();
  const [slug, setSlug] = useState("acme-corp");
  const [validationState, setValidationState] = useState("success");
  const [isChecking, setIsChecking] = useState(false);
  const overlayRef = React.useRef(null);

  const checkSlugAvailability = (slugValue) => {
    if (!slugValue) {
      setValidationState("initial");
      return;
    }

    const isValidFormat = /^[a-z0-9-]+$/.test(slugValue);
    if (!isValidFormat) {
      setValidationState("error");
      return;
    }

    setIsChecking(true);
    setValidationState("checking");

    setTimeout(() => {
      const takenSlugs = ["admin", "api", "test", "demo"];

      if (takenSlugs.includes(slugValue)) {
        setValidationState("error");
      } else {
        setValidationState("success");
      }
      setIsChecking(false);
    }, 500);
  };

  const handleSlugChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      checkSlugAvailability(slug);
    }, 300);

    return () => clearTimeout(timer);
  }, [slug]);

  const handleBack = () => {
    console.log("Navigate back");
    router.back();
  };

  const handleContinue = () => {
    if (validationState === "success") {
      console.log("Continue with slug:", slug);
      router.push("/onboarding/review");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex justify-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl flex flex-col">
          {/* Progress Bar */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-800 mb-2 text-center">
              Step 3 of 5
            </p>
            <ProgressBar value={60} showValue={false} className="!h-2" />
          </div>

          {/* Card Container */}
          <Card className="!shadow-sm">
            {/* Page Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-2">
                Choose your Brand URL
              </h1>
              <p className="text-base text-gray-500 max-w-md mx-auto">
                This will be your unique address on our platform. Make it
                memorable!
              </p>
            </div>

            {/* Form Content */}
            <div className="flex flex-col gap-4">
              {/* Input Field with Tooltip */}
              <div className="flex flex-col w-full">
                <div className="flex items-center gap-2 mb-2">
                  <label
                    htmlFor="brand-slug"
                    className="text-base font-medium text-gray-900"
                  >
                    Brand Slug
                  </label>
                  <Button
                    icon="pi pi-question-circle"
                    rounded
                    text
                    size="small"
                    className="!text-gray-400 !p-0 !w-5 !h-5"
                    onClick={(e) => overlayRef.current.toggle(e)}
                    tooltip="Use letters, numbers, and hyphens. This cannot be changed later."
                    tooltipOptions={{ position: "top" }}
                  />
                </div>

                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon bg-gray-50 text-gray-500 border-r">
                    app.yoursite.com/
                  </span>
                  <InputText
                    id="brand-slug"
                    value={slug}
                    onChange={handleSlugChange}
                    placeholder="e.g., acme-corp"
                    className={`w-full ${
                      validationState === "error"
                        ? "p-invalid"
                        : validationState === "success"
                        ? "border-green-500"
                        : ""
                    }`}
                  />
                  {validationState === "success" && (
                    <span className="p-inputgroup-addon bg-white border-l-0">
                      <i className="pi pi-check-circle text-green-500"></i>
                    </span>
                  )}
                  {validationState === "error" && (
                    <span className="p-inputgroup-addon bg-white border-l-0">
                      <i className="pi pi-times-circle text-red-500"></i>
                    </span>
                  )}
                  {isChecking && (
                    <span className="p-inputgroup-addon bg-white border-l-0">
                      <i className="pi pi-spin pi-spinner"></i>
                    </span>
                  )}
                </div>
              </div>

              {/* Validation Message */}
              {validationState === "success" && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <i className="pi pi-check text-sm"></i>
                  <span>This slug is available!</span>
                </div>
              )}

              {validationState === "error" && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <i className="pi pi-times text-sm"></i>
                  <span>This slug is already taken or invalid.</span>
                </div>
              )}

              {/* URL Preview */}
              <div className="mt-2 p-4 rounded-lg bg-gray-100 border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Your URL will be:</p>
                <p className="text-base text-gray-800 break-all">
                  app.yoursite.com/
                  <span className="text-indigo-600 font-semibold">
                    {slug || "your-slug"}
                  </span>
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 w-full bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-2xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center gap-4">
            <Button
              label="Back"
              onClick={handleBack}
              className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200 !border-gray-100"
              size="small"
            />
            <Button
              label="Continue"
              onClick={handleContinue}
              disabled={validationState !== "success"}
              className="!bg-indigo-600 hover:!bg-indigo-700 !border-none disabled:!opacity-50"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BrandUrlSetup;
