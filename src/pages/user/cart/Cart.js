import React, { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Tag } from "lucide-react";
import "./Cart.scss";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Vợt Cầu Lông Yonex Astrox 99 Play 2025 | Tấn Công...",
      price: 1639000,
      quantity: 1,
      image: "/api/placeholder/80/80",
    },
  ]);

  const [promoCode, setPromoCode] = useState("");

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

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
                Giỏ hàng <span className="item-count">1</span>
              </h2>
            </div>

            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <div className="item-controls">
                      <div className="quantity-controls">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="quantity-btn"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="quantity-btn"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="update-cart-btn">
              <ShoppingCart size={16} />
              Cập nhật giỏ hàng
            </button>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>

              <div className="summary-row">
                <span>Thành tiền</span>
                <span className="price">{formatPrice(subtotal)}</span>
              </div>

              <div className="summary-row">
                <span>Vận chuyển</span>
                <span className="shipping-note">
                  Liên hệ phí vận chuyển sau
                </span>
              </div>

              <div className="promo-section">
                <div className="promo-input">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button className="promo-btn">Sử dụng</button>
                </div>
              </div>

              <div className="summary-total">
                <div className="total-row">
                  <span>Tổng cống</span>
                  <span className="total-price">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Cart;
