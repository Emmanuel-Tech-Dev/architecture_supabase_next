"use client";
import DevTools from "@/component/DevTools";
import EmptyState from "@/component/EmptyState";
import TableSkeleton from "@/component/TableSkeleton";
import { useDataTable } from "@/hooks/useDataTable";
import { utils } from "@/libs/utils";
import { FilterMatchMode } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect, useMemo } from "react";

export default function Page() {
  const table = useDataTable(
    "affiliates",
    {
      rows: 10,
      sortField: "created_at",
      sortOrder: -1,
    }
    // null,
    // false
  );

  const columns = [
    {
      field: "id",
      header: "Affiliate",
      body: (rowData) => {
        const colors = utils.generateShadedColors();
        return (
          <>
            <div className="flex gap-2 items-center">
              <Avatar
                label={utils.getInitials(rowData?.name)}
                style={{
                  backgroundColor: colors?.lighterColor,
                  color: colors?.darker,
                }}
              />
              <div>
                <p>{rowData?.name}</p>
                <p>{rowData?.email}</p>
              </div>
            </div>

            <p></p>
          </>
        );
      },
    },
    // {
    //   field: "user_id",
    //   header: "User ID",
    //   //   sortable: true,
    //   filter: true,
    //   filterMatchMode: FilterMatchMode.EQUALS,
    // },
    // {
    //   field: "name",
    //   header: "Name",
    //   //   sortable: true,
    //   //   filter: true,
    //   filterMatchMode: FilterMatchMode.CONTAINS,
    // },
    // {
    //   field: "email",
    //   header: "Email",
    //   //   sortable: true,
    //   filter: true,
    //   filterMatchMode: FilterMatchMode.CONTAINS,
    // },
    {
      field: "tracking_code",
      header: "Tracking Code",
      //   sortable: true,
      filter: true,
      filterMatchMode: FilterMatchMode.STARTS_WITH,
    },
    {
      field: "commission_rate",
      header: "Commission Rate",
      sortable: true,
      //   filter: true,
      filterMatchMode: FilterMatchMode.EQUALS,
      body: (rowData) => (
        <span>{utils.percentageFormatter(rowData?.commission_rate)}</span>
      ),
    },
    {
      field: "status",
      header: "Status",
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
    },
    {
      field: "created_at",
      header: "Created At",
      body: (rowData) => <span>{utils.formatDateV3(rowData?.created_at)}</span>,
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
    },
  ];

  useEffect(() => {
    console.log("init....");
    table.setColumns(columns);
    table.setSelectionMode("multiple");
    table.fetchData();
  }, []);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-xl font-bold text-gray-700 m-0">Affiliate Tracker</h2>
      <div className="flex items-center gap-3">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText
            value={table.globalFilterValue}
            onChange={table.onGlobalFilterChange}
            placeholder="Global Search..."
            className="p-inputtext-sm w-64"
          />
        </IconField>
        <Button label="Add New Affiliate" icon="pi pi-plus" size="small" />
      </div>
    </div>
  );

  const message = (
    <EmptyState actionText={"Refresh Table"} onAction={() => table.refresh()} />
  );

  return (
    <>
      <div className="card bg-white p-2 rounded-lg shadow-sm border border-gray-200">
        {table.loading ? (
          <TableSkeleton rows={table.lazyParams?.rows} columns={columns} />
        ) : (
          table.renderTable({
            header: header,
            stripedRows: true,
            showGridlines: false,
            size: "small",
            emptyMessage: message,
          })
        )}
      </div>

      {/* THE MAGIC: DevTools Sidebar */}
      <DevTools debugQuery={table.debugQuery} />
    </>
  );
}
