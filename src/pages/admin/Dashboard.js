import React, { useState } from "react";
import "./Dashboard.scss";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Tổng quan hệ thống Badminton shop</h2>
        <p className="total-revenue">
          Tổng doanh thu: <strong>51.880.000 đ</strong>
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <h3>Doanh thu</h3>
            <div className="value">15</div>
            <div className="trend">+12% từ tháng trước</div>
          </div>
        </div>

        <div className="stat-card stat-card--success">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Tổng đơn hàng</h3>
            <div className="value">15</div>
            <div className="trend">+8% từ tuần trước</div>
          </div>
        </div>

        <div className="stat-card stat-card--purple">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Tổng khách hàng</h3>
            <div className="value">11</div>
            <div className="trend">+3 khách hàng mới</div>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-icon">🛍️</div>
          <div className="stat-info">
            <h3>Tổng sản phẩm</h3>
            <div className="value">16</div>
            <div className="trend">+2 sản phẩm mới</div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="content-grid">
        {/* Order Status */}
        <div className="card order-status">
          <h3>Trạng thái đơn hàng</h3>
          <ul>
            <li className="status-delivered">
              <div className="status-info">
                <span className="status-icon">✅</span>
                <span>Đơn đã giao</span>
              </div>
              <strong>8</strong>
            </li>
            <li className="status-cancelled">
              <div className="status-info">
                <span className="status-icon">❌</span>
                <span>Đơn đã hủy</span>
              </div>
              <strong>2</strong>
            </li>
            <li className="status-processing">
              <div className="status-info">
                <span className="status-icon">⏳</span>
                <span>Đang xử lý</span>
              </div>
              <strong>4</strong>
            </li>
            <li className="status-shipping">
              <div className="status-info">
                <span className="status-icon">🚚</span>
                <span>Đang vận chuyển</span>
              </div>
              <strong>1</strong>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions">
          <h3>Thao tác nhanh</h3>
          <div className="action-buttons">
            <button className="action-btn action-btn--add">
              <span className="action-icon">➕</span>
              <span className="action-text">Thêm sản phẩm</span>
            </button>
            <button className="action-btn action-btn--list">
              <span className="action-icon">📋</span>
              <span className="action-text">Danh sách sản phẩm</span>
            </button>
            <button className="action-btn action-btn--orders">
              <span className="action-icon">📦</span>
              <span className="action-text">Quản lý đơn hàng</span>
            </button>
            <button className="action-btn action-btn--stats">
              <span className="action-icon">📊</span>
              <span className="action-text">Thống kê chi tiết</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card recent-activities">
          <h3>Hoạt động gần đây</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">🛒</div>
              <div className="activity-content">
                <p>Đơn hàng mới #1234</p>
                <span className="activity-time">2 phút trước</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <p>Khách hàng mới đăng ký</p>
                <span className="activity-time">15 phút trước</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📦</div>
              <div className="activity-content">
                <p>Đơn hàng #1233 đã giao</p>
                <span className="activity-time">1 giờ trước</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="card top-products">
          <h3>Sản phẩm bán chạy</h3>
          <div className="product-list">
            <div className="product-item">
              <div className="product-info">
                <span className="product-name">Áo thun basic</span>
                <span className="product-sales">25 đã bán</span>
              </div>
              <div className="product-revenue">1.250.000đ</div>
            </div>
            <div className="product-item">
              <div className="product-info">
                <span className="product-name">Quần jeans</span>
                <span className="product-sales">18 đã bán</span>
              </div>
              <div className="product-revenue">2.160.000đ</div>
            </div>
            <div className="product-item">
              <div className="product-info">
                <span className="product-name">Giày sneaker</span>
                <span className="product-sales">12 đã bán</span>
              </div>
              <div className="product-revenue">1.800.000đ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Dashboard;
