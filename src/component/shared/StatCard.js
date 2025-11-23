import { utils } from "@/libs/utils";
import { Card } from "primereact/card";
import React from "react";

const StatCard = ({ items }) => {
  const colors = utils.resolveColors(items?.id);
  return (
    <Card className="col-span-1 rounded-lg !shadow-sm border-slate-200 border">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">
            {items?.title || "Total Affiliates"}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-2">
            {items?.value || "144"}
          </p>
          <p className={`text-sm ${colors?.text} mt-1`}>
            <i className={`${colors?.text} pi pi-arrow-up`}></i>+{" "}
            {items?.change || "8 this month"}
          </p>
        </div>
        <div
          className={`w-12 h-12 ${colors?.bg} rounded-lg flex items-center justify-center`}
        >
          <i className={`${colors?.text} pi pi-${items.icon}`}></i>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
