import React, { useState, useEffect } from "react";
import "./AdminHeader.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faBellConcierge,
  faGear,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/userAction";
import { useNavigate } from "react-router-dom";
const AdminHeader = ({ sidebarOpen, setSidebarOpen }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { userInfo } = useSelector((state) => state.userLogin);
  const [loginTime, setLoginTime] = useState(() => {
    const saved = localStorage.getItem("loginTime");
    return saved ? new Date(saved) : new Date();
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("loginTime");
    dispatch(logout());
    navigate("/auth");
  };
  const formatTime = (date) => {
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
          <h1 className="page-title">Dashboard</h1>
          <div className="breadcrumb">
            <span>Trang chủ</span>
            <span className="separator">›</span>
            <span className="current">Dashboard</span>
          </div>
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
            <span className="current-time">{formatTime(currentTime)}</span>
            <span className="time-separator">/</span>
            <span className="working-time">{getWorkingTime()}</span>
          </div>
          <div className="date-info">
            {currentTime.toLocaleDateString("vi-VN")}
          </div>
        </div>

        <div className="header-actions">
          <button className="notification-btn" aria-label="Thông báo">
            <span className="bell-icon">
              <FontAwesomeIcon icon={faBell} />
            </span>
            <span className="notification-badge">3</span>
          </button>

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
              <span>👤</span>
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
