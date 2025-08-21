import React from "react";
import "./Footer.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import {
  faClock,
  faEnvelope,
  faLock,
  faMapMarked,
  faMapMarkedAlt,
  faPhone,
  faPhoneAlt,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <h3>Badminton shop</h3>
            <p>
              Chuyên cung cấp các sản phẩm cầu lông chất lượng cao, phù hợp với
              mọi đối tượng người chơi.
            </p>
          </div>
          <div className="social-links">
            <Link href="#" aria-label="Facebook">
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
            <Link href="#" aria-label="Instagram">
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link href="#" aria-label="Twitter">
              <FontAwesomeIcon icon={faTwitter} />
            </Link>
            <Link href="#" aria-label="YouTube">
              <FontAwesomeIcon icon={faYoutube} />
            </Link>
          </div>
        </div>

        <div className="footer-section">
          <h4>VỀ CHÚNG TÔI</h4>
          <ul>
            <li>
              <Link>Giới thiệu</Link>
            </li>
            <li>
              <Link>Lịch sử hình thành</Link>
            </li>
            <li>
              <Link>Tầm nhìn & Sứ mệnh</Link>
            </li>
            <li>
              <Link href="#">Đội ngũ nhân viên</Link>
            </li>
            <li>
              <Link href="#">Tuyển dụng</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>DỊCH VỤ</h4>
          <ul>
            <li>
              <Link>Tư vấn chọn vợt</Link>
            </li>
            <li>
              <Link>Đổi trả sản phẩm</Link>
            </li>
            <li>
              <Link>Bảo hành</Link>
            </li>
            <li>
              <Link>Bảo trì vợt</Link>
            </li>
            <li>
              <Link>Căng vợt chuyên nghiệp</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>LIÊN HỆ</h4>
          <div className="contact-info">
            <p>
              <FontAwesomeIcon icon={faMapMarkedAlt} />
              <span>Tạ Khoa, Sơn La</span>
            </p>
            <p>
              <FontAwesomeIcon icon={faPhone} />

              <span>03/09/07/77</span>
            </p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} />

              <span>weathnet32k5l@gmail.com</span>
            </p>
            <p>
              <FontAwesomeIcon icon={faClock} />

              <span>Thứ 2 - Chủ nhật: 8:00 - 22:00</span>
            </p>
          </div>
        </div>

        <div className="footer-section">
          <h4>ĐĂNG KÝ NHẬN TIN</h4>
          <p>Nhận thông tin khuyến mãi và sản phẩm mới</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Email của bạn" />
            <button>Đăng ký</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; 2025 Badminton Shop. Not copy right.Developer Đức Vình! </p>
          <div className="payment-methods">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-amex"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
