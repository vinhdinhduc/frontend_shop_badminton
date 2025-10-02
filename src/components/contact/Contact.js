import React, { useState } from "react";
import "./Contact.scss";
import Navbar from "../common/Navbar";
import { toast } from "react-toastify";
import { newsLetter, sendEmail } from "../../services/emailService";

const Contact = () => {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.message) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    setIsSubmitting(true);

    try {
      const res = await sendEmail(formData);

      if (res && res.code === 0) {
        toast.success(
          "Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất."
        );
        setFormData({ email: "", message: "" });
      } else {
        toast.error(res.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error sending contact email:", error);
      toast.error(
        error.res?.message || "Không thể gửi tin nhắn. Vui lòng thử lại sau!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    if (!newsletterEmail) {
      toast.warning("Vui lòng nhập email!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newsletterEmail)) {
      toast.warning("Email không hợp lệ!");
      return;
    }

    setIsSubscribing(true);

    try {
      const response = await newsLetter(newsletterEmail);
      if (response.code === 0) {
        toast.success(
          "Đăng ký thành công! Kiểm tra email để nhận mã giảm giá."
        );
        setNewsletterEmail("");
      } else {
        toast.error(response.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Error subscribing newsletter:", error);
      toast.error(
        error.response?.data?.message ||
          "Không thể đăng ký. Vui lòng thử lại sau!"
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="contact-container">
        <div className="contact-hero">
          <div className="hero-overlay">
            <h1>Liên hệ với chúng tôi</h1>
            <p>Nơi giải đáp toàn bộ mọi thắc mắc của bạn</p>
          </div>
        </div>

        <div className="contact-content">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <h2>Thông tin liên hệ</h2>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <h3>Địa chỉ</h3>
                    <p>Sập Việt, Tạ Khoa, Sơn La, Việt Nam</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-phone"></i>
                  <div>
                    <h3>Số điện thoại</h3>
                    <p>039 4996777</p>
                    <p>Hotline: 059 2016789</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-envelope"></i>
                  <div>
                    <h3>Email</h3>
                    <p>vinhdinh@gmail.com</p>
                    <p>fbok@gmail.com</p>
                  </div>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <h3>Giờ làm việc</h3>
                    <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                    <p>Thứ 7 - Chủ nhật: 8:00 - 12:00</p>
                  </div>
                </div>
              </div>

              <div className="contact-form">
                <h2>Gửi thắc mắc cho chúng tôi</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email của bạn</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Nhập email của bạn..."
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Nội dung tin nhắn</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hãy nhập nội dung của bạn..."
                      rows="5"
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-btn">
                    Gửi tin nhắn
                  </button>
                </form>
              </div>
            </div>

            <div className="newsletter-section">
              <div className="newsletter-content">
                <div className="newsletter-text">
                  <h2>Đăng ký ngay & nhận ưu đãi 15%</h2>
                  <p>
                    Chỉ cần đăng ký tài khoản, bạn sẽ nhận ngay mã giảm giá 15%
                    cho đơn hàng đầu tiên. Nhanh tay - số lượng có hạn!
                  </p>
                </div>
                <div className="newsletter-form">
                  <input type="email" placeholder="Nhập email của bạn" />
                  <button className="subscribe-btn">Đăng ký</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="map-section">
          <div className="container">
            <h2>Bản đồ đường đi</h2>
            <div className="map-placeholder">
              <i className="fas fa-map-marked-alt"></i>
              <p>Bản đồ sẽ được hiển thị tại đây</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
