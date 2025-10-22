import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import "./AddToCartModal.scss";
import {
  addToCartAction,
  buyNowAction,
} from "../../../redux/actions/cartAction";

const AddToCartModal = ({ isOpen, onClose, product, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const addingToCart = useSelector(
    (state) => state.cartList.selectAddingToCart
  );
  console.log("Adding", addingToCart);
  console.log("Check props", product);

  const cartError = useSelector((state) => state.cartList.selectCartError);

  // Local state
  const [selectedOptions, setSelectedOptions] = useState({
    weight: "4U: 80g-84g",
    variation_id: null,
  });
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen && product) {
      setQuantity(1);

      const variations = getProductVariations();
      const firstVariation = variations[0];

      setSelectedOptions({
        weight: firstVariation?.variation_value || getDefaultWeightOption(),
        variation_id: firstVariation?.id || null,
      });
    }
  }, [isOpen, product]);

  // Parse product variations
  const getProductVariations = () => {
    try {
      if (product?.variations) {
        return typeof product.variations === "string"
          ? JSON.parse(product.variations)
          : product.variations;
      }
    } catch (error) {
      console.error("Error parsing product variations:", error);
    }
    return [];
  };

  // Parse product specifications for weight options
  const getWeightFromSpecifications = () => {
    try {
      if (product?.specifications) {
        const spec =
          typeof product.specifications === "string"
            ? JSON.parse(product.specifications)
            : product.specifications;
        return spec.weight;
      }
    } catch (error) {
      console.error("Error parsing product specifications:", error);
    }
    return null;
  };
  const getUCategoryFromWeight = (weight) => {
    if (!weight) return "Kích thước mặc định";
    if (weight >= 75 && weight <= 79) return "5U: 75g-79g";
    if (weight >= 80 && weight <= 84) return "4U: 80g-84g";
    if (weight >= 85 && weight <= 89) return "3U: 85g-89g";
    if (weight >= 90 && weight <= 94) return "2U: 90g-94g";
    if (weight >= 95 && weight <= 99) return "1U: 95g-99g";
    return;
  };

  const getDefaultWeightOption = () => {
    const weight = getWeightFromSpecifications();
    return getUCategoryFromWeight(weight);
  };
  const getWeightOptions = () => {
    const weight = getWeightFromSpecifications();
    if (weight) {
      const uCategory = getUCategoryFromWeight(weight);
      return [uCategory];
    }

    const variations = getProductVariations();
    if (variations.length > 0) {
      return variations.map((v) => v.variation_value);
    }

    return ["4U: 80g-84g"];
  };

  const getProductImage = () => {
    try {
      if (product?.images) {
        const images =
          typeof product.images === "string"
            ? JSON.parse(product.images)
            : product.images;

        if (images.length > 0) {
          const imageUrl = images[0].url;
          return imageUrl.startsWith("http")
            ? imageUrl
            : `${process.env.REACT_APP_URL_IMAGE}${imageUrl}`;
        }
      }
    } catch (error) {
      console.error("Error parsing product images:", error);
    }
    return "/api/placeholder/80/80";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const handleOptionChange = (optionType, value) => {
    setSelectedOptions((prev) => {
      const newOptions = {
        ...prev,
        [optionType]: value,
      };

      if (optionType === "weight") {
        const variations = getProductVariations();
        const matchingVariation = variations.find(
          (v) => v.variation_value === value
        );
        newOptions.variation_id = matchingVariation?.id || null;
      }

      return newOptions;
    });
  };

  const handleQuantityChange = (delta) => {
    const variations = getProductVariations();
    const selectedVariation = variations.find(
      (v) => v.id === selectedOptions.variation_id
    );
    const maxStock = selectedVariation?.stock || product?.stock || 99;

    setQuantity((prev) => Math.max(1, Math.min(prev + delta, maxStock)));
  };

  const handleAddToCart = async () => {
    if (addingToCart) return;

    try {
      const cartData = {
        product,
        selectedOptions,
        quantity,
        totalPrice: (product.discount_price || product.price) * quantity,
      };

      await dispatch(addToCartAction(cartData));

      if (onSuccess) {
        onSuccess(cartData);
      }

      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = async () => {
    if (addingToCart) return;

    try {
      const cartData = {
        product,
        selectedOptions,
        quantity,
        totalPrice: (product.discount_price || product.price) * quantity,
      };
      const cartResponse = await dispatch(buyNowAction(cartData));
      console.log("Check cartresponse add tocart", cartResponse);

      if (cartResponse && cartResponse.data) {
        const checkoutData = {
          items: cartResponse.data?.items?.map((item) => ({
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
            subtotal: cartResponse.data.total || 0,
            discount_amount: 0,
            shipping_fee: 0,
            total: cartResponse.data.total || 0,
          },
          coupon: null,
        };
        sessionStorage.setItem("checkout_data", JSON.stringify(checkoutData));
        onClose();

        setTimeout(() => {
          navigate("/checkout");
        }, [300]);
      }
      if (onSuccess) {
        onSuccess(cartData);
      }
    } catch (error) {
      console.error("Error buying now:", error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !addingToCart) {
      onClose();
    }
  };

  // Get available stock for selected variation
  const getAvailableStock = () => {
    const variations = getProductVariations();
    const selectedVariation = variations.find(
      (v) => v.id === selectedOptions.variation_id
    );
    return selectedVariation?.stock || product?.stock || 0;
  };

  if (!isOpen || !product) return null;

  const weightOptions = getWeightOptions();
  const productImage = getProductImage();
  const availableStock = getAvailableStock();
  const isOutOfStock = availableStock === 0;
  const actualWeight = getWeightFromSpecifications();
  return (
    <div className="add-to-cart-modal-overlay" onClick={handleOverlayClick}>
      <div className="add-to-cart-modal">
        {/* Close Button */}
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Đóng"
          disabled={addingToCart}
        >
          <X size={20} />
        </button>

        {/* Product Info Header */}
        <div className="modal-product-info">
          <div className="product-image">
            <img
              src={productImage}
              alt={product.name}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/api/placeholder/80/80";
              }}
            />
          </div>
          <div className="product-details">
            <h3 className="product-name">{product.name}</h3>
            <div className="product-price">
              <span className="current-price">
                {formatPrice(product.discount_price || product.price)}
              </span>
              {product.discount_price && (
                <span className="original-price">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>
            <div className="product-brand">{product.brand}</div>
            {actualWeight && (
              <div className="product-spec">
                Trọng lượng thực tế: {actualWeight}g
              </div>
            )}
          </div>
        </div>

        {/* Product Options */}
        <div className="modal-options">
          {/* Weight Options */}
          <div className="option-group">
            <label className="option-label">Kích thước (U):</label>
            <div className="option-values weight-options">
              {weightOptions.map((weight) => {
                const variations = getProductVariations();
                const variation = variations.find(
                  (v) => v.variation_value === weight
                );
                const variationStock = variation?.stock || 0;
                const isVariationOutOfStock = variationStock === 0;

                return (
                  <button
                    key={weight}
                    className={`option-btn weight-btn ${
                      selectedOptions.weight === weight ? "selected" : ""
                    } ${isVariationOutOfStock ? "out-of-stock" : ""}`}
                    onClick={() => handleOptionChange("weight", weight)}
                    disabled={addingToCart || isVariationOutOfStock}
                  >
                    {weight}
                    {isVariationOutOfStock && (
                      <span className="stock-label">Hết hàng</span>
                    )}
                    {!isVariationOutOfStock && variationStock < 10 && (
                      <span className="stock-label">Còn {variationStock}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label className="option-label">Số lượng:</label>
            <div className="quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1 || addingToCart || isOutOfStock}
                aria-label="Giảm số lượng"
              >
                <Minus size={16} />
              </button>
              <span className="quantity-value">{quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(1)}
                disabled={
                  quantity >= availableStock || addingToCart || isOutOfStock
                }
                aria-label="Tăng số lượng"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Stock info */}
          <div className="stock-info">
            {isOutOfStock ? (
              <small className="out-of-stock-text">Sản phẩm đã hết hàng</small>
            ) : (
              <small className="stock-text">
                Còn lại: {availableStock} sản phẩm
                {availableStock < 10 && (
                  <span className="low-stock"> (Sắp hết)</span>
                )}
              </small>
            )}
          </div>

          {/* Error message */}
          {cartError && <div className="error-message">{cartError}</div>}
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            className={`add-to-cart-btn ${addingToCart ? "loading" : ""}`}
            onClick={handleAddToCart}
            disabled={addingToCart || isOutOfStock}
          >
            {addingToCart ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <ShoppingCart size={18} />
            )}
            {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
          </button>

          <button
            className={`buy-now-btn ${addingToCart ? "loading" : ""}`}
            onClick={handleBuyNow}
            disabled={addingToCart || isOutOfStock}
          >
            {addingToCart ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Mua ngay"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
