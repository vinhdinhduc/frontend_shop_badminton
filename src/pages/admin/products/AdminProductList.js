import { faSearch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PaginationComponent } from "../../../components/ui/Pagination";
import { Search, Trash2, Edit, Plus, Archive } from "lucide-react";

import "./AdminProductList.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProduct,
  softDeleteAction,
  fetchSoftDeletedList,
} from "../../../redux/actions/productAction";

const AdminProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const { arrProduct, arrDeletedProduct, loading, error } = useSelector(
    (state) => state.productList
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [imageLoaded, setImageLoaded] = useState({});
  const [imageError, setImageError] = useState({});
  const [currentImageUrl, setCurrentImageUrl] = useState(null);

  useEffect(() => {
    dispatch(fetchProduct());
  }, []);

  useEffect(() => {
    if (arrProduct && arrProduct.data) {
      setProducts(arrProduct.data);
    }
  }, [arrProduct]);

  const handleLoadImgae = (productId) => {
    setImageLoaded((prev) => ({
      ...prev,
      [productId]: true,
    }));
  };

  const getImages = (product) => {
    if (!product.images) return [];
    return typeof product.images === "string"
      ? JSON.parse(product.images)
      : product.images;
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  const productCount = filteredProducts.length;
  const totalProducts = products.length;

  const deletedProductsCount = arrDeletedProduct.products?.data?.length;
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };

  const currentPageItems = getCurrentPageItems();

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleEdit = (id) => {
    navigate(`/admin/edit-product/${id}`);
  };

  const handleError = (productId) => {
    setImageError((prev) => ({ ...prev, [productId]: true }));
    setImageLoaded((prev) => ({ ...prev, [productId]: true }));
  };
  useEffect(() => {
    setImageLoaded({});
    setImageError({});
  }, [products]);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      dispatch(softDeleteAction(id));
    }
  };
  const handleViewDeletedProducts = () => {
    navigate("/admin/trash-products");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  return (
    <div className="admin-product-list-container">
      {/* Success Message */}

      <div className="admin-product-list-header">
        <div className="header-left">
          <h1 className="page-title">Danh sách tất cả sản phẩm</h1>
        </div>
        <div className="header-right">
          <span className="product-count">
            {searchTerm
              ? `Tìm thấy ${productCount} sản phẩm.`
              : `Danh sách có tất cả ${totalProducts} sản phẩm`}
          </span>
          <div className="header-buttons">
            {/* Trash Button */}
            <button
              className="trash-btn"
              onClick={handleViewDeletedProducts}
              title="Xem sản phẩm đã xóa"
            >
              <Archive size={16} />
              Thùng rác
              {deletedProductsCount > 0 && (
                <span className="trash-count">{deletedProductsCount}</span>
              )}
            </button>
          </div>
          <button
            className="add-btn"
            onClick={() => navigate("/admin/add-product")}
          >
            <Plus size={16} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="admin-search-container">
        <div className="search-box">
          <FontAwesomeIcon className="search-icon" icon={faSearch} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm theo tên hoặc hãng ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && (
        <div className="spinner-loading">
          <FontAwesomeIcon icon={faSpinner} className="loading-spinner" />

          <p>Đang tải danh sách sản phẩm...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <div className="error-content">
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => dispatch(fetchProduct())}
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="table-container">
            <div className="table-wrapper">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên</th>
                    <th>Hãng</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((product) => {
                    const productImages = getImages(product);

                    return (
                      <tr key={product.id}>
                        <td className="image-cell">
                          <div className="product-image">
                            {productImages.length > 0 ? (
                              <img
                                src={`http://localhost:8080${productImages[0].url}`}
                                alt={product.name}
                                onError={() => handleError(product.id)}
                                onLoad={() => handleLoadImgae(product.id)}
                              />
                            ) : (
                              <div className="no-image">No Image</div>
                            )}
                          </div>
                        </td>
                        <td className="name-cell">
                          <div className="product-info">
                            <span className="product-name">{product.name}</span>
                            <span className="product-slug">
                              /{product.slug}
                            </span>
                            {product.is_featured && (
                              <span className="featured-badge">Bán chạy</span>
                            )}
                          </div>
                        </td>
                        <td className="brand-cell">
                          <span
                            className={`brand-badge ${product.brand.toLowerCase()}`}
                          >
                            {product.brand}
                          </span>
                        </td>
                        <td className="price-cell">
                          <div className="price-info">
                            <span className="price">
                              {formatPrice(product.price)}
                            </span>
                            {product.discount_price &&
                              product.discount_price > 0 && (
                                <span className="discount-price">
                                  {formatPrice(product.discount_price)}
                                </span>
                              )}
                          </div>
                        </td>
                        <td className="stock-cell">
                          <span
                            className={`stock ${
                              product.stock <= 5 ? "low-stock" : ""
                            }`}
                          >
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="status-cell">
                          <span
                            className={`status ${
                              product.stock > 0 ? "in-stock" : "out-of-stock"
                            }`}
                          >
                            {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <div className="actions">
                            <button
                              className="edit-btn"
                              onClick={() => handleEdit(product.id)}
                              title="Chỉnh sửa"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDelete(product.id)}
                              title="Xóa"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Empty state */}
            {filteredProducts.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-content">
                  <div className="empty-icon">📦</div>
                  <h3>Không tìm thấy sản phẩm</h3>
                  <p>
                    {searchTerm
                      ? `Không có sản phẩm nào phù hợp với "${searchTerm}"`
                      : "Chưa có sản phẩm nào trong hệ thống"}
                  </p>
                  {!searchTerm && (
                    <button
                      className="empty-action-btn"
                      onClick={() => navigate("/admin/add-product")}
                    >
                      <Plus size={16} />
                      Thêm sản phẩm đầu tiên
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {filteredProducts.length > 0 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredProducts.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[5, 10, 20, 50]}
              showPageInfo={true}
              showPageSizeSelector={true}
              maxVisiblePages={5}
              className="products-pagination"
            />
          )}

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {currentPageItems.map((product) => {
              const productImages = getImages(product);

              return (
                <div key={product.id} className="product-card">
                  <div className="card-header">
                    <div className="product-image">
                      {productImages.length > 0 ? (
                        <img
                          src={`http://localhost:8080${productImages[0].url}`}
                          alt={product.name}
                          onError={() => handleError(product.id)}
                          onLoad={() => handleLoadImgae(product.id)}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="card-actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(product.id)}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="card-meta">
                      <span
                        className={`brand-badge ${product.brand.toLowerCase()}`}
                      >
                        {product.brand}
                      </span>
                      <span className="price">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="card-stock">
                      <span
                        className={`stock ${
                          product.stock <= 5 ? "low-stock" : ""
                        }`}
                      >
                        Tồn kho: {product.stock || 0}
                      </span>
                      <span
                        className={`status ${
                          product.stock > 0 ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {product.stock > 0 ? "Còn hàng" : "Hết hàng"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminProductList;
