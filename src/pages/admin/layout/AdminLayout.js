import React, { useState } from "react";
import Sidebar from "../Sidebar";
import AdminHeader from "../AdminHeader";
import "./AdminLayout.scss";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main content */}
      <div
        className={`main-wrapper ${
          isCollapsed ? "sidebar-collapsed" : "sidebar-expanded"
        }`}
      >
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isCollapsed={isCollapsed}
        />
        <div className="main-content">
          <Outlet />
        </div>
      </div>

      {/* Overlay cho mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;
