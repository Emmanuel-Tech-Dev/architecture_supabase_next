"use client";

import { useDataTable } from "@/hooks/useDataTable";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";

export default function Home() {
  const table = useDataTable(
    "testing",
    {
      pagination: { rows: 5, rowsPerPageOptions: [10, 20, 50] },
      filters: {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      supabaseFilters: [], // Static filters (e.g., always filter by status: 'active')
      order: { field: "id", ascending: true },
      useServerSideFiltering: true, // ✅ Enable server-side filtering
    },
    "id",
    false
  );

  const columns = [
    {
      field: "id",
      header: "ID",
      sortable: true,
      filter: true, // ✅ Enable column filter
      filterPlaceholder: "Search by ID",
    },
    {
      field: "room_number",
      header: "Room Number",
      sortable: false,
      filter: true,
      filterPlaceholder: "Search room number",
    },
    {
      field: "room_type",
      header: "Room Type",
      sortable: true,
      filter: true,
      filterPlaceholder: "Search room type",
    },
    {
      field: "Action",
      header: "Action",

      body: (rowData) => {
        return (
          <>
            <Button onClick={() => console.log(rowData)}>console me</Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    table.setClolumn(columns);
    table.setFooter(true);
    table.fetchData();
  }, []);

  // Custom header
  const customHeader = (
    <div className="flex items-center justify-between gap-4">
      <Button
        type="button"
        icon="pi pi-filter-slash"
        label="Clear All Filters"
        outlined
        onClick={() => {
          table.clearFilter();
          table.clearStaticFilters();
        }}
      />

      {/* Global search (searches all columns) */}
      <IconField iconPosition="left">
        <InputIcon className="pi pi-search" />
        <InputText
          value={table.globalFilterValue}
          onChange={(e) => table.globalFilterChange(e)}
          placeholder="Search all columns..."
        />
      </IconField>
    </div>
  );

  useEffect(() => {
    table.renderCustomHeader({
      defaultHeader: false,
      children: customHeader,
    });
  }, [table.globalFilterValue]);

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Room Management</h1>
        <p className="text-gray-600">Total Records: {table.totalRecords}</p>
      </div>
      {table.table()}
    </div>
  );
}
