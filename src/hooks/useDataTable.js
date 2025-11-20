"use client";
import { useState, useEffect, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode, FilterOperator } from "primereact/api"; // Import these
import Model from "@/libs/config/model";
import { utils } from "@/libs/utils";

function useDebounce(value, delay) {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debounceValue;
}

export const useDataTable = (
  tableName,
  initConfig = {},
  rowKey = "id",
  autoFetch = "true"
) => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [rowSelection, setRowSelection] = useState(false);
  const [rowSelected, setRowSelected] = useState();
  const [selectionMode, setSelectionMode] = useState("multiple");

  //GLOBAL FILTERS
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  // Debounce the global filter value (wait 500ms)
  const debouncedGlobalFilter = useDebounce(globalFilterValue, 500);

  // Initialize lazyParams
  const [lazyParams, setLazyParams] = useState({
    first: 0,
    rows: initConfig.rows || 10,
    page: 0,
    sortField: initConfig.sortField || "created_at",
    sortOrder: initConfig.sortOrder || -1,
    filters: {}, // Will be populated by setTableColumns
  });

  const [debugQuery, setDebugQuery] = useState(null);

  // --- FILTER INITIALIZATION (The Fix) ---
  // This recreates the logic you had in your original code
  const initFilters = (cols) => {
    let _filters = { ...lazyParams.filters };

    // Global filter init
    if (!_filters["global"]) {
      _filters["global"] = { value: null, matchMode: FilterMatchMode.CONTAINS };
    }

    // Column filters init
    cols.forEach((col) => {
      if (col.filter !== false) {
        // Only init if filter is enabled
        _filters[col.field] = {
          operator: FilterOperator.AND,
          constraints: [
            {
              value: null,
              matchMode: col.filterMatchMode || FilterMatchMode.CONTAINS,
            },
          ],
        };
      }
    });
    return _filters;
  };

  // Use this instead of setColumns directly in your page
  const setTableColumns = (cols) => {
    setColumns(cols);
    // Initialize filters based on these new columns
    const initialFilters = initFilters(cols);
    setLazyParams((prev) => ({ ...prev, filters: initialFilters }));
  };

  const onSelectionChange = (e) => {
    const value = e.value;
    console.log(value);
    setRowSelected(value);
  };

  const onSelectAllChange = (event) => {};
  // --- FETCH LOGIC ---
  const fetchData = useCallback(async () => {
    if (!tableName) return;

    setLoading(true);
    try {
      const range = {
        from: lazyParams.first,
        to: lazyParams.first + lazyParams.rows - 1,
      };

      const order = lazyParams.sortField
        ? {
            field: lazyParams.sortField,
            ascending: lazyParams.sortOrder === 1,
          }
        : null;

      // --- FILTER PARSING LOGIC ---
      const activeFilters = [];
      const globalSearchString = debouncedGlobalFilter;

      if (lazyParams.filters) {
        Object.keys(lazyParams.filters).forEach((field) => {
          const filterMeta = lazyParams.filters[field];

          // Handle Global
          if (field === "global") return;

          // Handle "Menu" Mode (Constraints Array)
          if (filterMeta && filterMeta.constraints) {
            filterMeta.constraints.forEach((constraint) => {
              if (
                constraint.value !== null &&
                constraint.value !== undefined &&
                constraint.value !== ""
              ) {
                activeFilters.push({
                  field: field,
                  op: utils.getSupabaseOperator(constraint.matchMode),
                  value: utils.formatFilterValue(
                    constraint.matchMode,
                    constraint.value
                  ),
                });
              }
            });
          }
          // Handle "Row" Mode (Direct Object) - Fallback
          else if (filterMeta && filterMeta.value !== null) {
            activeFilters.push({
              field: field,
              op: getSupabaseOperator(filterMeta.matchMode),
              value: formatFilterValue(filterMeta.matchMode, filterMeta.value),
            });
          }
        });
      }

      // Construct OR query for Global Search
      let orQuery = null;
      if (globalSearchString && columns.length > 0) {
        const searchable = columns
          .filter((c) => c.filter !== false && c.field !== "action")
          .map((c) => `${c.field}.ilike.%${globalSearchString}%`)
          .join(",");
        if (searchable) orQuery = searchable;
      }

      // Debugging
      setDebugQuery({
        table: tableName,
        range,
        order,
        filters: activeFilters,
        or: orQuery,
        timestamp: new Date().toLocaleTimeString(),
      });

      const res = await Model.get(tableName, {
        range,
        order,
        filters: activeFilters,
        or: orQuery,
      });

      setData(res.data || []);

      setTotalRecords(res.count || 0);
    } catch (err) {
      console.error("Table Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [tableName, lazyParams, columns, debouncedGlobalFilter]);

  // // Fetch on params change
  useEffect(() => {
    if (!autoFetch) return;
    fetchData();
  }, [fetchData, autoFetch]);

  // --- EVENTS ---
  const onPage = (e) => setLazyParams((prev) => ({ ...prev, ...e }));
  const onSort = (e) => setLazyParams((prev) => ({ ...prev, ...e }));
  const onFilter = (e) => {
    // PrimeReact returns the whole new filter object structure here
    setLazyParams((prev) => ({ ...prev, filters: e.filters }));
  };

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  // --- RENDERER ---
  const renderTable = (props = {}) => (
    <DataTable
      value={data}
      lazy
      dataKey={rowKey}
      paginator
      first={lazyParams.first}
      rows={lazyParams.rows}
      totalRecords={totalRecords}
      onPage={onPage}
      onSort={onSort}
      sortField={lazyParams.sortField}
      sortOrder={lazyParams.sortOrder}
      onFilter={onFilter}
      filters={lazyParams.filters}
      selection={rowSelected}
      onSelectionChange={onSelectionChange}
      selectAll={rowSelection}
      filterDisplay="menu" // <--- IMPORTANT: Matches the constraints structure
      tableStyle={{ minWidth: "50rem" }}
      rowsPerPageOptions={[5, 10, 20, 50]}
      globalFilterFields={columns.map((c) => c.field)} // Needed for global search to not crash
      {...props}
    >
      {selectionMode && (
        <Column
          selectionMode={selectionMode}
          style={{ width: "3em" }}
          headerStyle={{ width: "3em" }} // Added header style for consistency
        />
      )}
      {columns.map((col) => (
        <Column
          key={col.field}
          field={col.field}
          header={col.header}
          sortable={col.sortable}
          filter={col.filter}
          filterPlaceholder={`Search ${col.header}`}
          body={col.body}
          style={col.style}
          // Pass specific match modes if needed (e.g., for dates)
          filterMatchMode={col.filterMatchMode || FilterMatchMode.CONTAINS}
        />
      ))}
    </DataTable>
  );

  return {
    renderTable,
    setColumns: setTableColumns, // Export the custom setter
    columns,
    onGlobalFilterChange,
    globalFilterValue,
    refresh: fetchData,
    fetchData,
    debugQuery,
    loading,
    setSelectionMode,
    rowSelected,
    data,
    columns,
    lazyParams,
  };
};
