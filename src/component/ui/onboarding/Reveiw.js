"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-indigo/theme.css";

// Define components outside to prevent recreation
const DetailRow = ({ label, value, icon, onEdit }) => (
  <div className="flex justify-between items-center gap-6 py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex flex-col flex-1">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        {icon && <i className={`pi ${icon} text-green-500`}></i>}
        <p className="text-base font-medium text-gray-800">{value}</p>
      </div>
    </div>
    {label != "Payments" && (
      <Button
        label="Edit"
        text
        size="small"
        onClick={onEdit}
        className="!text-indigo-600 hover:!text-indigo-700"
      />
    )}
  </div>
);

const EditableDetailRow = ({
  label,
  value,
  onChange,
  field,
  onSave,
  onCancel,
}) => (
  <div className="flex flex-col gap-3 py-3 border-b border-gray-100 last:border-b-0">
    <div className="flex flex-col">
      <label htmlFor={field} className="text-sm text-gray-500 mb-2">
        {label}
      </label>
      <InputText
        id={field}
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="w-full"
      />
    </div>
    <div className="flex gap-2 justify-end">
      <Button
        label="Cancel"
        text
        size="small"
        onClick={onCancel}
        className="!text-gray-600"
      />
      <Button
        label="Save"
        icon="pi pi-check"
        size="small"
        onClick={onSave}
        className="!bg-indigo-600 !border-none"
      />
    </div>
  </div>
);

const Review = () => {
  const router = useRouter();
  const [editingField, setEditingField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    brandName: "My Awesome Store",
    brandSlug: "platform.com/my-awesome-store",
    paymentStatus: "Stripe Connected",
  });

  const [originalData, setOriginalData] = useState(formData);

  const handleEdit = useCallback(
    (field) => {
      setOriginalData(formData);
      setEditingField(field);
    },
    [formData]
  );

  const handleSave = useCallback(() => {
    console.log("Saving field:", editingField);
    setOriginalData(formData);
    setEditingField(null);
  }, [editingField, formData]);

  const handleCancel = useCallback(() => {
    setFormData(originalData);
    setEditingField(null);
  }, [originalData]);

  const handleFieldChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBack = () => {
    console.log("Navigate back");
    router.back();
  };

  const handleFinish = () => {
    setIsSubmitting(true);
    console.log("Finishing setup with data:", formData);

    setTimeout(() => {
      setIsSubmitting(false);
      console.log("Setup completed!");
      router.push("/onboarding/setup_complete");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex justify-center py-5 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[560px] flex flex-col">
          {/* Progress Bar */}
          <div className="mb-8 px-4">
            <p className="text-sm font-medium text-gray-800 mb-2">
              Step 4 of 4: Confirmation
            </p>
            <ProgressBar value={100} showValue={false} className="!h-2" />
          </div>

          {/* Card Container */}
          <Card className="!shadow-sm !p-0 overflow-hidden">
            {/* Page Heading */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm your details
              </h1>
              <p className="text-base text-gray-500">
                Please review the information below before completing your
                setup.
              </p>
            </div>

            {/* Details List */}
            <div className="p-6">
              {editingField === "brandName" ? (
                <EditableDetailRow
                  label="Brand Name"
                  value={formData.brandName}
                  field="brandName"
                  onChange={handleFieldChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <DetailRow
                  label="Brand Name"
                  value={formData.brandName}
                  onEdit={() => handleEdit("brandName")}
                />
              )}

              {editingField === "brandSlug" ? (
                <EditableDetailRow
                  label="Brand Slug"
                  value={formData.brandSlug}
                  field="brandSlug"
                  onChange={handleFieldChange}
                  onSave={handleSave}
                  onCancel={handleCancel}
                />
              ) : (
                <DetailRow
                  label="Brand Slug"
                  value={formData.brandSlug}
                  onEdit={() => handleEdit("brandSlug")}
                />
              )}

              <DetailRow
                label="Payments"
                value={formData.paymentStatus}
                icon="pi-check-circle"
                onEdit={() => handleEdit("paymentStatus")}
              />
            </div>
          </Card>
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-[560px] mx-auto">
          <div className="flex gap-3 p-4 justify-between">
            <Button
              label="Back"
              onClick={handleBack}
              className="!bg-gray-200 !text-gray-800 hover:!bg-gray-300 !border-gray-200 flex-1 sm:flex-none"
            />
            <Button
              label="Finish Setup"
              onClick={handleFinish}
              loading={isSubmitting}
              className="!bg-indigo-600 hover:!bg-indigo-700 !border-none flex-1 sm:flex-auto"
            />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Review;
