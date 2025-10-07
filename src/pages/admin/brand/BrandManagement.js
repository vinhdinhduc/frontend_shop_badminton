import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import "./BrandManagement.scss";
import BrandFormModal from "./BrandFormModal";

import {
  getBrandsAction,
  createBrandAction,
  updateBrandAction,
  deleteBrandAction,
} from "../../../redux/actions/brandAction";
import BrandDeleteModal from "./BrandDeleteModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";

const BrandManagement = () => {
  const dispatch = useDispatch();
  const { brands, loading, error, pagination } = useSelector(
    (state) => state.brandList
  );
  console.log(brands);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [formModalMode, setFormModalMode] = useState("create");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);

  // Loading states for individual actions
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deleteSubmitting, setDeleteSubmitting] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchBrands();
  }, [currentPage, searchTerm, filterStatus, sortBy, sortOrder]);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        fetchBrands();
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const fetchBrands = () => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchTerm,
      status: filterStatus !== "all" ? filterStatus : undefined,
      sortBy,
      sortOrder,
    };
    dispatch(getBrandsAction(params));
  };

  // Form Modal handlers
  const openCreateModal = () => {
    setFormModalMode("create");
    setSelectedBrand(null);
    setShowFormModal(true);
  };

  const openEditModal = (brand) => {
    setFormModalMode("edit");
    setSelectedBrand(brand);
    setShowFormModal(true);
  };

  const closeFormModal = () => {
    setShowFormModal(false);
    setSelectedBrand(null);
    setFormSubmitting(false);
  };

  const handleFormSubmit = async (formData) => {
    setFormSubmitting(true);

    try {
      if (formModalMode === "create") {
        await dispatch(createBrandAction(formData));
      } else {
        await dispatch(updateBrandAction(selectedBrand.id, formData));
      }

      closeFormModal();
      fetchBrands();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        formModalMode === "create"
          ? "Có lỗi xảy ra khi thêm thương hiệu"
          : "Có lỗi xảy ra khi cập nhật thương hiệu"
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  // Delete Modal handlers
  const openDeleteModal = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
    setDeleteSubmitting(false);
  };

  const handleDelete = async (brandId) => {
    setDeleteSubmitting(true);

    try {
      await dispatch(deleteBrandAction(brandId));

      closeDeleteModal();
      fetchBrands();

      // If we deleted the last item on current page, go to previous page
      if (brands.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("Error deleting brand:", error);
      toast.error("Có lỗi xảy ra khi xóa thương hiệu");
    } finally {
      setDeleteSubmitting(false);
    }
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Search and filter handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const { currentPage: current, totalPages, totalItems } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="pagination-wrapper">
        <div className="pagination-info">
          Hiển thị {(current - 1) * pageSize + 1}-
          {Math.min(current * pageSize, totalItems)}
          trong tổng số {totalItems} thương hiệu
        </div>
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => handlePageChange(1)}
            disabled={current === 1}
            title="Trang đầu"
          >
            <i className="fas fa-angle-double-left"></i>
          </button>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(current - 1)}
            disabled={current === 1}
            title="Trang trước"
          >
            <i className="fas fa-chevron-left"></i>
          </button>

          {startPage > 1 && (
            <>
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && (
                <span className="pagination-ellipsis">...</span>
              )}
            </>
          )}

          {pages.map((page) => (
            <button
              key={page}
              className={`pagination-btn ${page === current ? "active" : ""}`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="pagination-ellipsis">...</span>
              )}
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(current + 1)}
            disabled={current === totalPages}
            title="Trang sau"
          >
            <i className="fas fa-chevron-right"></i>
          </button>

          <button
            className="pagination-btn"
            onClick={() => handlePageChange(totalPages)}
            disabled={current === totalPages}
            title="Trang cuối"
          >
            <i className="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
    );
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return <i className="fas fa-sort"></i>;
    return sortOrder === "asc" ? (
      <i className="fas fa-sort-up"></i>
    ) : (
      <i className="fas fa-sort-down"></i>
    );
  };

  const formatWebsiteUrl = (url) => {
    if (!url) return null;
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
    const placeholder = e.target.nextElementSibling;
    if (placeholder) {
      placeholder.style.display = "flex";
    }
  };

  return (
    <div className="brand-management">
      {/* Header */}
      <div className="brand-management__header">
        <div className="header-left">
          <h1>Quản lý thương hiệu</h1>
          <p>Quản lý danh sách các thương hiệu sản phẩm trong hệ thống</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={clearFilters}>
            <i className="fas fa-redo"></i>
            Làm mới
          </button>
          <button className="btn btn-primary" onClick={openCreateModal}>
            <i className="fas fa-plus"></i>
            Thêm thương hiệu
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="brand-management__filters">
        <div className="filters-left">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm thương hiệu theo tên..."
              value={searchTerm}
              onChange={handleSearch}
            />
            {searchTerm && (
              <button
                className="clear-search"
                onClick={() => setSearchTerm("")}
                title="Xóa tìm kiếm"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>

        <div className="filters-right">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={handleFilterChange}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>

          <select
            className="filter-select"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field);
              setSortOrder(order);
              setCurrentPage(1);
            }}
          >
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
            <option value="status-asc">Trạng thái</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      {!loading && brands && (
        <div className="brand-management__stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tags"></i>
            </div>
            <div className="stat-content">
              <h3>{pagination?.totalItems || 0}</h3>
              <p>Tổng thương hiệu</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{brands.filter((b) => b.is_active).length}</h3>
              <p>Đang hoạt động</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon inactive">
              <i className="fas fa-pause-circle"></i>
            </div>
            <div className="stat-content">
              <h3>{brands.filter((b) => !b.is_active).length}</h3>
              <p>Không hoạt động</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="loading-wrapper">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} className="spinner-loading" />
          </div>
          <p>Đang tải danh sách thương hiệu...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <>
          <div className="brand-management__table-wrapper">
            <table className="brand-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th className="sortable" onClick={() => handleSort("name")}>
                    Tên thương hiệu {getSortIcon("name")}
                  </th>
                  <th>Mô tả</th>
                  <th>Website</th>
                  <th className="sortable" onClick={() => handleSort("status")}>
                    Trạng thái {getSortIcon("status")}
                  </th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {brands && brands.length > 0 ? (
                  brands.map((brand) => (
                    <tr key={brand.id}>
                      <td data-label="Logo">
                        <div className="brand-logo">
                          {brand.logo && (
                            <img
                              src={`http://localhost:8080${brand.logo}`}
                              alt={`Logo ${brand.name}`}
                              onError={handleImageError}
                            />
                          )}
                          <div
                            className="logo-placeholder"
                            style={{ display: brand.logo ? "none" : "flex" }}
                          >
                            <i className="fas fa-image"></i>
                          </div>
                        </div>
                      </td>
                      <td data-label="Tên thương hiệu">
                        <div className="brand-name">
                          <span className="name">{brand.name}</span>
                          {brand.featured && (
                            <span
                              className="featured-badge"
                              title="Thương hiệu nổi bật"
                            >
                              <i className="fas fa-star"></i>
                            </span>
                          )}
                        </div>
                      </td>
                      <td data-label="Mô tả">
                        <div
                          className="brand-description"
                          title={brand.description}
                        >
                          {brand.description || "Chưa có mô tả"}
                        </div>
                      </td>
                      <td data-label="Website">
                        <div className="brand-website">
                          {brand.website ? (
                            <a
                              href={formatWebsiteUrl(brand.website)}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={`Truy cập ${brand.website}`}
                            >
                              Website
                              <i className="fas fa-external-link-alt"></i>
                            </a>
                          ) : (
                            <span className="no-website">Chưa có</span>
                          )}
                        </div>
                      </td>
                      <td data-label="Trạng thái">
                        <span
                          className={`status-badge ${
                            brand.is_active ? "active" : "inactive"
                          }`}
                        >
                          <i
                            className={`fas ${
                              brand.is_active
                                ? "fa-check-circle"
                                : "fa-pause-circle"
                            }`}
                          ></i>
                          {brand.is_active ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td data-label="Thao tác">
                        <div className="action-buttons">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openEditModal(brand)}
                            title="Chỉnh sửa thương hiệu"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openDeleteModal(brand)}
                            title="Xóa thương hiệu"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      <div className="no-data-content">
                        <i className="fas fa-inbox"></i>
                        <p>
                          {searchTerm || filterStatus !== "all"
                            ? "Không tìm thấy thương hiệu nào phù hợp với bộ lọc"
                            : "Chưa có thương hiệu nào trong hệ thống"}
                        </p>
                        {(searchTerm || filterStatus !== "all") && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={clearFilters}
                          >
                            <i className="fas fa-redo"></i>
                            Xóa bộ lọc
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </>
      )}

      {/* Form Modal */}
      <BrandFormModal
        show={showFormModal}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        mode={formModalMode}
        brandData={selectedBrand}
        loading={formSubmitting}
      />
      <BrandDeleteModal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        brand={brandToDelete}
        loading={deleteSubmitting}
      />
    </div>
  );
};

export default BrandManagement;
