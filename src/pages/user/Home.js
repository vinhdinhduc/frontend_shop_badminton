import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import ProductCard from "../user/products/ProductCard";
import { fetchProduct } from "../../redux/actions/productAction";
import { getBrandsAction } from "../../redux/actions/brandAction";
import { CirclesWithBar } from "react-loader-spinner";
import "./Home.scss";

const Home = () => {
  const dispatch = useDispatch();
  const { arrProduct, loading, error } = useSelector(
    (state) => state.productList
  );
  const { brands } = useSelector((state) => state.brandList);
  console.log("Check brand", brands);

  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(getBrandsAction());
  }, [dispatch]);

  // Sử dụng useMemo để tối ưu performance
  const featuredProducts = useMemo(() => {
    if (!arrProduct?.data || !Array.isArray(arrProduct.data)) return [];

    return arrProduct.data
      .filter((product) => product.is_featured === true)
      .slice(0, 8);
  }, [arrProduct]);

  const latestProducts = useMemo(() => {
    if (!arrProduct?.data || !Array.isArray(arrProduct.data)) return [];

    return [...arrProduct.data]
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 8);
  }, [arrProduct]);

  const topBrands = useMemo(() => {
    return brands.slice(0, 3);
  }, [brands]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const heroFeatures = [
    {
      icon: "🏸",
      title: "Chất lượng cao",
      description: "Sản phẩm chính hãng, chất lượng được đảm bảo",
    },
    {
      icon: "🚚",
      title: "Giao hàng nhanh",
      description: "Giao hàng toàn quốc trong 24-48h",
    },
    {
      icon: "💯",
      title: "Bảo hành tốt",
      description: "Bảo hành chính hãng, hỗ trợ 24/7",
    },
    {
      icon: "💰",
      title: "Giá tốt nhất",
      description: "Cam kết giá tốt nhất thị trường",
    },
  ];

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loader">
          <div className="loader-container">
            <CirclesWithBar
              height={100}
              width={100}
              color="#2563eb"
              ariaLabel="Loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-message">
          <p>{error}</p>
          <button
            onClick={() => dispatch(fetchProduct())}
            className="retry-btn"
          >
            Thử lại
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="home">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Vợt Cầu Lông <span className="highlight">Chính Hãng</span>
            </h1>
            <p className="hero-description">
              Khám phá bộ sưu tập vợt cầu lông chất lượng cao từ các thương hiệu
              uy tín. Nâng tầm kỹ năng, chinh phục mọi trận đấu.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="btn-homepage ">
                Xem sản phẩm
              </Link>
              <Link to="/intro" className="btn-homepage ">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-badge">
              <span>Mới nhất</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {heroFeatures.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Sản phẩm nổi bật</h2>
              <p className="section-subtitle">
                Những sản phẩm được yêu thích nhất tại cửa hàng
              </p>
              <Link to="/products?featured=true" className="view-all-link">
                Xem tất cả →
              </Link>
            </div>
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest Products Section */}
      {latestProducts.length > 0 && (
        <section className="latest-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Sản phẩm mới nhất</h2>
              <p className="section-subtitle">
                Cập nhật những mẫu vợt mới nhất từ các thương hiệu hàng đầu
              </p>
              <Link to="/products" className="view-all-link">
                Xem tất cả →
              </Link>
            </div>
            <div className="products-grid">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brands Section */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Thương hiệu uy tín</h2>
            <p className="section-subtitle">
              Đối tác của những thương hiệu hàng đầu thế giới
            </p>
          </div>
          <div className="brands-grid">
            {topBrands.map((brand, index) => (
              <div className="brand-card" key={brand.id || index}>
                <h3>{brand.name}</h3>
                <p>{brand.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Bạn đang tìm kiếm vợt cầu lông hoàn hảo?
            </h2>
            <p className="cta-description">
              Liên hệ với chúng tôi để được tư vấn miễn phí về sản phẩm phù hợp
              nhất
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn-contact-home">
                Liên hệ ngay
              </Link>
              <Link to="/products" className="btn-viewProduct-home">
                Xem sản phẩm
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
