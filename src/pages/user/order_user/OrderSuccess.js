import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Clock,
  CreditCard,
  ArrowRight,
  Home,
  FileText,
  Phone,
  Mail,
} from "lucide-react";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import "./OrderSuccess.scss";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    // Lấy dữ liệu từ location state hoặc sessionStorage
    if (location.state?.orderData) {
      setOrderData(location.state.orderData);
    } else {
      // Nếu không có dữ liệu, chuyển về trang chủ
      navigate("/");
    }
  }, [location, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPaymentMethodName = (method) => {
    const methods = {
      cod: "Thanh toán khi nhận hàng (COD)",
      banking: "Chuyển khoản ngân hàng",
      momo: "Ví MoMo",
      vnpay: "VNPay",
    };
    return methods[method] || method;
  };

  const getOrderStatusText = (status) => {
    const statusMap = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      processing: "Đang xử lý",
      shipping: "Đang giao hàng",
      delivered: "Đã giao hàng",
      cancelled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  if (!orderData) {
    return (
      <>
        <Navbar />
        <div className="order-success-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Đang tải thông tin đơn hàng...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="order-success-container">
        <div className="success-content">
          {/* Success Header */}
          <div className="success-header">
            <div className="success-icon">
              <CheckCircle size={80} />
            </div>
            <h1>Đặt hàng thành công!</h1>
            <p className="success-message">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong
              thời gian sớm nhất.
            </p>
          </div>

          {/* Order Information Card */}
          <div className="order-info-card">
            <div className="card-header">
              <h2>
                <FileText size={24} />
                Thông tin đơn hàng
              </h2>
            </div>

            <div className="order-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Mã đơn hàng:</span>
                  <span className="value order-code">
                    {orderData.order_code}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Thời gian đặt:</span>
                  <span className="value">
                    <Clock size={16} />
                    {formatDate(orderData.created_at)}
                  </span>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <span className="label">Trạng thái:</span>
                  <span className="value status pending">
                    <Package size={16} />
                    {getOrderStatusText(orderData.order_status)}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Thanh toán:</span>
                  <span className="value payment">
                    <CreditCard size={16} />
                    {getPaymentMethodName(orderData.payment_method)}
                  </span>
                </div>
              </div>

              <div className="detail-row full-width">
                <div className="detail-item">
                  <span className="label">
                    <MapPin size={16} />
                    Địa chỉ giao hàng:
                  </span>
                  <span className="value address">
                    {orderData.shipping_address}
                  </span>
                </div>
              </div>

              {orderData.customer_note && (
                <div className="detail-row full-width">
                  <div className="detail-item">
                    <span className="label">Ghi chú:</span>
                    <span className="value note">
                      {orderData.customer_note}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="order-items-card">
              <div className="card-header">
                <h2>
                  <Package size={24} />
                  Sản phẩm đã đặt ({orderData.items.length})
                </h2>
              </div>

              <div className="items-list">
                {orderData.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-image">
                      <img
                        src={
                          item.image
                            ? `http://localhost:8080${item.image}`
                            : "/api/placeholder/80/80"
                        }
                        alt={item.product_name}
                      />
                    </div>
                    <div className="item-info">
                      <h3>{item.product_name}</h3>
                      {item.variation_info && (
                        <p className="variation">{item.variation_info}</p>
                      )}
                      <div className="item-meta">
                        <span className="quantity">
                          Số lượng: {item.quantity}
                        </span>
                        <span className="price">
                          {formatPrice(item.total_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="order-summary-card">
            <div className="card-header">
              <h2>Tổng thanh toán</h2>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>{formatPrice(orderData.subtotal || 0)}</span>
              </div>
              {orderData.discount_amount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(orderData.discount_amount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>
                  {orderData.shipping_fee > 0
                    ? formatPrice(orderData.shipping_fee)
                    : "Miễn phí"}
                </span>
              </div>
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span className="total-amount">
                  {formatPrice(orderData.order_total)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Instructions */}
          {orderData.payment_method === "banking" && (
            <div className="payment-instructions">
              <div className="instruction-header">
                <CreditCard size={24} />
                <h3>Hướng dẫn thanh toán</h3>
              </div>
              <div className="instruction-content">
                <p>Vui lòng chuyển khoản theo thông tin sau:</p>
                <div className="bank-info">
                  <div className="info-row">
                    <strong>Ngân hàng:</strong>
                    <span>Vietcombank</span>
                  </div>
                  <div className="info-row">
                    <strong>Số tài khoản:</strong>
                    <span>1234567890</span>
                  </div>
                  <div className="info-row">
                    <strong>Chủ tài khoản:</strong>
                    <span>BADMINTON SHOP</span>
                  </div>
                  <div className="info-row">
                    <strong>Số tiền:</strong>
                    <span className="highlight">
                      {formatPrice(orderData.order_total)}
                    </span>
                  </div>
                  <div className="info-row">
                    <strong>Nội dung:</strong>
                    <span className="highlight">{orderData.order_code}</span>
                  </div>
                </div>
                <p className="note">
                  * Sau khi chuyển khoản, vui lòng liên hệ với chúng tôi để xác
                  nhận đơn hàng.
                </p>
              </div>
            </div>
          )}

          {/* Contact Support */}
          <div className="support-section">
            <h3>Cần hỗ trợ?</h3>
            <p>
              Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với
              chúng tôi:
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <Phone size={20} />
                <span>Hotline: 1900 xxxx</span>
              </div>
              <div className="contact-item">
                <Mail size={20} />
                <span>Email: support@badmintonshop.com</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons-success">
            <button className="btn-secondary" onClick={() => navigate("/")}>
              <Home size={20} />
              Về trang chủ
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("/view-order")}
            >
              Xem đơn hàng
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderSuccess;
