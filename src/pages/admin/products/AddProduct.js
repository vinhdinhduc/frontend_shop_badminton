import React, { useState } from "react";
import "./AddProduct.scss";
import AdminHeader from "../AdminHeader";
import Sidebar from "../Sidebar";
import { addProduct } from "../../../redux/actions/productAction";
import { useDispatch } from "react-redux";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    brand: "Yonex",
    category_id: 1,
    price: "",
    variations: [],
    images: [],
    is_featured: false,
    specifications: {},
    stock: 0,
  });

  const [dragActive, setDragActive] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [slug, setSlug] = useState("");

  const dispatch = useDispatch();

  const brands = [
    "Yonex",
    "Victor",
    "Li-Ning",
    "Mizuno",
    "Kawasaki",
    "FZ Forza",
  ];

  const categories = [
    { id: 1, name: "Tấn công" },
    { id: 2, name: "Phòng thủ" },
    { id: 3, name: "Cân bằng" },
    { id: 4, name: "All-around" },
    { id: 5, name: "Speed" },
  ];

  const availableSizes = ["2U", "3U", "4U", "5U"];

  // Generate slug from product name
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
      .trim();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "name") {
      const newSlug = generateSlug(value);
      setSlug(newSlug);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData((prev) => {
      const existingVariationIndex = prev.variations.findIndex(
        (v) => v.variation_value === size
      );

      let newVariations;
      if (existingVariationIndex > -1) {
        // Remove variation if already exists
        newVariations = prev.variations.filter(
          (_, i) => i !== existingVariationIndex
        );
      } else {
        // Add new variation
        newVariations = [
          ...prev.variations,
          {
            variation_type: "Kích thước",
            variation_value: size,
            stock: 0,
            price_adjustment: 0,
            sku: `${slug}-${size}`.toUpperCase(),
          },
        ];
      }

      // Calculate total stock
      const totalStock = newVariations.reduce(
        (sum, v) => sum + (v.stock || 0),
        0
      );

      return {
        ...prev,
        variations: newVariations,
        stock: totalStock,
      };
    });
  };

  const handleVariationStockChange = (size, newStock) => {
    setFormData((prev) => {
      const newVariations = prev.variations.map((v) =>
        v.variation_value === size
          ? { ...v, stock: parseInt(newStock) || 0 }
          : v
      );

      // Calculate total stock
      const totalStock = newVariations.reduce(
        (sum, v) => sum + (v.stock || 0),
        0
      );

      return {
        ...prev,
        variations: newVariations,
        stock: totalStock,
      };
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length > 0) {
      const newPreviews = [];
      const newImages = [];

      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push({
            file,
            url: e.target.result,
            name: file.name,
          });

          if (newPreviews.length === validFiles.length) {
            setPreviewImages((prev) => [...prev, ...newPreviews]);
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...validFiles],
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!formData.description.trim()) {
      alert("Vui lòng nhập mô tả sản phẩm");
      return;
    }

    if (!formData.price || formData.price <= 0) {
      alert("Vui lòng nhập giá sản phẩm hợp lệ");
      return;
    }

    if (formData.variations.length === 0) {
      alert("Vui lòng chọn ít nhất một kích thước");
      return;
    }

    // Prepare form data for API
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("slug", slug);
    submitData.append("description", formData.description);
    submitData.append("brand", formData.brand);
    submitData.append("category_id", formData.category_id);
    submitData.append("price", formData.price);
    submitData.append("is_featured", formData.is_featured);
    submitData.append("stock", formData.stock);
    submitData.append(
      "specifications",
      JSON.stringify(formData.specifications)
    );

    // Append variations as JSON
    submitData.append("variations", JSON.stringify(formData.variations));

    // Append images
    formData.images.forEach((image) => {
      submitData.append("images", image);
    });

    dispatch(addProduct(submitData));
    // Reset form
    setFormData({
      name: "",
      description: "",
      brand: "Yonex",
      category_id: 1,
      price: "",
      variations: [],
      images: [],
      is_featured: false,
      specifications: {},
      stock: 0,
    });
    setSlug("");
    setPreviewImages([]);
  };

  return (
    <>
      <div className="page-header">
        <div className="header-content">
          <h1>Thêm sản phẩm mới</h1>
          <p>Điền thông tin chi tiết để thêm sản phẩm vào cửa hàng</p>
        </div>
      </div>

      <form className="add-product-form" onSubmit={handleSubmit}>
        {/* Product Information */}
        <div className="form-section">
          <h2>Thông tin sản phẩm</h2>

          {/* Tên và slug */}
          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="name">
                Tên sản phẩm <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Slug (tự động tạo)</label>
              <input
                type="text"
                value={slug}
                readOnly
                placeholder="Slug sẽ được tạo tự động"
                className="slug-preview"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="description">
                Mô tả sản phẩm <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Nhập nội dung mô tả sản phẩm"
                rows={5}
                required
              />
              <div className="char-count">
                {formData.description.length}/500 ký tự
              </div>
            </div>
          </div>

          {/* Thương hiệu, phân loại và giá */}
          <div className="form-row three-cols">
            <div className="form-group">
              <label htmlFor="brand">Thương hiệu</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category_id">Phong cách chơi</label>
              <select
                id="category_id"
                name="category_id"
                value={formData.category_id}
                onChange={handleInputChange}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="price">
                Giá sản phẩm <span className="required">*</span>
              </label>
              <div className="price-input">
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                  required
                />
                <span className="currency">VNĐ</span>
              </div>
            </div>
          </div>

          {/* Kích thước và stock */}
          <div className="form-row">
            <div className="form-group full-width">
              <label>
                Kích thước sản phẩm <span className="required">*</span>
              </label>
              <div className="size-selection">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`size-btn ${
                      formData.variations.some(
                        (v) => v.variation_value === size
                      )
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => handleSizeToggle(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {formData.variations.length > 0 && (
                <div className="variations-table">
                  <h4>Quản lý tồn kho theo kích thước</h4>
                  <table>
                    <thead>
                      <tr>
                        <th>Kích thước</th>
                        <th>Số lượng tồn kho</th>
                        <th>SKU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.variations.map((variation, index) => (
                        <tr key={index}>
                          <td>{variation.variation_value}</td>
                          <td>
                            <input
                              type="number"
                              min="0"
                              value={variation.stock}
                              onChange={(e) =>
                                handleVariationStockChange(
                                  variation.variation_value,
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          <td>{variation.sku}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="total-stock">
                    Tổng tồn kho: <strong>{formData.stock}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Images Section */}
        <div className="form-section">
          <h2>Tải lên hình ảnh</h2>
          <div
            className={`image-upload-area ${dragActive ? "drag-active" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
          >
            <div className="upload-content">
              <div className="upload-icon">📷</div>
              <h3>Kéo thả hình ảnh vào đây</h3>
              <p>
                hoặc <span className="browse-text">chọn file</span>
              </p>
              <small>PNG, JPG, JPEG tối đa 5MB mỗi file</small>
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              style={{ display: "none" }}
            />
          </div>

          {previewImages.length > 0 && (
            <div className="image-previews">
              {previewImages.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image.url} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                  >
                    ✕
                  </button>
                  <div className="image-name">{image.name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Options */}
        <div className="form-section">
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleInputChange}
              />
              <span className="checkmark"></span>
              Thêm vào danh sách bán chạy nhất
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary">
            Hủy bỏ
          </button>
          <button type="submit" className="btn btn-primary">
            <span className="btn-icon">✓</span>
            Thêm sản phẩm
          </button>
        </div>
      </form>
    </>
  );
};

export default AddProduct;
