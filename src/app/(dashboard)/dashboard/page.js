"use client";
import { useEffect, useState } from "react";
import { useDataTable } from "@/hooks/useDataTable";

// PrimeReact UI
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import DevTools from "@/component/DevTools";
import { FilterMatchMode } from "primereact/api";
import TableSkeleton from "@/component/TableSkeleton";

export default function Page() {
  // 1. Init Hook
  const {
    renderTable,
    setColumns,
    onGlobalFilterChange,
    globalFilterValue,
    debugQuery,
    loading,
    fetchData,
    columns,
    lazyParams,
  } = useDataTable("testing", {
    rows: 10,
    sortField: "createdAt",
    sortOrder: -1,
  });

  // 2. Define Columns Configuration
  useEffect(() => {
    setColumns([
      {
        field: "id",
        header: "ID",
        sortable: true,
        filter: true,
        filterMatchMode: FilterMatchMode.EQUALS,
        style: { width: "100px" },
      },
      {
        field: "room_number",
        header: "Room",
        sortable: true,
        filter: true,
        filterMatchMode: FilterMatchMode.CONTAINS,
        filterPlaceholder: "Search name...",
      },
      // {
      //   field: "email",
      //   header: "Email",
      //   sortable: true,
      //   filter: true,
      //   filterPlaceholder: "Search email...",
      // },
      // {
      //   field: "status",
      //   header: "Status",
      //   sortable: true,
      //   filter: true,
      //   body: (rowData) => {
      //     const severity = {
      //       active: "success",
      //       pending: "warning",
      //       banned: "danger",
      //     };
      //     return (
      //       <Tag value={rowData.status} severity={severity[rowData.status]} />
      //     );
      //   },
      // },
      // {
      //   field: "earnings",
      //   header: "Revenue",
      //   sortable: true,
      //   filter: false,
      //   body: (rowData) => `$${rowData.earnings}`,
      // },
      {
        field: "action",
        header: "Actions",
        body: (rowData) => (
          <Button icon="pi pi-cog" text rounded aria-label="Settings" />
        ),
      },
    ]);
  }, []);

  console.log("This is a lazy", lazyParams);

  // 3. Custom Header Component
  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-xl font-bold text-gray-700 m-0">Affiliate Tracker</h2>
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Global Search..."
          className="p-inputtext-sm w-64"
        />
      </IconField>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Table Card */}
      <div className="card bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <TableSkeleton columns={columns} />
        ) : (
          renderTable({
            header: header,
            stripedRows: true,
            showGridlines: false,
            size: "small",
            emptyMessage: "No affiliates found.",
          })
        )}
      </div>

      {/* THE MAGIC: DevTools Sidebar */}
      <DevTools debugQuery={debugQuery} />
    </div>
  );
}
