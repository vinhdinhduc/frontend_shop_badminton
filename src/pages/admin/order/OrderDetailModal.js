import { X } from "lucide-react";
import { useState } from "react";
import "./OrderManagement.scss";
import { updateOrderStatus } from "../../../services/orderService";
import { toast } from "react-toastify";
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
  console.log(currentStatus);

  const handleStatusUpdate = async () => {
    if (currentStatus === order.status) {
      onClose();
      return;
    }
    const loadingToast = toast.loading("Đang cập nhật trạng thái...");

    let res = await updateOrderStatus(order.id, currentStatus);

    if (res && res.code === 0) {
      onStatusChange(order.id, currentStatus);
      onClose();
      toast.dismiss(loadingToast);
      toast.success("Cập nhật trạng thái đơn hàng thành công!");
    } else {
      toast.dismiss(loadingToast);

      toast.error(`Cập nhật trạng thái thất bại ${res.message}`);
    }
  };

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chi tiết đơn hàng: #{order.order_code}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} color="red" />
          </button>
        </div>

        <div className="modal-body">
          <div className="order-section">
            <h3>Thông tin đơn hàng</h3>
            <div className="order-info-grid">
              <div className="info-item">
                <label>Ngày đặt:</label>
                <span>{formatDate(order.created_at)}</span>
              </div>
              <div className="info-item">
                <label>Trạng thái:</label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                >
                  <option value="pending">Chờ xác nhận</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đang giao</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div className="info-item">
                <label>Phương thức thanh toán:</label>
                <span>
                  {order.payment_method === "cod"
                    ? "Thanh toán khi nhận hàng"
                    : order.payment_method === "bank_transfer"
                    ? "Chuyển khoản"
                    : order.payment_method === "momo"
                    ? "Ví MoMo"
                    : order.payment_method === "vnpay"
                    ? "VNPay"
                    : order.payment_method}
                </span>
              </div>
              <div className="info-item">
                <label>Tình trạng thanh toán:</label>
                <span className={`payment-status ${order.payment_status}`}>
                  {getPaymentStatusText(order.payment_status)}
                </span>
              </div>
            </div>
          </div>

          <div className="order-section">
            <h3>Thông tin khách hàng</h3>
            <div className="customer-info-grid">
              <div className="info-item">
                <label>Họ tên:</label>
                <span>{order.user?.fullName}</span>
              </div>
              <div className="info-item">
                <label>Số điện thoại:</label>
                <span>{order.user?.phone_number}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{order.user?.email}</span>
              </div>
              <div className="info-item full-width">
                <label>Địa chỉ giao hàng:</label>
                <span>{order.shipping_address}</span>
              </div>
              {order.customer_note && (
                <div className="info-item full-width">
                  <label htmlFor="">Ghi chú:</label>
                  <span>{order.customer_note}</span>
                </div>
              )}
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
                  {order.items?.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div>
                          {item.product_name}
                          {item.variation_info && (
                            <div className="variation-info">
                              {item.variation_info}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{formatCurrency(item.unit_price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.total_price)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="2">Phí vận chuyển:</td>
                    <td colSpan="2">{formatCurrency(order.shipping_fee)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="total-label">
                      Tổng cộng:
                    </td>
                    <td className="total-amount">
                      {formatCurrency(order.order_total)}
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
export default OrderDetailModal;
