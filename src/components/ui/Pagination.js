// components/ui/Pagination.js
import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import "./Pagination.scss";

// Base Pagination component
export const Pagination = ({ className, children, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={`pagination ${className || ""}`}
    {...props}
  >
    {children}
  </nav>
);

// Pagination Content wrapper
export const PaginationContent = ({ className, children, ...props }) => (
  <ul className={`pagination-content ${className || ""}`} {...props}>
    {children}
  </ul>
);

// Individual pagination item
export const PaginationItem = ({ className, children, ...props }) => (
  <li className={`pagination-item ${className || ""}`} {...props}>
    {children}
  </li>
);

// Pagination link/button
export const PaginationLink = ({
  className,
  isActive = false,
  size = "default",
  disabled = false,
  onClick,
  children,
  ...props
}) => {
  const handleClick = (e) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      className={`pagination-link ${size} ${isActive ? "active" : ""} ${
        disabled ? "disabled" : ""
      } ${className || ""}`}
      onClick={handleClick}
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </button>
  );
};

// Previous button
export const PaginationPrevious = ({
  className,
  disabled,
  onClick,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={`pagination-previous ${className || ""}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    <ChevronLeft className="pagination-icon" />
    <span>Trước</span>
  </PaginationLink>
);

// Next button
export const PaginationNext = ({ className, disabled, onClick, ...props }) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={`pagination-next ${className || ""}`}
    disabled={disabled}
    onClick={onClick}
    {...props}
  >
    <span>Tiếp</span>
    <ChevronRight className="pagination-icon" />
  </PaginationLink>
);

// Ellipsis for indicating more pages
export const PaginationEllipsis = ({ className, ...props }) => (
  <span
    aria-hidden
    className={`pagination-ellipsis ${className || ""}`}
    {...props}
  >
    <MoreHorizontal className="pagination-icon" />
    <span className="sr-only">More pages</span>
  </span>
);

// Main Pagination component with built-in logic
export const PaginationComponent = ({
  currentPage = 1,
  totalPages,
  totalItems,
  itemsPerPage = 10,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
  showPageInfo = true,
  showPageSizeSelector = true,
  maxVisiblePages = 5,
  className,
}) => {
  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = visiblePages[0] > 1;
  const showEndEllipsis = visiblePages[visiblePages.length - 1] < totalPages;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    onPageSizeChange?.(newPageSize);
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`pagination-wrapper ${className || ""}`}>
      {/* Page Info */}
      {showPageInfo && (
        <div className="pagination-info">
          Hiển thị {startItem} - {endItem} của {totalItems} sản phẩm
        </div>
      )}

      {/* Main Pagination */}
      <Pagination>
        <PaginationContent>
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>

          {/* First Page */}
          {showStartEllipsis && (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  isActive={currentPage === 1}
                >
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            </>
          )}

          {/* Visible Page Numbers */}
          {visiblePages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Last Page */}
          {showEndEllipsis && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}

          {/* Next Button */}
          <PaginationItem>
            <PaginationNext
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Page Size Selector */}
      {showPageSizeSelector && (
        <div className="pagination-page-size">
          <label>
            Số lượng mỗi trang:
            <select
              value={itemsPerPage}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="page-size-select"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
};
