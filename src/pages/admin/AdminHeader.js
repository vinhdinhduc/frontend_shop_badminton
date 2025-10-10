import React, { useState, useEffect, useRef } from "react";
import "./AdminHeader.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faGear,
  faRightFromBracket,
  faCheck,
  faTrash,
  faTimes,
  faExclamationCircle,
  faShoppingCart,
  faBox,
  faUser,
  faStar,
  faCreditCard,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/userAction";
import { useLocation, useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/ui/BreadCrumb";
import {
  deleteNotificationService,
  getNotificationService,
  getUnreadCountService,
  markAllAsReadService,
  markAsReadService,
} from "../../services/notificationService";
const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const notificationRef = useRef(null);
  const { userInfo } = useSelector((state) => state.userLogin);

  const [loginTime, setLoginTime] = useState(() => {
    const saved = localStorage.getItem("loginTime");
    return saved ? new Date(saved) : new Date();
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter === "unread") params.is_read = false;
      if (filter === "read") params.is_read = true;

      const response = await getNotificationService(params);
      if (response && response.code === 0) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unreadCount);
      }
    } catch (error) {
      console.error("Fetch notifications error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await getUnreadCountService();
      if (response && response.code === 0) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error("Fetch unread count error:", error);
    }
  };

  useEffect(() => {
    if (isNotificationOpen) {
      fetchNotifications();
    }
  }, [filter, isNotificationOpen]);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  //Cập nhật số lượng sản phẩm chưa đọc

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const response = await markAsReadService(id);
      if (response && response.code === 0) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await markAllAsReadService();
      if (response && response.code === 0) {
        fetchNotifications();
        setUnreadCount(0);
      }
    } catch (error) {
      console.error("Mark all as read error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteNotificationService(id);
      if (response && response.code === 0) {
        fetchNotifications();
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.action_url) {
      navigate(notification.action_url);
      setIsNotificationOpen(false);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      order_new: faShoppingCart,
      order_cancelled: faTimes,
      product_low_stock: faExclamationCircle,
      product_out_of_stock: faBox,
      customer_new: faUser,
      review_new: faStar,
      payment_success: faCreditCard,
      payment_failed: faTimes,
      system: faInfoCircle,
    };
    return icons[type] || faBell;
  };
  const handleLogout = () => {
    localStorage.removeItem("loginTime");
    dispatch(logout());
    navigate("/auth");
  };
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };
  const formatTimeDisplay = (date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const getWorkingTime = () => {
    const currentTime = new Date();
    const timeDiff = currentTime - loginTime;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  const handleViewNotifications = () => {
    navigate("/admin/notifications");
  };
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };
  const getPageTitle = () => {
    const pathnames = location.pathname.split("/").filter(Boolean);

    const routeToTitleMap = {
      dashboard: "Bảng điều khiển",
      "add-product": "Thêm sản phẩm",
      "list-products": "Danh sách sản phẩm",
      orders: "Quản lý đơn hàng",
      customers: "Quản lý khách hàng",
      brands: "Quản lý thương hiệu",
      reports: "Thống kê & Báo cáo",
      settings: "Cài đặt",
      help: "Trợ giúp",
    };
    //Get route cuối cùng
    const currentRoute = pathnames[pathnames.length - 1];

    return routeToTitleMap[currentRoute];
  };
  const getCustomName = () => {
    const pathnames = location.pathname.split("/").filter(Boolean);
    const lastSegment = pathnames[pathnames.length - 1];

    if (/^\d+$/.test(lastSegment)) {
      return null;
    }

    return null;
  };
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Chào buổi sáng";
    if (hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
  };

  return (
    <header className="admin-header">
      <div className="header-left">
        <button
          className={`menu-toggle ${sidebarOpen ? "active" : ""}`}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className="page-info">
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>
      </div>

      <div className="header-center">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="search-input"
          />
          <button className="search-btn" aria-label="Tìm kiếm">
            <span>🔍</span>
          </button>
        </div>
      </div>

      <div className="header-right">
        <div className="time-display">
          <div className="time-info">
            <span className="current-time">
              {formatTimeDisplay(currentTime)}
            </span>
            <span className="time-separator">/</span>
            <span className="working-time">{getWorkingTime()}</span>
          </div>
          <div className="date-info">
            {currentTime.toLocaleDateString("vi-VN")}
          </div>
        </div>

        <div className="header-actions">
          <div className="notification-container" ref={notificationRef}>
            <button
              className="notification-btn"
              aria-label="Thông báo"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <span className="bell-icon">
                <FontAwesomeIcon icon={faBell} />
              </span>
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>

            {/* Notification Panel */}
            {isNotificationOpen && (
              <div className="notification-panel">
                <div className="notification-header">
                  <h3>Thông báo</h3>
                  {unreadCount > 0 && (
                    <button
                      className="mark-all-read-btn"
                      onClick={handleMarkAllAsRead}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>

                <div className="notification-filters">
                  <button
                    className={`filter-btn ${filter === "all" ? "active" : ""}`}
                    onClick={() => setFilter("all")}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`filter-btn ${
                      filter === "unread" ? "active" : ""
                    }`}
                    onClick={() => setFilter("unread")}
                  >
                    Chưa đọc ({unreadCount})
                  </button>
                  <button
                    className={`filter-btn ${
                      filter === "read" ? "active" : ""
                    }`}
                    onClick={() => setFilter("read")}
                  >
                    Đã đọc
                  </button>
                </div>

                <div className="notification-list">
                  {loading ? (
                    <div className="notification-loading">
                      <div className="spinner"></div>
                      <p>Đang tải...</p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="notification-empty">
                      <FontAwesomeIcon icon={faBell} />
                      <p>Không có thông báo nào</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`notification-item ${
                          !notification.is_read ? "unread" : ""
                        } ${getPriorityClass(notification.priority)}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="notification-icon">
                          <FontAwesomeIcon
                            icon={getNotificationIcon(notification.type)}
                          />
                        </div>

                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">
                            {formatTime(notification.created_at)}
                          </span>
                        </div>

                        <div className="notification-actions">
                          {!notification.is_read && (
                            <button
                              className="action-btn read-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              title="Đánh dấu đã đọc"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                          )}
                          <button
                            className="action-btn delete-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            title="Xóa"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="notification-footer">
                    <button
                      className="view-all-btn"
                      onClick={() => {
                        navigate("/admin/notifications");
                        setIsNotificationOpen(false);
                      }}
                    >
                      Xem tất cả thông báo
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <button className="settings-btn" aria-label="Cài đặt">
            <span>
              {" "}
              <FontAwesomeIcon icon={faGear} />
            </span>
          </button>
        </div>

        <div className="user-section">
          <div className="user-profile">
            <div className="avatar">
              {userInfo?.data?.user?.avatar ? (
                <img
                  src={`http://localhost:8080${userInfo.data.user.avatar}`}
                  alt={userInfo.data.user.fullName}
                />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="user-info">
              <div className="greeting">{getGreeting()}</div>
              <div className="user-details">
                <span className="username">
                  {userInfo?.data?.user?.fullName}
                </span>
              </div>
            </div>
          </div>

          <div className="user-menu">
            <button className="logout-btn" onClick={() => handleLogout()}>
              <span>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </span>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
