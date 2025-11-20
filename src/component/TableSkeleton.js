import { Skeleton } from "primereact/skeleton";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

// You will adjust the number of columns (cols) and rows (rows) to match your table size.
export default function TableSkeleton({ cols = 5, rows = 10, columns }) {
  const items = Array.from({ length: rows }, (v, i) => i);

  return (
    <div className="card">
      <DataTable value={items} className="p-datatable-striped">
        {columns?.map((col) => (
          <Column
            key={col?.field}
            field={col?.field}
            header={col?.header}
            body={<Skeleton />}
            style={{ width: "25%" }}
            // Pass specific match modes if needed (e.g., for dates)
          />
        ))}
      </DataTable>
    </div>
  );
}
