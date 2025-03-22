import { Outlet } from "react-router-dom";
//
import { SidebarComponent } from "./components/SidebarComponent";
import { useState } from "react";
import { NavbarComponent } from "./components";

export const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="d-flex">
      <SidebarComponent collapsed={sidebarCollapsed} />
      <div style={{ width: "100%" }}>
        <NavbarComponent handleSidebarCollapse={handleSidebarCollapse} />
        <div
          className="p-3"
          style={{ height: "calc(100vh - 40px)", overflowY: "auto" }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
