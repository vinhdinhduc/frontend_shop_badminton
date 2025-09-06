import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";
import ProductCard from "../user/products/ProductCard";
import { fetchProduct } from "../../redux/actions/productAction";
import { CirclesWithBar } from "react-loader-spinner";
import "./Home.scss";

const Home = () => {
  const dispatch = useDispatch();
  const { arrProduct, loading, error } = useSelector(
    (state) => state.productList
  );

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProduct());
  }, [dispatch]);

  useEffect(() => {
    if (arrProduct && arrProduct.data) {
      // Lọc sản phẩm nổi bật
      const featured = arrProduct.data.filter((product) => product.is_featured);
      setFeaturedProducts(featured.slice(0, 8)); // Lấy 8 sản phẩm nổi bật

      // Lấy sản phẩm mới nhất (sắp xếp theo id giảm dần)
      const latest = [...arrProduct.data]
        .sort((a, b) => b.id - a.id)
        .slice(0, 8);
      setLatestProducts(latest);
    }
  }, [arrProduct]);

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
              ariaLabel="loading"
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
        <div className="error-message">{error}</div>
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
              <Link to="/products" className="btn btn-primary">
                Xem sản phẩm
              </Link>
              <Link to="/intro" className="btn btn-outline">
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
            <div className="brand-card">
              <h3>Yerak</h3>
              <p>Thương hiệu uy tín hàng đầu</p>
            </div>
            <div className="brand-card">
              <h3>Valeer</h3>
              <p>Chất lượng quốc tế</p>
            </div>
            <div className="brand-card">
              <h3>Living</h3>
              <p>Thiết kế hiện đại</p>
            </div>
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
              <Link to="/contact" className="btn btn-primary">
                Liên hệ ngay
              </Link>
              <Link to="/products" className="btn btn-outline">
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
