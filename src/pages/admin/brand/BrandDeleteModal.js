import React, { useState, useEffect } from "react";
import "./BrandDeleteModal.scss";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BrandDeleteModal = ({ show, onClose, onConfirm, brand, loading }) => {
  const [confirmText, setConfirmText] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!show) {
      setConfirmText("");
      setShowCountdown(false);
      setCountdown(5);
    }
  }, [show]);

  // Countdown effect
  useEffect(() => {
    if (showCountdown && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showCountdown && countdown === 0) {
      handleFinalConfirm();
    }
  }, [showCountdown, countdown]);
  if (!show || !brand) return null;

  const isConfirmed = confirmText === brand.name;
  const hasProducts = brand.productCount > 0;

  const handleConfirm = () => {
    if (!isConfirmed) return;

    setShowCountdown(true);
  };

  const handleFinalConfirm = () => {
    onConfirm(brand.id);
    setShowCountdown(false);
  };

  const handleCancelCountdown = () => {
    setShowCountdown(false);
    setCountdown(5);
  };

  return (
    <div className="brand-delete-modal-overlay">
      <div className="brand-delete-modal">
        <div className="danger-overlay"></div>

        <div className="modal__header">
          <h2>
            <i className="fas fa-exclamation-triangle"></i>
            Xác nhận xóa thương hiệu
          </h2>
          <button
            className="modal__close"
            onClick={onClose}
            disabled={loading || showCountdown}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal__body">
          <div className="delete-confirmation">
            {/* Warning Animation */}
            <div className="warning-animation">
              <div className="warning-pulse"></div>
              <div className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
            </div>

            {/* Brand Information */}
            <div className="brand-info">
              <div className="brand-visual">
                <div
                  className={`brand-logo ${!brand.logo ? "placeholder" : ""}`}
                >
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} />
                  ) : (
                    <i className="fas fa-tag"></i>
                  )}
                </div>
              </div>
              <div className="brand-details">
                <h3 className="brand-name">{brand.name}</h3>
                <div className="brand-meta">
                  <span className={`status-badge ${brand.status || "active"}`}>
                    <i
                      className={`fas ${
                        brand.status === "active"
                          ? "fa-check-circle"
                          : "fa-pause-circle"
                      }`}
                    ></i>
                    {brand.status === "active"
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </span>
                  {brand.featured && (
                    <span className="featured-badge">
                      <i className="fas fa-star"></i>
                      Nổi bật
                    </span>
                  )}
                </div>
                <p className="brand-description">
                  {brand.description || "Thương hiệu chưa có mô tả"}
                </p>
              </div>
            </div>

            {/* Warning Message */}
            <div className="warning-message">
              <div className="main-warning">
                <h4>
                  <i className="fas fa-skull-crossbones"></i>
                  CẢNH BÁO: HÀNH ĐỘNG NÀY KHÔNG THỂ HOÀN TÁC
                </h4>
                <p>
                  Bạn sắp xóa vĩnh viễn thương hiệu{" "}
                  <strong>"{brand.name}"</strong> khỏi hệ thống. Tất cả dữ liệu
                  liên quan sẽ bị mất.
                </p>
              </div>

              {/* Impact Analysis */}
              {hasProducts && (
                <div className="impact-analysis">
                  <h5>
                    <i className="fas fa-chart-line"></i>
                    TÁC ĐỘNG DỰ KIẾN
                  </h5>
                  <div className="impact-grid">
                    <div className="impact-item">
                      <i className="fas fa-boxes"></i>
                      <span className="impact-number">
                        {brand.productCount || 0}
                      </span>
                      <span className="impact-label">Sản phẩm</span>
                    </div>
                    <div className="impact-item">
                      <i className="fas fa-shopping-cart"></i>
                      <span className="impact-number">
                        {brand.orderCount || 0}
                      </span>
                      <span className="impact-label">Đơn hàng</span>
                    </div>
                    <div className="impact-item">
                      <i className="fas fa-users"></i>
                      <span className="impact-number">
                        {brand.customerCount || 0}
                      </span>
                      <span className="impact-label">Khách hàng</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Consequences */}
              <div className="consequences">
                <h5>
                  <i className="fas fa-exclamation-circle"></i>
                  HẬU QUẢ KHI XÓA
                </h5>
                <ul>
                  <li>
                    <i className="fas fa-times"></i>
                    Tất cả sản phẩm thuộc thương hiệu này sẽ bị ảnh hưởng
                  </li>
                  <li>
                    <i className="fas fa-times"></i>
                    Dữ liệu thống kê và báo cáo sẽ thay đổi
                  </li>
                  <li>
                    <i className="fas fa-times"></i>
                    Không thể khôi phục thương hiệu sau khi xóa
                  </li>
                  {hasProducts && (
                    <li>
                      <i className="fas fa-times"></i>
                      {brand.productCount} sản phẩm sẽ mất thông tin thương hiệu
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Countdown Timer */}
            {showCountdown && (
              <div className="countdown-container">
                <div className="countdown-circle">
                  <span className="countdown-number">{countdown}</span>
                </div>
                <p>Hành động sẽ được thực hiện sau {countdown} giây...</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCancelCountdown}
                >
                  <i className="fas fa-stop"></i>
                  Hủy bỏ
                </button>
              </div>
            )}

            {/* Delete Progress */}
            {loading && (
              <div className="delete-progress">
                <div className="progress-icon">
                  <FontAwesomeIcon
                    icon={faSpinner}
                    className="spinner-loading"
                  />
                </div>
                <h4>Đang xóa thương hiệu...</h4>
                <p>Vui lòng không đóng cửa sổ này</p>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            )}

            {/* Confirm Input Section */}
            {!loading && !showCountdown && (
              <div className="confirm-input-section">
                <div className="confirm-instruction">
                  <h5>
                    <i className="fas fa-keyboard"></i>
                    XÁC NHẬN CUỐI CÙNG
                  </h5>
                  <p>
                    Vui lòng nhập <strong>"{brand.name}"</strong> vào ô bên dưới
                    để xác nhận xóa:
                  </p>
                  <div className="brand-name-display">
                    <code>"{brand.name}"</code>
                  </div>
                </div>

                <div className="confirm-input-wrapper">
                  <input
                    type="text"
                    className={`confirm-input ${
                      confirmText ? (isConfirmed ? "valid" : "invalid") : ""
                    }`}
                    placeholder={`Nhập "${brand.name}" để xác nhận...`}
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                  <div className="input-validation">
                    {confirmText && (
                      <i
                        className={`fas ${
                          isConfirmed ? "fa-check valid" : "fa-times invalid"
                        }`}
                      ></i>
                    )}
                  </div>
                </div>

                {confirmText && !isConfirmed && (
                  <div className="validation-message">
                    <i className="fas fa-exclamation-circle"></i>
                    Vui lòng nhập chính xác tên thương hiệu:{" "}
                    <strong>"{brand.name}"</strong>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal__footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading || showCountdown}
          >
            <i className="fas fa-times"></i>
            Hủy bỏ
          </button>
          <button
            className={`btn btn-danger ${!isConfirmed ? "disabled" : ""} ${
              loading ? "loading" : ""
            }`}
            onClick={handleConfirm}
            disabled={!isConfirmed || loading || showCountdown}
          >
            {loading ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="spinner-loading" />
                Đang xóa...
              </>
            ) : showCountdown ? (
              <>
                <i className="fas fa-clock"></i>
                Đang đếm ngược...
              </>
            ) : (
              <>
                <i className="fas fa-trash"></i>
                Xóa thương hiệu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrandDeleteModal;
