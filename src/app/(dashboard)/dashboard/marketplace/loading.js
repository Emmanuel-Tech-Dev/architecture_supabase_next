import { MarketPlaceSkeletonGrid } from "@/component/loaders/MarketPlaceSkeleton";
import Loading from "@/component/loaders/PageLoader";
import React from "react";

const loading = () => {
  return (
    <div>
      <MarketPlaceSkeletonGrid count={6} />
    </div>
  );
};

export default loading;
