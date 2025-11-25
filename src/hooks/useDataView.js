"use client";
import EmptyState from "@/component/shared/EmptyState";
import Model from "@/libs/config/model";
import { utils } from "@/libs/utils";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { useState, useEffect } from "react";

export const useDataView = (
  tableName = null, // Default to null
  initDataParams = {
    pagination: { rows: 10 },
    sortOptions: [],
    initialData: [], // ADDED: Allow passing initial data
  },
  itemsList,
  autoFetch = true
) => {
  // Initialize state with passed data or empty array
  const [data, setData] = useState(initDataParams.initialData || []);
  const [loading, setLoading] = useState(false);
  const [templateGrid, setTemplateGrid] = useState(
    " grid-cols-2 md:grid-cols-3"
  );

  const [dataParams, setDataParams] = useState({
    pagination: { rows: 10 },
    sortOptions: [
      { label: "Price High to Low", value: "!commision_value" },
      { label: "Price Low to High", value: "commision_value" },
    ],
    ...initDataParams,
  });

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState("");

  async function fetchData() {
    // FIXED: Do not fetch if tableName is missing
    if (!tableName) return;

    try {
      if (autoFetch === false) return;

      setLoading(true);
      const res = await Model.get(tableName);
      setData(res.data || []);
      setLoading(false);
    } catch (error) {
      utils.showToastV2("error", "Error", "Failed to fetch data");
      setLoading(false);
    }
  }

  // Fetch data on mount ONLY if a table name exists
  useEffect(() => {
    if (tableName) {
      fetchData();
    }
  }, [tableName]);

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf("!") === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const listTemplate = (items) => {
    if (!items || items.length === 0) return <EmptyState />;

    const renderItem =
      itemsList || ((p) => <div key={p.id}>{JSON.stringify(p)}</div>);

    return (
      <div className={`grid ${templateGrid} gap-5 p-3 mt-3`}>
        {items.map((product, index) => renderItem(product, index))}
      </div>
    );
  };

  const renderHeaderDropdown = () => {
    return (
      <Dropdown
        options={dataParams?.sortOptions || []}
        value={sortKey}
        optionLabel="label"
        placeholder="Sort By"
        onChange={onSortChange}
        className="md:w-65 w-full"
      />
    );
  };

  // FIXED: Logic to merge custom header with Sort Dropdown
  const dataView = (prop = {}) => {
    const combinedHeader = (
      <div className="md:flex md:justify-between md:items-center gap-2 w-full">
        <h1 className="text-xl font-bold mb-3 md:mb-0 ">{prop.header || ""}</h1>
        <div className="flex items-center gap-3">
          {renderHeaderDropdown()}
          {prop?.filterjsx}
        </div>
      </div>
    );

    return (
      <div className="card">
        <DataView
          value={data}
          listTemplate={listTemplate} // PrimeReact will pass the specific page items here
          loading={loading}
          paginator
          rows={dataParams?.pagination?.rows}
          sortField={sortField}
          sortOrder={sortOrder}
          {...prop} // Spread props
          header={combinedHeader} // Override header LAST to ensure our logic persists
        />
      </div>
    );
  };

  return {
    data,
    setData,
    setLoading,
    dataView,
    fetchData,
    loading,
    onSortChange,
    dataParams,
    sortField,
    setTemplateGrid,
  };
};
