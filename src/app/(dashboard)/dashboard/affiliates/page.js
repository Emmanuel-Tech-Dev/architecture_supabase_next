"use client";
import CustomTag from "@/component/CustomTag";
import DevTools from "@/component/DevTools";
import EmptyState from "@/component/EmptyState";
import PageHeader from "@/component/PageHeader";
import StatCard from "@/component/StatCard";
import TableSkeleton from "@/component/TableSkeleton";
import { useDataTable } from "@/hooks/useDataTable";
import { utils } from "@/libs/utils";
import { FilterMatchMode } from "primereact/api";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useEffect, useMemo } from "react";

export const affiliateStats = [
  {
    id: "totalAffiliates",
    title: "Total Affiliates",
    value: 142,
    subtext: "+8 this month",
    changeType: "positive", // positive | negative | neutral
    icon: "users", // your icon reference
    colorKey: "blue",
  },
  {
    id: "activeAffiliates",
    title: "Active Affiliates",
    value: 128,
    subtext: "90.1% active rate",
    icon: "user-plus",
    colorKey: "green",
  },
  {
    id: "avgRevenue",
    title: "Avg. Revenue",
    value: "$173",
    change: "5.2%",
    changeType: "positive",
    icon: "dollar",
    colorKey: "purple",
  },
  {
    id: "topPerformer",
    title: "Top Performer",
    value: "Sarah Johnson",
    subtext: "$4,250 revenue",
    icon: "trophy",
    colorKey: "orange",
  },
];

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
      header: "C/R %",
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
      body: (rowData) => (
        <CustomTag
          value={rowData?.status}
          severity={utils.getColumnStatusColor(rowData?.status)}
        />
      ),
    },
    {
      field: "tier",
      header: "Tier",
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
      body: (rowData) => (
        <CustomTag value={rowData?.tier} severity={rowData?.tier} />
      ),
    },
    {
      field: "created_at",
      header: "Joined",
      body: (rowData) => <span>{utils.formatDateV3(rowData?.created_at)}</span>,
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
    },
    {
      field: "last_activity",
      header: "last_activity",
      body: (rowData) => <span>{utils.fromNow(rowData?.last_activity)}</span>,
      //   sortable: true,
      //   filter: true,
      //   filterMatchMode: FilterMatchMode.EQUALS,
    },
  ];

  useEffect(() => {
    console.log("init....");
    table.setColumns(columns);
    table.setSelectionMode("multiple");
    // table.fetchData();
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
      </div>
    </div>
  );

  const message = (
    <EmptyState actionText={"Refresh Table"} onAction={() => table.refresh()} />
  );

  return (
    <>
      {/* Statistics Cards */}

      <PageHeader
        pageTitle="Affiliates"
        homeUrl={null}
        // items={[{ label: "Affiliates", url: "/dashboard/affiliates" }]}
        desc={"Manage and monitor your affiliate partners"}
        childrenJsx={
          <div className="flex items-center gap-2">
            <Button
              className="col-span-1"
              label="Add New Affiliate"
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

      <div className="grid grid-cols-4 gap-5 mt-6">
        {affiliateStats?.map((items) => (
          <StatCard key={items?.id} items={items} />
        ))}
      </div>

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

      {/* THE MAGIC: DevTools Sidebar */}
      <DevTools debugQuery={table.debugQuery} />
    </>
  );
}
