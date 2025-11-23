import SkeletonLoader, {
  MarketPlaceCardSkeleton,
  MarketPlaceSkeletonGrid,
} from "@/component/loaders/MarketPlaceSkeleton";
import MarketPlace from "@/component/ui/MarketPlace";
import Model from "@/libs/config/model";
import React from "react";

const page = async () => {
  const select = `*, merchants!programs_merchant_id_fkey(id , company_name , logo_url)`;
  const { data } = await Model.get("programs", {
    select,
    order: { field: "created_at", ascending: false },
  });
  //   console.log(data);
  return (
    <div>
      <MarketPlace data={data} />
    </div>
  );
};

export default page;
