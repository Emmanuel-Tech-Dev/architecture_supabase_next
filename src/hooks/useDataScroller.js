import { DataScroller } from "primereact/datascroller";
import Model from "@/libs/config/model";
import { utils } from "@/libs/utils";
import { useState } from "react";

export const useDataScroller = (
  tableName = "testing",
  itemsList,
  autoFetch = true
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scrollHeight, setScrollHeight] = useState("400px");

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
          page: window?.location?.pathname,
        });
      }
      setLoading(false);
    }
  }

  const dataScroller = () => {
    return (
      <DataScroller
        value={data}
        itemTemplate={itemsList}
        // loading={loading}
        // paginator
        inline
        scrollHeight={scrollHeight}
        rows={5}
        buffer={0.4}
      />
    );
  };

  return {
    data,
    setData,
    fetchData,
    dataScroller,
    loading,
    setLoading,
    setScrollHeight,
  };
};
