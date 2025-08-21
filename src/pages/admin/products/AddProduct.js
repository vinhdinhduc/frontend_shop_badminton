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
    discount_price: "",
    variations: [],
    images: [],
    is_featured: false,
    specifications: {
      weight: "",
      balance_point: "",
      flexibility: "Medium",
      max_string_tension: "",
      frame_material: "Carbon",
      shaft_material: "Carbon",
      string_pattern: "",
      grip_size: "G4",
      head_shape: "Isometric",
      recommended_for: "All levels",
      made_in: "",
    },
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

  const flexibilityOptions = [
    { value: "Stiff", label: "Cứng (Stiff)" },
    { value: "Medium", label: "Trung bình (Medium)" },
    { value: "Flexible", label: "Mềm (Flexible)" },
  ];

  const gripSizeOptions = ["G3", "G4", "G5"];

  const headShapeOptions = [
    { value: "Isometric", label: "Isometric" },
    { value: "Traditional", label: "Traditional" },
  ];

  const recommendedForOptions = [
    { value: "Beginner", label: "Người mới" },
    { value: "Intermediate", label: "Trung bình" },
    { value: "Advanced", label: "Nâng cao" },
    { value: "All levels", label: "Mọi trình độ" },
  ];

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

  const handleSpecificationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
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
          const base64String = e.target.result;
          setPreviewImages((prev) => [
            ...prev,
            {
              file,
              url: base64String,
              name: file.name,
              base64: base64String.split(",")[1],
            },
          ]);
          setFormData((prev) => ({
            ...prev,
            images: [
              ...prev.images,
              {
                name: file.name,
                type: file.type,
                base64: base64String.split(",")[1],
              },
            ],
          }));
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

    if (formData.discount_price && formData.discount_price >= formData.price) {
      alert("Giá khuyến mãi phải nhỏ hơn giá gốc");
      return;
    }

    if (formData.variations.length === 0) {
      alert("Vui lòng chọn ít nhất một kích thước");
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("slug", slug);
    submitData.append("description", formData.description);
    submitData.append("brand", formData.brand);
    submitData.append("category_id", formData.category_id);
    submitData.append("price", formData.price);

    if (formData.discount_price) {
      submitData.append("discount_price", formData.discount_price);
    }

    submitData.append("is_featured", formData.is_featured);
    submitData.append("stock", formData.stock);

    const cleanedSpecs = Object.fromEntries(
      Object.entries(formData.specifications).filter(
        ([key, value]) => value !== null && value !== undefined && value !== ""
      )
    );

    submitData.append("specifications", JSON.stringify(cleanedSpecs));

    submitData.append("variations", JSON.stringify(formData.variations));

    if (previewImages.length > 0) {
      submitData.append("images", JSON.stringify(formData.images));
    }

    dispatch(addProduct(submitData));

    // Reset form
    setFormData({
      name: "",
      description: "",
      brand: "Yonex",
      category_id: 1,
      price: "",
      discount_price: "",
      variations: [],
      images: [],
      is_featured: false,
      specifications: {
        weight: "",
        balance_point: "",
        flexibility: "Medium",
        max_string_tension: "",
        frame_material: "Carbon",
        shaft_material: "Carbon",
        string_pattern: "",
        grip_size: "G4",
        head_shape: "Isometric",
        recommended_for: "All levels",
        made_in: "",
      },
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

          {/* Giá khuyến mãi và tồn kho */}
          <div className="form-row two-cols">
            <div className="form-group">
              <label htmlFor="discount_price">Giá khuyến mãi</label>
              <div className="price-input">
                <input
                  type="number"
                  id="discount_price"
                  name="discount_price"
                  value={formData.discount_price}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="1000"
                />
                <span className="currency">VNĐ</span>
              </div>
            </div>

            <div className="form-group">
              <label>Tổng tồn kho (tự động tính)</label>
              <input
                type="number"
                value={formData.stock}
                readOnly
                className="slug-preview"
              />
            </div>
          </div>
        </div>

        {/* Specifications Section */}
        <div className="form-section">
          <h2>Thông số kỹ thuật</h2>

          <div className="specs-grid">
            <div className="form-group">
              <label htmlFor="weight">Trọng lượng (Weight)</label>
              <input
                type="text"
                id="weight"
                placeholder="88g"
                value={formData.specifications.weight}
                onChange={(e) =>
                  handleSpecificationChange("weight", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="balance_point">
                Điểm cân bằng (Balance Point)
              </label>
              <input
                type="text"
                id="balance_point"
                placeholder="295mm"
                value={formData.specifications.balance_point}
                onChange={(e) =>
                  handleSpecificationChange("balance_point", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="flexibility">Độ mềm cán (Flexibility)</label>
              <select
                id="flexibility"
                value={formData.specifications.flexibility}
                onChange={(e) =>
                  handleSpecificationChange("flexibility", e.target.value)
                }
              >
                {flexibilityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="max_string_tension">
                Sức căng tối đa (Max String Tension)
              </label>
              <input
                type="text"
                id="max_string_tension"
                placeholder="30 lbs"
                value={formData.specifications.max_string_tension}
                onChange={(e) =>
                  handleSpecificationChange(
                    "max_string_tension",
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="frame_material">
                Chất liệu khung (Frame Material)
              </label>
              <input
                type="text"
                id="frame_material"
                placeholder="Carbon"
                value={formData.specifications.frame_material}
                onChange={(e) =>
                  handleSpecificationChange("frame_material", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="shaft_material">
                Chất liệu cán (Shaft Material)
              </label>
              <input
                type="text"
                id="shaft_material"
                placeholder="Carbon"
                value={formData.specifications.shaft_material}
                onChange={(e) =>
                  handleSpecificationChange("shaft_material", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="string_pattern">Mẫu dây (String Pattern)</label>
              <input
                type="text"
                id="string_pattern"
                placeholder="16x19"
                value={formData.specifications.string_pattern}
                onChange={(e) =>
                  handleSpecificationChange("string_pattern", e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="grip_size">Kích thước cán (Grip Size)</label>
              <select
                id="grip_size"
                value={formData.specifications.grip_size}
                onChange={(e) =>
                  handleSpecificationChange("grip_size", e.target.value)
                }
              >
                {gripSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="head_shape">Hình dạng đầu (Head Shape)</label>
              <select
                id="head_shape"
                value={formData.specifications.head_shape}
                onChange={(e) =>
                  handleSpecificationChange("head_shape", e.target.value)
                }
              >
                {headShapeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="recommended_for">
                Phù hợp với (Recommended For)
              </label>
              <select
                id="recommended_for"
                value={formData.specifications.recommended_for}
                onChange={(e) =>
                  handleSpecificationChange("recommended_for", e.target.value)
                }
              >
                {recommendedForOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="made_in">Xuất xứ (Made In)</label>
              <input
                type="text"
                id="made_in"
                placeholder="Japan"
                value={formData.specifications.made_in}
                onChange={(e) =>
                  handleSpecificationChange("made_in", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        {/* Kích thước và stock */}
        <div className="form-section">
          <h2>Kích thước và tồn kho</h2>
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
