"use client";

import { Skeleton } from "primereact/skeleton";

export default function Loading() {
  return (
    <div className="p-6 space-y-6" role="status" aria-label="Loading content">
      {/* Page Title */}
      <div className="space-y-2">
        <Skeleton width="12rem" height="1.75rem" borderRadius="8px" />
        <Skeleton width="20rem" height="1rem" />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg border bg-white shadow-sm space-y-3"
            aria-hidden="true"
          >
            <Skeleton width="50%" height="1rem" />
            <Skeleton width="30%" height="2rem" />
            <Skeleton width="40%" height="1rem" />
          </div>
        ))}
      </div>

      {/* Action Bar with Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton width="10rem" height="2.5rem" borderRadius="12px" />
        <Skeleton width="16rem" height="2.5rem" borderRadius="12px" />
      </div>

      {/* Table skeleton */}
      <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 border-b">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton key={idx} width="6rem" height="1rem" />
          ))}
        </div>

        {/* Table Rows */}
        {Array.from({ length: 5 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-5 gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
          >
            {Array.from({ length: 5 }).map((_, colIdx) => (
              <Skeleton key={colIdx} height="1.5rem" />
            ))}
          </div>
        ))}
      </div>

      {/* Pagination skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton width="8rem" height="1rem" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton
              key={idx}
              width="2.5rem"
              height="2.5rem"
              borderRadius="8px"
            />
          ))}
        </div>
      </div>

      {/* Screen reader announcement */}
      <span className="sr-only">Loading dashboard data, please wait...</span>
    </div>
  );
}
