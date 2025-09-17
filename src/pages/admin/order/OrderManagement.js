import React, { useState, useEffect } from "react";
import "./OrderManagement.scss";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  MoreHorizontal,
} from "lucide-react";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const sampleOrders = [
    {
      id: "ORD-001",
      customer: "Nguyễn Văn A",
      phone: "0912345678",
      email: "nguyenvana@email.com",
      items: [
        { name: "Vợt Yonex ArcSaber 11", price: 3500000, quantity: 1 },
        { name: "Túi đựng vợt", price: 450000, quantity: 1 },
      ],
      total: 3950000,
      status: "pending", // pending, confirmed, shipping, delivered, cancelled
      paymentMethod: "cod",
      paymentStatus: "pending", // pending, paid
      createdAt: "2023-10-15T08:30:00",
      shippingAddress: "123 Đường ABC, Quận 1, TP.HCM",
    },
    {
      id: "ORD-002",
      customer: "Trần Thị B",
      phone: "0923456789",
      email: "tranthib@email.com",
      items: [{ name: "Vợt Victor Thruster F", price: 2800000, quantity: 2 }],
      total: 5600000,
      status: "confirmed",
      paymentMethod: "banking",
      paymentStatus: "paid",
      createdAt: "2023-10-14T14:20:00",
      shippingAddress: "456 Đường XYZ, Quận 3, TP.HCM",
    },
    {
      id: "ORD-003",
      customer: "Lê Văn C",
      phone: "0934567890",
      email: "levanc@email.com",
      items: [
        { name: "Vợt Lining Windstorm 72", price: 2200000, quantity: 1 },
        { name: "Cầu lông Yonex AS-50", price: 650000, quantity: 3 },
        { name: "Giày cầu lông", price: 1200000, quantity: 1 },
      ],
      total: 5550000,
      status: "shipping",
      paymentMethod: "cod",
      paymentStatus: "pending",
      createdAt: "2023-10-13T10:15:00",
      shippingAddress: "789 Đường DEF, Quận Tân Bình, TP.HCM",
    },
    {
      id: "ORD-004",
      customer: "Phạm Thị D",
      phone: "0945678901",
      email: "phamthid@email.com",
      items: [
        { name: "Vợt Mizuno Fortius 10", price: 3100000, quantity: 1 },
        { name: "Cầu lông Victor Champion", price: 520000, quantity: 2 },
      ],
      total: 4140000,
      status: "delivered",
      paymentMethod: "momo",
      paymentStatus: "paid",
      createdAt: "2023-10-12T16:45:00",
      shippingAddress: "321 Đường GHI, Quận Bình Thạnh, TP.HCM",
    },
    {
      id: "ORD-005",
      customer: "Hoàng Văn E",
      phone: "0956789012",
      email: "hoangvane@email.com",
      items: [{ name: "Vợt Kawasaki Pro 700", price: 1800000, quantity: 1 }],
      total: 1800000,
      status: "cancelled",
      paymentMethod: "banking",
      paymentStatus: "refunded",
      createdAt: "2023-10-11T09:30:00",
      shippingAddress: "654 Đường JKL, Quận 10, TP.HCM",
    },
  ];

  useEffect(() => {
    // Giả lập fetch API
    setTimeout(() => {
      setOrders(sampleOrders);
      setFilteredOrders(sampleOrders);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const filterOrders = () => {
    let result = orders;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(term) ||
          order.customer.toLowerCase().includes(term) ||
          order.phone.includes(term) ||
          order.email.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }
    setFilteredOrders(result);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge--pending";
      case "confirmed":
        return "status-badge--confirmed";
      case "shipping":
        return "status-badge--shipping";
      case "delivered":
        return "status-badge--delivered";
      case "cancelled":
        return "status-badge--cancelled";
      default:
        return "";
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "confirmed":
        return "Đã xác nhận";
      case "shipping":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ thanh toán";
      case "paid":
        return "Đã thanh toán";
      case "refunded":
        return "Đã hoàn tiền";
      default:
        return status;
    }
  };
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };
  if (loading) {
    return (
      <div className="order-management">
        <div className="admin-page-header">
          <h1>Quản lý đơn hàng</h1>
        </div>
        <div className="loading-spinner">Đang tải dữ liệu...</div>
      </div>
    );
  }
  return (
    <div className="order-management">
      <div className="admin-page-header">
        <h1>Quản lý đơn hàng</h1>
        <p>Theo dõi và quản lý tất cả đơn hàng của cửa hàng</p>
      </div>

      <div className="order-tools">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm đơn hàng theo ID, tên, SĐT hoặc email..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <div className="filter-box">
          <Filter size={20} />
          <select value={statusFilter} onChange={handleStatusFilter}>
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="shipping">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>

        <button className="export-btn">
          <Download size={18} />
          Xuất Excel
        </button>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn hàng</th>
              <th>Khách hàng</th>
              <th>Ngày đặt</th>
              <th>Số lượng</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Thanh toán</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.id}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">{order.customer}</div>
                      <div className="customer-contact">{order.phone}</div>
                    </div>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="order-total">{formatCurrency(order.total)}</td>
                  <td>
                    <span
                      className={`status-badge ${getStatusBadgeClass(
                        order.status
                      )}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td>
                    <span className={`payment-status ${order.paymentStatus}`}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="view-btn"
                        onClick={() => viewOrderDetail(order)}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="edit-btn" title="Cập nhật trạng thái">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-orders">
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDetailModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setShowDetailModal(false)}
          onStatusChange={handleStatusChange}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusText={getStatusText}
          getPaymentStatusText={getPaymentStatusText}
        />
      )}
    </div>
  );
};

// Modal chi tiết đơn hàng
const OrderDetailModal = ({
  order,
  onClose,
  onStatusChange,
  formatCurrency,
  formatDate,
  getStatusText,
  getPaymentStatusText,
}) => {
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleStatusUpdate = () => {
    onStatusChange(order.id, currentStatus);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết đơn hàng: {order.id}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="order-section">
            <h3>Thông tin đơn hàng</h3>
            <div className="order-info-grid">
              <div className="info-item">
                <label>Ngày đặt:</label>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <div className="info-item">
                <label>Trạng thái:</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="shipping">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div className="info-item">
                <label>Phương thức thanh toán:</label>
                <span>
                  {order.paymentMethod === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : order.paymentMethod === "banking"
                    ? "Chuyển khoản"
                    : order.paymentMethod === "momo"
                    ? "Ví MoMo"
                    : order.paymentMethod}
                </span>
              </div>
              <div className="info-item">
                <label>Tình trạng thanh toán:</label>
                <span className={`payment-status ${order.paymentStatus}`}>
                  {getPaymentStatusText(order.paymentStatus)}
                </span>
              </div>
            </div>
          </div>

          <div className="order-section">
            <h3>Thông tin khách hàng</h3>
            <div className="customer-info-grid">
              <div className="info-item">
                <label>Họ tên:</label>
                <span>{order.customer}</span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{order.phone}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{order.email}</span>
              </div>
              <div className="info-item full-width">
                <label>Địa chỉ giao hàng:</label>
                <span>{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          <div className="order-section">
            <h3>Sản phẩm đã đặt</h3>
            <div className="order-items">
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th>Số lượng</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{formatCurrency(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="total-label">
                      Tổng cộng:
                    </td>
                    <td className="total-amount">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
          <button className="btn-primary" onClick={handleStatusUpdate}>
            Cập nhật trạng thái
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
