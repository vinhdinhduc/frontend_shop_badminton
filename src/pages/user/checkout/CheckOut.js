import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  CreditCard,
  CheckCircle,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Edit2,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Wallet,
  Smartphone,
  Building,
  Lock,
} from "lucide-react";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import { toast } from "react-toastify";
import "./CheckOut.scss";
import { createOrder, getProvince } from "../../../services/orderService";
import { createPaymentUrl } from "../../../services/paymentService";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.userLogin);

  const [checkoutData, setCheckoutData] = useState([]);
  console.log("Check out data", checkoutData);

  const [currentStep, setCurrentStep] = useState(2);
  //address
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [selectedWard, setSelectedWard] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [shippingInfo, setShippingInfo] = useState({
    fullName: userInfo?.data.user?.fullName || "",
    phone: userInfo?.data.user?.phone_number || "",
    email: userInfo?.data.user?.email || "",
    address: "",
    ward: "",
    district: "",
    province: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get("https://provinces.open-api.vn/api/p/");

        setProvinces([{ code: "", name: "Chọn tỉnh/thành phố" }, ...res.data]);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Lỗi khi tải danh sách tỉnh/thành phố");
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    try {
      if (selectedProvince) {
        setSelectedDistrict("");
        setSelectedWard("");
        setDistricts([]);
        setWards([]);
        axios
          .get(
            `https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`
          )
          .then((res) =>
            setDistricts([
              { code: "", name: "Chọn quận/huyện" },
              ...res.data.districts,
            ])
          );

        const provinceName = provinces?.find(
          (p) => p.code === selectedProvince
        )?.name;

        if (provinceName && provinceName !== "Chọn tỉnh/thành phố") {
          handleInputChange("province", provinceName);
        }
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      toast.error("Lỗi khi tải danh sách quận/huyện");
    }
  }, [selectedProvince, provinces]);

  useEffect(() => {
    try {
      if (selectedDistrict) {
        setSelectedWard("");
        setWards([]);
        axios
          .get(
            `https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`
          )
          .then((res) =>
            setWards([{ code: "", name: "Chọn xã/phường" }, ...res.data.wards])
          );

        const districtName = districts.find(
          (d) => d.code === selectedDistrict
        )?.name;
        if (districtName && districtName !== "Chọn quận/huyện") {
          handleInputChange("district", districtName);
        }
      }
    } catch (error) {
      console.error("Error fetching wards:", error);
      toast.error("Lỗi khi tải danh sách phường/xã");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (selectedWard) {
      const wardName = wards.find((w) => w.code === selectedWard)?.name;
      if (wardName && wardName !== "Chọn xã/phường") {
        handleInputChange("ward", wardName);
      }
    }
  }, [selectedWard, wards]);
  useEffect(() => {
    const loadCheckoutData = () => {
      try {
        const sessionData = sessionStorage.getItem("checkout_data");
        console.log("Check sestin", sessionData);

        if (sessionData) {
          const parsedData = JSON.parse(sessionData);
          console.log("Loaded checkout data from session:", parsedData);
          setCheckoutData(parsedData);
          setLoading(false);
          return;
        }

        const savedUserInfo = localStorage.getItem("userInfo");
        if (savedUserInfo) {
          toast.warning(
            "Không tìm thấy dữ liệu giỏ hàng. Vui lòng thêm sản phẩm vào giỏ hàng trước."
          );
          navigate("/cart");
          return;
        }

        navigate("/cart");
      } catch (error) {
        console.error("Error loading checkout data:", error);
        toast.error("Có lỗi khi tải dữ liệu đơn hàng");
        navigate("/cart");
      }
    };

    loadCheckoutData();
  }, [navigate]);

  useEffect(() => {
    if (!userInfo) {
      navigate("/auth");
      toast.info("Vui lòng đăng nhập để tiếp tục thanh toán !");
    }
  }, [userInfo, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const validateShippingInfo = () => {
    const newErrors = {};
    if (!shippingInfo.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ tên";
    }
    if (!shippingInfo.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(shippingInfo.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!shippingInfo.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!shippingInfo.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    if (!selectedProvince) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    }

    if (!selectedDistrict) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }

    if (!selectedWard) {
      newErrors.ward = "Vui lòng chọn phường/xã";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setShippingInfo((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleNextStep = () => {
    if (currentStep === 2) {
      if (validateShippingInfo()) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      handlePlaceOrder();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    setLoading(true);

    try {
      const fullShippingAddress = `${shippingInfo.address}, ${shippingInfo.ward}, ${shippingInfo.district}, ${shippingInfo.province}`;
      const orderData = {
        user_id: userInfo.data.user.id,
        cart_items: checkoutData?.items.map((item) => ({
          product_id: item.product_id,
          variation_id: item.variation_id,
          quantity: item.quantity,
          variation_info: item.variation_info,
        })),
        payment_method: paymentMethod,
        shipping_address: fullShippingAddress,
        customer_note: shippingInfo.note,
      };
      const orderResponse = await createOrder(orderData);
      if (orderResponse && orderResponse.code === 0) {
        const newOrder = orderResponse.data?.order;
        const dataPayment = {
          order_id: newOrder.id,
          amount: newOrder.order_total,
          order_info: `Thanh toán đơn hàng ${newOrder.order_code}`,
          order_type: "other",
          locale: "vn",
          client_ip: "127.0.0.1",
        };
        if (paymentMethod === "vnpay") {
          //Tạo url thanh toán

          try {
            const paymentResponse = await createPaymentUrl(dataPayment);
            console.log("Check payment res", paymentMethod);

            if (paymentResponse && paymentResponse.code === 0) {
              sessionStorage.removeItem("checkout_data");

              //Redirect đến VNPay

              window.location.href = paymentResponse.data.paymentUrl;
              return;
            } else {
              throw new Error(
                paymentResponse.data.message ||
                  "Lỗi khi tạo URL thanh toán VNPay"
              );
            }
          } catch (error) {
            console.error("VNPay payment error:", error);
            toast.error("Có lỗi khi tạo thanh toán VNPay. Vui lòng thử lại.");
            return;
          }
        } else {
          sessionStorage.removeItem("checkout_data");

          navigate("/order/success", {
            state: {
              orderData: newOrder,
              orderId: newOrder.id,
              paymentMethod: paymentMethod,
            },
          });

          toast.success("Đặt hàng thành công!");
        }
      } else {
        throw new Error(orderResponse.data.message || "Lỗi khi tạo đơn hàng");
      }
    } catch (error) {
      console.error("Order placement error:", error);

      let errorMessage = "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.";

      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
        if (error.response.status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại";
          navigate("/auth");
        }
      } else if (error.request) {
        errorMessage =
          "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
      }
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
      setLoading(false);
    }
  };
  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán khi nhận hàng (COD)",
      icon: <Truck size={20} />,
      description: "Thanh toán bằng tiền mặt khi nhận hàng",
    },
    {
      id: "banking",
      name: "Chuyển khoản ngân hàng",
      icon: <Building size={20} />,
      description: "Chuyển khoản qua ngân hàng online",
    },
    {
      id: "momo",
      name: "Ví MoMo",
      icon: <Smartphone size={20} />,
      description: "Thanh toán qua ví điện tử MoMo",
    },
    {
      id: "vnpay",
      name: "VNPay",
      icon: <CreditCard size={20} />,
      description: "Thanh toán qua cổng VNPay",
    },
  ];

  if (!checkoutData) {
    return (
      <>
        <Navbar />
        <div className="checkout-container">
          <div className="checkout-loading">
            <Loader2 className="animate-spin" size={40} />
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
      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="checkout-header">
          <div className="checkout-steps">
            <div className="step completed">
              <div className="step-icon">
                <CheckCircle size={20} />
              </div>
              <span>Đặt hàng</span>
            </div>
            <div className="step-line completed"></div>

            <div
              className={`step ${currentStep >= 2 ? "active" : ""} ${
                currentStep > 2 ? "completed" : ""
              }`}
            >
              <div className="step-icon">
                {currentStep > 2 ? (
                  <CheckCircle size={20} />
                ) : (
                  <CreditCard size={20} />
                )}
              </div>
              <span>Thanh toán</span>
            </div>
            <div
              className={`step-line ${currentStep > 2 ? "completed" : ""}`}
            ></div>

            <div
              className={`step ${currentStep >= 3 ? "active" : ""} ${
                currentStep > 3 ? "completed" : ""
              }`}
            >
              <div className="step-icon">
                {currentStep > 3 ? <CheckCircle size={20} /> : "3"}
              </div>
              <span>Xác nhận đơn hàng</span>
            </div>
            <div
              className={`step-line ${currentStep > 3 ? "completed" : ""}`}
            ></div>

            <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
              <div className="step-icon">
                <Truck size={20} />
              </div>
              <span>Giao hàng</span>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Step 2: Payment Information */}
          {currentStep === 2 && (
            <div className="checkout-step">
              <div className="step-content">
                <div className="shipping-info-section">
                  <h3>
                    <MapPin size={20} />
                    Thông tin giao hàng
                  </h3>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Họ và tên *</label>
                      <div className="input-wrapper">
                        <User size={16} className="input-icon" />
                        <input
                          type="text"
                          value={shippingInfo.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className={errors.fullName ? "error" : ""}
                          placeholder="Nhập họ và tên"
                        />
                      </div>
                      {errors.fullName && (
                        <span className="error-text">{errors.fullName}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <div className="input-wrapper">
                        <Phone size={16} className="input-icon" />
                        <input
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={errors.phone ? "error" : ""}
                          placeholder="Nhập số điện thoại"
                        />
                      </div>
                      {errors.phone && (
                        <span className="error-text">{errors.phone}</span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Email *</label>
                      <div className="input-wrapper">
                        <Mail size={16} className="input-icon" />
                        <input
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={errors.email ? "error" : ""}
                          placeholder="Nhập địa chỉ email"
                        />
                      </div>
                      {errors.email && (
                        <span className="error-text">{errors.email}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Tỉnh/Thành phố *</label>
                      <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                        className={errors.provinces ? "error" : ""}
                      >
                        {provinces &&
                          provinces?.map((p) => (
                            <option key={p.code} value={p.code}>
                              {p.name}
                            </option>
                          ))}
                      </select>
                      {errors.provinces && (
                        <span className="error-text">{errors.provinces}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Quận/Huyện *</label>
                      <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className={errors.district ? "error" : ""}
                      >
                        {districts?.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      {errors.district && (
                        <span className="error-text">{errors.district}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Phường/Xã *</label>
                      <select
                        value={selectedWard}
                        onChange={(e) => setSelectedWard(e.target.value)}
                        className={errors.ward ? "error" : ""}
                      >
                        {wards?.map((w) => (
                          <option key={w.code} value={w.code}>
                            {w.name}
                          </option>
                        ))}
                      </select>
                      {errors.ward && (
                        <span className="error-text">{errors.ward}</span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Địa chỉ cụ thể *</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className={errors.address ? "error" : ""}
                        placeholder="Số nhà, tên đường..."
                      />
                      {errors.address && (
                        <span className="error-text">{errors.address}</span>
                      )}
                    </div>

                    <div className="form-group full-width">
                      <label>Ghi chú (Tùy chọn)</label>
                      <textarea
                        value={shippingInfo.note}
                        onChange={(e) =>
                          handleInputChange("note", e.target.value)
                        }
                        placeholder="Ghi chú thêm cho đơn hàng..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-card">
                  <h3>Đơn hàng của bạn</h3>

                  <div className="order-items">
                    {checkoutData?.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          <img
                            src={
                              item.image
                                ? `http://localhost:8080${item.image}`
                                : "/api/placeholder/50/50"
                            }
                            alt={item.product_name}
                          />
                        </div>
                        <div className="item-details">
                          <span className="item-name">{item.product_name}</span>
                          {item.variation_info && (
                            <span className="item-variation">
                              {item.variation_info}
                            </span>
                          )}
                          <div className="item-quantity-price">
                            <span>SL: {item.quantity}</span>
                            <span className="item-price">
                              {formatPrice(item.total_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Tạm tính:</span>
                      <span>
                        {formatPrice(checkoutData?.pricing?.subtotal)}
                      </span>
                    </div>
                    {checkoutData?.pricing?.discount_amount > 0 && (
                      <div className="total-row discount">
                        <span>Giảm giá:</span>
                        <span>
                          -{formatPrice(checkoutData?.pricing?.discount_amount)}
                        </span>
                      </div>
                    )}
                    <div className="total-row">
                      <span>Phí vận chuyển:</span>
                      <span>
                        {checkoutData?.pricing?.shipping_fee > 0
                          ? formatPrice(checkoutData?.pricing?.shipping_fee)
                          : "Liên hệ"}
                      </span>
                    </div>
                    <div className="total-row total">
                      <span>Tổng cộng:</span>
                      <span className="total-price">
                        {formatPrice(checkoutData?.pricing?.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Method & Confirmation */}
          {currentStep === 3 && (
            <div className="checkout-step">
              <div className="step-content">
                <div className="payment-method-section">
                  <h3>
                    <CreditCard size={20} />
                    Phương thức thanh toán
                  </h3>

                  <div className="payment-methods">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`payment-method ${
                          paymentMethod === method.id ? "selected" : ""
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="method-icon">{method.icon}</div>
                        <div className="method-info">
                          <span className="method-name">{method.name}</span>
                          <span className="method-description">
                            {method.description}
                          </span>
                        </div>
                        <div className="method-radio">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === method.id}
                            readOnly
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {paymentMethod === "banking" && (
                    <div className="payment-info">
                      <h4>Thông tin chuyển khoản</h4>
                      <div className="bank-info">
                        <p>
                          <strong>Ngân hàng:</strong> Vietcombank
                        </p>
                        <p>
                          <strong>Số tài khoản:</strong> 1234567890
                        </p>
                        <p>
                          <strong>Chủ tài khoản:</strong> BADMINTON SHOP
                        </p>
                        <p>
                          <strong>Nội dung:</strong> [Mã đơn hàng] - [Họ tên]
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="shipping-summary">
                  <h3>Thông tin giao hàng</h3>
                  <div className="shipping-address">
                    <div className="address-info">
                      <strong>{shippingInfo.fullName}</strong>
                      <p>{shippingInfo.phone}</p>
                      <p>{shippingInfo.email}</p>
                      <p>
                        {shippingInfo.address}, {shippingInfo.ward},{" "}
                        {shippingInfo.district}, {shippingInfo.province}
                      </p>
                      {shippingInfo.note && (
                        <p className="note">Ghi chú: {shippingInfo.note}</p>
                      )}
                    </div>
                    <button
                      className="edit-btn"
                      onClick={() => setCurrentStep(2)}
                    >
                      <Edit2 size={16} />
                      Sửa
                    </button>
                  </div>
                </div>
              </div>

              <div className="order-summary">
                <div className="summary-card">
                  <h3>Xác nhận đơn hàng</h3>

                  <div className="order-items">
                    {checkoutData?.items?.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          <img
                            src={
                              item.image
                                ? `http://localhost:8080${item.image}`
                                : "/api/placeholder/50/50"
                            }
                            alt={item.product_name}
                          />
                        </div>
                        <div className="item-details">
                          <span className="item-name">{item.product_name}</span>
                          {item.variation_info && (
                            <span className="item-variation">
                              {item.variation_info}
                            </span>
                          )}
                          <div className="item-quantity-price">
                            <span>SL: {item.quantity}</span>
                            <span className="item-price">
                              {formatPrice(item.total_price)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="order-totals">
                    <div className="total-row">
                      <span>Tạm tính:</span>
                      <span>
                        {formatPrice(checkoutData?.pricing?.subtotal)}
                      </span>
                    </div>
                    {checkoutData?.pricing?.discount_amount > 0 && (
                      <div className="total-row discount">
                        <span>Giảm giá:</span>
                        <span>
                          -{formatPrice(checkoutData?.pricing?.discount_amount)}
                        </span>
                      </div>
                    )}
                    <div className="total-row">
                      <span>Phí vận chuyển:</span>
                      <span>
                        {checkoutData?.pricing?.shipping_fee > 0
                          ? formatPrice(checkoutData?.pricing?.shipping_fee)
                          : "Liên hệ"}
                      </span>
                    </div>
                    <div className="total-row total">
                      <span>Tổng cộng:</span>
                      <span className="total-price">
                        {formatPrice(checkoutData?.pricing?.total)}
                      </span>
                    </div>
                  </div>

                  <div className="payment-summary">
                    <div className="selected-method">
                      <Lock size={16} />
                      <span>
                        {
                          paymentMethods.find((m) => m.id === paymentMethod)
                            ?.name
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="checkout-navigation">
            <button
              className="btn-back"
              onClick={() =>
                currentStep === 2 ? navigate("/cart") : handlePrevStep()
              }
            >
              <ArrowLeft size={18} />
              {currentStep === 2 ? "Quay về giỏ hàng" : "Quay lại"}
            </button>

            <button
              className={`btn-next ${isProcessing ? "loading" : ""}`}
              onClick={handleNextStep}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Đang xử lý...
                </>
              ) : currentStep === 3 ? (
                "Đặt hàng"
              ) : (
                "Tiếp tục"
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckOut;
