import React, { useEffect, useState } from "react";
import {
  ShoppingCart,
  X,
  Plus,
  Minus,
  Tag,
  Loader2,
  ArrowRight,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./Cart.scss";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";
import {
  clearCartAction,
  getCartAction,
  removeFromCartAction,
  updateCartItemAction,
} from "../../../redux/actions/cartAction";
import CartItem from "./CartItem";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState("");
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const {
    items,
    totalItems,
    totalAmount,
    loading,
    loadingItems,
    coupon,
    discountAmount,
    shippingFee,
    couponLoading,
    couponError,
  } = useSelector((state) => state.cartList);
  useEffect(() => {
    dispatch(getCartAction());
  }, []);

  useEffect(() => {
    setCartItems(items);
  }, [items]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(updateCartItemAction(itemId, newQuantity));
    } catch (error) {
      console.log("error update", error);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await dispatch(removeFromCartAction(itemId));
    } catch (error) {
      console.log("error remove cart", error);
    }
  };

  const handleClearCart = async () => {
    await dispatch(clearCartAction());
    setShowClearConfirm(false);
  };

  const handleApplyCoupon = async () => {
    if (!promoCode.trim()) return;

    // await dispatch(applyCoupon(promoCode.trim()));
    setPromoCode("");
  };

  const handleRemoveCoupon = () => {
    // dispatch(removeCoupon());
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const checkoutData = {
    items: cartItems.map((item) => ({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.total_price,
      variation_info: item.variation_info,
      image: item.product?.images
        ? typeof item.product.images === "string"
          ? JSON.parse(item.product.images)[0]?.url
          : item.product.images[0]?.url
        : null,
    })),
    pricing: {
      discount_amount: discountAmount,
      shipping_fee: shippingFee,
    },
    coupon: coupon
      ? {
          code: coupon.code,
          discount_amount: discountAmount,
        }
      : null,
  };

  // Lưu vào sessionStorage
  sessionStorage.setItem("checkout_data", JSON.stringify(checkoutData));

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const subtotal = items.reduce(
    (sum, item) => sum + (item.unit_price || item.price) * item.quantity,
    0
  );

  const total = subtotal - discountAmount + shippingFee;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="shopping-cart">
          <div className="cart-loading">
            <Loader2 className="animate-spin" size={40} />
            <p>Đang tải giỏ hàng...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }
  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="shopping-cart">
          <div className="cart-empty">
            <ShoppingCart size={80} className="empty-icon" />
            <h3>Giỏ hàng của bạn đang trống</h3>
            <p>Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <button
              onClick={handleContinueShopping}
              className="continue-shopping-btn"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="shopping-cart">
        <div className="cart-header">
          <div className="cart-steps">
            <div className="step active">
              <div className="step-icon">
                <ShoppingCart size={20} />
              </div>
              <span>Đặt hàng</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-icon">2</div>
              <span>Thanh toán</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-icon">3</div>
              <span>Xác nhận đơn hàng</span>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-icon">4</div>
              <span>Giao hàng</span>
            </div>
          </div>
        </div>

        <div className="cart-content">
          <div className="cart-main">
            <div className="cart-title">
              <h2>
                Giỏ hàng <span className="item-count">{itemCount}</span>
              </h2>
              {cartItems.length > 0 && (
                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="clear-cart-btn"
                  title="Xóa toàn bộ giỏ hàng"
                >
                  <Trash2 size={16} />
                  Xóa tất cả
                </button>
              )}
            </div>

            <div className="cart-items">
              {cartItems.map((item) => {
                const isLoading = !!loadingItems[item.id];

                return (
                  <CartItem
                    key={item.id}
                    item={item}
                    isLoading={isLoading}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                    formatPrice={formatPrice}
                  />
                );
              })}
            </div>

            <div className="cart-actions">
              <button
                onClick={handleContinueShopping}
                className="continue-shopping-btn"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>

              <div className="summary-row">
                <span>Thành tiền ({itemCount} sản phẩm)</span>
                <span className="price">{formatPrice(subtotal)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>
                    Giảm giá
                    {coupon && (
                      <span className="coupon-code">({coupon.code})</span>
                    )}
                  </span>
                  <span className="discount-price">
                    -{formatPrice(discountAmount)}
                    <button
                      onClick={handleRemoveCoupon}
                      className="remove-coupon-btn"
                      title="Bỏ mã giảm giá"
                    >
                      <X size={14} />
                    </button>
                  </span>
                </div>
              )}

              <div className="summary-row">
                <span>Vận chuyển</span>
                {shippingFee > 0 ? (
                  <span className="price">{formatPrice(shippingFee)}</span>
                ) : (
                  <span className="shipping-note">
                    Liên hệ phí vận chuyển sau
                  </span>
                )}
              </div>

              {/* Coupon section */}
              <div className="promo-section">
                <div className="promo-input">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={couponLoading}
                    onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
                  />
                  <button
                    className="promo-btn"
                    onClick={handleApplyCoupon}
                    disabled={!promoCode.trim() || couponLoading}
                  >
                    {couponLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "Sử dụng"
                    )}
                  </button>
                </div>
                {couponError && (
                  <div className="error-message">
                    <AlertCircle size={14} />
                    {couponError}
                  </div>
                )}
              </div>

              <div className="summary-total">
                <div className="total-row">
                  <span>Tổng cộng</span>
                  <span className="total-price">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
              >
                Tiến hành thanh toán
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Clear cart confirmation modal */}
        {showClearConfirm && (
          <div
            className="modal-overlay"
            onClick={() => setShowClearConfirm(false)}
          >
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Xác nhận xóa giỏ hàng</h3>
              <p>Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?</p>
              <div className="modal-actions">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="btn-cancel"
                >
                  Hủy
                </button>
                <button
                  onClick={handleClearCart}
                  className="btn-confirm"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
