"use client";
import Model from "@/libs/config/model";
import { utils } from "@/libs/utils";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useState } from "react";

export const useDataTable = (
  tableName,
  initTblParams = {
    pagination: { rows: 10, rowsPerPageOptions: [5, 10, 20, 50] },
  },
  autoFetch = true
) => {
  const [data, setData] = useState([]);
  const [column, setClolumn] = useState([]);
  const [cleintPage, setClientPage] = useState();
  const [width, setwidth] = useState();
  const [footer, setFooter] = useState(true);
  const [header, setHeader] = useState(true);
  const [paginatorProps, setPaginatorProps] = useState(paginatorPropsBuilder());

  const [params, setParams] = useState({
    ...initTblParams.pagination,
  });

  // Table styiling States
  const [showGridLines, setShowGridLines] = useState(false);

  const [size, setSize] = useState("normal"); // small , normal , large;

  async function fetchData() {
    try {
      if (autoFetch === false && tableName == null) return;

      const res = await Model.get(tableName);
      setData(res);
    } catch (error) {
      utils.showToast("error", "Error", "Falied to fetch data");
      if (process.env.NODE_ENV !== "production") {
        console.error("Error fetching data:", error);
      } else {
        await utils.logError({
          message: error?.message,
          stack: error?.stack,
          userId: null,
          page: cleintPage || window?.location?.pathname,
        });
      }
    }
  }

  const headerJsx = (props = {}) => {
    const { children, defaultHeader = true } = props;

    return (
      <>
        {defaultHeader && (
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <span className="text-xl text-900 font-bold">Products</span>
            <Button icon="pi pi-refresh" rounded raised />
          </div>
        )}

        {/* Children can be JSX */}
        {children ?? null}
      </>
    );
  };

  const footerJsx = (props = {}) => {
    const { children, defaultFooter = true } = props;

    return (
      <>
        {defaultFooter && (
          <div>In total there are {data ? data.length : 0} items.</div>
        )}

        {children ?? null}
      </>
    );
  };

  function paginatorPropsBuilder(left = null, right = null) {
    return {
      paginatorTemplate:
        "RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",
      currentPageReportTemplate: "{first} to {last} of {totalRecords}",
      paginatorLeft: left,
      paginatorRight: right,
    };
  }

  function createPaginatorProps(left = null, right = null) {
    setPaginatorProps(paginatorPropsBuilder(left, right));
  }

  const table = () => {
    return (
      <div className="card">
        <DataTable
          value={data}
          header={header && headerJsx({ defaultHeader: true })}
          paginator
          {...paginatorProps}
          rows={params?.rows}
          tableStyle={{ minWidth: width || "50rem" }}
          size={size}
          showGridlines={showGridLines}
          stripedRows
          removableSort
          rowsPerPageOptions={params?.rowsPerPageOptions}
          footer={footer && footerJsx({ defaultFooter: true })}
        >
          {column?.map((col) => (
            <Column
              key={col.field}
              field={col.field}
              header={col.header}
              body={col?.body}
              sortable={col.sortable}
            ></Column>
          ))}
          {/* <Column field="id" header="ID" sortable></Column>
            <Column field="name" header="Name" sortable></Column>
            <Column field="email" header="Email" sortable></Column> */}
        </DataTable>
      </div>
    );
  };

  return {
    data,
    setData,
    column,
    setClolumn,
    table,
    cleintPage,
    setClientPage,
    fetchData,
    width,
    setwidth,
    setFooter,
    setSize,
    setHeader,
    headerJsx,
    footerJsx,
    setShowGridLines,
    paginatorProps: createPaginatorProps,
    setParams,
  };
};
