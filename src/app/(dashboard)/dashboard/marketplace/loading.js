import SkeletonLoader, {
  MarketPlaceSkeletonGrid,
} from "@/component/loaders/MarketPlaceSkeleton";
import Loading from "@/component/loaders/PageLoader";
import { Skeleton } from "primereact/skeleton";
import React from "react";

const loading = () => {
  return (
    <div>
      <SkeletonLoader />
    </div>
  );
};

export default loading;
