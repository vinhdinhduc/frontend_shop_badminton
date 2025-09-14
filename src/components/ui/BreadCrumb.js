import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Breadcrumb.scss";

const BreadCrumb = () => {
  const location = useLocation();

  const pathNameMap = {
    products: "Sản phẩm",
    product: "Sản phẩm",
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
  };
};
