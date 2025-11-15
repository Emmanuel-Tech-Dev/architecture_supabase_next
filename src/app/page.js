"use client";

import { useDataTable } from "@/hooks/useDataTable";
import Model from "@/libs/config/model";
import { utils } from "@/libs/utils";
import Image from "next/image";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { use, useEffect, useRef } from "react";

export default function Home() {
  // async function getData() {
  //   try {
  //     const res = await Model.get("testing", {
  //       // textSearch: { column: "room_number", query: "OW354" },
  //       filters: [{ field: "room_number", op: "ilike", value: "OW" }],
  //     });
  //     console.log("Data fetched:", res);
  //     utils.showToast("success", "Data fetched successfully");
  //   } catch (err) {
  //     console.error("Error fetching data:", err);
  //     utils.showToast("error", "Error fetching data", err.message);
  //   }
  // }

  // const channel = Model.subscribe("users", (payload) => {
  //   console.log("Realtime change:", payload);
  // });

  // // Later, to stop listening:
  // Model.unsubscribe(channel);

  // useEffect(() => {
  //   const channel = Model.subscribe("testing", (payload) =>
  //     console.log(payload)
  //   );

  //   // Cleanup: unsubscribe when component unmounts
  //   return () => {
  //     Model.unsubscribe(channel);
  //   };
  // }, []);

  const toastRef = useRef(null);

  const table = useDataTable(
    "testing",
    {
      pagination: { rows: 10, rowsPerPageOptions: [10, 20, 50] },
    },
    false
  );

  const columns = [
    { field: "id", header: "ID", sortable: true },
    { field: "room_number", header: "Room Number", sortable: true },
    { field: "room_type", header: "Room Type", sortable: true },
  ];

  useEffect(() => {
    table.setClolumn(columns);

    // table.paginatorProps(
    //   <Button icon="pi pi-refresh" rounded text onClick={table.fetchData} />,
    //   "Yes"
    // );
    table.setFooter(false);
    table.fetchData();
  }, []);

  return (
    <div className="">
      <Button
        onClick={() =>
          utils.showToastV2("success", "Attention", "Your message")
        }
      >
        Testing Toaster
      </Button>
      {/* {table.table()} */}
    </div>
  );
}
