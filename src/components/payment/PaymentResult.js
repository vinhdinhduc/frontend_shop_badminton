import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentResult, setPaymentResult] = useState(null);

  useEffect(() => {
    const orderId = searchParams.get("orderId");
    const status = searchParams.get("status");

    if (orderId && status) {
      // Check payment status
      checkPaymentStatus(orderId);
    }
  }, [searchParams]);

  const checkPaymentStatus = async (orderId) => {
    try {
      //   const response = await axios.get(
      //     `/api/payment/vnpay/order-status/${orderId}`,
      //     {
      //       headers: { Authorization: `Bearer ${token}` },
      //     }
      //   );
      //   setPaymentResult(response.data.data);
    } catch (error) {
      console.error("Check payment status error:", error);
    }
  };

  return (
    <div className="payment-result">
      {paymentResult?.payment_status === "paid" ? (
        <div className="success">
          <h2>Thanh toán thành công!</h2>
          <p>Mã đơn hàng: {paymentResult.order_code}</p>
          <p>Số tiền: {paymentResult.order_total.toLocaleString("vi-VN")}đ</p>
        </div>
      ) : (
        <div className="failed">
          <h2>Thanh toán thất bại</h2>
          <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác</p>
        </div>
      )}
    </div>
  );
};
export default PaymentResult;
