import React, { useState, useEffect, useRef } from "react";
import "./NavBar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
  faBars,
  faTimes,
  faChevronDown,
  faChevronUp,
  faAddressCard,
  faRightFromBracket,
  faListCheck,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/userAction";

import { NavLink, useNavigate } from "react-router-dom";
import { getCartCountAction } from "../../redux/actions/cartAction";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [showDropdown, setShowDropdown] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchInputRef = useRef(null);
  const dropDownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.userLogin);
  const { cartCount } = useSelector((state) => state.cartList);

  useEffect(() => {
    dispatch(getCartCountAction());
  }, [dispatch]);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth");
  };

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
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery("");
    }
  };

  useEffect(() => {
    const handleClickOutSide = (event) => {
      console.log("event", event);

      if (
        showSearch &&
        !event.target.closest(".search-overlay") &&
        !event.target.closest(".nav-action")
      ) {
        setShowSearch(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => document.removeEventListener("mousedown", handleClickOutSide);
  }, [showSearch]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        if (showSearch) {
          setShowSearch(false);
          setSearchQuery("");
        }
        if (isSidebarOpen) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [showSearch, isSidebarOpen]);

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

  const navLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/products", label: "Sản phẩm" },
    { to: "/intro", label: "Giới thiệu" },
    { to: "/contact", label: "Liên hệ" },
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
              <button
                onClick={toggleSearch}
                className="nav-action"
                title="Tìm kiếm"
                aria-label="Search"
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <NavLink
                to="/cart"
                className="nav-action has-items"
                title="Giỏ hàng"
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                {cartCount > 0 && (
                  <span
                    className={`nav-cart-count ${
                      isLargeCart(cartCount) ? "large" : ""
                    }`}
                  >
                    {formatCartCount(cartCount)}
                  </span>
                )}
              </NavLink>

              {userInfo ? (
                <div
                  ref={dropDownRef}
                  className="nav-action"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span className="nav-username">
                    {userInfo?.data?.user?.fullName}{" "}
                  </span>
                  <FontAwesomeIcon
                    icon={showDropdown ? faChevronUp : faChevronDown}
                    className="chevron"
                  />

                  {showDropdown && (
                    <div className="user-dropdown">
                      <NavLink to="/profile" className="dropdown-item">
                        <FontAwesomeIcon
                          icon={faAddressCard}
                          className="icon"
                        />{" "}
                        Hồ sơ
                      </NavLink>
                      <NavLink to="/view-order" className="dropdown-item">
                        <FontAwesomeIcon icon={faListCheck} className="icon" />{" "}
                        Đơn hàng của bạn
                      </NavLink>
                      <button onClick={handleLogout} className="dropdown-item">
                        <FontAwesomeIcon
                          icon={faRightFromBracket}
                          className="icon"
                        />{" "}
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink to="/auth" className="nav-action">
                  <button className="btn-login">Đăng nhập</button>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
      {showSearch && (
        <div className={`search-overlay ${showSearch ? "active" : ""}`}>
          <div className="search-container">
            <button
              className="search-close"
              onClick={toggleSearch}
              aria-label="Close search"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <form onSubmit={handleSearchSubmit} className="search-form">
              <div className="search-input-wrapper">
                <FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear"
                    onClick={() => setSearchQuery("")}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                )}
              </div>
              <button type="submit" className="search-submit">
                Tìm kiếm
              </button>
            </form>
            <div className="search-suggestions">
              <p className="search-label">Gợi ý tìm kiếm:</p>
              <div className="search-tags">
                {["Vợt cầu lông", "Giày cầu lông", "Yerak", "Valeer"].map(
                  (tag) => (
                    <button
                      key={tag}
                      className="search-tag"
                      onClick={() => {
                        setSearchQuery(tag);
                        searchInputRef.current?.focus();
                      }}
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar */}
      {isMobile && (
        <>
          {console.log("Rendering sidebar overlay:", isSidebarOpen)}
          {/* Overlay */}
          <div
            className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div className={`sidebar-home ${isSidebarOpen ? "active" : ""}`}>
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
              <button
                className="sidebar-action"
                onClick={() => {
                  closeSidebar();
                  setShowSearch(true);
                }}
              >
                <FontAwesomeIcon icon={faSearch} />
                <span>Tìm kiếm</span>
              </button>
              <NavLink
                to="/cart"
                className="sidebar-action"
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>Giỏ hàng</span>
              </NavLink>
              {userInfo ? (
                <NavLink
                  to="/profile"
                  className="sidebar-action"
                  onClick={closeSidebar}
                >
                  <FontAwesomeIcon icon={faUser} />
                  <span>{userInfo?.data?.user?.fullName}</span>
                </NavLink>
              ) : (
                <NavLink to="/auth" onClick={closeSidebar}>
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
