"use client";

import { Button } from "primereact/button";
import { confirmDialog as confirm } from "primereact/confirmdialog";

const useConfirmDiaglog = () => {
  // 1. Standard Delete (Red, Dangerous)
  const confirmDelete = (
    acceptCallback,
    message = "Are you sure you want to delete this record?"
  ) => {
    confirm({
      message: message,
      header: "Delete Confirmation",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger", // Red button automatically
      accept: acceptCallback,
      defaultFocus: "reject",
    });
  };

  // 2. Standard Save/Action (Blue/Primary)
  const confirmAction = (
    acceptCallback,
    message = "Are you sure you want to proceed?",
    header = "Confirmation",
    iconJsx
  ) => {
    confirm({
      message: message,
      header: header,
      icon:
        iconJsx ||
        "pi pi-exclamation-triangle bg-blue-50 p-4 rounded-full !text-blue-400",
      accept: acceptCallback,
      acceptLabel: "Confirm",
      rejectLabel: "Cancel",
      //   footer: (options) => {
      //     return (
      //       <div className="flex gap-2 justify-content-end w-full pt-3 border-top-1 border-gray-200">
      //         {/* Your Custom HTML/Buttons here */}

      //         <Button
      //           label="No, go back"
      //           icon="pi pi-arrow-left"
      //           className="p-button-text text-gray-600"
      //           onClick={options.reject} // Call PrimeReact's internal reject
      //         />

      //         <Button
      //           label="Let's do it!"
      //           icon="pi pi-check"
      //           className="bg-purple-600 border-purple-600 hover:bg-purple-700"
      //           onClick={() => {
      //             console.log("from hook ", options);
      //             acceptCallback(); // Run your logic
      //             options.accept(); // Close the dialog
      //           }}
      //         />
      //       </div>
      //     );
      //   },
      defaultFocus: "accept",
    });
  };

  const confirmImportant = (acceptCallback) => {
    confirm({
      message: "You cannot undo this.",
      dismissableMask: false, // <--- Forces user to click a button
      accept: acceptCallback,
    });
  };

  return { confirmDelete, confirmAction, confirmImportant };
};

export default useConfirmDiaglog;
