"use client";

import CustomTag from "@/component/shared/CustomTag";
import DevTools from "@/component/shared/DevTools";
import EmptyState from "@/component/shared/EmptyState";
import PageHeader from "@/component/shared/PageHeader";
import TableSkeleton from "@/component/shared/TableSkeleton";
import { useDataTable } from "@/hooks/useDataTable";
import customFunctions from "@/libs/dependencies/customfunction";
import { utils } from "@/libs/utils";
import { FilterMatchMode } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Menu } from "primereact/menu";
import React, { useEffect, useRef, useState } from "react";

const Payout = () => {
  const [selectedRow, setSelectedRow] = useState({});
  const menuRef = useRef(null);
  const table = useDataTable(
    "payouts",
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
      field: "affiliate_name",
      header: "Affiliate",
      // sortable: true,
      filter: true,
      filterMatchMode: FilterMatchMode.CONTAINS,
    },
    {
      field: "amount",
      header: "Amount",
      // sortable: true,
      filter: true,
      filterMatchMode: FilterMatchMode.CONTAINS,
      body: (rowData) => (
        <span>{utils.currencyConvertor(rowData?.amount)}</span>
      ),
    },

    {
      field: "status",
      header: "Status",
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
      body: (rowData) => (
        <CustomTag
          value={rowData?.status}
          severity={utils.getColumnStatusColor(rowData?.status)}
        />
      ),
    },

    {
      field: "paid_at",
      header: "Paid At",
      body: (rowData) => <span>{utils.formatDateV3(rowData?.paid_at)}</span>,
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
    },
    {
      field: "created_at",
      header: "Date Created",
      body: (rowData) => <span>{utils.formatDateV3(rowData?.created_at)}</span>,
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
    },
    {
      field: "action",
      header: "Action",
      body: (rowData) => (
        <>
          {" "}
          <Button
            icon="pi pi-ellipsis-v"
            text
            severity="help"
            size="small"
            onClick={(e) => {
              setSelectedRow(rowData);
              menuRef.current.toggle(e);
            }}
            aria-label="Actions"
          />
        </>
      ),
    },
  ];

  function update(selectedRow) {
    console.log(selectedRow);
    utils.showToastV2("success", "data Update", JSON.stringify(selectedRow));
  }

  useEffect(() => {
    console.log("init....");
    table.setColumns(columns);
    table.setSelectionMode("multiple");
    // table.fetchData();
  }, []);

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-xl font-bold text-gray-700 m-0">Payout Center</h2>

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
        {table.rowSelected?.length > 0 && (
          <Button
            severity="success"
            icon="pi pi-money-bill"
            tooltip="Bulk Payout"
            tooltipOptions={{ position: "top" }}
            size="small"
          />
        )}
      </div>
    </div>
  );

  const message = (
    <EmptyState actionText={"Refresh Table"} onAction={() => table.refresh()} />
  );

  return (
    <>
      <PageHeader
        pageTitle="Payout Center"
        homeUrl={null}
        // items={[{ label: "Affiliates", url: "/dashboard/affiliates" }]}
        desc={"Manage all payouts for affiliates"}
        childrenJsx={
          <div className="flex items-center gap-2">
            {/* <Button
              className="col-span-1"
              label="Add New Program"
              icon="pi pi-plus"
              size="small"
            /> */}
            <Button
              //   label={actionText}
              icon="pi pi-refresh"
              severity="help"
              outlined
              onClick={() => table.refresh()}
              aria-label="Refresh"
              size="small"
              tooltip="Refresh data table"
              tooltipOptions={{ position: "left" }}
            />
          </div>
        }
      />

      {/* <div className="grid grid-cols-4 gap-5 mt-6">
        {affiliateStats?.map((items) => (
          <StatCard key={items?.id} items={items} />
        ))}
      </div> */}

      <div className="card bg-white p-2 rounded-lg shadow-sm border border-gray-200 mt-12">
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

      <Menu
        model={customFunctions.popUpTableMenu(update, selectedRow)}
        popup
        ref={menuRef}
      />

      {/* THE MAGIC: DevTools Sidebar */}
      <DevTools debugQuery={table.debugQuery} />
    </>
  );
};

export default Payout;
