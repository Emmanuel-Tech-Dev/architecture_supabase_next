const customFunctions = {
  popUpTableMenu(actionFunc, rowData) {
    const items = [
      {
        label: "Update",
        icon: "pi pi-refresh",
        command: () => {
          actionFunc(rowData);
        },
      },
      {
        label: "Delete",
        icon: "pi pi-trash",
        command: () => {
          toast.current.show({
            severity: "warn",
            summary: "Delete",
            detail: "Data Deleted",
            life: 3000,
          });
        },
      },
      //   {
      //     label: "React Website",
      //     icon: "pi pi-external-link",
      //     command: () => {
      //       window.location.href = "https://react.dev/";
      //     },
      //   },
      //   {
      //     label: "Upload",
      //     icon: "pi pi-upload",
      //     command: () => {
      //       router.push("/fileupload");
      //     },
      //   },
    ];

    return items;
  },
};

export default customFunctions;
