"use client";
import PageHeader from "@/component/PageHeader";
import { TabPanel, TabView } from "primereact/tabview";
import React from "react";

const Supabase = () => {
  const items = [
    {
      label: "Config",
      icon: "pi pi-cog",
      children: <div>Config Content</div>,
    },
    { label: "Models", icon: "pi pi-server" },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        pageTitle="Supabase Integration"
        homeUrl="/dashboard"
        items={[{ label: "Supabase", url: "/dashboard/supabase" }]}
      />

      <div className="card">
        <TabView>
          <TabPanel header="Connection" leftIcon="pi pi-cog mr-2">
            <div>Supabase Connection</div>
          </TabPanel>
          <TabPanel header="Custom Models" leftIcon="pi pi-server mr-2">
            <div>Supabase Custom Models</div>
          </TabPanel>
        </TabView>
      </div>
    </div>
  );
};

export default Supabase;
