import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NotFound.scss"; // Import SCSS file

const NotFound = ({ theme = "default" }) => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGoHome = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate("/");
    }, 300);
  };

  const handleGoBack = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  // Determine container class based on theme
  const getContainerClass = () => {
    switch (theme) {
      case "dark":
        return "not-found-container dark-theme";
      case "light":
        return "not-found-container light-theme";
      default:
        return "not-found-container";
    }
  };

  return (
    <div className={`${getContainerClass()} ${isAnimating ? "animating" : ""}`}>
      <div className="not-found-content">
        {/* 404 Number */}
        <div className="error-code">
          <span className="four">4</span>
          <span className="zero">0</span>
          <span className="four">4</span>
        </div>

        {/* Error Message */}
        <h1 className="error-title">Trang không tồn tại</h1>
        <p className="error-description">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        {/* Action Buttons */}
        <div className="error-actions">
          <button
            onClick={handleGoHome}
            className="btn btn-primary"
            disabled={isAnimating}
          >
            {isAnimating ? "Đang chuyển..." : "Về trang chủ"}
          </button>
          <button
            onClick={handleGoBack}
            className="btn btn-secondary"
            disabled={isAnimating}
          >
            Quay lại
          </button>
        </div>

        {/* Additional Links */}
        <div className="help-links">
          <p>Hoặc bạn có thể:</p>
          <ul>
            <li>
              <Link to="/products" onClick={() => setIsAnimating(true)}>
                Xem sản phẩm
              </Link>
            </li>
            <li>
              <Link to="/intro" onClick={() => setIsAnimating(true)}>
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setIsAnimating(true)}>
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
