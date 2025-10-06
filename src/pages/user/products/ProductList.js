import Footer from "../../../components/common/Footer";
import Navbar from "../../../components/common/Navbar";
import ProductCard from "./ProductCard";
import { useSearchParams } from "react-router-dom";
import { PaginationComponent } from "../../../components/ui/Pagination";
import "./ProductList.scss";
import "../../../components/ui/Pagination.scss";
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct } from "../../../redux/actions/productAction";
import { CirclesWithBar } from "react-loader-spinner";
import { getBrandsAction } from "../../../redux/actions/brandAction";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [arrBrands, setArrBrands] = useState([]);
  const [filters, setFilters] = useState({
    category_id: searchParams.get("category_id") || "",
    brand: searchParams.get("brand") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
    search: searchParams.get("search") || "",
  });
  const [sortOption, setSortOption] = useState("newest");
  const dispatch = useDispatch();
  const { arrProduct, loading, error } = useSelector(
    (state) => state.productList
  );
  const { brands } = useSelector((state) => state.brandList);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // All products (would normally come from API)
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProduct());
    dispatch(getBrandsAction({ page: 1, limit: 10 }));
  }, []);

  useEffect(() => {
    if (arrProduct && arrProduct.data) {
      setAllProducts(arrProduct.data);
    }
  }, [arrProduct]);
  useEffect(() => {
    if (brands) {
      setArrBrands(brands);
    }
  }, [brands]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Apply filters
    if (filters.brand) {
      filtered = filtered.filter((product) => product.brand === filters.brand);
    }

    if (filters.min_price) {
      filtered = filtered.filter((product) => {
        const price = product.discount_price || product.price;
        return price >= parseInt(filters.min_price);
      });
    }

    if (filters.max_price) {
      filtered = filtered.filter((product) => {
        const price = product.discount_price || product.price;
        return price <= parseInt(filters.max_price);
      });
    }

    if (filters.search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    switch (sortOption) {
      case "price_asc":
        filtered.sort((a, b) => {
          const priceA = a.discount_price || a.price;
          const priceB = b.discount_price || b.price;
          return priceA - priceB;
        });
        break;
      case "price_desc":
        filtered.sort((a, b) => {
          const priceA = a.discount_price || a.price;
          const priceB = b.discount_price || b.price;
          return priceB - priceA;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest
        filtered.sort((a, b) => b.id - a.id);
        break;
    }

    return filtered;
  }, [allProducts, filters, sortOption]);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);

    const params = {};
    Object.keys(newFilters).forEach((key) => {
      if (newFilters[key]) {
        params[key] = newFilters[key];
      }
    });
    setSearchParams(params);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    document.querySelector(".products-main")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePageSizeChange = (newPageSize) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="loader">
          <div className="loader-container">
            <CirclesWithBar
              height={100}
              width={100}
              color="#2563eb"
              ariaLabel="loading"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          <div className="product-list-container">
            <div className="filters-sidebar">
              <h3>BỘ LỌC</h3>

              {/* Search Filter */}
              <div className="filter-group">
                <h4>TÌM KIẾM</h4>
                <div className="filter-options">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="search-input"
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="filter-group">
                <h4>THƯƠNG HIỆU</h4>
                <div className="filter-options">
                  {arrBrands &&
                    arrBrands.length > 0 &&
                    arrBrands?.map((brand) => (
                      <div key={brand.id}>
                        <label htmlFor="">
                          <input
                            type="checkbox"
                            value={brand.name}
                            checked={filters.brand === brand.name}
                            onChange={() =>
                              handleFilterChange(
                                "brand",
                                filters.brand === brand.name ? "" : brand.name
                              )
                            }
                          />
                          {brand.name}
                        </label>
                      </div>
                    ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="filter-group">
                <h4>Khoảng giá</h4>
                <div className="filter-options">
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={
                        filters.min_price === "" && filters.max_price === ""
                      }
                      onChange={() => {
                        handleFilterChange("min_price", "");
                        handleFilterChange("max_price", "");
                      }}
                    />
                    Tất cả
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={filters.max_price === "1000000"}
                      onChange={() => {
                        handleFilterChange("min_price", "");
                        handleFilterChange("max_price", "1000000");
                      }}
                    />
                    Dưới 1.000.000đ
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={
                        filters.min_price === "1000000" &&
                        filters.max_price === "2000000"
                      }
                      onChange={() => {
                        handleFilterChange("min_price", "1000000");
                        handleFilterChange("max_price", "2000000");
                      }}
                    />
                    1.000.000đ - 2.000.000đ
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="price"
                      checked={filters.min_price === "2000000"}
                      onChange={() => {
                        handleFilterChange("min_price", "2000000");
                        handleFilterChange("max_price", "");
                      }}
                    />
                    Trên 2.000.000đ
                  </label>
                </div>
              </div>
            </div>

            <div className="products-main">
              <div className="products-header">
                <h2>TẤT CẢ SẢN PHẨM</h2>
                <div className="sort-options">
                  <select
                    value={sortOption}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="name">Theo tên</option>
                  </select>
                </div>
              </div>

              <div className="products-grid">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="no-products">
                    Không tìm thấy sản phẩm nào.
                  </div>
                )}
              </div>

              {/* Pagination Component */}
              {filteredAndSortedProducts.length > 0 && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={filteredAndSortedProducts.length}
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
            </div>
          </div>
        </>
      )}
      <Footer />
    </>
  );
};

export default ProductList;
