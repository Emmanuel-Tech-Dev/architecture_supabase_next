import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import React from "react";

const ConfIrmPopUp = ({
  message,
  header,
  icon = "pi pi-exclamation-triangle",
  defaultFocus = "accept",
  accept,
  reject,
}) => {
  const confirm1 = () => {
    confirmDialog({
      message,
      header,
      icon,
      defaultFocus,
      accept,
      reject,
    });
  };
  return (
    <div>
      <ConfirmDialog />
    </div>
  );
};

export default ConfIrmPopUp;
