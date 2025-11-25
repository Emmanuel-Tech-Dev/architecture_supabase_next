"use client";
import { useDataView } from "@/hooks/useDataView"; // Adjust path as needed
import Image from "next/image";
import { Button } from "primereact/button";
import { Rating } from "primereact/rating";
import React, { useEffect, useState } from "react";
import CustomTag from "../shared/CustomTag";
import { utils } from "@/libs/utils";
import PageHeader from "../shared/PageHeader";
import EmptyState from "../shared/EmptyState";
import useConfirmDiaglog from "@/hooks/useConfirmDialog";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import useSideBar from "@/hooks/useSideBar";
import { Sidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Slider } from "primereact/slider";
import { RadioButton } from "primereact/radiobutton";
import { Checkbox } from "primereact/checkbox";

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
  const { confirmAction } = useConfirmDiaglog();
  const sideBar = useSideBar();
  const [searchTerm, setSearchTerm] = useState("");
  const [commissionRate, setCommissionRate] = useState([0, 100]);
  const [selectedCategories, setSelectedCategories] = useState(["fashion"]);
  const [cookieDuration, setCookieDuration] = useState("30");

  const categories = [
    { id: "fashion", label: "Fashion" },
    { id: "tech", label: "Tech" },
    { id: "finance", label: "Finance" },
    { id: "health", label: "Health & Wellness" },
  ];

  const durations = [
    { id: "30", label: "30 Days" },
    { id: "60", label: "60 Days" },
    { id: "90", label: "90+ Days" },
  ];

  const handleCategoryChange = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(
        selectedCategories.filter((id) => id !== categoryId)
      );
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handleApplyFilters = () => {
    console.log("Applying filters:", {
      search: searchTerm,
      categories: selectedCategories,
      commissionRate,
      cookieDuration,
    });
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setCommissionRate([0, 100]);
    setCookieDuration("");
  };

  function accept() {
    console.log("accept triggered ");
  }

  function close() {
    console.log("close triggered ");
  }

  function openSideBar() {
    sideBar.setVisible(true);
    sideBar.setPosition("right");
  }

  useEffect(() => {
    if (data) {
      cards.setData(data);
      cards.setTemplateGrid("md:grid-cols-4");
    }
  }, [data]);

  function gridItem(product) {
    return (
      <div className="col-span-1" key={product.id}>
        <div className="p-3 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              {product?.merchants?.logo_url ? (
                <Image
                  src={product.merchants.logo_url}
                  alt={product.merchants.company_name}
                  className="w-14 h-14 object-cover rounded-lg shadow-lg ring-4 ring-white"
                  width={100}
                  height={100}
                />
              ) : (
                <div className="w-20 h-20 bg-linear-to-br from-blue-400 to-indigo-500 rounded-lg shadow-lg ring-4 ring-white flex items-center justify-center">
                  <i className="pi pi-building text-white text-3xl"></i>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {product?.name}{" "}
                </h3>
                <p className="text-xs text-gray-600">
                  {product?.merchants?.company_name || "Company Name"}
                </p>
              </div>
            </div>
            {product.is_active && (
              <div className="">
                <CustomTag
                  value="Active"
                  severity="success"
                  className="!bg-green-500 !text-white !px-3 !py-1 !text-xs !font-semibold"
                />
              </div>
            )}
          </div>

          {/* Commission Highlight */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-2 border border-green-200">
            <div className="flex items-center justify-center gap-2">
              <i className="pi pi-money-bill text-green-600 text-xl"></i>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
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
            onClick={() => {
              const message = (
                <p className="text-slate-500">
                  Are you sure you want to apply to join the{" "}
                  <b className="text-slate-800">{product?.name}</b> affiliate
                  program? Your request will be sent to the program manager for
                  review
                </p>
              );

              confirmAction(accept, message, "Join Program?");
            }}
          />

          {/* Footer Info */}
          <div className="px-6 mt-3  pt-3 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <i className="pi pi-calendar"></i>
              <span>Added {utils.formatDateV3(product?.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  function filterJsx() {
    return (
      <>
        <Button
          icon="pi pi-filter"
          text
          tooltip="Advanced filters"
          tooltipOptions={{ position: "left" }}
          onClick={() => openSideBar()}
        />
      </>
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
          filterjsx: filterJsx(),
        })}
      </div>

      {sideBar.sider(
        {
          header: <h1 className="font-bold">Filter Programs</h1>,
          // className: "w-full md:!w-[20rem] lg:!w-[30rem]",
          // icons: (
          //   <>
          //     <button className="p-sidebar-icon p-link mr-2">
          //       <span className="pi pi-search" />
          //     </button>
          //   </>
          // ),
        },
        <>
          <div className="w-full">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-base font-semibold text-gray-900">
                Advanced Filter
              </h2>
            </div>

            <div className=" mt-5 space-y-6">
              {/* Search */}
              <div>
                <IconField iconPosition="left">
                  <InputIcon className="pi pi-search"> </InputIcon>
                  <InputText placeholder="Search by company name" />
                </IconField>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Categories
                </h3>
                <div className="space-y-2.5">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <Checkbox
                        inputId={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={category.id}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Commission Rate */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Commission Rate
                </h3>
                <div className="space-y-3">
                  <Slider
                    value={commissionRate}
                    onChange={(e) => setCommissionRate(e.value)}
                    range
                    min={0}
                    max={100}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>{commissionRate[0]}%</span>
                    <span>{commissionRate[1]}%</span>
                  </div>
                </div>
              </div>

              {/* Cookie Duration */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Cookie Duration
                </h3>
                <div className="space-y-2.5">
                  {durations.map((duration) => (
                    <div key={duration.id} className="flex items-center">
                      <RadioButton
                        inputId={duration.id}
                        value={duration.id}
                        checked={cookieDuration === duration.id}
                        onChange={(e) => setCookieDuration(e.value)}
                        className="mr-2"
                      />
                      <label
                        htmlFor={duration.id}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {duration.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <Button
                label="Apply Filters"
                onClick={handleApplyFilters}
                className="w-full !bg-indigo-600 hover:!bg-indigo-700 !border-none"
                size="small"
              />

              {/* Reset Button */}
              <Button
                label="Reset"
                onClick={handleReset}
                text
                className="w-full !text-gray-600 hover:!text-gray-900"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default MarketPlace;
