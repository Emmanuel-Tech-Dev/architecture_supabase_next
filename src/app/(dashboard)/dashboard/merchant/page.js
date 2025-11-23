"use server";
import Merchant from "@/component/ui/Merchant";
import Model from "@/libs/config/model";
import React from "react";

const page = async () => {
  return (
    <div>
      <Merchant />
    </div>
  );
};

export default page;
