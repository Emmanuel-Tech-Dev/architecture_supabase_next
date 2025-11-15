import Model from "@/libs/config/model";
import { utils } from "@/libs/utils";
import { DataView } from "primereact/dataview";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";

export const useDataView = (
  tableName = "testing",
  initDataParams = {
    pagination: { rows: 10 },
    sortOptions: [
      { label: "Price High to Low", value: "!room_price" },
      { label: "Price Low to High", value: "room_price" },
      { label: "Capacity High to Low", value: "!room_capacity" },
      { label: "Capacity Low to High", value: "room_capacity" },
      { label: "Available Spots High to Low", value: "!available_spots" },
      { label: "Available Spots Low to High", value: "available_spots" },
    ],
  },
  itemsList,
  autoFetch = true
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [dataParams, setDataParams] = useState({
    ...{
      pagination: { rows: 10 },
      sortOptions: [
        { label: "Price High to Low", value: "!room_price" },
        // ... rest of sortOptions array
      ],
    },
    ...initDataParams,
  });

  // FIXED: default must be null
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState(0);
  const [sortField, setSortField] = useState("");

  async function fetchData() {
    try {
      if (autoFetch === false && tableName == null) return;

      setLoading(true);

      const res = await Model.get(tableName);
      setData(res.data || []);
      console.log("DataView fetched data:", res.data);
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

  const listTemplate = (items, dataKey = "id") => {
    // Safety: Ensure itemsList is a function
    const renderItem =
      itemsList || ((p) => <div key={p[dataKey]}>{JSON.stringify(p)}</div>);
    return (
      <div className="" key={items[dataKey]}>
        {items?.map((p, i) => renderItem(p, i))}
      </div>
    );
  };

  const header = () => {
    return (
      <Dropdown
        options={dataParams?.sortOptions || []} // FIXED: Fallback to empty array to prevent crash
        value={sortKey}
        optionLabel="label"
        placeholder="Sort By Price"
        onChange={onSortChange}
        className="w-full sm:w-14rem"
      />
    );
  };

  const dataView = () => {
    return (
      <div className="card">
        <DataView
          value={data}
          listTemplate={listTemplate}
          loading={loading}
          paginator
          rows={dataParams?.pagination?.rows}
          header={header()}
          sortField={sortField}
          sortOrder={sortOrder}
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
  };
};
