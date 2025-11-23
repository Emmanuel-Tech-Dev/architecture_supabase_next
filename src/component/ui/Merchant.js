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

const Merchant = () => {
  const [selectedRow, setSelectedRow] = useState({});
  const menuRef = useRef(null);
  const table = useDataTable(
    "merchants",
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
      field: "company_name",
      header: "Merchant",
      // sortable: true,
      filter: true,
      filterMatchMode: FilterMatchMode.CONTAINS,
      body: (rowData) => {
        const colors = utils.generateShadedColors();
        return (
          <>
            <div className="flex gap-2 items-center">
              <Avatar
                label={utils.getInitials(rowData?.company_name)}
                style={{
                  backgroundColor: colors?.lighterColor,
                  color: colors?.darker,
                }}
              />
              <div>
                <p>{rowData?.company_name}</p>
                <p>Stripe Acc: {rowData?.stripe_email_acc}</p>
              </div>
            </div>

            <p></p>
          </>
        );
      },
    },
    {
      field: "slug",
      header: "Slug",
      //   sortable: true,
      filter: true,
      filterMatchMode: FilterMatchMode.EQUALS,
    },
    // {
    //   field: "stripe_account_id",
    //   header: "Payment Account ID",
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
      field: "created_at",
      header: "Joined",
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
      <h2 className="text-xl font-bold text-gray-700 m-0">Manage Merchants</h2>
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
      </div>
    </div>
  );

  const message = (
    <EmptyState actionText={"Refresh Table"} onAction={() => table.refresh()} />
  );

  return (
    <>
      <PageHeader
        pageTitle="Merchants"
        homeUrl={null}
        // items={[{ label: "Affiliates", url: "/dashboard/affiliates" }]}
        desc={"Manage merchants on the platform"}
        childrenJsx={
          <div className="flex items-center gap-2">
            <Button
              className="col-span-1"
              label="Add New Merchant"
              icon="pi pi-plus"
              size="small"
            />
            <Button
              //   label={actionText}
              icon="pi pi-refresh"
              severity="help"
              outlined
              onClick={() => table.refresh()}
              aria-label="Refresh"
              size="small"
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

export default Merchant;
