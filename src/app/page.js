"use client";

import { useDataScroller } from "@/hooks/useDataScroller";
import { useDataTable } from "@/hooks/useDataTable";
import { useDataView } from "@/hooks/useDataView";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";

export default function Home() {
  // const table = useDataTable(
  //   "testing",
  //   {
  //     pagination: { rows: 5, rowsPerPageOptions: [10, 20, 50] },
  //     filters: {
  //       global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  //     },
  //     supabaseFilters: [], // Static filters (e.g., always filter by status: 'active')
  //     order: { field: "id", ascending: true },
  //     useServerSideFiltering: true, // ✅ Enable server-side filtering
  //   },
  //   "id",
  //   false
  // );

  // const columns = [
  //   {
  //     field: "id",
  //     header: "ID",
  //     sortable: true,
  //     filter: true, // ✅ Enable column filter
  //     filterPlaceholder: "Search by ID",
  //   },
  //   {
  //     field: "room_number",
  //     header: "Room Number",
  //     sortable: false,
  //     filter: true,
  //     filterPlaceholder: "Search room number",
  //   },
  //   {
  //     field: "room_type",
  //     header: "Room Type",
  //     sortable: true,
  //     filter: true,
  //     filterPlaceholder: "Search room type",
  //   },
  //   {
  //     field: "Action",
  //     header: "Action",

  //     body: (rowData) => {
  //       return (
  //         <>
  //           <Button onClick={() => console.log(rowData)}>console me</Button>
  //         </>
  //       );
  //     },
  //   },
  // ];

  // useEffect(() => {
  //   table.setClolumn(columns);
  //   table.setFooter(true);
  //   table.fetchData();
  // }, []);

  // // Custom header
  // const customHeader = (
  //   <div className="flex items-center justify-between gap-4">
  //     <Button
  //       type="button"
  //       icon="pi pi-filter-slash"
  //       label="Clear All Filters"
  //       outlined
  //       onClick={() => {
  //         table.clearFilter();
  //         table.clearStaticFilters();
  //       }}
  //     />

  //     {/* Global search (searches all columns) */}
  //     <IconField iconPosition="left">
  //       <InputIcon className="pi pi-search" />
  //       <InputText
  //         value={table.globalFilterValue}
  //         onChange={(e) => table.globalFilterChange(e)}
  //         placeholder="Search all columns..."
  //       />
  //     </IconField>
  //   </div>
  // );

  // useEffect(() => {
  //   table.renderCustomHeader({
  //     defaultHeader: false,
  //     children: customHeader,
  //   });
  // }, [table.globalFilterValue]);

  // const dataView = useDataView(
  //   "testing",
  //   undefined,
  //   itemsList

  //   // false
  // );

  const dataScroller = useDataScroller(
    "testing",
    itemsList
    // false
  );

  function itemsList(data) {
    return (
      <div className="col-12 md:col-4 lg:col-3 p-2" key={data?.id}>
        <div className="p-3 border-round surface-card shadow-1">
          <h3 className="m-0">{data?.room_number}</h3>
          <p>{data?.room_type}</p>
        </div>
      </div>
    );
  }

  // function listTemplate(items, dataKey = "id", listFn) {
  //   return (
  //     <div className="" key={items[dataKey]}>
  //       {items?.map((p, i) => listFn(p, i))}
  //     </div>
  //   );
  // }
  useEffect(() => {
    dataScroller.setLoading(true);
    dataScroller.fetchData();
  }, []);

  return (
    <div className="p-4">
      {/* {table.table()} */}
      {dataScroller.dataScroller()}
    </div>
  );
}
