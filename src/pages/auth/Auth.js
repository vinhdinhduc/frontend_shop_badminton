import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEye,
  faEyeSlash,
  faEnvelope,
  faPhone,
  faUserPlus,
  faSignInAlt,
  faArrowLeft,
  faCheckCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userService";
import "./Auth.scss";
import { toast } from "react-toastify";
import { login } from "../../redux/actions/userAction";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const dispatch = useDispatch();
  const { userInfo, error } = useSelector((state) => state.userLogin);
  const navigate = useNavigate();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const handleLoginChange = (event) => {
    const { name, value, type, checked } = event.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRegisterChange = (event) => {
    const { name, value, type, checked } = event.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const validateLoginForm = () => {
    const { email, password } = loginForm;
    if (!email || !password) {
      showNotification("error", "Email and password are required.");
      return false;
    }
    return true;
  };
  const validateRegisterForm = () => {
    const { fullName, email, phone, password, confirmPassword, acceptTerms } =
      registerForm;
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      showNotification("error", "All fields are required.");
      return false;
    }
    if (password !== confirmPassword) {
      showNotification("error", "Passwords do not match.");
      return false;
    }
    if (!acceptTerms) {
      showNotification("error", "You must accept the terms and conditions.");
      return false;
    }
    return true;
  };
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: "", message: "" });
    }, 3000);
  };

  useEffect(() => {
    if (error) toast.error(error);
    if (userInfo) {
      setLoginForm({ email: "", password: "" });

      if (userInfo.data?.user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [error, userInfo]);
  const handleLoginSubmit = (event) => {
    event.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);
    dispatch(login(loginForm));
    setIsLoading(false);
  };
  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);

    let res = await registerUser(registerForm);

    if (res && res.code === 0) {
      setIsLoading(false);
      toast.success("Đăng kí thành công!");
      setIsLogin(true);
    } else {
      toast.error(res.message);
      setIsLoading(false);
    }
  };
  const handleSocialLogin = (provider) => {
    setIsLoading(true);
    if (provider === "Google") {
      window.location.href = `${process.env.REACT_APP_URL_API}/auth/google`;
    } else if (provider === "Facebook") {
      window.location.href = `${process.env.REACT_APP_URL_API}/auth/facebook`;
    }
  };

  useEffect(() => {
    setLoginForm({
      email: "",
      password: "",
      rememberMe: false,
    });
    setRegisterForm({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    });
    setNotification({ type: "", message: "" });
  }, [isLogin]);
  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      if (isLogin) {
        handleLoginSubmit(e);
      }
      handleRegisterSubmit(e);
    }
  };
  return (
    <div className="login-page-container">
      {/* Background Elements */}
      <div className="background-decoration">
        <div className="bg-circle circle-1"></div>
        <div className="bg-circle circle-2"></div>
        <div className="bg-circle circle-3"></div>
      </div>

      {/* Back to Home Button */}
      <Link to="/" className="back-home-btn">
        <FontAwesomeIcon icon={faArrowLeft} />
        <span>Về trang chủ</span>
      </Link>

      {/* Notification */}
      {notification.message && (
        <div className={`notification ${notification.type}`}>
          <FontAwesomeIcon
            icon={
              notification.type === "success"
                ? faCheckCircle
                : faExclamationTriangle
            }
          />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="logo">
              <h2>Badminton Shop</h2>
            </div>

            <div className="tab-switcher">
              <button
                className={`tab-btn ${isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(true)}
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                Đăng nhập
              </button>
              <button
                className={`tab-btn ${!isLogin ? "active" : ""}`}
                onClick={() => setIsLogin(false)}
              >
                <FontAwesomeIcon icon={faUserPlus} />
                Đăng ký
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="form-container">
            {isLogin ? (
              /* Login Form */
              <form className="login-form" onSubmit={handleLoginSubmit}>
                <h3>Chào mừng trở lại!</h3>
                <p>Đăng nhập để tiếp tục mua sắm</p>

                <div className="form-group">
                  <label htmlFor="loginEmail">
                    <FontAwesomeIcon icon={faEnvelope} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="loginEmail"
                    name="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="loginPassword">
                    <FontAwesomeIcon icon={faLock} />
                    Mật khẩu
                  </label>
                  <div className="password-input">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="loginPassword"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      placeholder="Nhập mật khẩu"
                      required
                      onKeyDown={handleOnKeyDown}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="no-account">
                    <span onClick={() => setIsLogin(false)}>
                      Bạn chưa có tài khoản?
                    </span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Quên mật khẩu?
                  </Link>
                </div>

                <button
                  type="submit"
                  className={`submit-btn ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Đang đăng nhập...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faSignInAlt} />
                      Đăng nhập
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form className="register-form" onSubmit={handleRegisterSubmit}>
                <h3>Tạo tài khoản mới</h3>
                <p>Đăng ký để trở thành thành viên</p>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">
                      <FontAwesomeIcon icon={faUser} />
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={registerForm.fullName}
                      onChange={handleRegisterChange}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">
                      <FontAwesomeIcon icon={faPhone} />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={registerForm.phone}
                      onChange={handleRegisterChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="registerEmail">
                    <FontAwesomeIcon icon={faEnvelope} />
                    Email
                  </label>
                  <input
                    type="email"
                    id="registerEmail"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="Nhập địa chỉ email"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="registerPassword">
                      <FontAwesomeIcon icon={faLock} />
                      Mật khẩu
                    </label>
                    <div className="password-input">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="registerPassword"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        placeholder="Nhập mật khẩu"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      <FontAwesomeIcon icon={faLock} />
                      Xác nhận
                    </label>
                    <div className="password-input">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="Nhập lại mật khẩu"
                        required
                        onKeyDown={handleOnKeyDown}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        <FontAwesomeIcon
                          icon={showConfirmPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-options">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={registerForm.acceptTerms}
                      onChange={handleRegisterChange}
                      required
                    />
                    <span className="checkmark"></span>
                    Tôi đồng ý với <Link to="/terms">điều khoản sử dụng</Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className={`submit-btn ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      Đang đăng ký...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faUserPlus} />
                      Đăng ký
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Social Login */}
            <div className="social-login">
              <div className="divider">
                <span>Hoặc</span>
              </div>

              <div className="social-buttons">
                <button
                  type="button"
                  className="social-btn google"
                  onClick={() => handleSocialLogin("Google")}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faGoogle} />
                  Google
                </button>

                <button
                  type="button"
                  className="social-btn facebook"
                  onClick={() => handleSocialLogin("Facebook")}
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faFacebookF} />
                  Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
