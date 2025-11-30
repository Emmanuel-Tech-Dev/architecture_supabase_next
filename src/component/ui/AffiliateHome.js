"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PageHeader from "../shared/PageHeader";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { utils } from "@/libs/utils";

const AffiliateHome = () => {
  const [slug, setSlug] = useState("acme-corp");
  const [validationState, setValidationState] = useState("success");
  const [isChecking, setIsChecking] = useState(false);
  const overlayRef = useRef(null);

  const [brushStart, setBrushStart] = useState(null);
  const [brushEnd, setBrushEnd] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: "",
    end: "",
  });
  const contextChartRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(null);

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

  const generateMockData = useMemo(() => {
    const data = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);

    for (let i = 0; i < 180; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString().split("T")[0],
        sales: Math.floor(Math.random() * 5000) + 15000,
        revenue: Math.floor(Math.random() * 50000) + 150000,
        users: Math.floor(Math.random() * 500) + 1000,
      });
    }
    return data;
  }, []);

  const allData = generateMockData;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Initialize with last 7 days
  useEffect(() => {
    const endIdx = allData.length - 1;
    const startIdx = Math.max(0, endIdx - 6);
    setBrushStart(startIdx);
    setBrushEnd(endIdx);
    updateDetailData(startIdx, endIdx);
  }, []);

  const updateDetailData = (start, end) => {
    const filteredData = allData.slice(start, end + 1);

    setSelectedDateRange({
      start: formatDate(allData[start].date),
      end: formatDate(allData[end].date),
    });

    setDetailData({
      labels: filteredData.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      }),
      datasets: [
        {
          label: "Revenue",
          data: filteredData.map((d) => d.sales),
          borderColor: "#2563EB",
          backgroundColor: "#3B82F6",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    });
  };

  // Historical context chart data
  const contextData = {
    labels: allData.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }),
    datasets: [
      {
        label: "Revenue",
        data: allData.map((d) => d.revenue),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const contextOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Historical Context (6 Months) - Drag to Select Period",
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxTicksLimit: 12,
        },
      },
      y: {
        display: true,
        beginAtZero: false,
      },
    },
    events: [],
  };

  const detailOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: `Selected Period: ${selectedDateRange.start} - ${selectedDateRange.end}`,
        font: { size: 16, weight: "bold" },
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        display: true,
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        display: true,
        beginAtZero: false,
      },
    },
  };

  const getDataIndexFromX = (clientX) => {
    if (!contextChartRef.current) return null;

    // Access the Chart.js instance from PrimeReact Chart component
    const chartInstance = contextChartRef.current.getChart();
    if (!chartInstance || !chartInstance.chartArea) return null;

    const chartArea = chartInstance.chartArea;
    const canvas = chartInstance.canvas;
    const rect = canvas.getBoundingClientRect();

    // Calculate position relative to canvas
    const x = clientX - rect.left;

    // Calculate position relative to chart area (excluding padding)
    const relativeX = x - chartArea.left;
    const chartWidth = chartArea.right - chartArea.left;

    // console.log({
    //   clientX,
    //   rectLeft: rect.left,
    //   x,
    //   chartAreaLeft: chartArea.left,
    //   relativeX,
    //   chartWidth,
    //   chartArea,
    //   rect,
    //   canvas,
    // });

    // Check if click is within chart area
    if (relativeX < 0 || relativeX > chartWidth) return null;

    const percentage = relativeX / chartWidth;
    const index = Math.round(percentage * (allData.length - 1));

    return Math.max(0, Math.min(allData.length - 1, index));
  };

  const handleMouseDown = (event) => {
    const index = getDataIndexFromX(event.clientX);
    if (index !== null) {
      setDragStartX(index);
      setBrushStart(index);
      setBrushEnd(index);
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event) => {
    if (!isDragging || dragStartX === null) return;

    const index = getDataIndexFromX(event.clientX);
    if (index !== null) {
      const start = Math.min(dragStartX, index);
      const end = Math.max(dragStartX, index);
      setBrushStart(start);
      setBrushEnd(end);
    }
  };

  const handleMouseUp = () => {
    if (isDragging && brushStart !== null && brushEnd !== null) {
      updateDetailData(brushStart, brushEnd);
    }
    setIsDragging(false);
    setDragStartX(null);
  };

  // Calculate summary metrics for the three cards
  const calculateMetrics = () => {
    if (brushStart === null || brushEnd === null)
      return { avgSales: 0, totalRevenue: 0, avgUsers: 0, days: 0 };

    const selectedData = allData.slice(brushStart, brushEnd + 1);
    const days = selectedData.length;
    const avgSales = Math.round(
      selectedData.reduce((sum, d) => sum + d.sales, 0) / days
    );
    const totalRevenue = selectedData.reduce((sum, d) => sum + d.revenue, 0);
    const avgUsers = Math.round(
      selectedData.reduce((sum, d) => sum + d.users, 0) / days
    );

    return { avgSales, totalRevenue, avgUsers, days };
  };

  const metrics = calculateMetrics();

  // Get brush overlay position based on Chart.js chartArea
  const getBrushStyle = () => {
    // Always show brush during dragging, even if chart not ready
    if (brushStart === null || brushEnd === null) {
      return { display: "none" };
    }

    // Try to get chart instance, but have fallback
    let chartArea = null;
    if (contextChartRef.current) {
      const chartInstance = contextChartRef.current.getChart();
      if (chartInstance && chartInstance.chartArea) {
        chartArea = chartInstance.chartArea;
      }
    }

    // Fallback: use container dimensions if chart not ready (during drag/refresh)
    if (!chartArea && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Estimate chart area with typical Chart.js padding
      chartArea = {
        top: 70,
        left: 60,
        right: rect.width - 20,
        bottom: rect.height - 60,
      };
    }

    if (!chartArea) {
      return { display: "none" };
    }

    const chartWidth = chartArea.right - chartArea.left;
    const startPercent = brushStart / (allData.length - 1);
    const endPercent = brushEnd / (allData.length - 1);

    return {
      position: "absolute",
      top: `${chartArea.top}px`,
      left: `${chartArea.left + startPercent * chartWidth}px`,
      width: `${(endPercent - startPercent) * chartWidth}px`,
      height: `${chartArea.bottom - chartArea.top}px`,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      border: "2px solid #3B82F6",
      pointerEvents: "none",
      borderRadius: "4px",
      transition: isDragging ? "none" : "all 0.2s ease",
    };
  };

  return (
    <>
      <PageHeader pageTitle={"Welcome User"} />

      <div className="space-y-3 !mt-12">
        <div className="grid grid-cols-3 gap-3">
          <Card className="borde-none !shadow-xs">
            <span className="text-lg text-slate-600 tracking-tight mb-2">
              Clicks today
            </span>
            <h1 className="my-2 text-2xl font-bold text-black">20,348</h1>
            <span className="text-sm text-green-500">
              +5.4% since yesterday
            </span>
          </Card>
          <Card className="borde-none !shadow-xs">
            <span className="text-lg text-slate-600 tracking-tight mb-2">
              Signups today
            </span>
            <h1 className="my-2 text-2xl font-bold text-black">20,348</h1>
            <span className="text-sm text-green-500">
              +5.4% since yesterday
            </span>
          </Card>
          <Card className="borde-none !shadow-xs">
            <span className="text-lg text-slate-600 tracking-tight mb-2">
              Unpaid Earnings
            </span>
            <h1 className="my-2 text-2xl font-bold text-black">20,348</h1>
            <span className="text-sm text-green-500">
              +5.4% since yesterday
            </span>
          </Card>
        </div>

        <Card className="border-none !shadow-xs">
          <div className=" mb-8">
            <h1 className="text-xl  font-bold text-gray-900 tracking-tight mb-2">
              Historical Performance
            </h1>
          </div>
          <div
            ref={containerRef}
            style={{
              height: "400px",
              position: "relative",
              cursor: isDragging ? "grabbing" : "crosshair",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <Chart
              ref={contextChartRef}
              type="line"
              data={contextData}
              options={contextOptions}
              height="350px"
            />

            {/* Brush overlay - now aligned with Chart.js chartArea */}
            <div style={getBrushStyle()}>
              <div
                style={{
                  position: "absolute",
                  top: "-25px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#3B82F6",
                  backgroundColor: "white",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid #3B82F6",
                  whiteSpace: "nowrap",
                }}
              >
                {metrics.days} days selected
              </div>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            <i className="pi pi-hand-pointer mr-2"></i>
            Click and drag on the chart to select a custom time period
          </div>
        </Card>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Detail Chart */}
            <Card className="md:col-span-2 !shadow-sm">
              <div>
                {detailData && (
                  <Chart
                    type="bar"
                    data={detailData}
                    options={detailOptions}
                    height="300px"
                  />
                )}
              </div>
            </Card>

            {/* Summary Metrics */}
            <div className="flex flex-col gap-4">
              <Card
                className="!shadow-sm !bg-blue-100"
                // style={{ backgroundColor: "#dbeafe" }}
              >
                <div className="text-center">
                  <i className="pi pi-chart-line text-4xl text-blue-600 mb-2"></i>
                  <h3 className="text-gray-600 text-sm font-semibold mb-1">
                    Avg Daily Sales
                  </h3>
                  <p className="text-3xl font-bold text-blue-700">
                    {metrics.avgSales.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {metrics.days} days
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Card className="!shadow-sm !bg-green-100">
                  <div className="text-center">
                    <i className="pi pi-dollar text-4xl text-green-600 mb-2"></i>
                    <h3 className="text-gray-600 text-sm font-semibold mb-1">
                      Total Revenue
                    </h3>
                    <p className="text-3xl font-bold text-green-700">
                      GHS {utils.formatNumber(metrics?.totalRevenue)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {selectedDateRange.start} - {selectedDateRange.end}
                    </p>
                  </div>
                </Card>

                <Card className="col-span-1 !shadow-sm !bg-purple-100">
                  <div className="text-center">
                    <i className="pi pi-users text-4xl text-purple-600 mb-2"></i>
                    <h3 className="text-gray-600 text-sm font-semibold mb-1">
                      Avg Daily Users
                    </h3>
                    <p className="text-3xl font-bold text-purple-700">
                      {metrics.avgUsers.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {metrics.days} days average
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <Card className="border-none !shadow-xs">
            <div className=" mb-8">
              <h1 className="text-xl  font-bold text-gray-900 tracking-tight mb-2">
                Recent Activities
              </h1>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <div>
                  <span>New signup</span>
                  <h1 className="font-medium text-black tracking-wide">
                    admin@gmail.com
                  </h1>
                </div>
                <span>2m ago</span>
              </div>
            </div>

            <div className="List"></div>
          </Card>
          <Card className="col-span-2  !shadow-xs">
            {/* Page Heading */}
            <div className=" mb-8">
              <h1 className="text-xl  font-bold text-gray-900 tracking-tight mb-2">
                Your Affiliate Link Generator
              </h1>
              <p className="text-base text-gray-500">
                Enter any URL from Openrefer.com and we will generate a unique,
                trackable affiliate link for you
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
      </div>
    </>
  );
};

export default AffiliateHome;
