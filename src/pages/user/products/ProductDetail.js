import React, { useEffect, useState } from "react";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import "./ProductDetail.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../../components/common/Navbar";
import { fetchProductById } from "../../../redux/actions/productAction";
import { useParams } from "react-router-dom";
import BreadCrumb from "../../../components/ui/BreadCrumb";

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const { id } = useParams();
  const { arrProductId } = useSelector((state) => state.productList);

  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      fetchDetailRacket(id);
    }
  }, [dispatch, id]);

  console.log("Check arrProductId", arrProductId);

  const fetchDetailRacket = async (id) => {
    try {
      await dispatch(fetchProductById(id));
    } catch (error) {
      console.log("error fetch product by id");
    }
  };

  // Parse product data from Redux store
  const product = arrProductId?.racket || {};
  const relatedProducts = arrProductId?.relatedRackets || [];

  // Parse images from JSON string
  const getProductImages = () => {
    try {
      if (product.images) {
        const API_URL = process.env.URL_API || "http://localhost:8080";
        const parsedImages = JSON.parse(product.images);
        return parsedImages.map((img) =>
          img.url.startsWith("/uploads") ? `${API_URL}${img.url}` : img.url
        );
      }
    } catch (error) {
      console.log("Error parsing images:", error);
    }
    // Fallback images
    return [
      "/api/placeholder/500/500",
      "/api/placeholder/500/500",
      "/api/placeholder/500/500",
      "/api/placeholder/500/500",
    ];
  };

  // Parse specifications from JSON string
  const getSpecifications = () => {
    try {
      if (product.specifications) {
        // Handle the malformed JSON string
        let specs = product.specifications;

        // If it's the malformed format, try to extract the actual JSON part
        if (typeof specs === "string" && specs.includes("weight")) {
          // Find the actual JSON object within the string
          const jsonStart = specs.indexOf('{"weight"');
          if (jsonStart > -1) {
            const jsonPart = specs.substring(jsonStart);
            const parsed = JSON.parse(jsonPart);
            return [
              { label: "Trọng lượng", value: parsed.weight || "88g" },
              {
                label: "Điểm cân bằng",
                value: parsed.balance_point
                  ? `${parsed.balance_point}mm`
                  : "Cân bằng",
              },
              { label: "Độ cứng", value: parsed.flexibility || "Medium" },
              {
                label: "Sức căng dây tối đa",
                value: parsed.max_string_tension
                  ? `${parsed.max_string_tension} lbs`
                  : "32 lbs",
              },
              {
                label: "Chất liệu khung",
                value: parsed.frame_material || "Carbon",
              },
              {
                label: "Chất liệu cần",
                value: parsed.shaft_material || "Carbon",
              },
              { label: "Mật độ lưới", value: parsed.string_pattern || "26" },
              { label: "Kích thước cán", value: parsed.grip_size || "G4" },
              {
                label: "Hình dạng đầu",
                value: parsed.head_shape || "Isometric",
              },
              {
                label: "Phù hợp với",
                value: parsed.recommended_for || "All levels",
              },
            ];
          }
        } else if (typeof specs === "object") {
          // If it's already parsed
          return [
            { label: "Trọng lượng", value: specs.weight || "88g" },
            {
              label: "Điểm cân bằng",
              value: specs.balance_point
                ? `${specs.balance_point}mm`
                : "Cân bằng",
            },
            { label: "Độ cứng", value: specs.flexibility || "Medium" },
            {
              label: "Sức căng dây tối đa",
              value: specs.max_string_tension
                ? `${specs.max_string_tension} lbs`
                : "32 lbs",
            },
            {
              label: "Chất liệu khung",
              value: specs.frame_material || "Carbon",
            },
            { label: "Chất liệu cần", value: specs.shaft_material || "Carbon" },
            { label: "Mật độ lưới", value: specs.string_pattern || "26" },
            { label: "Kích thước cán", value: specs.grip_size || "G4" },
            { label: "Hình dạng đầu", value: specs.head_shape || "Isometric" },
            {
              label: "Phù hợp với",
              value: specs.recommended_for || "All levels",
            },
          ];
        }
      }
    } catch (error) {
      console.log("Error parsing specifications:", error);
    }

    // Fallback specifications
    return [
      { label: "Độ cứng", value: "Trung bình" },
      { label: "Khung vợt", value: "H.M. Graphite" },
      { label: "Dây vợt", value: "H.M. Graphite" },
      { label: "Trọng lượng", value: "3U (Khoảng 85 – 89 gram)" },
      { label: "Chu vi cán vợt", value: "G4, G5" },
      {
        label: "Sức căng lưới đơ",
        value: "19 – 26 lbs (Khoảng 8.5 – 11.5 kg)",
      },
      { label: "Điểm cân bằng", value: "Cân bằng (Khoảng 285mm)" },
      { label: "Màu sắc", value: "Cam / Đỏ" },
      { label: "Xuất xứ", value: "Đài Loan" },
    ];
  };

  const productImages = getProductImages();
  console.log("Check productImages", productImages);
  const specifications = getSpecifications();

  const features = [
    "Tặng bao nhung/bao đơn bảo vệ vợt cầu lông",
    "Tặng quấn cán vợt cầu lông",
    "Freeship khi chuyển khoản trước với đơn hàng trên 1 triệu",
    "Yên tâm với quy trình nhận hàng kiểm tra trước thanh toán sau",
    "Bảo hành vợt 90 ngày lỗi 1 đổi 1 tại nhà sản xuất",
    "Có hộp nhận voucher cho các đơn hàng tiếp theo",
    "Và vận dịch vụ hỗ trợ miễn phí khác",
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ";
  };

  const renderStars = (rating) => {
    const ratingNum = parseFloat(rating) || 0;
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        className={`star ${i < ratingNum ? "filled" : "empty"}`}
      />
    ));
  };

  // Show loading state if product data is not available
  if (!product || !product.id) {
    return (
      <>
        <Navbar />
        <div className="badminton-racket-detail">
          <div className="container">
            <div style={{ textAlign: "center", padding: "50px" }}>
              <p>Đang tải thông tin sản phẩm...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="badminton-racket-detail">
        <div className="container">
          <BreadCrumb customName={product.name} />

          {/* Product Main Section */}
          <div className="product-main">
            <div className="product-grid">
              {/* Image Gallery */}
              <div className="image-gallery">
                <div className="main-image">
                  <img src={productImages[selectedImage]} alt={product.name} />
                </div>
                <div className="thumbnail-grid">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`thumbnail ${
                        selectedImage === index ? "active" : ""
                      }`}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="product-info">
                <div className="product-header">
                  <h1 className="product-title">{product.name}</h1>
                  <h2 className="product-subtitle">{product.brand}</h2>
                </div>

                {/* Rating */}
                <div className="rating-section">
                  <div className="stars">{renderStars(product.rating)}</div>
                  <span className="rating-text">
                    {product.num_reviews || 0} đánh giá
                  </span>
                  <span className="rating-text">
                    {product.stock || 0} sản phẩm có sẵn
                  </span>
                </div>

                {/* Price */}
                <div className="price-section">
                  <div className="current-price">
                    {formatPrice(parseFloat(product.price) || 0)}
                  </div>
                  {product.discount_price && (
                    <div className="original-price">
                      {formatPrice(parseFloat(product.discount_price))}
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="features-section">
                  <h3 className="features-title">Ưu đãi</h3>
                  <ul className="features-list">
                    {features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Quantity and Actions */}
                <div className="quantity-section">
                  <div className="quantity-label">Số lượng:</div>
                  <div className="quantity-controls">
                    <div className="quantity-input">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </button>
                      <span className="quantity-value">{quantity}</span>
                      <button onClick={() => setQuantity(quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>

                  <div className="action-buttons">
                    <button className="add-to-cart-btn">
                      <ShoppingCart size={20} />
                      Thêm vào giỏ
                    </button>
                    <button className="buy-now-btn">Mua ngay</button>
                  </div>

                  <div className="secondary-actions">
                    <button>
                      <Heart size={20} />
                      Yêu thích
                    </button>
                    <button>
                      <Share2 size={20} />
                      Chia sẻ
                    </button>
                  </div>
                </div>

                {/* Service Features */}
                <div className="service-features">
                  <div className="service-item">
                    <Truck className="service-icon" size={24} />
                    <div className="service-content">
                      <div className="service-title">Miễn phí vận chuyển</div>
                      <div className="service-desc">Đơn hàng trên 1 triệu</div>
                    </div>
                  </div>
                  <div className="service-item">
                    <Shield className="service-icon" size={24} />
                    <div className="service-content">
                      <div className="service-title">Bảo hành 90 ngày</div>
                      <div className="service-desc">Lỗi 1 đổi 1</div>
                    </div>
                  </div>
                  <div className="service-item">
                    <RefreshCw className="service-icon" size={24} />
                    <div className="service-content">
                      <div className="service-title">Đổi trả dễ dàng</div>
                      <div className="service-desc">Trong 7 ngày</div>
                    </div>
                  </div>
                  <div className="service-item">
                    <MessageCircle className="service-icon" size={24} />
                    <div className="service-content">
                      <div className="service-title">Hỗ trợ 24/7</div>
                      <div className="service-desc">Tư vấn miễn phí</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="product-details">
            <div className="tabs-header">
              <div className="tabs-nav">
                {["description", "specifications", "reviews"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`tab-button ${
                      activeTab === tab ? "active" : ""
                    }`}
                  >
                    {tab === "description" && "Mô tả sản phẩm"}
                    {tab === "specifications" && "Thông số kỹ thuật"}
                    {tab === "reviews" && "Đánh giá"}
                  </button>
                ))}
              </div>
            </div>

            <div className="tab-content">
              {activeTab === "description" && (
                <div className="prose">
                  {product.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: product.description.replace(/\n/g, "<br />"),
                      }}
                    />
                  ) : (
                    <div>
                      <h3>1. Giới thiệu vợt cầu lông {product.name}</h3>
                      <p>Thông tin chi tiết sản phẩm đang được cập nhật.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3>2. Thông số kỹ thuật của vợt {product.name}</h3>
                  <div className="specifications-list">
                    {specifications.map((spec, index) => (
                      <div key={index} className="spec-item">
                        <span className="spec-label">– {spec.label}:</span>
                        <span className="spec-value">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="empty-reviews">
                  <div className="empty-icon">⭐</div>
                  <h3 className="empty-title">Chưa có đánh giá nào</h3>
                  <p className="empty-desc">
                    Hãy trở thành người đầu tiên đánh giá sản phẩm này
                  </p>
                  <button className="review-btn">Viết đánh giá</button>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="related-products">
              <div className="related-header">
                <h3 className="related-title">Sản phẩm tương tự</h3>
              </div>
              <div className="related-content">
                <div className="products-grid">
                  {relatedProducts.map((item) => {
                    const relatedImages = (() => {
                      try {
                        if (item.images) {
                          const parsedImages = JSON.parse(item.images);

                          const baseURL =
                            process.env.URL_API || "http://localhost:8080";
                          const imgURL = parsedImages[0]?.url;

                          if (imgURL && imgURL.startsWith("/uploads")) {
                            return `${baseURL}${imgURL}`;
                          }

                          return imgURL || "/api/placeholder/300/300";
                        }
                      } catch (error) {
                        return "/api/placeholder/300/300";
                      }
                      return "/api/placeholder/300/300";
                    })();

                    return (
                      <div key={item.id} className="product-card">
                        <div className="product-image">
                          <img src={relatedImages} alt={item.name} />
                        </div>
                        <h4 className="product-name">{item.name}</h4>
                        <p className="product-subtitle">{item.brand}</p>
                        {item.stock > 0 ? (
                          <div className="product-price in-stock">
                            {formatPrice(parseFloat(item.price) || 0)}
                          </div>
                        ) : (
                          <div className="product-price out-of-stock">
                            Hết hàng
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
