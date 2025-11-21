import dynamic from "next/dynamic";
import { BreadCrumb } from "primereact/breadcrumb";
import React from "react";

// const BreadCrumb = dynamic(
//   () => import("primereact/breadcrumb").then((mod) => mod.BreadCrumb),
//   { ssr: false }
// );

const PageHeader = ({ pageTitle, homeUrl, items, desc, childrenJsx }) => {
  const items1 = [
    { label: "", url: "/electronics" },
    { label: "Computer" },
    { label: "Accessories" },
    { label: "Keyboard" },
    { label: "Wireless" },
  ];
  const home = { icon: "pi pi-home", url: homeUrl || "/" };
  return (
    <div className=" mt-3 mb-5 flex items-center justify-between">
      <div>
        <h1 className="font-bold text-2xl">{pageTitle || "Title"}</h1>

        {items?.length === 0 ? (
          <BreadCrumb
            model={items}
            home={home}
            // className="!bg-transparent !border-0 !p-0"
          />
        ) : (
          <p className="text-slate-500">{desc}</p>
        )}
      </div>
      <div>{childrenJsx}</div>
    </div>
  );
};

export default PageHeader;
