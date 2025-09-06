import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const AdminRoute = ({ children }) => {
  const location = useLocation();

  const { userInfo, loading } = useSelector((state) => state.userLogin);

  const token = localStorage.getItem("userInfo");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  if (!token) {
    toast.warning("Vui lòng đăng nhập để truy cập trang này !");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  const isAdmin = () => {
    if (userInfo?.data?.user?.role === "admin") return true;

    return false;
  };

  if (!isAdmin()) {
    toast.info("Bạn không có quyền truy cập vào trang quản trị!");
    return <Navigate to="/" replace />;
  }
  return children;
};
export default AdminRoute;
