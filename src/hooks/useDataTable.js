"use client";
import Model from "@/libs/config/model";
import { utils } from "@/libs/utils";

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { supabase } from "@/libs/config/conn";

// // Apply static filters to Supabase query
// const applyFiltersToQuery = (query, filters) => {
//   filters.forEach(({ field, op, value }) => {
//     if (op === "ilike") {
//       query = query.ilike(field, value);
//     } else if (op === "not.ilike") {
//       query = query.not(field, "ilike", value);
//     } else if (op === "in") {
//       const inValues = value
//         .replace(/[()]/g, "")
//         .split(",")
//         .map((v) => v.trim());
//       query = query.in(field, inValues);
//     } else if (op === "eq") {
//       query = query.eq(field, value);
//     } else if (op === "neq") {
//       query = query.neq(field, value);
//     } else if (op === "lt") {
//       query = query.lt(field, value);
//     } else if (op === "lte") {
//       query = query.lte(field, value);
//     } else if (op === "gt") {
//       query = query.gt(field, value);
//     } else if (op === "gte") {
//       query = query.gte(field, value);
//     }
//   });
//   return query;
// };

export const useDataTable = (
  tableName,
  initTblParams = {
    pagination: { rows: 10, rowsPerPageOptions: [5, 10, 20, 50] },
    filters: {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    },
    supabaseFilters: [], // Additional static filters (applied server-side)
    order: { field: "createdAt", ascending: false },
  },
  rowkey = "id",
  autoFetch = true
) => {
  const [data, setData] = useState([]);

  const [column, setClolumn] = useState([]);
  const [cleintPage, setClientPage] = useState();
  const [width, setwidth] = useState();
  const [footer, setFooter] = useState(true);
  const [header, setHeader] = useState(true);
  const [customHeader, setCustomHeader] = useState(null);
  const [customFooter, setCustomFooter] = useState(null);
  const [loading, setLoading] = useState(false);

  // Server-side pagination
  const [totalRecords, setTotalRecords] = useState(0);
  const [first, setFirst] = useState(0);

  // Static Supabase filters (applied server-side, don't change via UI)
  const [staticSupabaseFilters, setStaticSupabaseFilters] = useState(
    initTblParams.supabaseFilters || []
  );
  const [orderBy, setOrderBy] = useState(
    initTblParams.order || { field: "createdAt", ascending: false }
  );

  const [paginatorProps, setPaginatorProps] = useState(paginatorPropsBuilder());
  const [params, setParams] = useState({
    ...initTblParams.pagination,
  });

  // Initialize filters with proper structure for each column
  const initializeFilters = () => {
    const baseFilters = {
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };

    // If columns are provided in initTblParams, initialize their filters
    if (initTblParams.columns) {
      initTblParams.columns.forEach((col) => {
        if (col.filter !== false) {
          baseFilters[col.field] = {
            operator: FilterOperator.AND,
            constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
          };
        }
      });
    }

    return { ...baseFilters, ...(initTblParams?.filters || {}) };
  };

  const [filters, setFilters] = useState(initializeFilters());
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // Table styling States
  const [showGridLines, setShowGridLines] = useState(false);
  const [size, setSize] = useState("normal");

  // Fetch ALL data with only static filters (for client-side filtering)
  async function fetchAllData() {
    try {
      setLoading(true);
      if (autoFetch === false && tableName == null) return;

      // Build query with only static filters
      // let query = supabase.from(tableName).select("*");

      // // Apply static filters
      // query = applyFiltersToQuery(query, staticSupabaseFilters);

      // // Apply ordering
      // query = query.order(orderBy.field, {
      //   ascending: orderBy.ascending,
      // });

      // const { data: fetchedData, error } = await query;

      const res = await Model.get(tableName, {
        // range: { from: first, to: first + params.rows - 1 },
        order: initTblParams?.order,
      });
      console.log("Fetched Data:", res);
      setData(res?.data || []);
      setTotalRecords(res?.count || 0);
      setLoading(false);
    } catch (error) {
      utils.showToastV2("error", "Error", "Failed to fetch data");
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
      setLoading(false);
    }
  }

  // Handle page change (client-side pagination handled by PrimeReact)
  const onPage = (event) => {
    setFirst(event.first);
  };

  // Handle sort change (client-side sorting handled by PrimeReact)
  const onSort = (event) => {
    // PrimeReact handles this automatically
  };

  // Handle filter change (client-side filtering handled by PrimeReact)
  const onFilter = (event) => {
    setFilters(event.filters);
  };

  // Add a static Supabase filter (server-side)
  const addStaticFilter = (field, op, value) => {
    const newFilters = [...staticSupabaseFilters, { field, op, value }];
    setStaticSupabaseFilters(newFilters);
    return newFilters;
  };

  // Remove a static Supabase filter
  const removeStaticFilter = (field) => {
    const newFilters = staticSupabaseFilters.filter((f) => f.field !== field);
    setStaticSupabaseFilters(newFilters);
    return newFilters;
  };

  // Update a static Supabase filter
  const updateStaticFilter = (field, op, value) => {
    const existing = staticSupabaseFilters.find((f) => f.field === field);
    let newFilters;

    if (existing) {
      newFilters = staticSupabaseFilters.map((f) =>
        f.field === field ? { field, op, value } : f
      );
    } else {
      newFilters = [...staticSupabaseFilters, { field, op, value }];
    }

    setStaticSupabaseFilters(newFilters);
    return newFilters;
  };

  // Clear all static Supabase filters
  const clearStaticFilters = () => {
    setStaticSupabaseFilters([]);
  };

  const headerJsx = (props = {}) => {
    const { children, defaultHeader = true } = props;

    return (
      <>
        {defaultHeader && (
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <span className="text-xl text-900 font-bold">Products</span>
            <Button
              icon="pi pi-refresh"
              rounded
              raised
              onClick={() => fetchAllData()}
            />
          </div>
        )}
        {children ?? null}
      </>
    );
  };

  const renderCustomHeader = (props) => {
    setCustomHeader(headerJsx(props));
  };

  const footerJsx = (props = {}) => {
    const { children, defaultFooter = true } = props;

    return (
      <>
        {defaultFooter && (
          <div>In total there are {data?.length || 0} items.</div>
        )}
        {children ?? null}
      </>
    );
  };

  const renderCustomFooter = (props) => {
    setCustomFooter(footerJsx(props));
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

  // Global filter change (client-side)
  function globalFilterChange(e) {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  }

  const clearFilter = () => {
    const defaultFilters = initializeFilters();
    setFilters(defaultFilters);
    setGlobalFilterValue("");
  };

  // Initialize column filters when columns are set
  const setClolumnWithFilters = (cols) => {
    setClolumn(cols);

    // Initialize filters for each column
    const newFilters = { ...filters };
    cols.forEach((col) => {
      if (col.filter !== false && !newFilters[col.field]) {
        newFilters[col.field] = {
          operator: FilterOperator.AND,
          constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
        };
      }
    });
    setFilters(newFilters);
  };

  // Fetch data when static filters change
  // useEffect(() => {
  //   if (autoFetch) {
  //     fetchAllData();
  //   }
  // }, [staticSupabaseFilters]);

  const table = () => {
    return (
      <div className="card">
        <DataTable
          value={data}
          header={header && (customHeader || headerJsx())}
          lazy={false}
          paginator
          {...paginatorProps}
          rows={params.rows}
          rowsPerPageOptions={params?.rowsPerPageOptions}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={column.map((col) => col.field)}
          tableStyle={{ minWidth: width || "50rem" }}
          size={size}
          showGridlines={showGridLines}
          stripedRows
          removableSort
          footer={footer && (customFooter || footerJsx())}
          dataKey={rowkey}
          loading={loading}
        >
          {column?.map((col) => {
            const isAction =
              String(col.field).toLowerCase() === "action" ||
              String(col.header).toLowerCase() === "action";

            return (
              <Column
                key={col.field}
                field={col.field}
                header={col.header}
                body={col?.body}
                // disable sorting for action column
                sortable={isAction ? false : col.sortable !== false}
                // disable filtering for action column
                filter={isAction ? false : col.filter !== false}
                filterField={col.field}
                filterPlaceholder={
                  isAction
                    ? ""
                    : col.filterPlaceholder || `Search by ${col.header}`
                }
                showFilterMenu={isAction ? false : col.filter !== false}
              />
            );
          })}
        </DataTable>
      </div>
    );
  };

  return {
    data,
    setData,
    column,
    setClolumn: setClolumnWithFilters,
    table,
    cleintPage,
    setClientPage,
    fetchData: fetchAllData,
    width,
    setwidth,
    setFooter,
    setSize,
    setHeader,
    renderCustomHeader,
    renderCustomFooter,
    setShowGridLines,
    paginatorProps: createPaginatorProps,
    setParams,
    globalFilterChange,
    globalFilterValue,
    clearFilter,
    setLoading,
    // Static filter methods (applied server-side on data fetch)
    addStaticFilter,
    removeStaticFilter,
    updateStaticFilter,
    clearStaticFilters,
    staticSupabaseFilters,
    setOrderBy,
    totalRecords,
  };
};
