import React from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import "./AddProduct.scss";

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate("/admin/list-products");
  };

  const handleCancel = () => {
    navigate("/admin/list-products");
  };

  return (
    <div className="add-product-container">
      <div className="add-product-header">
        <button className="back-button" onClick={handleCancel}>
          ← Quay lại danh sách
        </button>
      </div>

      <ProductForm isEdit={false} onSuccess={handleSuccess} />
    </div>
  );
};

export default AddProduct;
