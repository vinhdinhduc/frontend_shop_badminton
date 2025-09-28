import React from "react";
import {
  X,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  User,
  Calendar,
} from "lucide-react";
import "./OrderTrackingModal.scss";

const OrderTrackingModal = ({
  order,
  onClose,
  formatCurrency,
  formatDate,
  getStatusText,
  getPaymentStatusText,
  getStatusIcon,
}) => {
  const getOrderProgress = (status) => {
    const statusSteps = {
      pending: 1,
      processing: 2,
      shipped: 3,
      delivered: 4,
      cancelled: 0,
    };
    return statusSteps[status] || 0;
  };

  const progressStep = getOrderProgress(order.status);

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng";
      case "bank_transfer":
        return "Chuyển khoản ngân hàng";
      case "momo":
        return "Ví MoMo";
      case "vnpay":
        return "VNPay";
      default:
        return method;
    }
  };

  return (
    <div className="order-tracking-modal-overlay" onClick={onClose}>
      <div
        className="order-tracking-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <h2>Chi tiết đơn hàng #{order.order_code}</h2>
            <div className="order-status-badge">
              {getStatusIcon(order.status)}
              <span className={`status-text ${order.status}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Order Progress */}
          {order.status !== "cancelled" && (
            <div className="order-progress-section">
              <h3>Tiến trình đơn hàng</h3>
              <div className="progress-tracker">
                <div
                  className={`progress-step ${
                    progressStep >= 1 ? "completed" : ""
                  } ${progressStep === 1 ? "current" : ""}`}
                >
                  <div className="step-icon">
                    <Clock size={20} />
                  </div>
                  <div className="step-content">
                    <h4>Chờ xác nhận</h4>
                    <p>Đơn hàng đang chờ xác nhận</p>
                  </div>
                </div>

                <div
                  className={`progress-step ${
                    progressStep >= 2 ? "completed" : ""
                  } ${progressStep === 2 ? "current" : ""}`}
                >
                  <div className="step-icon">
                    <Package size={20} />
                  </div>
                  <div className="step-content">
                    <h4>Đang xử lý</h4>
                    <p>Cửa hàng đang chuẩn bị hàng</p>
                  </div>
                </div>

                <div
                  className={`progress-step ${
                    progressStep >= 3 ? "completed" : ""
                  } ${progressStep === 3 ? "current" : ""}`}
                >
                  <div className="step-icon">
                    <Truck size={20} />
                  </div>
                  <div className="step-content">
                    <h4>Đang giao hàng</h4>
                    <p>Đơn hàng đang được vận chuyển</p>
                  </div>
                </div>

                <div
                  className={`progress-step ${
                    progressStep >= 4 ? "completed" : ""
                  } ${progressStep === 4 ? "current" : ""}`}
                >
                  <div className="step-icon">
                    <CheckCircle size={20} />
                  </div>
                  <div className="step-content">
                    <h4>Đã giao hàng</h4>
                    <p>Đơn hàng đã được giao thành công</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Order Information */}
          <div className="order-info-section">
            <h3>Thông tin đơn hàng</h3>
            <div className="info-grid">
              <div className="info-card">
                <div className="info-header">
                  <Calendar size={20} />
                  <span>Ngày đặt hàng</span>
                </div>
                <div className="info-content">
                  {formatDate(order.created_at)}
                </div>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <CreditCard size={20} />
                  <span>Phương thức thanh toán</span>
                </div>
                <div className="info-content">
                  {getPaymentMethodText(order.payment_method)}
                </div>
              </div>

              <div className="info-card">
                <div className="info-header">
                  <Package size={20} />
                  <span>Trạng thái thanh toán</span>
                </div>
                <div className="info-content">
                  <span className={`payment-status ${order.payment_status}`}>
                    {getPaymentStatusText(order.payment_status)}
                  </span>
                </div>
              </div>

              <div className="info-card full-width">
                <div className="info-header">
                  <MapPin size={20} />
                  <span>Địa chỉ giao hàng</span>
                </div>
                <div className="info-content">{order.shipping_address}</div>
              </div>

              {order.customer_note && (
                <div className="info-card full-width">
                  <div className="info-header">
                    <User size={20} />
                    <span>Ghi chú</span>
                  </div>
                  <div className="info-content">{order.customer_note}</div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="customer-info-section">
            <h3>Thông tin khách hàng</h3>
            <div className="customer-details">
              <div className="customer-item">
                <User size={18} />
                <div>
                  <label>Họ tên:</label>
                  <span>{order.user?.fullName || "N/A"}</span>
                </div>
              </div>
              <div className="customer-item">
                <span className="phone-icon">📞</span>
                <div>
                  <label>Số điện thoại:</label>
                  <span>{order.user?.phone_number || "N/A"}</span>
                </div>
              </div>
              <div className="customer-item">
                <span className="email-icon">✉️</span>
                <div>
                  <label>Email:</label>
                  <span>{order.user?.email || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Sản phẩm đã đặt</h3>
            <div className="items-table-container">
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
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-info">
                          <div className="product-name">
                            {item.product_name}
                          </div>
                          {item.variation_info && (
                            <div className="product-variation">
                              {item.variation_info}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="price">
                        {formatCurrency(item.unit_price)}
                      </td>
                      <td className="quantity">{item.quantity}</td>
                      <td className="total">
                        {formatCurrency(item.total_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>
                  {formatCurrency(
                    (order.order_total || 0) - (order.shipping_fee || 0)
                  )}
                </span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>{formatCurrency(order.shipping_fee || 0)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Tổng cộng:</span>
                <span>{formatCurrency(order.order_total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingModal;
