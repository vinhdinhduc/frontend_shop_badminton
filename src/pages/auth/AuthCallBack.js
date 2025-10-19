import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import "./AuthCallBack.scss";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");
      const userStr = params.get("user");
      const error = params.get("error");

      if (error) {
        let messageError = "Đăng nhập thất bại!";
        switch (error) {
          case "authentication_failed":
            messageError = "Xác thực thất bại. Vui lòng thử lại.";
            break;
          case "google_auth_failed":
            messageError = "Đăng nhập Google thất bại!";
            break;
          case "facebook_auth_failed":
            messageError = "Đăng nhập Facebook thất bại!";
            break;
          case "server_error":
            messageError = "Lỗi server. Vui lòng thử lại sau!";
            break;
          default:
            messageError = "Có lỗi xảy ra. Vui lòng thử lại.";
        }
        toast.error(messageError);
        navigate("/auth", { replace: true });
        return;
      }
      if (token && userStr) {
        try {
          const user = JSON.parse(decodeURIComponent(userStr));

          localStorage.setItem("token", token);
          localStorage.setItem(
            "userInfo",
            JSON.stringify({
              data: { user, token },
            })
          );

          toast.success(`Xin chào ${user.fullName}! Đăng nhập thành công.`);

          // Redirect based on role
          setTimeout(() => {
            if (user.role === "admin") {
              navigate("/admin/dashboard", { replace: true });
            } else {
              navigate("/", { replace: true });
            }
          }, 1000);
        } catch (error) {
          console.error("Error processing OAuth callback:", error);
          toast.error("Có lỗi xảy ra khi xử lý đăng nhập!");
          navigate("/auth", { replace: true });
        }
      } else {
        toast.error("Thông tin đăng nhập không hợp lệ!");
        navigate("/auth", { replace: true });
      }
    };
    processCallback();
  }, [location, navigate, dispatch]);
  return (
    <div className="auth-callback-container">
      <div className="auth-callback-content">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
        <h2>Đang xử lý đăng nhập...</h2>
        <p>Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
};

export default AuthCallback;
