import React, { useState, useEffect } from "react";
import "./ProductList.scss";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  const getSpecifications = () => {
    try {
      if (!product.specifications) return {};
      return typeof product.specifications === "string"
        ? JSON.parse(product.specifications)
        : product.specifications;
    } catch (error) {
      console.error("Error parsing specifications:", error);
      return {};
    }
  };

  const specifications = getSpecifications();
  const getImages = () => {
    try {
      if (!product.images) return [];
      return typeof product.images === "string"
        ? JSON.parse(product.images)
        : product.images;
    } catch (error) {
      console.error("Error parsing images:", error);
      return [];
    }
  };
  const images = getImages();
  const handleViewDetail = (productId) => {
    navigate(`/product-detail/${productId}`);
  };

  return (
    <div className="product-card" onClick={() => handleViewDetail(product.id)}>
      <div className="product-image-container">
        {images.length > 0 ? (
          <img
            src={`http://localhost:8080${images[0].url}`}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "../../../assets/images/no-image.jfif";
            }}
          />
        ) : (
          <div className="no-image">No Image</div>
        )}
        {product.discount_price && (
          <div className="discount-badge">
            -{Math.round((1 - product.discount_price / product.price) * 100)}%
          </div>
        )}
        {product.is_featured && <div className="featured-badge">Nổi bật</div>}
      </div>
      <div className="product-info">
        <div className="product-brand">{product.brand}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price">
          {product.discount_price ? (
            <>
              <span className="discount-price">
                {formatPrice(product.discount_price)}
              </span>
              <span className="original-price">
                {formatPrice(product.price)}
              </span>
            </>
          ) : (
            <span className="current-price">{formatPrice(product.price)}</span>
          )}
        </div>
        <div className="product-specs">
          {specifications?.weight && (
            <div className="spec-item">
              <span className="spec-label">Trọng lượng:</span>
              <span className="spec-value">{specifications.weight}g</span>
            </div>
          )}
          {product.specifications?.balance_point && (
            <div className="spec-item">
              <span className="spec-label">Điểm cân bằng:</span>
              <span className="spec-value">
                {specifications.balance_point}mm
              </span>
            </div>
          )}
        </div>
        <div className="product-actions">
          <button className="add-to-cart-btn">Thêm vào giỏ</button>
          <button className="wishlist-btn">
            <i className="far fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
