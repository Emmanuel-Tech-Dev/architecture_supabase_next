import { Card } from "primereact/card";
import { Button } from "primereact/button";

export default function EmptyState({
  message = "No records found matching your criteria.",
  actionText,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-dashed border-gray-300 rounded-lg text-center my-6">
      <i
        className="pi pi-inbox text-gray-400 mb-4"
        style={{ fontSize: "2.5rem" }}
      ></i>
      <h3 className="text-lg font-semibold text-gray-700">No Data Available</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">{message}</p>
      {actionText && onAction && (
        <Button
          //   label={actionText}
          icon="pi pi-refresh"
          severity="help"
          outlined
          onClick={onAction}
          aria-label="Refresh"
          size="small"
        />
      )}
    </div>
  );
}
