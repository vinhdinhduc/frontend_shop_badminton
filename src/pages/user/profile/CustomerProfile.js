import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Camera,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Package,
  Settings,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import "./CustomerProfile.scss";
import { toast } from "react-toastify";
import {
  getProfileAction,
  updateUserProfileAction,
  updateAvatarAction,
  changePasswordAction,
  getUserAddressesAction,
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "../../../redux/actions/profileAction";
import Navbar from "../../../components/common/Navbar";
import Footer from "../../../components/common/Footer";

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [editedProfile, setEditedProfile] = useState(null);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { profile, addresses, error, loading } = useSelector(
    (state) => state.profileList
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone_number: "",
    address_line1: "",
    address_line2: "",
    city: "",
    region: "",
    postal_code: "",
    country: "Việt Nam",
    is_default: false,
  });

  // Load data on component mount
  useEffect(() => {
    dispatch(getProfileAction(userInfo?.data?.user.id));
    dispatch(getUserAddressesAction());
  }, [dispatch]);

  // Handlers
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsEditing(false);
    setShowChangePassword(false);
    setShowAddAddress(false);
    setEditingAddress(null);
  };

  const handleEditProfile = () => {
    setEditedProfile({ ...profile });
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    // Validate form
    if (
      !editedProfile.fullName ||
      !editedProfile.email ||
      !editedProfile.phone_number
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editedProfile.email)) {
      toast.error("Email không hợp lệ");
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(editedProfile.phone_number.replace(/\s/g, ""))) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    }

    dispatch(updateUserProfileAction(editedProfile));
    setIsEditing(false);
    setIsEditing(null);
  };

  const handleCancelEdit = () => {
    setEditedProfile(null);
    setIsEditing(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 5MB");
        return;
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, WebP)");
        return;
      }

      const formData = new FormData();
      formData.append("avatar", file);
      console.log("Form data send", file, formData);

      dispatch(updateAvatarAction(formData));
    }
  };

  const handleChangePassword = () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    dispatch(
      changePasswordAction({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
    );

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setShowChangePassword(false);
  };

  const handleAddAddress = () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone_number ||
      !addressForm.address_line1 ||
      !addressForm.city
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    dispatch(createAddressAction(addressForm));
    resetAddressForm();
    setShowAddAddress(false);
  };

  const handleEditAddress = (address) => {
    setAddressForm(address);
    setEditingAddress(address.id);
  };

  const handleUpdateAddress = () => {
    if (
      !addressForm.fullName ||
      !addressForm.phone_number ||
      !addressForm.address_line1 ||
      !addressForm.city
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    dispatch(updateAddressAction(editingAddress, addressForm));
    resetAddressForm();
    setEditingAddress(null);
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length === 1) {
      toast.error("Không thể xóa địa chỉ cuối cùng");
      return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      dispatch(deleteAddressAction(id));
    }
  };

  const handleSetDefaultAddress = (id) => {
    dispatch(setDefaultAddressAction(id));
  };

  const resetAddressForm = () => {
    setAddressForm({
      fullName: "",
      phone_number: "",
      address_line1: "",
      address_line2: "",
      city: "",
      region: "",
      postal_code: "",
      country: "Việt Nam",
      is_default: false,
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao hàng";
      case "delivered":
        return "Đã giao hàng";
      case "cancelled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  if (loading && !profile) {
    return (
      <div className="customer-profile">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="customer-profile">
        <div className="profile-container">
          {/* Sidebar */}
          <div className="profile-sidebar">
            <div className="user-info-card">
              <div className="avatar-section">
                <div className="avatar-container">
                  {profile?.avatar ? (
                    <img
                      src={`${process.env.REACT_APP_URL_IMAGE}${profile.avatar} `}
                      alt="Avatar"
                      className="avatar"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      <User size={40} />
                    </div>
                  )}
                  <button
                    className="avatar-edit-btn"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                  >
                    <Camera size={16} />
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </div>
                <div className="user-details">
                  <h3>{profile?.fullName || "Người dùng"}</h3>
                  <p>{profile?.email || "email@example.com"}</p>
                </div>
              </div>
            </div>

            <nav className="profile-nav">
              <button
                className={`nav-item ${
                  activeTab === "profile" ? "active" : ""
                }`}
                onClick={() => handleTabChange("profile")}
              >
                <User size={20} />
                <span>Thông tin cá nhân</span>
              </button>
              <button
                className={`nav-item ${
                  activeTab === "addresses" ? "active" : ""
                }`}
                onClick={() => handleTabChange("addresses")}
              >
                <MapPin size={20} />
                <span>Địa chỉ của tôi</span>
              </button>
              <button
                className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
                onClick={() => handleTabChange("orders")}
              >
                <Package size={20} />
                <span>Đơn hàng của tôi</span>
              </button>
              <button
                className={`nav-item ${
                  activeTab === "security" ? "active" : ""
                }`}
                onClick={() => handleTabChange("security")}
              >
                <Shield size={20} />
                <span>Bảo mật</span>
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="profile-content">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Thông tin cá nhân</h2>
                  {!isEditing ? (
                    <button
                      className="btn-edit"
                      onClick={handleEditProfile}
                      disabled={loading}
                    >
                      <Edit2 size={16} />
                      Chỉnh sửa
                    </button>
                  ) : (
                    <div className="edit-actions">
                      <button
                        className="btn-cancel"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        <X size={16} />
                        Hủy
                      </button>
                      <button
                        className="btn-save"
                        onClick={handleSaveProfile}
                        disabled={loading}
                      >
                        <Save size={16} />
                        {loading ? "Đang lưu..." : "Lưu"}
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-form">
                  <div className="form-group">
                    <label>
                      <User size={20} />
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={
                        isEditing
                          ? editedProfile?.fullName || ""
                          : profile?.fullName || ""
                      }
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      disabled={!isEditing || loading}
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Mail size={20} />
                      Email
                    </label>
                    <input
                      type="email"
                      value={
                        isEditing
                          ? editedProfile?.email || ""
                          : profile?.email || ""
                      }
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      disabled={!isEditing || loading}
                      placeholder="Nhập email"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Phone size={20} />
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={
                        isEditing
                          ? editedProfile?.phone_number || ""
                          : profile?.phone_number || ""
                      }
                      onChange={(e) =>
                        setEditedProfile((prev) => ({
                          ...prev,
                          phone_number: e.target.value,
                        }))
                      }
                      disabled={!isEditing || loading}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Settings size={20} />
                      Vai trò
                    </label>
                    <input
                      type="text"
                      value={
                        profile?.role === "admin"
                          ? "Quản trị viên"
                          : "Khách hàng"
                      }
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <User size={20} />
                      Ngày tham gia
                    </label>
                    <input
                      type="text"
                      value={
                        profile?.created_at
                          ? formatDate(profile.created_at)
                          : ""
                      }
                      disabled
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Địa chỉ của tôi</h2>
                  <button
                    className="btn-add"
                    onClick={() => setShowAddAddress(true)}
                    disabled={loading}
                  >
                    <Plus size={16} />
                    Thêm địa chỉ mới
                  </button>
                </div>

                {loading && addresses.length === 0 ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải địa chỉ...</p>
                  </div>
                ) : (
                  <div className="addresses-list">
                    {addresses.map((address) => (
                      <div key={address.id} className="address-card">
                        <div className="address-header">
                          <div className="address-name">
                            <h4>{address.fullName}</h4>
                            {address.is_default && (
                              <span className="default-badge">Mặc định</span>
                            )}
                          </div>
                          <div className="address-actions">
                            <button
                              className="btn-edit-address"
                              onClick={() => handleEditAddress(address)}
                              disabled={loading}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="btn-delete-address"
                              onClick={() => handleDeleteAddress(address.id)}
                              disabled={loading}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div className="address-details">
                          <p>
                            <Phone size={14} /> {address.phone_number}
                          </p>
                          <p>
                            <MapPin size={14} />
                            {address.address_line1}
                            {address.address_line2 &&
                              `, ${address.address_line2}`}
                            , {address.city}, {address.region}{" "}
                            {address.postal_code}, {address.country}
                          </p>
                        </div>

                        {!address.is_default && (
                          <div className="address-footer">
                            <button
                              className="btn-set-default"
                              onClick={() =>
                                handleSetDefaultAddress(address.id)
                              }
                              disabled={loading}
                            >
                              {loading ? "Đang xử lý..." : "Đặt làm mặc định"}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {addresses.length === 0 && !loading && (
                      <div className="no-data">
                        <MapPin size={48} />
                        <h3>Chưa có địa chỉ nào</h3>
                        <p>Thêm địa chỉ giao hàng để mua sắm dễ dàng hơn</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Add/Edit Address Modal */}
                {(showAddAddress || editingAddress) && (
                  <div className="address-modal-overlay">
                    <div className="address-modal">
                      <div className="modal-header">
                        <h3>
                          {editingAddress
                            ? "Chỉnh sửa địa chỉ"
                            : "Thêm địa chỉ mới"}
                        </h3>
                        <button
                          className="close-btn"
                          onClick={() => {
                            setShowAddAddress(false);
                            setEditingAddress(null);
                            resetAddressForm();
                          }}
                          disabled={loading}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="modal-body">
                        <div className="form-row">
                          <div className="form-group">
                            <label>Họ và tên *</label>
                            <input
                              type="text"
                              value={addressForm.fullName}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  fullName: e.target.value,
                                }))
                              }
                              placeholder="Nhập họ và tên"
                              disabled={loading}
                            />
                          </div>

                          <div className="form-group">
                            <label>Số điện thoại *</label>
                            <input
                              type="tel"
                              value={addressForm.phone_number}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  phone_number: e.target.value,
                                }))
                              }
                              placeholder="Nhập số điện thoại"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Địa chỉ chi tiết *</label>
                          <input
                            type="text"
                            value={addressForm.address_line1}
                            onChange={(e) =>
                              setAddressForm((prev) => ({
                                ...prev,
                                address_line1: e.target.value,
                              }))
                            }
                            placeholder="Số nhà, tên đường"
                            disabled={loading}
                          />
                        </div>

                        <div className="form-group">
                          <label>Địa chỉ bổ sung</label>
                          <input
                            type="text"
                            value={addressForm.address_line2}
                            onChange={(e) =>
                              setAddressForm((prev) => ({
                                ...prev,
                                address_line2: e.target.value,
                              }))
                            }
                            placeholder="Phường, xã (tùy chọn)"
                            disabled={loading}
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Thành phố *</label>
                            <input
                              type="text"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  city: e.target.value,
                                }))
                              }
                              placeholder="Thành phố"
                              disabled={loading}
                            />
                          </div>

                          <div className="form-group">
                            <label>Tỉnh/Thành phố</label>
                            <input
                              type="text"
                              value={addressForm.region}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  region: e.target.value,
                                }))
                              }
                              placeholder="Tỉnh/Thành phố"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Mã bưu điện</label>
                            <input
                              type="text"
                              value={addressForm.postal_code}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  postal_code: e.target.value,
                                }))
                              }
                              placeholder="Mã bưu điện"
                              disabled={loading}
                            />
                          </div>

                          <div className="form-group">
                            <label>Quốc gia</label>
                            <input
                              type="text"
                              value={addressForm.country}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  country: e.target.value,
                                }))
                              }
                              placeholder="Quốc gia"
                              disabled={loading}
                            />
                          </div>
                        </div>

                        <div className="checkbox-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={addressForm.is_default}
                              onChange={(e) =>
                                setAddressForm((prev) => ({
                                  ...prev,
                                  is_default: e.target.checked,
                                }))
                              }
                              disabled={loading}
                            />
                            <span className="checkmark"></span>
                            Đặt làm địa chỉ mặc định
                          </label>
                        </div>
                      </div>

                      <div className="modal-footer">
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            setShowAddAddress(false);
                            setEditingAddress(null);
                            resetAddressForm();
                          }}
                          disabled={loading}
                        >
                          Hủy
                        </button>
                        <button
                          className="btn-save"
                          onClick={
                            editingAddress
                              ? handleUpdateAddress
                              : handleAddAddress
                          }
                          disabled={loading}
                        >
                          {loading
                            ? "Đang xử lý..."
                            : editingAddress
                            ? "Cập nhật"
                            : "Thêm địa chỉ"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Đơn hàng của tôi</h2>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="content-section">
                <div className="section-header">
                  <h2>Bảo mật tài khoản</h2>
                </div>

                <div className="security-options">
                  <div className="security-item">
                    <div className="security-info">
                      <h4>Đổi mật khẩu</h4>
                      <p>Cập nhật mật khẩu để bảo mật tài khoản</p>
                    </div>
                    <button
                      className="btn-security"
                      onClick={() => setShowChangePassword(!showChangePassword)}
                      disabled={loading}
                    >
                      <Lock size={16} />
                      {showChangePassword ? "Hủy" : "Đổi mật khẩu"}
                    </button>
                  </div>

                  {showChangePassword && (
                    <div className="password-form">
                      <div className="form-group">
                        <label>Mật khẩu hiện tại</label>
                        <div className="password-input">
                          <input
                            type={showPassword.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                currentPassword: e.target.value,
                              }))
                            }
                            placeholder="Nhập mật khẩu hiện tại"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                            disabled={loading}
                          >
                            {showPassword.current ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Mật khẩu mới</label>
                        <div className="password-input">
                          <input
                            type={showPassword.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                newPassword: e.target.value,
                              }))
                            }
                            placeholder="Nhập mật khẩu mới"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                            disabled={loading}
                          >
                            {showPassword.new ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Xác nhận mật khẩu mới</label>
                        <div className="password-input">
                          <input
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            placeholder="Xác nhận mật khẩu mới"
                            disabled={loading}
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                            disabled={loading}
                          >
                            {showPassword.confirm ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="password-actions">
                        <button
                          className="btn-cancel"
                          onClick={() => {
                            setShowChangePassword(false);
                            setPasswordForm({
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                          disabled={loading}
                        >
                          Hủy
                        </button>
                        <button
                          className="btn-change-password"
                          onClick={handleChangePassword}
                          disabled={loading}
                        >
                          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CustomerProfile;
