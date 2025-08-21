import React, { useState, useEffect } from "react";
import "./ProductList.scss";

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img
          src={
            (product.images && product.images[0]?.url) ||
            "/placeholder-product.jpg"
          }
          alt={product.name}
          className="product-image"
        />
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
          {product.specifications?.weight && (
            <div className="spec-item">
              <span className="spec-label">Trọng lượng:</span>
              <span className="spec-value">
                {product.specifications.weight}g
              </span>
            </div>
          )}
          {product.specifications?.balance_point && (
            <div className="spec-item">
              <span className="spec-label">Điểm cân bằng:</span>
              <span className="spec-value">
                {product.specifications.balance_point}mm
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
