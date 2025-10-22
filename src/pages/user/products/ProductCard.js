import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Eye, ShoppingBasket } from "lucide-react";
import "./ProductCard.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import AddToCartModal from "../cart/AddToCartModal";

const ProductCard = React.memo(({ product }) => {
  const navigate = useNavigate();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  }, []);

  const tensionSpec = useMemo(() => {
    try {
      if (!product.specifications) return null;
      const specs =
        typeof product.specifications === "string"
          ? JSON.parse(product.specifications)
          : product.specifications;

      return specs?.tension || specs?.string_tension || specs?.u || null;
    } catch (error) {
      console.error("Error parsing specifications:", error);
      return null;
    }
  }, [product.specifications]);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };
  const primaryImage = useMemo(() => {
    try {
      if (!product.images) return null;
      const images =
        typeof product.images === "string"
          ? JSON.parse(product.images)
          : product.images;

      if (Array.isArray(images) && images.length > 0) {
        const firstImage = images[0];
        const imageUrl = firstImage?.url;
        if (imageUrl) {
          return imageUrl.startsWith("http")
            ? imageUrl
            : `${process.env.REACT_APP_URL_IMAGE}${imageUrl}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Error parsing images:", error);
      return null;
    }
  }, [product.images]);

  useEffect(() => {
    if (primaryImage !== currentImageUrl) {
      setCurrentImageUrl(primaryImage);
      setImageLoaded(false);
      setImageError(false);
    }
  }, [primaryImage, currentImageUrl]);

  const handleImageError = useCallback(
    (e) => {
      if (!imageError) {
        setImageError(true);
        setImageLoaded(true);
        e.target.style.display = "none";
      }
    },
    [imageError]
  );

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const discountPercentage = useMemo(() => {
    if (product.discount_price && product.price > product.discount_price) {
      return Math.round((1 - product.discount_price / product.price) * 100);
    }
    return 0;
  }, [product.discount_price, product.price]);

  // Navigation handlers
  const handleViewDetail = useCallback(
    (e) => {
      e.stopPropagation();
      navigate(`/products/${product.id}`);
    },
    [navigate, product.id]
  );

  const handleAddToCart = useCallback(
    (e) => {
      e.stopPropagation();
      setIsOpenModal(true);
    },
    [product.id]
  );

  const priceDisplay = useMemo(() => {
    if (product.discount_price && product.discount_price < product.price) {
      return (
        <div className="price-container">
          <span className="discount-price">
            {formatPrice(product.discount_price)}
          </span>
          <span className="original-price">{formatPrice(product.price)}</span>
        </div>
      );
    }
    return (
      <div className="price-container">
        <span className="current-price">{formatPrice(product.price)}</span>
      </div>
    );
  }, [product.discount_price, product.price, formatPrice]);

  return (
    <>
      <div className="product-card-simplified">
        {/* Image Container */}
        <div className="product-image-container">
          {currentImageUrl ? (
            <div className="image-wrapper">
              <img
                src={currentImageUrl}
                alt={product.name}
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  display: imageError ? "none" : "block",
                  opacity: imageLoaded && !imageError ? 1 : 0.7,
                }}
              />
              {(imageError || !imageLoaded) && (
                <div className="image-placeholder">
                  {imageError ? (
                    <div className="no-image">
                      <span>Không có ảnh</span>
                    </div>
                  ) : (
                    <div className="image-loading">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="no-image">
              <span>Không có ảnh</span>
            </div>
          )}

          {/* Badges */}
          {discountPercentage > 0 && (
            <div className="discount-badge">-{discountPercentage}%</div>
          )}
          {product.is_featured && <div className="featured-badge">Nổi bật</div>}
        </div>

        {/* Product Info */}
        <div className="product-info-simplified">
          {/* Brand */}
          <div className="product-brand">{product.brand}</div>

          {/* Product Name */}
          <h3 className="product-name">{product.name}</h3>

          {/* Price */}
          {priceDisplay}

          {/* Tension Specification */}
          {tensionSpec && (
            <div className="tension-spec">
              <span className="spec-label">Độ căng:</span>
              <span className="spec-value">{tensionSpec}U</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="product-actions-simplified">
            <button
              className="view-detail-btn"
              onClick={handleViewDetail}
              title="Xem chi tiết sản phẩm"
            >
              <Eye size={16} />
              <span>Xem chi tiết</span>
            </button>

            <button
              className="add-to-cart-btn-icon"
              onClick={handleAddToCart}
              title="Thêm vào giỏ hàng"
            >
              <FontAwesomeIcon icon={faCartPlus} />
            </button>
          </div>
        </div>
      </div>
      <AddToCartModal
        isOpen={isOpenModal}
        product={product}
        onClose={handleCloseModal}
      />{" "}
    </>
  );
});

// Display name for debugging
ProductCard.displayName = "ProductCard";

export default ProductCard;
