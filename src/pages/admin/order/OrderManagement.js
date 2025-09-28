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
import { useDispatch, useSelector } from "react-redux";
import { getAllOrders } from "../../../redux/actions/orderAction";
import { PaginationComponent } from "../../../components/ui/Pagination";
import OrderDetailModal from "./OrderDetailModal";
import { updateOrderStatus } from "../../../services/orderService";
import { toast } from "react-toastify";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const dispatch = useDispatch();

  const { arrOrders, loading, error } = useSelector((state) => state.orderList);

  useEffect(() => {
    dispatch(
      getAllOrders({
        page: currentPage,
        limit: itemsPerPage,
        status: statusFilter !== "all" ? statusFilter : undefined,
        search: searchTerm || undefined,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, statusFilter]);

  useEffect(() => {
    if (arrOrders && arrOrders.code === 0) {
      setOrders(arrOrders.data.orders);
      setTotalPages(arrOrders.data.pagination?.totalPages);
      setTotalItems(arrOrders.data.pagination?.totalItems);
    }
  }, [arrOrders]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        dispatch(
          getAllOrders({
            page: 1,
            limit: itemsPerPage,
            status: statusFilter !== "all" ? statusFilter : undefined,
            search: searchTerm || undefined,
          })
        );
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter, itemsPerPage, dispatch]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handlePageSizeChange = (newPageSize) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1);
  };
  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
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
      case "processing":
        return "status-badge--processing";
      case "shipped":
        return "status-badge--shipped";
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
      case "processing":
        return "Đang xử lý";
      case "shipped":
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
      case "failed":
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
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
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
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-id">{order.order_code}</td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-name">
                        {order.user?.fullName}
                      </div>
                      <div className="customer-contact">
                        {order.user?.phone_number}
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(order.created_at)}</td>
                  <td>
                    {order.items?.reduce((sum, item) => sum + item.quantity, 0)}
                  </td>
                  <td className="order-total">
                    {formatCurrency(order.order_total)}
                  </td>
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
                    <span className={`payment-status ${order.payment_status}`}>
                      {getPaymentStatusText(order.payment_status)}
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

      {totalPages >= 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          pageSizeOptions={[10, 20, 50, 100]}
          showPageInfo={true}
          showPageSizeSelector={true}
          maxVisiblePages={7}
        />
      )}
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

export default OrderManagement;
