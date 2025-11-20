export default function getMenuItems(router, defaultRoute) {
  const menuItems = [
    {
      id: "/",
      label: "Dashboard",
      icon: "pi pi-home",
      command: () => {
        router.push(defaultRoute);
      },
    },
    {
      id: "affiliates",
      label: "Affiliates",
      icon: "pi pi-user",
      command: () => {
        router.push(`${defaultRoute}/affiliates`);
      },
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: "pi pi-chart-line",
      command: () => {
        router.push(`${defaultRoute}/analytics`);
      },
    },
    {
      id: "hooks",
      label: "Hooks",
      icon: "pi pi-table",
      command: () => {
        router.push(`${defaultRoute}/hooks`);
      },
    },
    {
      id: "utils",
      label: "Utils",
      icon: "pi pi-hashtag",
      command: () => {
        router.push(`${defaultRoute}/utils`);
      },
    },
    {
      id: "supabase",
      label: "Supabase",
      icon: "pi pi-database",
      command: () => {
        router.push(`${defaultRoute}/supabase`);
      },
    },
    {
      id: "provider",
      label: "Context Provider",
      icon: "pi pi-lock",
      command: () => {
        router.push(`${defaultRoute}/provider`);
      },
    },
    {
      id: "settings",
      label: "Settings",
      icon: "pi pi-cog",
      command: () => {
        router.push(`${defaultRoute}/settings`);
      },
    },
  ];

  return menuItems;
}
