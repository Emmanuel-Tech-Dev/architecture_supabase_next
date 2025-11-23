import { Card } from "primereact/card";
import React from "react";

const cardGradients = {
  revenue: "!bg-gradient-to-br from-[#3B82F6] to-[#1E40AF]", // Blue
  transactions: "!bg-gradient-to-br from-[#22C55E] to-[#15803D]", // Green
  conversionRate: "!bg-gradient-to-br from-[#F97316] to-[#C2410C]", // Orange
  activeAffiliates: "!bg-gradient-to-br from-[#A855F7] to-[#6B21A8]", // Purple
};

const Transaction = () => {
  return (
    <div>
      <Card className={cardGradients?.revenue}></Card>
    </div>
  );
};

export default Transaction;
