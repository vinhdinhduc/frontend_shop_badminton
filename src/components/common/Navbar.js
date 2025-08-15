import React, { useState, useEffect } from "react";
import "./NavBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [hasUser, setHasUser] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [cartItems, setCartItems] = useState(99);

  const formatCartCount = (count) => {
    if (count === 0) return null;
    if (count > 99) return "99+";
    return count.toString();
  };
  const isLargeCart = (count) => {
    return count > 99;
  };

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 992);
      if (window.innerWidth >= 992) {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape" && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/products", label: "Sản phẩm" },
    { to: "/intro", label: "Giới thiệu" },
    { to: "/about", label: "Liên hệ" },
  ];

  return (
    <>
      <div className="nav-bar-container">
        <div className="container-fluid">
          <div className="nav-bar">
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <button
                className="mobile-toggle"
                onClick={toggleSidebar}
                aria-label="Toggle navigation menu"
                aria-expanded={isSidebarOpen}
              >
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}

            <div className="logo">
              <NavLink to="/" className="logo-link" />
            </div>

            {!isMobile && (
              <div className="nav-links">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="nav-link"
                    onClick={closeSidebar}
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="nav-actions">
              <NavLink to="/search" className="nav-action" title="Tìm kiếm">
                <FontAwesomeIcon icon={faSearch} />
              </NavLink>
              <NavLink
                to="/cart"
                className="nav-action has-items"
                title="Giỏ hàng"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartItems > 0 && (
                  <span
                    className={`nav-cart-count ${
                      isLargeCart(cartItems) ? "large" : ""
                    }`}
                  >
                    {formatCartCount(cartItems)}
                  </span>
                )}
              </NavLink>

              {hasUser ? (
                <NavLink to="/profile" className="nav-action" title="Tài khoản">
                  <FontAwesomeIcon icon={faUser} />
                  <span className="nav-username">Tài khoản</span>
                </NavLink>
              ) : (
                <NavLink to="/auth" className="nav-action">
                  <button className="btn-login">Đăng nhập</button>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {/* Overlay */}
          <div
            className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
            {/* Sidebar Header */}
            <div className="sidebar-header">
              <div className="sidebar-logo">Badminton Shop</div>
              <button
                className="sidebar-close"
                onClick={closeSidebar}
                aria-label="Close navigation menu"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Sidebar Navigation */}
            <nav className="sidebar-nav">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="sidebar-nav-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Sidebar Actions */}
            <div className="sidebar-actions">
              <NavLink
                to="/search"
                className="sidebar-action"
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Tìm kiếm</span>
              </NavLink>
              <NavLink
                to="/cart"
                className="sidebar-action"
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Giỏ hàng</span>
              </NavLink>
              {hasUser ? (
                <NavLink
                  to="/profile"
                  className="sidebar-action"
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>Tài khoản</span>
                </NavLink>
              ) : (
                <NavLink to="/login" onClick={closeSidebar}>
                  <button className="sidebar-btn-login">Đăng nhập</button>
                </NavLink>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
