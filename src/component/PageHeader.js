import dynamic from "next/dynamic";
import { BreadCrumb } from "primereact/breadcrumb";
import React from "react";

// const BreadCrumb = dynamic(
//   () => import("primereact/breadcrumb").then((mod) => mod.BreadCrumb),
//   { ssr: false }
// );

const PageHeader = ({ pageTitle, homeUrl, items }) => {
  const items1 = [
    { label: "", url: "/electronics" },
    { label: "Computer" },
    { label: "Accessories" },
    { label: "Keyboard" },
    { label: "Wireless" },
  ];
  const home = { icon: "pi pi-home", url: homeUrl || "/" };
  return (
    <div className="space-y-3 my-5">
      <h1 className="font-bold text-lg">{pageTitle || "Title"}</h1>

      <BreadCrumb
        model={items}
        home={home}
        // className="!bg-transparent !border-0 !p-0"
      />
    </div>
  );
};

export default PageHeader;
