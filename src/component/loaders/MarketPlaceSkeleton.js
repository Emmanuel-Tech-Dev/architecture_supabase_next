import React from "react";
import { Skeleton } from "primereact/skeleton";

const MarketPlaceCardSkeleton = () => {
  return (
    <div className="p-3 col-span-1">
      <div className="relative bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        {/* Status Badge Skeleton */}
        <div className="absolute top-3 right-3 z-10">
          <Skeleton width="4rem" height="1.75rem" className="rounded-md" />
        </div>

        {/* Header with Logo Skeleton */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 pb-8">
          <div className="flex justify-center">
            <Skeleton width="7rem" height="7rem" className="rounded-lg" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Company Info Skeleton */}
          <div className="text-center mb-4">
            <Skeleton width="60%" height="1.75rem" className="mb-2 mx-auto" />
            <Skeleton width="70%" height="1rem" className="mx-auto" />
          </div>

          {/* Commission Highlight Skeleton */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-2 mb-5 border border-green-200">
            <div className="flex  items-center justify-center gap-2">
              <Skeleton shape="circle" size="2rem" className="mb-1" />
              <div>
                <Skeleton width="5rem" height="3rem" className="mb-1" />
                <Skeleton width="6rem" height="0.875rem" />
              </div>
            </div>
          </div>

          {/* Details Grid Skeleton */}
          <div className="space-y-3 mb-5">
            {/* Cookie Duration Row */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Skeleton shape="circle" size="1.25rem" />
                <Skeleton width="7rem" height="0.875rem" />
              </div>
              <Skeleton width="4.5rem" height="1rem" />
            </div>

            {/* Commission Type Row */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Skeleton shape="circle" size="1.25rem" />
                <Skeleton width="8.5rem" height="0.875rem" />
              </div>
              <Skeleton
                width="5.5rem"
                height="1.5rem"
                className="rounded-full"
              />
            </div>
          </div>

          {/* Action Button Skeleton */}
          <Skeleton width="100%" height="3rem" className="rounded-lg mb-4" />
        </div>

        {/* Footer Info Skeleton */}
        <div className="px-6 pb-4 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-center gap-2">
            <Skeleton shape="circle" size="1rem" />
            <Skeleton width="9rem" height="0.875rem" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Multiple skeleton cards component
const MarketPlaceSkeletonGrid = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0">
      {Array.from({ length: count }).map((_, index) => (
        <MarketPlaceCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Demo with header skeleton
export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Sort dropdown skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <Skeleton width="12rem" height="2rem" />
          <Skeleton width="10rem" height="3rem" className="rounded-md" />
        </div>

        <div className="card p-2 bg-white rounded-md">
          <MarketPlaceSkeletonGrid count={6} />

          {/* Pagination skeleton */}
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-gray-100">
            <Skeleton shape="circle" size="2.5rem" />
            <Skeleton shape="circle" size="2.5rem" />
            <Skeleton width="2.5rem" height="2.5rem" className="rounded-md" />
            <Skeleton shape="circle" size="2.5rem" />
            <Skeleton shape="circle" size="2.5rem" />
          </div>
        </div>
      </div>
    </div>
  );
}

export { MarketPlaceCardSkeleton, MarketPlaceSkeletonGrid };
