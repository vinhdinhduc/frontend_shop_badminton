import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Shield, Eye, EyeOff } from "lucide-react";
import "./CustomerModal.scss";

const CustomerModal = ({
  isOpen,
  onClose,
  customer = null,
  onSubmit,
  existingEmail,
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone_number: "",
    role: "user",
    avatar: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!customer;

  useEffect(() => {
    if (isOpen) {
      if (customer) {
        setFormData({
          fullName: customer.fullName || "",
          email: customer.email || "",
          password: "",
          phone_number: customer.phone_number || "",
          role: customer.role || "",
          avatar: customer.avatar || "",
        });
      } else {
        setFormData({
          fullName: "",
          email: "",
          password: "",
          phone_number: "",
          role: "user",
          avatar: "",
        });
      }
      setFormErrors({});
      setShowPassword(false);
      setIsSubmitting(false);
    }
  }, [isOpen, customer]);

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Họ tên không được để trống";
    } else if (formData.fullName.length < 2) {
      errors.fullName = "Họ tên phải ít nhất có 2 kí tự";
    } else if (formData.fullName.length > 50) {
      errors.fullName = "Họ tên không được vượt quá 50 kí tự";
    }

    if (!formData.email.trim()) {
      errors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
    } else if (formData.email.length > 100) {
      errors.email = "Email không được vượt quá 100 kí tự";
    } else {
      const emailExists = existingEmail.some(
        (email) =>
          email === formData.email &&
          (!customer || customer.email !== formData.email)
      );
      if (emailExists) {
        errors.email = "Email đã tồn tại trong hệ thống";
      }
    }

    if (!isEditing) {
      if (!formData.password.trim()) {
        errors.password = "Mật khẩu không được để trống";
      } else if (formData.password.length < 6) {
        errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
      } else if (formData.password.length > 255) {
        errors.password = "Mật khẩu không được vượt quá 255 ký tự";
      }
    } else if (formData.password && formData.password.length < 0) {
      errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (formData.phone_number) {
      if (!/^[0-9+\-\s()]*$/.test(formData.phone_number)) {
        errors.phone_number = "Số điện thoại không được chứa chữ cái";
      } else if (formData.phone_number.replace(/[^0-9]/g, "").length < 10) {
        errors.phone_number = "Số điện thoại phải có ít nhất 10 chữ số";
      } else if (formData.phone_number.length > 20) {
        errors.phone_number = "Số điện thoại không được vượt quá 20 chữ số";
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = { ...formData };

      // Remove password if empty when editing
      if (isEditing && !submitData.password) {
        delete submitData.password;
      }

      await onSubmit(submitData);
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error - could set form errors here
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    //Xoá lỗi khi người dùng chọn

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="customer-modal-overlay" onClick={handleOverlayClick}>
      <div className="customer-modal" onClick={(e) => e.stopPropagation()}>
        <div className="customer-modal__header">
          <h2 className="customer-modal__title">
            <User size={24} className="customer-modal__title-icon" />
            {isEditing
              ? "Chỉnh sửa thông tin khách hàng"
              : "Thêm khách hàng mới"}
          </h2>
          <button
            className="customer-modal__close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Đóng modal"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="customer-modal__form">
          <div className="customer-modal__body">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">
                <User size={24} />
                Họ tên *
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên..."
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`form-input ${formErrors.fullName ? "error" : ""}`}
                disabled={isSubmitting}
                maxLength={50}
              />
              {formErrors.fullName && (
                <span className="error-text">{formErrors.fullName}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} />
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${formErrors.email ? "error" : ""}`}
                placeholder="example@domain.com"
                disabled={isSubmitting}
                maxLength={100}
              />
              {formErrors.email && (
                <span className="error-text">{formErrors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Shield size={16} />
                Mật khẩu {!isEditing && "*"}
                {isEditing && (
                  <span className="optional-text">
                    (để trống nếu không thay đổi)
                  </span>
                )}
              </label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${formErrors.password ? "error" : ""}`}
                  placeholder={
                    isEditing
                      ? "Nhập mật khẩu mới (tùy chọn)"
                      : "Tối thiểu 6 ký tự"
                  }
                  disabled={isSubmitting}
                  maxLength={255}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {formErrors.password && (
                <span className="error-text">{formErrors.password}</span>
              )}
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone_number" className="form-label">
                <Phone size={16} />
                Số điện thoại
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleInputChange}
                className={`form-input ${
                  formErrors.phone_number ? "error" : ""
                }`}
                placeholder="0901234567"
                disabled={isSubmitting}
                maxLength={20}
              />
              {formErrors.phone_number && (
                <span className="error-text">{formErrors.phone_number}</span>
              )}
            </div>

            {/* Role */}
            <div className="form-group">
              <label htmlFor="role" className="form-label">
                <Shield size={16} />
                Vai trò
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="form-select"
                disabled={isSubmitting}
              >
                <option value="user">Người dùng</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>

            {/* Avatar URL */}
            <div className="form-group">
              <label htmlFor="avatar" className="form-label">
                <User size={16} />
                Avatar URL
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className={`form-input ${formErrors.avatar ? "error" : ""}`}
                placeholder="https://example.com/avatar.jpg"
                disabled={isSubmitting}
              />
              {formErrors.avatar && (
                <span className="error-text">{formErrors.avatar}</span>
              )}
              {formData.avatar && !formErrors.avatar && (
                <div className="avatar-preview">
                  <img
                    src={formData.avatar}
                    alt="Avatar preview"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="customer-modal__footer">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  {isEditing ? "Đang cập nhật..." : "Đang thêm..."}
                </>
              ) : isEditing ? (
                "Cập nhật"
              ) : (
                "Thêm mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CustomerModal;
