import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  Calendar,
  Download,
} from "lucide-react";
import "./Reports.scss";

const Reports = () => {
  const { arrOrders } = useSelector((state) => state.orderList);
  const { arrProduct } = useSelector((state) => state.productList);
  const { arrUsers } = useSelector((state) => state.customerList);

  const [dateRange, setDateRange] = useState("30days");
  const [reportData, setReportData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    revenueGrowth: 0,
    ordersGrowth: 0,
  });

  // Tính toán dữ liệu thống kê
  useEffect(() => {
    if (arrOrders?.data?.orders) {
      const orders = arrOrders.data.orders;
      const totalRevenue = orders.reduce(
        (sum, order) => sum + parseFloat(order.order_total || 0),
        0
      );
      const totalOrders = orders.length;

      // Tính growth (giả định so với tháng trước)
      const revenueGrowth = Math.random() * 20 - 5; // Random cho demo
      const ordersGrowth = Math.random() * 15 - 3;

      setReportData({
        totalRevenue,
        totalOrders,
        totalProducts: arrProduct?.data?.length || 0,
        totalCustomers: arrUsers?.data?.users?.length || 0,
        revenueGrowth,
        ordersGrowth,
      });
    }
  }, [arrOrders, arrProduct, arrUsers]);

  // Dữ liệu doanh thu theo tháng
  const revenueByMonth = [
    { month: "T1", revenue: 45000000, orders: 145 },
    { month: "T2", revenue: 52000000, orders: 168 },
    { month: "T3", revenue: 48000000, orders: 152 },
    { month: "T4", revenue: 61000000, orders: 189 },
    { month: "T5", revenue: 55000000, orders: 171 },
    { month: "T6", revenue: 67000000, orders: 203 },
    { month: "T7", revenue: 72000000, orders: 221 },
    { month: "T8", revenue: 65000000, orders: 198 },
    { month: "T9", revenue: 78000000, orders: 235 },
    { month: "T10", revenue: 82000000, orders: 248 },
    { month: "T11", revenue: 88000000, orders: 267 },
    { month: "T12", revenue: 95000000, orders: 289 },
  ];

  // Dữ liệu trạng thái đơn hàng
  const orderStatusData = [
    { name: "Đang xử lý", value: 45, color: "#3498db" },
    { name: "Đã giao", value: 120, color: "#27ae60" },
    { name: "Đã hủy", value: 15, color: "#e74c3c" },
    { name: "Đang giao", value: 32, color: "#f39c12" },
  ];

  // Top sản phẩm bán chạy
  const topProducts = [
    { name: "Vợt Yonex ArcSaber", sold: 145, revenue: 87000000 },
    { name: "Giày Victor SH-A920", sold: 132, revenue: 72600000 },
    { name: "Áo Lining AAYP013", sold: 118, revenue: 35400000 },
    { name: "Vợt Victor Jetspeed", sold: 98, revenue: 58800000 },
    { name: "Túi đựng vợt Yonex", sold: 87, revenue: 17400000 },
  ];

  // Doanh thu theo danh mục
  const categoryRevenue = [
    { category: "Vợt cầu lông", value: 45, color: "#3498db" },
    { category: "Giày", value: 28, color: "#27ae60" },
    { category: "Quần áo", value: 18, color: "#f39c12" },
    { category: "Phụ kiện", value: 9, color: "#e74c3c" },
  ];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const StatCard = ({ icon, title, value, growth, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}15` }}>
        <div style={{ color }}>{icon}</div>
      </div>
      <div className="stat-content">
        <p className="stat-title">{title}</p>
        <h3 className="stat-value">{value}</h3>
        {growth !== undefined && (
          <div
            className={`stat-growth ${growth >= 0 ? "positive" : "negative"}`}
          >
            {growth >= 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <span>{Math.abs(growth).toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div>
          <h1>Thống kê & Báo cáo</h1>
          <p>Tổng quan về hoạt động kinh doanh</p>
        </div>
        <div className="reports-actions">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-range-select"
          >
            <option value="7days">7 ngày qua</option>
            <option value="30days">30 ngày qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="12months">12 tháng qua</option>
          </select>
          <button className="export-btn">
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard
          icon={<DollarSign size={24} />}
          title="Tổng doanh thu"
          value={formatCurrency(reportData.totalRevenue)}
          growth={reportData.revenueGrowth}
          color="#27ae60"
        />
        <StatCard
          icon={<ShoppingCart size={24} />}
          title="Tổng đơn hàng"
          value={reportData.totalOrders}
          growth={reportData.ordersGrowth}
          color="#3498db"
        />
        <StatCard
          icon={<Package size={24} />}
          title="Sản phẩm"
          value={reportData.totalProducts}
          color="#f39c12"
        />
        <StatCard
          icon={<Users size={24} />}
          title="Khách hàng"
          value={reportData.totalCustomers}
          color="#9b59b6"
        />
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Revenue Chart */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Doanh thu theo tháng</h3>
            <span className="chart-subtitle">
              Biểu đồ doanh thu 12 tháng gần nhất
            </span>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueByMonth}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3498db" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3498db" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="month" stroke="#7f8c8d" />
              <YAxis stroke="#7f8c8d" />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3498db"
                fillOpacity={1}
                fill="url(#colorRevenue)"
                name="Doanh thu"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Số lượng đơn hàng</h3>
            <span className="chart-subtitle">Theo tháng</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis dataKey="month" stroke="#7f8c8d" />
              <YAxis stroke="#7f8c8d" />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="orders"
                fill="#27ae60"
                name="Đơn hàng"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Pie Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Trạng thái đơn hàng</h3>
            <span className="chart-subtitle">Phân bổ theo trạng thái</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="chart-card full-width">
          <div className="chart-header">
            <h3>Top sản phẩm bán chạy</h3>
            <span className="chart-subtitle">
              5 sản phẩm có doanh thu cao nhất
            </span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#ecf0f1" />
              <XAxis type="number" stroke="#7f8c8d" />
              <YAxis
                dataKey="name"
                type="category"
                width={150}
                stroke="#7f8c8d"
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => [
                  name === "sold" ? value : formatCurrency(value),
                  name === "sold" ? "Đã bán" : "Doanh thu",
                ]}
              />
              <Legend />
              <Bar
                dataKey="sold"
                fill="#3498db"
                name="Số lượng bán"
                radius={[0, 8, 8, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Revenue */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Doanh thu theo danh mục</h3>
            <span className="chart-subtitle">Phần trăm doanh thu</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryRevenue}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, value }) => `${category}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryRevenue.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Table */}
        <div className="chart-card">
          <div className="chart-header">
            <h3>Thống kê nhanh</h3>
            <span className="chart-subtitle">Các chỉ số quan trọng</span>
          </div>
          <div className="summary-table">
            <div className="summary-row">
              <span className="summary-label">Đơn hàng trung bình/ngày</span>
              <span className="summary-value">8.9</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Giá trị đơn hàng TB</span>
              <span className="summary-value">{formatCurrency(850000)}</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tỷ lệ hoàn thành</span>
              <span className="summary-value success">94.5%</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Tỷ lệ hủy đơn</span>
              <span className="summary-value danger">5.5%</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Sản phẩm sắp hết hàng</span>
              <span className="summary-value warning">12</span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Khách hàng mới (tháng này)</span>
              <span className="summary-value">45</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
