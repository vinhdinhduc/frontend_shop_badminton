import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  CreditCard,
  MapPin,
  Eye,
  Filter,
  RefreshCw,
} from "lucide-react";
import "./OrderTracking.scss";
import {
  getAllOrders,
  getOrderByUserId,
  getOrderByUserIdAction,
} from "../../../redux/actions/orderAction";
import OrderTrackingModal from "./OrderTrackingModal";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const dispatch = useDispatch();
  const { orderUser, loading, error } = useSelector((state) => state.orderList);
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    dispatch(getOrderByUserIdAction(userInfo.data?.user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderUser && orderUser.code === 0) {
      setOrders(orderUser.data.orders || []);
    }
  }, [orderUser]);

  useEffect(() => {
    const filtered = orders;
    if (statusFilter !== "all") {
      filtered = filtered.map((order) => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.order_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some((item) =>
            item.product_name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [orders, searchTerm, statusFilter]);

  const handleRefresh = () => {
    dispatch(getAllOrders({ page: 1, limit: 100 }));
  };

  const viewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={20} className="status-icon pending" />;
      case "processing":
        return <Package size={20} className="status-icon processing" />;
      case "shipped":
        return <Truck size={20} className="status-icon shipped" />;
      case "delivered":
        return <CheckCircle size={20} className="status-icon delivered" />;
      case "cancelled":
        return <XCircle size={20} className="status-icon cancelled" />;
      default:
        return <Clock size={20} className="status-icon" />;
    }
  };
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
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
      case "failed":
        return "Thất bại";
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
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="order-tracking">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải đơn hàng...</p>
          </div>
        </div>
      ) : (
        <div className="order-tracking">
          <div className="order-tracking-header">
            <div className="header-content">
              <h1>Đơn hàng của tôi</h1>
              <p>Theo dõi trạng thái và lịch sử đơn hàng của bạn</p>
            </div>
            <button className="refresh-btn" onClick={handleRefresh}>
              <RefreshCw size={18} />
              Làm mới
            </button>
          </div>

          <div className="order-filters">
            <div className="search-filter">
              <div className="search-box">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn hàng hoặc tên sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="status-filter">
              <Filter size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tất cả đơn hàng</option>
                <option value="pending">Chờ xác nhận</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipped">Đang giao hàng</option>
                <option value="delivered">Đã giao hàng</option>
                <option value="cancelled">Đã hủy</option>
              </select>
            </div>
          </div>

          {currentOrders.length > 0 ? (
            <>
              <div className="orders-grid">
                {currentOrders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-card-header">
                      <div className="order-info">
                        <h3>#{order.order_code}</h3>
                        <span className="order-date">
                          <Calendar size={16} />
                          {formatDate(order.created_at)}
                        </span>
                      </div>
                      <div className="order-status">
                        {getStatusIcon(order.status)}
                        <span className={`status-text ${order.status}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="order-card-body">
                      <div className="order-items-preview">
                        {order.items?.slice(0, 2).map((item, index) => (
                          <div key={index} className="item-preview">
                            <span className="item-name">
                              {item.product_name}
                            </span>
                            <span className="item-quantity">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                        {order.items?.length > 2 && (
                          <div className="more-items">
                            +{order.items.length - 2} sản phẩm khác
                          </div>
                        )}
                      </div>

                      <div className="order-details">
                        <div className="detail-item">
                          <CreditCard size={16} />
                          <span>Thanh toán: </span>
                          <span
                            className={`payment-status ${order.payment_status}`}
                          >
                            {getPaymentStatusText(order.payment_status)}
                          </span>
                        </div>
                        <div className="detail-item">
                          <MapPin size={16} />
                          <span>
                            Giao đến: {order.shipping_address?.substring(0, 50)}
                            ...
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="order-card-footer">
                      <div className="order-total">
                        <span className="total-label">Tổng tiền:</span>
                        <span className="total-amount">
                          {formatCurrency(order.order_total)}
                        </span>
                      </div>
                      <button
                        className="view-detail-btn"
                        onClick={() => viewOrderDetail(order)}
                      >
                        <Eye size={16} />
                        Chi tiết
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className={`pagination-btn ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Trước
                  </button>

                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`pagination-btn ${
                        currentPage === index + 1 ? "active" : ""
                      }`}
                      onClick={() => paginate(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className={`pagination-btn ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-orders">
              <div className="no-orders-content">
                <Package size={64} className="no-orders-icon" />
                <h3>Chưa có đơn hàng nào</h3>
                <p>Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
                <button className="shop-now-btn">Mua sắm ngay</button>
              </div>
            </div>
          )}

          {showDetailModal && selectedOrder && (
            <OrderTrackingModal
              order={selectedOrder}
              onClose={() => setShowDetailModal(false)}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
              getStatusText={getStatusText}
              getPaymentStatusText={getPaymentStatusText}
              getStatusIcon={getStatusIcon}
            />
          )}
        </div>
      )}
      <Footer />
    </>
  );
};
export default OrderTracking;
