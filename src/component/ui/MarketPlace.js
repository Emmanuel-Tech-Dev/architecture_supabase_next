"use client";
import { useDataView } from "@/hooks/useDataView"; // Adjust path as needed
import Image from "next/image";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import React, { useEffect } from "react";
import CustomTag from "../shared/CustomTag";
import { utils } from "@/libs/utils";
import PageHeader from "../shared/PageHeader";
import EmptyState from "../shared/EmptyState";

const MarketPlace = ({ data }) => {
  const cards = useDataView(
    null,
    {
      pagination: { rows: 10 },
      initialData: data,
      sortOptions: [
        { label: " High Commision", value: "!commission_value" },
        { label: "Low  Commision", value: "commission_value" },
        { label: "Longer cookie time", value: "!cookie_duration" },
        { label: "shorter cookie time", value: "cookie_duration" },
      ],
    },
    gridItem
  );

  useEffect(() => {
    if (data) {
      cards.setData(data);
    }
  }, [data]);

  function gridItem(product) {
    return (
      <div className=" p-3 col-span-1" key={product.id}>
        <div className="relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          {/* Status Badge */}
          {product.is_active && (
            <div className="absolute top-3 right-3 z-10">
              <CustomTag
                value="Active"
                severity="success"
                className="!bg-green-500 !text-white !px-3 !py-1 !text-xs !font-semibold"
              />
            </div>
          )}

          {/* Header with Logo */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-3">
            <div className="flex justify-center">
              {product?.merchants?.logo_url ? (
                <Image
                  src={product.merchants.logo_url}
                  alt={product.merchants.company_name}
                  className="w-20 h-20 object-cover rounded-lg shadow-lg ring-4 ring-white"
                  width={150}
                  height={150}
                />
              ) : (
                <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-indigo-500 rounded-lg shadow-lg ring-4 ring-white flex items-center justify-center">
                  <i className="pi pi-building text-white text-3xl"></i>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Company Info */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {product?.merchants?.company_name || "Company Name"}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                {product?.name}
              </p>
            </div>

            {/* Commission Highlight */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-2 border border-green-200">
              <div className="flex items-center justify-center gap-2">
                <i className="pi pi-money-bill text-green-600 text-xl"></i>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700">
                    {product?.commission_value}%
                  </div>
                  <div className="text-xs text-green-600 font-medium uppercase tracking-wide">
                    Commission
                  </div>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="space-y-3 mb-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <i className="pi pi-clock text-blue-600"></i>
                  <span className="text-sm text-gray-600">Cookie Duration</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {product?.cookie_duration} days
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <i className="pi pi-percentage text-purple-600"></i>
                  <span className="text-sm text-gray-600">Commission Type</span>
                </div>
                <CustomTag
                  value={product?.commission_type}
                  className="!bg-purple-100 !text-purple-700 !capitalize !text-xs !font-semibold"
                />
              </div>
            </div>

            {/* Action Button */}
            <Button
              label="Join program"
              icon="pi pi-arrow-right"
              iconPos="right"
              className="w-full !bg-gradient-to-r !from-blue-600 !to-indigo-600 hover:!from-blue-700 hover:!to-indigo-700 !border-none !text-white !font-semibold !py-3 !rounded-lg !shadow-md hover:!shadow-lg !transition-all"
              disabled={!product?.is_active}
              onClick={() => console.log(product)}
            />
          </div>

          {/* Footer Info */}
          <div className="px-6 pb-4 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <i className="pi pi-calendar"></i>
              <span>Added {utils.formatDateV3(product?.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        pageTitle={"Affiliate Marketplace"}
        desc={"Discover endless earning opportunities"}
      />

      <div className="card p-2 bg-white rounded-md">
        {/* You don't need to pass listTemplate here anymore, the hook handles it */}
        {cards.dataView({
          header: "Marketplace Results",
        })}
      </div>
    </>
  );
};

export default MarketPlace;
