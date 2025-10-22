import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PaginationComponent } from "../../../../components/ui/Pagination";
import { Search, RotateCcw, Trash2, Eye } from "lucide-react";

import "./AdminDeletedProductList.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSoftDeletedList,
  hardDeleteProduct,
  restoreProductAction,
} from "../../../../redux/actions/productAction";

const AdminDeletedProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [deletedProducts, setDeletedProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const dispatch = useDispatch();
  const { arrDeletedProduct, loading, error } = useSelector(
    (state) => state.productList
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchSoftDeletedList());
  }, []);

  console.log("Check arrDeletedProduct fro, admin", arrDeletedProduct);

  useEffect(() => {
    if (arrDeletedProduct && arrDeletedProduct.products) {
      setDeletedProducts(arrDeletedProduct.products.data);
    }
  }, [arrDeletedProduct]);

  const getImages = (product) => {
    if (!product.images) return [];

    console.log("check product imgaes", product.images);

    return typeof product.images === "string"
      ? JSON.parse(product.images)
      : product.images;
  };

  const filteredProducts = deletedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  const productCount = filteredProducts.length;
  const totalProducts = deletedProducts.length;

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

  const handleView = (id) => {
    navigate(`/admin/view-product/${id}`);
  };

  const handleRestore = (id, productName) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn khôi phục sản phẩm "${productName}"?`
      )
    ) {
      dispatch(restoreProductAction(id));
    }
  };

  const handlePermanentDelete = (id, productName) => {
    if (
      window.confirm(
        `CẢNH BÁO: Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "${productName}"? Hành động này không thể hoàn tác!`
      )
    ) {
      if (
        window.confirm(
          "Xác nhận lần cuối: Sản phẩm sẽ bị xóa vĩnh viễn và không thể khôi phục!"
        )
      ) {
        dispatch(hardDeleteProduct(id));
      }
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " VNĐ";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="admin-deleted-product-list-container">
      <div className="admin-deleted-product-list-header">
        <div className="header-left">
          <h1 className="page-title">
            <Trash2 size={24} />
            Sản phẩm đã xóa
          </h1>
          <p className="page-subtitle">Quản lý các sản phẩm đã bị xóa mềm</p>
        </div>
        <div className="header-right">
          <span className="product-count">
            {searchTerm
              ? `Tìm thấy ${productCount} sản phẩm đã xóa.`
              : `Có ${totalProducts} sản phẩm đã bị xóa`}
          </span>
          <button
            className="back-btn"
            onClick={() => navigate("/admin/list-products")}
          >
            <Eye size={16} />
            Xem sản phẩm hoạt động
          </button>
        </div>
      </div>

      <div className="admin-search-container">
        <div className="search-box">
          <FontAwesomeIcon className="search-icon" icon={faSearch} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm đã xóa theo tên hoặc hãng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Đang tải danh sách sản phẩm đã xóa...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="error-container">
          <div className="error-content">
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button
              className="retry-btn"
              onClick={() => dispatch(fetchSoftDeletedList())}
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
              <table className="deleted-product-table">
                <thead>
                  <tr>
                    <th>Hình ảnh</th>
                    <th>Tên</th>
                    <th>Hãng</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th>Ngày xóa</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((product) => {
                    const productImages = getImages(product);
                    console.log("check list dleted product", product);

                    return (
                      <tr key={product.id} className="deleted-row">
                        <td className="image-cell">
                          <div className="product-image deleted">
                            {productImages.length > 0 ? (
                              <img
                                src={`${process.env.REACT_APP_URL_IMAGE}${productImages[0].url}`}
                                alt={product.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src =
                                    "../../../assets/images/no-image.jfif";
                                }}
                              />
                            ) : (
                              <div className="no-image">No Image</div>
                            )}
                            <div className="deleted-overlay">
                              <Trash2 size={16} />
                            </div>
                          </div>
                        </td>
                        <td className="name-cell">
                          <div className="product-info deleted">
                            <span className="product-name">{product.name}</span>
                            <span className="product-slug">
                              /{product.slug}
                            </span>
                            <span className="deleted-badge">Đã xóa</span>
                          </div>
                        </td>
                        <td className="brand-cell">
                          <span
                            className={`brand-badge deleted ${product.brand.toLowerCase()}`}
                          >
                            {product.brand}
                          </span>
                        </td>
                        <td className="price-cell">
                          <div className="price-info deleted">
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
                          <span className="stock deleted">
                            {product.stock || 0}
                          </span>
                        </td>
                        <td className="date-cell">
                          <span className="delete-date">
                            {product.deleted_at
                              ? formatDate(product.deleted_at)
                              : "N/A"}
                          </span>
                        </td>
                        <td className="actions-cell">
                          <div className="actions">
                            <button
                              className="restore-btn"
                              onClick={() =>
                                handleRestore(product.id, product.name)
                              }
                              title="Khôi phục sản phẩm"
                            >
                              <RotateCcw size={16} />
                            </button>
                            <button
                              className="permanent-delete-btn"
                              onClick={() =>
                                handlePermanentDelete(product.id, product.name)
                              }
                              title="Xóa vĩnh viễn"
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
                  <div className="empty-icon">🗑️</div>
                  <h3>Không có sản phẩm đã xóa</h3>
                  <p>
                    {searchTerm
                      ? `Không có sản phẩm đã xóa nào phù hợp với "${searchTerm}"`
                      : "Chưa có sản phẩm nào bị xóa trong hệ thống"}
                  </p>
                  {!searchTerm && (
                    <button
                      className="empty-action-btn"
                      onClick={() => navigate("/admin/products")}
                    >
                      <Eye size={16} />
                      Xem danh sách sản phẩm
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
              className="deleted-products-pagination"
            />
          )}

          {/* Mobile Cards */}
          <div className="mobile-cards">
            {currentPageItems.map((product) => {
              const productImages = getImages(product);

              return (
                <div key={product.id} className="product-card deleted">
                  <div className="card-header">
                    <div className="product-image deleted">
                      {productImages.length > 0 ? (
                        <img
                          src={`${process.env.REACT_APP_URL_IMAGE}${productImages[0].url}`}
                          alt={product.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "../../../assets/images/no-image.jfif";
                          }}
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      <div className="deleted-overlay">
                        <Trash2 size={16} />
                      </div>
                    </div>
                    <div className="card-actions">
                      <button
                        className="restore-btn"
                        onClick={() => handleRestore(product.id, product.name)}
                        title="Khôi phục"
                      >
                        <RotateCcw size={16} />
                      </button>
                      <button
                        className="permanent-delete-btn"
                        onClick={() =>
                          handlePermanentDelete(product.id, product.name)
                        }
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="card-body">
                    <h3 className="product-name">{product.name}</h3>
                    <div className="card-meta">
                      <span
                        className={`brand-badge deleted ${product.brand.toLowerCase()}`}
                      >
                        {product.brand}
                      </span>
                      <span className="price">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <div className="card-stock">
                      <span className="stock deleted">
                        Tồn kho: {product.stock || 0}
                      </span>
                      <span className="delete-date">
                        Xóa:{" "}
                        {product.deleted_at
                          ? formatDate(product.deleted_at)
                          : "N/A"}
                      </span>
                    </div>
                    <div className="card-status">
                      <span className="deleted-badge">Đã xóa</span>
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

export default AdminDeletedProductList;
