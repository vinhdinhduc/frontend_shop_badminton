import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaginationComponent } from "../../../components/ui/Pagination";
import { Search, Trash2, Edit, Plus } from "lucide-react";

import "./AdminProductList.scss";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/actions/productAction";

const AdminProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const { arrProduct, loading, error } = useSelector(
    (state) => state.productList
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchProduct());
  }, []);
  useEffect(() => {
    if (arrProduct && arrProduct.data) {
      setProducts(arrProduct.data);
    }
  }, [arrProduct]);

  const getImages = (product) => {
    if (!product.images) return [];
    return typeof product.images === "string"
      ? JSON.parse(product.images)
      : product.images;
  };

  //   console.log("images", images);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm?.toLowerCase())
  );
  const productCount = filteredProducts.length;
  const totalProducts = products.length;

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  };
  const currentPageItems = getCurrentPageItems();
  const handlePageChange = (page) => {
    console.log("checkpage", page);
    setCurrentPage(page);
  };
  const handlePageSizeChange = (newPageSize) => {
    console.log("new pagee", newPageSize);
    setItemsPerPage(newPageSize);
    setCurrentPage(1);
  };
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleEdit = (id) => {};
  const handleDelete = (id) => {};
  return (
    <div className="admin-product-list-container">
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
          <button
            className="add-btn"
            onClick={() => navigate("/admin/add-product")}
          >
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
      <div className="table-container">
        <div className="table-wrapper">
          <table className="product-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên</th>
                <th>Hãng</th>
                <th>Giá</th>
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
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src =
                                "../../../assets/images/no-image.jfif";
                            }}
                          />
                        ) : (
                          <div className="no-image">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="name-cell">
                      <span className="product-name">{product.name}</span>
                    </td>
                    <td className="brand-cell">
                      <span
                        className={`brand-badge ${product.brand.toLowerCase()}`}
                      >
                        {product.brand}
                      </span>
                    </td>
                    <td className="price-cell">
                      <span className="price">{product.price}</span>
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
        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <p>Không tìm thấy sản phẩm nào phù hợp</p>
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
      <div className="mobile-cards">
        {filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="card-header">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
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
                <span className={`brand-badge ${product.brand.toLowerCase()}`}>
                  {product.brand}
                </span>
                <span className="price">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProductList;
