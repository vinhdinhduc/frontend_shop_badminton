import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "./ProductForm";
import { fetchProductById } from "../../../redux/actions/productAction";
import "./EditProduct.scss";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [productData, setProductData] = useState(null);

  const { arrProductId, loading, error } = useSelector(
    (state) => state.productList
  );

  useEffect(() => {
    const loadProduct = async () => {
      try {
        await dispatch(fetchProductById(id));
      } catch (err) {
        console.error("Error loading product:", err);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, dispatch]);

  useEffect(() => {
    setProductData(arrProductId?.racket);
  }, [arrProductId]);

  const handleSuccess = () => {
    navigate("/admin/list-products");
  };

  const handleCancel = () => {
    navigate("/admin/list-products");
  };

  if (loading) {
    return (
      <div className="edit-product-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="edit-product-error">
        <div className="error-content">
          <h2>Có lỗi xảy ra</h2>
          <p>{error || "Không thể tải thông tin sản phẩm"}</p>
          <div className="error-actions">
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </button>
            <button className="btn btn-secondary" onClick={handleCancel}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="edit-product-error">
        <div className="error-content">
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Sản phẩm với ID {id} không tồn tại hoặc đã bị xóa.</p>
          <div className="error-actions">
            <button className="btn btn-primary" onClick={handleCancel}>
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-product-container">
      <div className="edit-product-header">
        <button className="back-button" onClick={handleCancel}>
          ← Quay lại danh sách
        </button>
      </div>

      <ProductForm
        initialData={productData}
        isEdit={true}
        productId={id}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default EditProduct;
