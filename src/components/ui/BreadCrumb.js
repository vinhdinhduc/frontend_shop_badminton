import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./BreadCrumb.scss";

const BreadCrumb = ({ customName }) => {
  const location = useLocation();

  const pathNameMap = {
    products: "Sản phẩm",
    "product-detail": "Chi tiết sản phẩm",
    categories: "Danh mục",
    brands: "Thương hiệu",
    cart: "Giỏ hàng",
    checkout: "Thanh toán",
    orders: "Đơn hàng",
    profile: "Tài khoản",
    admin: "Quản trị",
    dashboard: "Bảng điều khiển",
    users: "Người dùng",
    settings: "Cài đặt",
    "add-product": "Thêm sản phẩm",
    "list-products": "Danh sách sản phẩm",
    customers: "Khách hàng",
    reports: "Báo cáo",
    help: "Trợ giúp",
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split("/").filter(Boolean);

    const breadCrumb = [{ label: "Trang chủ", path: "/" }];

    let currentPath = "";

    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;

      const isNumberId = /^\d+$/.test(pathname);

      if (isNumberId && index === pathnames.length - 1) {
        if (customName) {
          breadCrumb.push({
            label: customName,
            path: currentPath,
            isCurrentPage: true,
          });
        }
      } else if (!isNumberId) {
        const displayName =
          pathNameMap[pathname] ||
          pathname.charAt(0).toUpperCase() +
            pathname.slice(1).replace(/-/g, " ");

        breadCrumb.push({
          label: displayName,
          path: currentPath,
          isCurrentPage: index === pathname.length - 1,
        });
      } else if (isNumberId && index < pathnames.length - 1) {
        return;
      }
    });
    return breadCrumb;
  };
  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="breadcrumb">
      <ol className="breadcrumb-list">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="breadcrumb-item">
            {index > 0 && <span className="breadcrumb-separator"></span>}
            {crumb.isCurrentPage ? (
              <span className="breadcrumb-current">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="breadcrumb-link">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
export default BreadCrumb;
