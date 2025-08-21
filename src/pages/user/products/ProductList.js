import Footer from "../../../components/common/Footer";
import Navbar from "../../../components/common/Navbar";
import ProductCard from "./ProductCard";
import { PaginationComponent } from "../../../components/ui/Pagination";
import "./ProductList.scss";
import "../../../components/ui/Pagination.scss";
import React, { useState, useEffect, useMemo } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category_id: "",
    brand: "",
    min_price: "",
    max_price: "",
    search: "",
  });
  const [sortOption, setSortOption] = useState("newest");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // All products (would normally come from API)
  const [allProducts, setAllProducts] = useState([]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // This would be replaced with actual API call
        // const response = await productService.getAllProductService(filters);
        // setAllProducts(response.data);

        // Mock data for demonstration
        setTimeout(() => {
          const mockProducts = [
            {
              id: 1,
              name: "Vợt cầu lông Trứka Changhay 75",
              brand: "Yerak",
              price: 1500000,
              discount_price: null,
              images: [
                {
                  url: "https://via.placeholder.com/300x300?text=Trứka+Changhay+75",
                },
              ],
              specifications: {
                weight: 85,
                balance_point: 295,
                flexibility: "Stiff",
              },
              stock: 10,
              is_featured: true,
            },
            {
              id: 2,
              name: "Vợt cầu lông Windstorm 78",
              brand: "Valeer",
              price: 1500000,
              discount_price: 1350000,
              images: [
                {
                  url: "https://via.placeholder.com/300x300?text=Windstorm+78",
                },
              ],
              specifications: {
                weight: 83,
                balance_point: 290,
                flexibility: "Medium",
              },
              stock: 15,
              is_featured: false,
            },
            {
              id: 3,
              name: "Vợt cầu lông Culture 300",
              brand: "Living",
              price: 1500000,
              discount_price: null,
              images: [
                { url: "https://via.placeholder.com/300x300?text=Culture+300" },
              ],
              specifications: {
                weight: 88,
                balance_point: 285,
                flexibility: "Flexible",
              },
              stock: 8,
              is_featured: true,
            },
            {
              id: 4,
              name: "Vợt cầu lông 3D Culture 600",
              brand: "Yerak",
              price: 2750000,
              discount_price: 2500000,
              images: [
                {
                  url: "https://via.placeholder.com/300x300?text=3D+Culture+600",
                },
              ],
              specifications: {
                weight: 87,
                balance_point: 292,
                flexibility: "Stiff",
              },
              stock: 5,
              is_featured: true,
            },
            // Add more mock products for pagination testing
            ...Array.from({ length: 20 }, (_, i) => ({
              id: i + 5,
              name: `Vợt cầu lông Mock ${i + 1}`,
              brand: ["Yerak", "Valeer", "Living"][i % 3],
              price: 1000000 + i * 100000,
              discount_price: i % 3 === 0 ? 900000 + i * 90000 : null,
              images: [
                {
                  url: `https://via.placeholder.com/300x300?text=Mock+${i + 1}`,
                },
              ],
              specifications: {
                weight: 80 + (i % 10),
                balance_point: 280 + (i % 20),
                flexibility: ["Stiff", "Medium", "Flexible"][i % 3],
              },
              stock: 5 + (i % 15),
              is_featured: i % 4 === 0,
            })),
          ];
          setAllProducts(mockProducts);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

    // Apply sorting
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

  // Get current page products
  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of products section
    document.querySelector(".products-main")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handlePageSizeChange = (newPageSize) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleSortChange = (newSortOption) => {
    setSortOption(newSortOption);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  if (loading) {
    return <div className="loading">Đang tải sản phẩm...</div>;
  }

  return (
    <>
      <Navbar />
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
                onChange={(e) => handleFilterChange("search", e.target.value)}
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
              <label>
                <input
                  type="checkbox"
                  checked={filters.brand === "Yerak"}
                  onChange={() =>
                    handleFilterChange(
                      "brand",
                      filters.brand === "Yerak" ? "" : "Yerak"
                    )
                  }
                />
                Yerak
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.brand === "Valeer"}
                  onChange={() =>
                    handleFilterChange(
                      "brand",
                      filters.brand === "Valeer" ? "" : "Valeer"
                    )
                  }
                />
                Valeer
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={filters.brand === "Living"}
                  onChange={() =>
                    handleFilterChange(
                      "brand",
                      filters.brand === "Living" ? "" : "Living"
                    )
                  }
                />
                Living
              </label>
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
                  checked={filters.min_price === "" && filters.max_price === ""}
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
              <div className="no-products">Không tìm thấy sản phẩm nào.</div>
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
      <Footer />
    </>
  );
};

export default ProductList;
