import React, { useEffect, useState, useMemo, useCallback } from "react";
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

const CartItem = React.memo(
  ({ item, isLoading, onUpdateQuantity, onRemove, formatPrice }) => {
    const productImage = useMemo(() => {
      if (!item?.product?.images) {
        return "../../../assets/images/no-image.jfif";
      }

      let images = item.product.images;

      try {
        if (typeof images === "string") {
          images = JSON.parse(images);
        }
      } catch (e) {
        console.error("Lỗi parse images:", e);
        return "../../../assets/images/no-image.jfif";
      }

      if (Array.isArray(images) && images.length > 0) {
        const firstImage = images[0];
        const imageURL = firstImage?.url || firstImage;

        if (imageURL) {
          return imageURL.startsWith("http")
            ? imageURL
            : `http://localhost:8080${imageURL}`;
        }
      }

      return "../../../assets/images/no-image.jfif";
    }, [item?.product?.images]);

    // 3. State để track ảnh đã load thành công
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // 4. Handler cho việc load ảnh thành công
    const handleImageLoad = useCallback(() => {
      setImageLoaded(true);
      setImageError(false);
    }, []);

    // 5. Handler cho việc load ảnh lỗi (tránh loop)
    const handleImageError = useCallback(
      (e) => {
        if (!imageError) {
          // Chỉ thay đổi 1 lần để tránh loop
          setImageError(true);
          e.target.src = "../../../assets/images/no-image.jfif";
        }
      },
      [imageError]
    );

    return (
      <div className={`cart-item ${isLoading ? "loading" : ""}`}>
        <div className="item-image">
          <img
            src={productImage}
            alt={item.product_name}
            loading="lazy" // 6. Lazy loading để tối ưu performance
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={{
              opacity: imageLoaded ? 1 : 0.7,
              transition: "opacity 0.3s ease",
            }}
          />
          {!imageLoaded && !imageError && (
            <div className="image-loading">
              <Loader2 size={16} className="animate-spin" />
            </div>
          )}
        </div>

        <div className="item-details">
          <h3 className="item-name">{item.product_name}</h3>

          {item.variation_info && (
            <div className="item-variation">
              <span>Phân loại: {item.variation_info}</span>
            </div>
          )}

          <div className="item-controls">
            <div className="quantity-controls">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="quantity-btn"
                disabled={isLoading || item.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="quantity">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="quantity-btn"
                disabled={isLoading}
              >
                <Plus size={16} />
              </button>
            </div>

            <div className="item-price">
              <div className="unit-price">
                {formatPrice(item.unit_price)} x {item.quantity}
              </div>
              <div className="total-price">{formatPrice(item.total_price)}</div>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              className="remove-btn"
              disabled={isLoading}
              title="Xóa sản phẩm"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <X size={16} />
              )}
            </button>
          </div>
        </div>

        {isLoading && <div className="item-loading-overlay" />}
      </div>
    );
  }
);

export default CartItem;
