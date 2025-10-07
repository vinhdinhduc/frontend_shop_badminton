import React from "react";

import { useNavigate } from "react-router-dom";
import "./About.scss";
import Navbar from "../common/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBullseye, faEye } from "@fortawesome/free-solid-svg-icons";

const About = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="about-container">
        <div className="about-hero">
          <div className="hero-overlay">
            <h1>Giới thiệu về chúng tôi</h1>
            <p>Badminton Shop - Chất lượng tạo nên khác biệt</p>
          </div>
        </div>

        <div className="about-content">
          <section className="about-section">
            <div className="container">
              <h2>Chào mừng đến với Badminton Shop</h2>
              <div className="about-grid">
                <div className="about-text">
                  <p>
                    Badminton Shop là một thương hiệu trẻ ra đời vào năm 2025,
                    chuyên cung cấp các dòng vợt cầu lông chất lượng cao, phục
                    vụ nhu cầu luyện tập và thi đấu của người chơi ở mọi trình
                    độ – từ phong trào đến chuyên nghiệp. Với định hướng "Chất
                    lượng tạo nên khác biệt", Badminton Shop không chỉ là nơi
                    bán sản phẩm, mà còn là người đồng hành đáng tin cậy của
                    cộng đồng cầu lông tại Việt Nam.
                  </p>
                </div>
                <div className="about-image">
                  <img
                    src="https://via.placeholder.com/400x300?text=TLOOK+Store"
                    alt="Cửa hàng Badminton Shop"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mission-section">
            <div className="container">
              <div className="mission-grid">
                <div className="mission-icon">
                  <FontAwesomeIcon icon={faBullseye} />
                </div>
                <div className="mission-content">
                  <h2>Sứ mệnh</h2>
                  <p>
                    Badminton Shop cam kết mang đến cho khách hàng những sản
                    phẩm chính hãng, đa dạng, phù hợp với thể trạng người Việt,
                    đồng thời tư vấn đúng – trung – tận tâm nhằm giúp người chơi
                    chọn được vợt phù hợp với phong cách và trình độ của mình.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="vision-section">
            <div className="container">
              <div className="vision-grid">
                <div className="vision-content">
                  <h2>Tầm nhìn</h2>
                  <p>
                    Chúng tôi hướng đến việc trở thành một trong những địa chỉ
                    bán vợt cầu lông đáng tin cậy nhất tại Việt Nam, với hệ
                    thống phân phối hiện đại và dịch vụ khách hàng chuyên
                    nghiệp, từng bước góp phần phát triển phong trào cầu lông
                    nước nhà.
                  </p>
                </div>
                <div className="vision-icon">
                  <FontAwesomeIcon icon={faEye} />
                </div>
              </div>
            </div>
          </section>

          <section className="stats-section">
            <div className="container">
              <h2>Badminton Shop trong số</h2>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">2025</div>
                  <div className="stat-label">Năm thành lập</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">1000+</div>
                  <div className="stat-label">Khách hàng hài lòng</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Sản phẩm đa dạng</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">0036/0138</div>
                  <div className="stat-label">Mã số kinh doanh</div>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="container">
              <div className="cta-content">
                <h2>HÃY MUA HÀNG CỦA CHÚNG TÔI</h2>
                <p>
                  Trải nghiệm sự khác biệt từ chất lượng và dịch vụ của
                  Badminton Shop
                </p>
                <button
                  className="cta-button"
                  onClick={() => navigate("/products")}
                >
                  Khám phá sản phẩm
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default About;
