import React, { useEffect, useState } from "react";
import "./Dashboard.scss";
import Sidebar from "./Sidebar";
import AdminHeader from "./AdminHeader";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "../../redux/actions/customerAction";
import { fetchProduct } from "../../redux/actions/productAction";
import {
  DollarSign,
  Package,
  Users,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Plus,
  List,
  BarChart3,
  ShoppingCart,
  User,
  Package2,
} from "lucide-react";
import { getAllOrders } from "../../redux/actions/orderAction";
import { getBrandsAction } from "../../redux/actions/brandAction";
import useCountUp from "../../hooks/useCountUp";
import { CirclesWithBar } from "react-loader-spinner";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const dispatch = useDispatch();
  const { arrUsers, loading: userLoading } = useSelector(
    (state) => state.customerList
  );
  const { arrOrders } = useSelector((state) => state.orderList);
  console.log(arrOrders);

  const {
    arrProduct,
    loading: productLoading,
    totalProducts,
  } = useSelector((state) => state.productList);
  const totalRevenue =
    arrOrders?.data?.orders
      ?.filter((o) => o.status === "delivered" && o.paymentStatus === "paid")
      ?.reduce((sum, order) => sum + order.order_total, 0) || 2300000;
  const totalOrders = arrOrders?.data?.orders.length;

  const totalCustomers =
    arrUsers?.data?.users.filter((user) => user.role !== "admin")?.length || 0;

  const orders = arrOrders?.data?.orders || [];
  console.log("Check orders", orders);
  const orderStats = {
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };
  const recentActivities = [
    {
      id: 1,
      icon: <ShoppingCart size={20} />,
      content: "Đơn hàng mới #1234",
      time: "2 phút trước",
    },
    {
      id: 2,
      icon: <User size={20} />,
      content: "Khách hàng mới đăng ký",
      time: "15 phút trước",
    },
    {
      id: 3,
      icon: <Package2 size={20} />,
      content: "Đơn hàng #1233 đã giao",
      time: "1 giờ trước",
    },
  ];

  const getTopProducts = () => {
    if (!arrProduct?.data) return [];

    return arrProduct.data?.slice(0, 3).map((product) => ({
      name: product.name,
      sales: Math.floor(Math.random() * 50) + 1,
      revenue: Math.floor(Math.random() * 3000) + 500000,
    }));
  };

  useEffect(() => {
    dispatch(getAllUser({ page: 1, limit: 100, search: "", role: "" }));
    dispatch(fetchProduct());
    dispatch(getAllOrders({ page: 1, limit: 50 }));
    dispatch(getBrandsAction());
  }, [dispatch]);

  const animatedRevenue = useCountUp(totalRevenue, 2000);
  const animatedOrders = useCountUp(totalOrders, 1800);
  const animatedCustomers = useCountUp(totalCustomers, 2000);
  const animatedProducts = useCountUp(totalProducts || 0, 1800);
  const animatedPending = useCountUp(orderStats.pending, 1500);
  const animatedDelivered = useCountUp(orderStats.delivered, 1500);
  const animatedCancelled = useCountUp(orderStats.cancelled, 1500);
  const animatedProcessing = useCountUp(orderStats.processing, 1500);
  const animatedShipped = useCountUp(orderStats.shipped, 1500);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const topProducts = getTopProducts();
  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Tổng quan hệ thống Badminton shop</h2>
        <p className="total-revenue">
          Tổng doanh thu: <strong>{formatCurrency(animatedRevenue)} </strong>
        </p>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <div className="stat-icon">
            <DollarSign size={32} />
          </div>
          <div className="stat-info">
            <h3>Doanh thu</h3>
            <div className="value">{formatCurrency(animatedRevenue)} </div>
            <div className="trend">+12% từ tháng trước</div>
          </div>
        </div>

        <div className="stat-card stat-card--success">
          <div className="stat-icon">
            {" "}
            <Package size={32} />
          </div>
          <div className="stat-info">
            <h3>Tổng đơn hàng</h3>
            <div className="value">{animatedOrders}</div>
            <div className="trend">+8% từ tuần trước</div>
          </div>
        </div>

        <div className="stat-card stat-card--purple">
          <div className="stat-icon">
            {" "}
            <Users size={32} />
          </div>
          <div className="stat-info">
            <h3>Tổng khách hàng</h3>
            <div className="value">
              {userLoading ? "..." : animatedCustomers}
            </div>
            <div className="trend">
              +{Math.floor(totalCustomers * 0.1)} khách hàng mới
            </div>
          </div>
        </div>

        <div className="stat-card stat-card--warning">
          <div className="stat-icon">
            {" "}
            <ShoppingBag size={32} />
          </div>
          <div className="stat-info">
            <h3>Tổng sản phẩm</h3>
            <div className="value">
              {productLoading ? "..." : animatedProducts}
            </div>
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
            <li className="status-pending">
              <div className="status-info">
                <span className="status-icon">
                  <Clock size={16} color="gray" />
                </span>
                <span>Chờ xác nhận</span>
              </div>
              <strong>{animatedPending}</strong>
            </li>

            <li className="status-processing">
              <div className="status-info">
                <span className="status-icon">
                  <Clock size={16} color="orange" />
                </span>
                <span>Đang xử lý</span>
              </div>
              <strong>{animatedProcessing}</strong>
            </li>

            <li className="status-shipped">
              <div className="status-info">
                <span className="status-icon">
                  <Truck size={16} color="#3e9392" />
                </span>
                <span>Đang giao</span>
              </div>
              <strong>{animatedShipped}</strong>
            </li>

            <li className="status-delivered">
              <div className="status-info">
                <span className="status-icon">
                  <CheckCircle size={16} color="green" />
                </span>
                <span>Đã giao</span>
              </div>
              <strong>{animatedDelivered}</strong>
            </li>

            <li className="status-cancelled">
              <div className="status-info">
                <span className="status-icon">
                  <XCircle size={16} color="red" />
                </span>
                <span>Đã hủy</span>
              </div>
              <strong>{animatedCancelled}</strong>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="card quick-actions">
          <h3>Thao tác nhanh</h3>
          <div className="action-buttons">
            <button className="action-btn action-btn--add">
              <span className="action-icon">
                {" "}
                <Plus size={20} color="blue" />
              </span>
              <span className="action-text">Thêm sản phẩm</span>
            </button>
            <button className="action-btn action-btn--list">
              <span className="action-icon">
                {" "}
                <List size={20} />
              </span>
              <span className="action-text">Danh sách sản phẩm</span>
            </button>
            <button className="action-btn action-btn--orders">
              <span className="action-icon">
                <Package size={20} />
              </span>
              <span className="action-text">Quản lý đơn hàng</span>
            </button>
            <button className="action-btn action-btn--stats">
              <span className="action-icon">
                <BarChart3 size={20} />
              </span>
              <span className="action-text">Thống kê chi tiết</span>
            </button>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card recent-activities">
          <h3>Hoạt động gần đây</h3>
          <div className="activity-list">
            {recentActivities.map((activity) => (
              <div className="activity-item" key={activity.id}>
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p>{activity.content}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card top-products">
          <h3>Sản phẩm bán chạy</h3>
          <div className="product-list">
            {productLoading ? (
              <div className="loader">
                <div className="loader-container">
                  <CirclesWithBar
                    height={100}
                    width={100}
                    color="#2563eb"
                    ariaLabel="loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>
              </div>
            ) : topProducts.length > 0 ? (
              topProducts.map((item, index) => (
                <div className="product-item" key={index}>
                  <div className="product-info">
                    <span className="product-name">{item.name}</span>
                    <span className="product-sales">{item.sales} đã bán</span>
                  </div>
                  <div className="product-revenue">
                    {formatCurrency(item.revenue)}
                  </div>
                </div>
              ))
            ) : (
              <div>Không có dữ liệu sản phẩm</div>
            )}
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
