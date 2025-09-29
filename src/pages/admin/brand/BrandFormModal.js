import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./BrandFormModal.scss";
import {
  faAlignLeft,
  faCheck,
  faCloudUploadAlt,
  faEdit,
  faExclamationCircle,
  faExternalLinkAlt,
  faImage,
  faLink,
  faStar,
  faTag,
  faTimes,
  faToggleOn,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const BrandFormModal = ({
  show,
  onClose,
  onSubmit,
  mode = "create",
  brandData = null,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    logo: "",
    banner_image: "",
    website: "",
    country: "",
    founded_year: "",
    is_active: true,
    is_featured: false,
    sort_order: 0,
    meta_title: "",
    meta_description: "",
  });

  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);
  const [bannerDragActive, setBannerDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [bannerPreview, setBannerPreview] = useState("");
  const fileInputRef = useRef(null);
  const bannerFileInputRef = useRef(null);
  const firstInputRef = useRef(null);

  const countries = [
    "Việt Nam",
    "United States",
    "China",
    "Japan",
    "South Korea",
    "Germany",
    "France",
    "United Kingdom",
    "Italy",
    "Thailand",
    "Singapore",
    "Taiwan",
    "India",
    "Brazil",
    "Canada",
    "Australia",
  ];

  useEffect(() => {
    if (show) {
      if (mode === "edit" && brandData) {
        setFormData({
          name: brandData.name || "",
          slug: brandData.slug || "",
          description: brandData.description || "",
          logo: brandData.logo || "",
          banner_image: brandData.banner_image || "",
          website: brandData.website || "",
          country: brandData.country || "",
          founded_year: brandData.founded_year || "",
          is_active:
            brandData.is_active !== undefined ? brandData.is_active : true,
          is_featured: brandData.is_featured || false,
          sort_order: brandData.sort_order || 0,
          meta_title: brandData.meta_title || "",
          meta_description: brandData.meta_description || "",
        });
        setImagePreview(brandData.logo || "");
        setBannerPreview(brandData.banner_image || "");
      } else {
        resetForm();
      }
      setErrors({});

      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
    }
  }, [show, mode, brandData]);

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      logo: "",
      banner_image: "",
      website: "",
      country: "",
      founded_year: "",
      is_active: true,
      is_featured: false,
      sort_order: 0,
      meta_title: "",
      meta_description: "",
    });
    setImagePreview("");
    setBannerPreview("");
    setDragActive(false);
    setBannerDragActive(false);
    setErrors({});
  };

  // Tạo slug tự động từ tên
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: inputValue,
    }));

    // Tạo slug tự động khi thay đổi tên
    if (name === "name" && mode === "create") {
      const slug = generateSlug(value);
      setFormData((prev) => ({
        ...prev,
        slug: slug,
      }));
    }

    // Clear error khi người dùng nhập
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Validation real-time
    if (name === "name" && value.length > 0 && value.length < 2) {
      setErrors((prev) => ({
        ...prev,
        name: "Tên thương hiệu phải có ít nhất 2 ký tự",
      }));
    }

    if (name === "website" && value.length > 0 && !isValidUrl(value)) {
      setErrors((prev) => ({
        ...prev,
        website: "URL website không hợp lệ",
      }));
    }

    if (name === "slug" && value.length > 0 && !/^[a-z0-9-]+$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        slug: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
      }));
    }

    if (name === "founded_year" && value.length > 0) {
      const year = parseInt(value);
      const currentYear = new Date().getFullYear();
      if (year < 1000 || year > currentYear) {
        setErrors((prev) => ({
          ...prev,
          founded_year: `Năm thành lập phải từ 1000 đến ${currentYear}`,
        }));
      }
    }
  };

  const handleFileSelect = (file, type) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Vui lòng chọn file hình ảnh (PNG, JPG, GIF, WebP)",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [type]: "Kích thước file không được vượt quá 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setFormData((prev) => ({
        ...prev,
        [type]: result,
      }));

      if (type === "logo") {
        setImagePreview(result);
      } else if (type === "banner_image") {
        setBannerPreview(result);
      }
    };
    reader.readAsDataURL(file);

    if (errors[type]) {
      setErrors((prev) => ({
        ...prev,
        [type]: "",
      }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    handleFileSelect(file, type);
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      if (type === "logo") setDragActive(true);
      else if (type === "banner") setBannerDragActive(true);
    } else if (e.type === "dragleave") {
      if (type === "logo") setDragActive(false);
      else if (type === "banner") setBannerDragActive(false);
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (type === "logo") setDragActive(false);
    else if (type === "banner") setBannerDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(
        e.dataTransfer.files[0],
        type === "logo" ? "logo" : "banner_image"
      );
    }
  };

  const handleRemoveImage = (type) => {
    setFormData((prev) => ({
      ...prev,
      [type]: "",
    }));

    if (type === "logo") {
      setImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else if (type === "banner_image") {
      setBannerPreview("");
      if (bannerFileInputRef.current) bannerFileInputRef.current.value = "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên thương hiệu là bắt buộc";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Tên thương hiệu phải có ít nhất 2 ký tự";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Tên thương hiệu không được vượt quá 100 ký tự";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug là bắt buộc";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug chỉ được chứa chữ thường, số và dấu gạch ngang";
    } else if (formData.slug.length < 2) {
      newErrors.slug = "Slug phải có ít nhất 2 ký tự";
    } else if (formData.slug.length > 100) {
      newErrors.slug = "Slug không được vượt quá 100 ký tự";
    }

    if (formData.website && !isValidUrl(formData.website)) {
      newErrors.website =
        "URL website không hợp lệ (ví dụ: https://example.com)";
    }

    if (formData.description && formData.description.length > 1000) {
      newErrors.description = "Mô tả không được vượt quá 1000 ký tự";
    }

    if (formData.founded_year) {
      const year = parseInt(formData.founded_year);
      const currentYear = new Date().getFullYear();
      if (year < 1000 || year > currentYear) {
        newErrors.founded_year = `Năm thành lập phải từ 1000 đến ${currentYear}`;
      }
    }

    if (formData.sort_order < 0) {
      newErrors.sort_order = "Thứ tự sắp xếp không được âm";
    }

    if (formData.meta_title && formData.meta_title.length > 255) {
      newErrors.meta_title = "Tiêu đề SEO không được vượt quá 255 ký tự";
    }

    if (formData.meta_description && formData.meta_description.length > 500) {
      newErrors.meta_description = "Mô tả SEO không được vượt quá 500 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(
        string.startsWith("http") ? string : `https://${string}`
      );
      return ["http:", "https:"].includes(url.protocol);
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Vui lòng kiểm tra lại thông tin đã nhập");
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement) errorElement.focus();
      return;
    }

    // Chuẩn bị dữ liệu để submit
    const submitData = {
      ...formData,
      name: formData.name.trim(),
      slug: formData.slug.trim(),
      description: formData.description.trim(),
      website: formData.website.trim(),
      meta_title: formData.meta_title.trim(),
      meta_description: formData.meta_description.trim(),
      founded_year: formData.founded_year
        ? parseInt(formData.founded_year)
        : null,
      sort_order: parseInt(formData.sort_order) || 0,
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !loading) {
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="brand-form-modal">
        <div className="modal__header">
          <h2>
            <i
              className={`fas ${
                mode === "create" ? "fa-plus-circle" : "fa-edit"
              }`}
            ></i>
            {mode === "create"
              ? "Thêm thương hiệu mới"
              : "Chỉnh sửa thương hiệu"}
          </h2>
          <button
            className="modal__close"
            onClick={onClose}
            disabled={loading}
            type="button"
            aria-label="Đóng modal"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__body">
          {/* Tên thương hiệu và Slug */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand-name">
                <FontAwesomeIcon icon={faTag} />
                Tên thương hiệu <span className="required">*</span>
              </label>
              <input
                ref={firstInputRef}
                type="text"
                id="brand-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên thương hiệu (VD: Apple, Samsung, Nike...)"
                className={errors.name ? "error" : ""}
                disabled={loading}
                maxLength={100}
                autoComplete="off"
              />
              <div className="field-info">
                <span className="character-count">
                  {formData.name.length}/100
                </span>
              </div>
              {errors.name && (
                <span className="error-message">
                  <FontAwesomeIcon icon={faExclamationCircle} />

                  {errors.name}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="brand-slug">
                <FontAwesomeIcon icon={faLink} />
                Slug <span className="required">*</span>
              </label>
              <input
                type="text"
                id="brand-slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                placeholder="vd: apple, samsung, nike"
                className={errors.slug ? "error" : ""}
                disabled={loading || mode === "create"}
                maxLength={100}
                autoComplete="off"
              />
              <div className="field-info">
                <span className="character-count">
                  {formData.slug.length}/100
                </span>
                <small className="field-help">
                  Slug sẽ tự động tạo từ tên thương hiệu
                </small>
              </div>
              {errors.slug && (
                <span className="error-message">
                  <FontAwesomeIcon icon={faExclamationCircle} />

                  {errors.slug}
                </span>
              )}
            </div>
          </div>

          {/* Mô tả thương hiệu */}
          <div className="form-group">
            <label htmlFor="brand-description">
              <FontAwesomeIcon icon={faAlignLeft} />
              Mô tả thương hiệu
            </label>
            <textarea
              id="brand-description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              placeholder="Nhập mô tả chi tiết về thương hiệu, lịch sử, đặc điểm nổi bật..."
              className={errors.description ? "error" : ""}
              disabled={loading}
              maxLength={1000}
            />
            <div className="field-info">
              <span className="character-count">
                {formData.description.length}/1000
              </span>
            </div>
            {errors.description && (
              <span className="error-message">
                <FontAwesomeIcon icon={faExclamationCircle} />

                {errors.description}
              </span>
            )}
          </div>

          {/* Logo và Banner */}
          <div className="form-row">
            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faImage} />
                Logo thương hiệu
              </label>
              <div
                className={`file-input-wrapper ${
                  dragActive ? "drag-active" : ""
                } ${errors.logo ? "error" : ""}`}
                onDragEnter={(e) => handleDrag(e, "logo")}
                onDragLeave={(e) => handleDrag(e, "logo")}
                onDragOver={(e) => handleDrag(e, "logo")}
                onDrop={(e) => handleDrop(e, "logo")}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="brand-logo"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "logo")}
                  disabled={loading}
                />

                {imagePreview ? (
                  <div className="image-preview-container">
                    <img
                      src={imagePreview}
                      alt="Logo preview"
                      className="image-preview"
                    />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Thay đổi
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveImage("logo")}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="brand-logo" className="file-input-display">
                    <div className="upload-placeholder">
                      <FontAwesomeIcon icon={faCloudUploadAlt} />

                      <h4>Tải lên logo</h4>
                      <p>Kéo thả file vào đây hoặc click để chọn</p>
                      <small>Hỗ trợ: PNG, JPG, GIF, WebP - Tối đa 5MB</small>
                    </div>
                  </label>
                )}
              </div>
              {errors.logo && (
                <span className="error-message">
                  <FontAwesomeIcon icon={faExclamationCircle} />

                  {errors.logo}
                </span>
              )}
            </div>

            <div className="form-group">
              <label>
                <FontAwesomeIcon icon={faImage} />
                Banner thương hiệu
              </label>
              <div
                className={`file-input-wrapper ${
                  bannerDragActive ? "drag-active" : ""
                } ${errors.banner_image ? "error" : ""}`}
                onDragEnter={(e) => handleDrag(e, "banner")}
                onDragLeave={(e) => handleDrag(e, "banner")}
                onDragOver={(e) => handleDrag(e, "banner")}
                onDrop={(e) => handleDrop(e, "banner")}
              >
                <input
                  ref={bannerFileInputRef}
                  type="file"
                  id="brand-banner"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "banner_image")}
                  disabled={loading}
                />

                {bannerPreview ? (
                  <div className="image-preview-container">
                    <img
                      src={bannerPreview}
                      alt="Banner preview"
                      className="image-preview"
                    />
                    <div className="image-overlay">
                      <div className="overlay-content">
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => bannerFileInputRef.current?.click()}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faEdit} />
                          Thay đổi
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleRemoveImage("banner_image")}
                          disabled={loading}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label htmlFor="brand-banner" className="file-input-display">
                    <div className="upload-placeholder">
                      <FontAwesomeIcon icon={faCloudUploadAlt} />

                      <h4>Tải lên banner</h4>
                      <p>Kéo thả file vào đây hoặc click để chọn</p>
                      <small>Hỗ trợ: PNG, JPG, GIF, WebP - Tối đa 5MB</small>
                    </div>
                  </label>
                )}
              </div>
              {errors.banner_image && (
                <span className="error-message">
                  <FontAwesomeIcon icon={faExclamationCircle} />

                  {errors.banner_image}
                </span>
              )}
            </div>
          </div>

          {/* Website và Quốc gia */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand-website">
                <i className="fas fa-globe"></i>
                Website chính thức
              </label>
              <div className="input-with-icon">
                <input
                  type="url"
                  id="brand-website"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className={errors.website ? "error" : ""}
                  disabled={loading}
                />
                {formData.website && (
                  <a
                    href={
                      formData.website.startsWith("http")
                        ? formData.website
                        : `https://${formData.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="website-preview"
                    title="Xem trước website"
                  >
                    <FontAwesomeIcon icon={faExternalLinkAlt} />
                  </a>
                )}
              </div>
              {errors.website && (
                <span className="error-message">
                  <FontAwesomeIcon icon={faExclamationCircle} />

                  {errors.website}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="brand-country">
                <i className="fas fa-flag"></i>
                Quốc gia
              </label>
              <select
                id="brand-country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                disabled={loading}
              >
                <option value="">Chọn quốc gia</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Năm thành lập và Thứ tự sắp xếp */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand-founded-year">
                <i className="fas fa-calendar-alt"></i>
                Năm thành lập
              </label>
              <input
                type="number"
                id="brand-founded-year"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleInputChange}
                placeholder="1990"
                min="1000"
                max={new Date().getFullYear()}
                className={errors.founded_year ? "error" : ""}
                disabled={loading}
              />
              {errors.founded_year && (
                <span className="error-message">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  {errors.founded_year}
                </span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="brand-sort-order">
                <i className="fas fa-sort-numeric-down"></i>
                Thứ tự sắp xếp
              </label>
              <input
                type="number"
                id="brand-sort-order"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className={errors.sort_order ? "error" : ""}
                disabled={loading}
              />
              <small className="field-help">Số nhỏ hơn sẽ hiển thị trước</small>
              {errors.sort_order && (
                <span className="error-message">
                  <i className="fas fa-exclamation-circle"></i>
                  {errors.sort_order}
                </span>
              )}
            </div>
          </div>

          {/* Trạng thái và Nổi bật */}
          <div className="form-row">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="checkbox-custom">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className="checkbox-text">
                  <FontAwesomeIcon icon={faToggleOn} />
                  Đang hoạt động
                </span>
              </label>
              <small className="field-help">
                Thương hiệu sẽ được hiển thị trên website
              </small>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_featured"
                  checked={formData.is_featured}
                  onChange={handleInputChange}
                  disabled={loading}
                />
                <span className="checkbox-custom">
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className="checkbox-text">
                  <FontAwesomeIcon icon={faStar} />
                  Thương hiệu nổi bật
                </span>
              </label>
              <small className="field-help">
                Thương hiệu nổi bật sẽ được ưu tiên hiển thị
              </small>
            </div>
          </div>

          {/* SEO Fields */}
          <div className="form-group">
            <label htmlFor="brand-meta-title">
              <i className="fas fa-search"></i>
              Tiêu đề SEO
            </label>
            <input
              type="text"
              id="brand-meta-title"
              name="meta_title"
              value={formData.meta_title}
              onChange={handleInputChange}
              placeholder="Tiêu đề hiển thị trên công cụ tìm kiếm"
              className={errors.meta_title ? "error" : ""}
              disabled={loading}
              maxLength={255}
            />
            <div className="field-info">
              <span className="character-count">
                {formData.meta_title.length}/255
              </span>
            </div>
            {errors.meta_title && (
              <span className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {errors.meta_title}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="brand-meta-description">
              <i className="fas fa-search"></i>
              Mô tả SEO
            </label>
            <textarea
              id="brand-meta-description"
              name="meta_description"
              value={formData.meta_description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Mô tả hiển thị trên công cụ tìm kiếm"
              className={errors.meta_description ? "error" : ""}
              disabled={loading}
              maxLength={500}
            />
            <div className="field-info">
              <span className="character-count">
                {formData.meta_description.length}/500
              </span>
            </div>
            {errors.meta_description && (
              <span className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {errors.meta_description}
              </span>
            )}
          </div>

          {/* Form Actions */}
          <div className="modal__footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              <i className="fas fa-times"></i>
              Hủy bỏ
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {mode === "create" ? "Đang thêm..." : "Đang cập nhật..."}
                </>
              ) : (
                <>
                  <i
                    className={`fas ${
                      mode === "create" ? "fa-plus" : "fa-save"
                    }`}
                  ></i>
                  {mode === "create" ? "Thêm thương hiệu" : "Cập nhật thay đổi"}
                </>
              )}
            </button>
          </div>
        </form>

        {/* Loading Overlay */}
        {loading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner"></div>
              <p>
                {mode === "create"
                  ? "Đang tạo thương hiệu..."
                  : "Đang cập nhật thương hiệu..."}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandFormModal;
