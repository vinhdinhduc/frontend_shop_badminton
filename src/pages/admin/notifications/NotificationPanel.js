import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
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
import "./NotificationPanel.scss";
import { useNavigate } from "react-router-dom";
import {
  getNotificationService,
  getUnreadCountService,
  markAllAsReadService,
  markAsReadService,
  deleteNotificationService,
} from "../../../services/notificationService";

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const panelRef = useRef(null);
  const navigate = useNavigate();

  // Đóng panel khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Lấy thông báo
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

  // Lấy số lượng chưa đọc
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
    fetchNotifications();
  }, [filter]);

  // Polling để cập nhật số lượng chưa đọc
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30 giây
    return () => clearInterval(interval);
  }, []);

  // Đánh dấu đã đọc
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

  // Đánh dấu tất cả đã đọc
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

  // Xóa thông báo
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

  // Xử lý click vào thông báo
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }

    if (notification.action_url) {
      navigate(notification.action_url);
      setIsOpen(false);
    }
  };

  // Icon theo loại thông báo
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

  // Màu theo priority
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  // Format thời gian
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

  return (
    <div className="notification-container" ref={panelRef}>
      <div className="notification-panel">
        <div className="notification-header">
          <h3>Thông báo</h3>
          {unreadCount > 0 && (
            <button className="mark-all-read-btn" onClick={handleMarkAllAsRead}>
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
            className={`filter-btn ${filter === "unread" ? "active" : ""}`}
            onClick={() => setFilter("unread")}
          >
            Chưa đọc ({unreadCount})
          </button>
          <button
            className={`filter-btn ${filter === "read" ? "active" : ""}`}
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
                setIsOpen(false);
              }}
            >
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
