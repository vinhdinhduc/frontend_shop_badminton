import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faEye,
  faEyeSlash,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();
  const { arrProduct } = useSelector((state) => state.productList);
  const { arrUsers } = useSelector((state) => state.customerList);
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Auto-collapse on smaller screens
      if (window.innerWidth <= 1024 && window.innerWidth > 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth > 1024) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // useEffect(() => {
  //   const updatedMenuItems = menuItems.map((item) => {
  //     if (item.id === "product-list") {
  //       return {
  //         ...item,
  //         badge: totalProducts?.toString() || "0",
  //       };
  //     }
  //     return item;
  //   });
  //   // Update your menuItems state if needed
  // }, [totalProducts]);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width-expanded",
      isCollapsed ? "70px" : "250px"
    );
  }, [isCollapsed]);

  const getTotalUsers = () => {
    return arrUsers ? arrUsers.data?.users?.length : 0;
  };
  const getTotalProducts = () => {
    console.log("arrProduct:", arrProduct);

    return arrProduct ? arrProduct.data?.length : 0;
  };
  console.log("Check user", userInfo);

  const getTextRole =
    userInfo?.data?.user?.role === "admin" ? "Quản trị viên" : "Khách hàng";

  const handleMenuItemClick = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: "📊",
      path: "/admin/dashboard",
      badge: null,
    },
    {
      id: "add-product",
      title: "Thêm sản phẩm",
      icon: "➕",
      path: "/admin/add-product",
      badge: null,
    },
    {
      id: "product-list",
      title: "Danh sách sản phẩm",
      icon: "📋",
      path: "/admin/list-products",
      badge: getTotalProducts(),
    },
    {
      id: "order-list",
      title: "Danh sách đơn hàng",
      icon: "📦",
      path: "/admin/orders",
      badge: "15",
    },
    {
      id: "customer",
      title: "Quản lý khách hàng",
      icon: "👥",
      path: "/admin/customers",
      badge: getTotalUsers(),
    },
    {
      id: "reports",
      title: "Thống kê & Báo cáo",
      icon: "📈",
      path: "/admin/reports",
      badge: null,
    },
  ];

  const quickActions = [
    {
      id: "settings",
      title: "Cài đặt",
      icon: "⚙️",
      path: "/admin/settings",
    },
    {
      id: "help",
      title: "Trợ giúp",
      icon: "❓",
      path: "/admin/help",
    },
  ];

  return (
    <>
      <div
        className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
          sidebarOpen && isMobile ? "mobile-open" : ""
        }`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <span onClick={() => setIsCollapsed(!isCollapsed)}>
                {!isCollapsed ? (
                  <FontAwesomeIcon icon={faEye} />
                ) : (
                  <FontAwesomeIcon icon={faEyeSlash} />
                )}
              </span>
            </div>
            {!isCollapsed && (
              <div className="logo-text">
                <h1>Badminton</h1>
                <p>ADMIN PANEL</p>
              </div>
            )}
          </div>

          {!isMobile && (
            <button
              className="collapse-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
              title={isCollapsed ? "Mở rộng sidebar" : "Thu gọn sidebar"}
            >
              <span>
                {isCollapsed ? (
                  <FontAwesomeIcon icon={faArrowRight} />
                ) : (
                  <FontAwesomeIcon icon={faArrowLeft} />
                )}
              </span>
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-header">
              {!isCollapsed && <span>QUẢN LÝ CHÍNH</span>}
            </div>
            <ul>
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className={location.pathname === item.path ? "active" : ""}
                >
                  <Link
                    to={item.path}
                    onClick={handleMenuItemClick}
                    title={isCollapsed ? item.title : ""}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <>
                        <span className="nav-title">{item.title}</span>
                        {item.badge && (
                          <span className="nav-badge">{item.badge}</span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="nav-section">
            <div className="nav-header">
              {!isCollapsed && <span>KHÁC</span>}
            </div>
            <ul>
              {quickActions.map((item) => (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={handleMenuItemClick}
                    title={isCollapsed ? item.title : ""}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    {!isCollapsed && (
                      <span className="nav-title">{item.title}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          {!isCollapsed && (
            <div className="system-info">
              <div className="status-indicator">
                <span className="status-dot online"></span>
                <span className="status-text">Hệ thống hoạt động tốt</span>
              </div>
              <div className="version">
                <span>Version 1.0.0</span>
              </div>
            </div>
          )}

          <div className="user-info">
            <div className="avatar">
              <span>👤</span>
            </div>
            {!isCollapsed && (
              <div className="user-details">
                <p className="username">{userInfo?.data?.user?.fullName} </p>
                <p className="role"> {getTextRole}</p>
                <div className="user-actions">
                  <button className="profile-btn" title="Hồ sơ">
                    <span>👤</span>
                  </button>
                  <button className="logout-btn" title="Đăng xuất">
                    <span>🚪</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
