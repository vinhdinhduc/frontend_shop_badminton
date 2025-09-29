// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   User,
//   Mail,
//   Phone,
//   MapPin,
//   Lock,
//   Camera,
//   Edit2,
//   Save,
//   X,
//   Plus,
//   Trash2,
//   Package,
//   Settings,
//   Shield,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import "./CustomerProfile.scss";
// import { toast } from "react-toastify";
// import {
//   getUserProfileAction,
//   updateUserProfileAction,
//   updateAvatarAction,
//   changePasswordAction,
//   getUserAddressesAction,
//   createAddressAction,
//   updateAddressAction,
//   deleteAddressAction,
//   setDefaultAddressAction,
//   getUserOrdersAction,
// } from "../../../redux/actions/profileAction";
// import Navbar from "../../../components/common/Navbar";
// import Footer from "../../../components/common/Footer";

// const CustomerProfile = () => {
//   const [activeTab, setActiveTab] = useState("profile");
//   const [isEditing, setIsEditing] = useState(false);
//   const [showChangePassword, setShowChangePassword] = useState(false);
//   const [showAddAddress, setShowAddAddress] = useState(false);
//   const [editingAddress, setEditingAddress] = useState(null);
//   const [showPassword, setShowPassword] = useState({
//     current: false,
//     new: false,
//     confirm: false,
//   });

//   const fileInputRef = useRef(null);
//   const dispatch = useDispatch();

//   // Redux state
//   const {
//     userProfile,
//     addresses,
//     orders,
//     loading,
//     updateLoading,
//     addressLoading,
//     orderLoading,
//     error,
//   } = useSelector((state) => state.profile);

//   // Form states
//   const [profileForm, setProfileForm] = useState({
//     fullName: "",
//     email: "",
//     phone_number: "",
//   });

//   const [passwordForm, setPasswordForm] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [addressForm, setAddressForm] = useState({
//     fullName: "",
//     phone_number: "",
//     address_line1: "",
//     address_line2: "",
//     city: "",
//     region: "",
//     postal_code: "",
//     country: "Việt Nam",
//     is_default: false,
//   });

//   // Load data on component mount
//   useEffect(() => {
//     dispatch(getUserProfileAction());
//     dispatch(getUserAddressesAction());
//     dispatch(getUserOrdersAction());
//   }, [dispatch]);

//   // Update form when userProfile changes
//   useEffect(() => {
//     if (userProfile) {
//       setProfileForm({
//         fullName: userProfile.fullName || "",
//         email: userProfile.email || "",
//         phone_number: userProfile.phone_number || "",
//       });
//     }
//   }, [userProfile]);

//   // Handlers
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setIsEditing(false);
//     setShowChangePassword(false);
//     setShowAddAddress(false);
//     setEditingAddress(null);
//   };

//   const handleEditProfile = () => {
//     setIsEditing(true);
//   };

//   const handleSaveProfile = () => {
//     // Validate form
//     if (
//       !profileForm.fullName ||
//       !profileForm.email ||
//       !profileForm.phone_number
//     ) {
//       toast.error("Vui lòng điền đầy đủ thông tin");
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(profileForm.email)) {
//       toast.error("Email không hợp lệ");
//       return;
//     }

//     // Phone validation
//     const phoneRegex = /^[0-9]{10,11}$/;
//     if (!phoneRegex.test(profileForm.phone_number.replace(/\s/g, ""))) {
//       toast.error("Số điện thoại không hợp lệ");
//       return;
//     }

//     dispatch(updateUserProfileAction(profileForm));
//     setIsEditing(false);
//   };

//   const handleCancelEdit = () => {
//     setProfileForm({
//       fullName: userProfile.fullName || "",
//       email: userProfile.email || "",
//       phone_number: userProfile.phone_number || "",
//     });
//     setIsEditing(false);
//   };

//   const handleAvatarChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("Kích thước ảnh không được vượt quá 5MB");
//         return;
//       }

//       const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
//       if (!allowedTypes.includes(file.type)) {
//         toast.error("Chỉ chấp nhận file ảnh (JPG, PNG, WebP)");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("avatar", file);
//       dispatch(updateAvatarAction(formData));
//     }
//   };

//   const handleChangePassword = () => {
//     if (
//       !passwordForm.currentPassword ||
//       !passwordForm.newPassword ||
//       !passwordForm.confirmPassword
//     ) {
//       toast.error("Vui lòng điền đầy đủ thông tin");
//       return;
//     }

//     if (passwordForm.newPassword !== passwordForm.confirmPassword) {
//       toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
//       return;
//     }

//     if (passwordForm.newPassword.length < 6) {
//       toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
//       return;
//     }

//     dispatch(
//       changePasswordAction({
//         currentPassword: passwordForm.currentPassword,
//         newPassword: passwordForm.newPassword,
//       })
//     );

//     setPasswordForm({
//       currentPassword: "",
//       newPassword: "",
//       confirmPassword: "",
//     });
//     setShowChangePassword(false);
//   };

//   const handleAddAddress = () => {
//     if (
//       !addressForm.fullName ||
//       !addressForm.phone_number ||
//       !addressForm.address_line1 ||
//       !addressForm.city
//     ) {
//       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
//       return;
//     }

//     dispatch(createAddressAction(addressForm));
//     resetAddressForm();
//     setShowAddAddress(false);
//   };

//   const handleEditAddress = (address) => {
//     setAddressForm(address);
//     setEditingAddress(address.id);
//   };

//   const handleUpdateAddress = () => {
//     if (
//       !addressForm.fullName ||
//       !addressForm.phone_number ||
//       !addressForm.address_line1 ||
//       !addressForm.city
//     ) {
//       toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
//       return;
//     }

//     dispatch(updateAddressAction(editingAddress, addressForm));
//     resetAddressForm();
//     setEditingAddress(null);
//   };

//   const handleDeleteAddress = (id) => {
//     if (addresses.length === 1) {
//       toast.error("Không thể xóa địa chỉ cuối cùng");
//       return;
//     }

//     if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
//       dispatch(deleteAddressAction(id));
//     }
//   };

//   const handleSetDefaultAddress = (id) => {
//     dispatch(setDefaultAddressAction(id));
//   };

//   const resetAddressForm = () => {
//     setAddressForm({
//       fullName: "",
//       phone_number: "",
//       address_line1: "",
//       address_line2: "",
//       city: "",
//       region: "",
//       postal_code: "",
//       country: "Việt Nam",
//       is_default: false,
//     });
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("vi-VN", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     });
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(amount);
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "pending":
//         return "Chờ xác nhận";
//       case "processing":
//         return "Đang xử lý";
//       case "shipped":
//         return "Đang giao hàng";
//       case "delivered":
//         return "Đã giao hàng";
//       case "cancelled":
//         return "Đã hủy";
//       default:
//         return status;
//     }
//   };

//   if (loading && !userProfile) {
//     return (
//       <div className="customer-profile">
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Đang tải thông tin...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <div className="customer-profile">
//         <div className="profile-container">
//           {/* Sidebar */}
//           <div className="profile-sidebar">
//             <div className="user-info-card">
//               <div className="avatar-section">
//                 <div className="avatar-container">
//                   {userProfile?.avatar ? (
//                     <img
//                       src={userProfile.avatar}
//                       alt="Avatar"
//                       className="avatar"
//                     />
//                   ) : (
//                     <div className="avatar-placeholder">
//                       <User size={40} />
//                     </div>
//                   )}
//                   <button
//                     className="avatar-edit-btn"
//                     onClick={() => fileInputRef.current?.click()}
//                     disabled={updateLoading}
//                   >
//                     <Camera size={16} />
//                   </button>
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     onChange={handleAvatarChange}
//                     accept="image/*"
//                     style={{ display: "none" }}
//                   />
//                 </div>
//                 <div className="user-details">
//                   <h3>{userProfile?.fullName || "Người dùng"}</h3>
//                   <p>{userProfile?.email || "email@example.com"}</p>
//                 </div>
//               </div>
//             </div>

//             <nav className="profile-nav">
//               <button
//                 className={`nav-item ${
//                   activeTab === "profile" ? "active" : ""
//                 }`}
//                 onClick={() => handleTabChange("profile")}
//               >
//                 <User size={20} />
//                 <span>Thông tin cá nhân</span>
//               </button>
//               <button
//                 className={`nav-item ${
//                   activeTab === "addresses" ? "active" : ""
//                 }`}
//                 onClick={() => handleTabChange("addresses")}
//               >
//                 <MapPin size={20} />
//                 <span>Địa chỉ của tôi</span>
//               </button>
//               <button
//                 className={`nav-item ${activeTab === "orders" ? "active" : ""}`}
//                 onClick={() => handleTabChange("orders")}
//               >
//                 <Package size={20} />
//                 <span>Đơn hàng của tôi</span>
//               </button>
//               <button
//                 className={`nav-item ${
//                   activeTab === "security" ? "active" : ""
//                 }`}
//                 onClick={() => handleTabChange("security")}
//               >
//                 <Shield size={20} />
//                 <span>Bảo mật</span>
//               </button>
//             </nav>
//           </div>

//           {/* Main Content */}
//           <div className="profile-content">
//             {/* Profile Tab */}
//             {activeTab === "profile" && (
//               <div className="content-section">
//                 <div className="section-header">
//                   <h2>Thông tin cá nhân</h2>
//                   {!isEditing ? (
//                     <button
//                       className="btn-edit"
//                       onClick={handleEditProfile}
//                       disabled={updateLoading}
//                     >
//                       <Edit2 size={16} />
//                       Chỉnh sửa
//                     </button>
//                   ) : (
//                     <div className="edit-actions">
//                       <button
//                         className="btn-cancel"
//                         onClick={handleCancelEdit}
//                         disabled={updateLoading}
//                       >
//                         <X size={16} />
//                         Hủy
//                       </button>
//                       <button
//                         className="btn-save"
//                         onClick={handleSaveProfile}
//                         disabled={updateLoading}
//                       >
//                         <Save size={16} />
//                         {updateLoading ? "Đang lưu..." : "Lưu"}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <div className="profile-form">
//                   <div className="form-group">
//                     <label>
//                       <User size={20} />
//                       Họ và tên
//                     </label>
//                     <input
//                       type="text"
//                       value={profileForm.fullName}
//                       onChange={(e) =>
//                         setProfileForm((prev) => ({
//                           ...prev,
//                           fullName: e.target.value,
//                         }))
//                       }
//                       disabled={!isEditing || updateLoading}
//                       placeholder="Nhập họ và tên"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>
//                       <Mail size={20} />
//                       Email
//                     </label>
//                     <input
//                       type="email"
//                       value={profileForm.email}
//                       onChange={(e) =>
//                         setProfileForm((prev) => ({
//                           ...prev,
//                           email: e.target.value,
//                         }))
//                       }
//                       disabled={!isEditing || updateLoading}
//                       placeholder="Nhập email"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>
//                       <Phone size={20} />
//                       Số điện thoại
//                     </label>
//                     <input
//                       type="tel"
//                       value={profileForm.phone_number}
//                       onChange={(e) =>
//                         setProfileForm((prev) => ({
//                           ...prev,
//                           phone_number: e.target.value,
//                         }))
//                       }
//                       disabled={!isEditing || updateLoading}
//                       placeholder="Nhập số điện thoại"
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>
//                       <Settings size={20} />
//                       Vai trò
//                     </label>
//                     <input
//                       type="text"
//                       value={
//                         userProfile?.role === "admin"
//                           ? "Quản trị viên"
//                           : "Khách hàng"
//                       }
//                       disabled
//                     />
//                   </div>

//                   <div className="form-group">
//                     <label>
//                       <User size={20} />
//                       Ngày tham gia
//                     </label>
//                     <input
//                       type="text"
//                       value={
//                         userProfile?.created_at
//                           ? formatDate(userProfile.created_at)
//                           : ""
//                       }
//                       disabled
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Addresses Tab */}
//             {activeTab === "addresses" && (
//               <div className="content-section">
//                 <div className="section-header">
//                   <h2>Địa chỉ của tôi</h2>
//                   <button
//                     className="btn-add"
//                     onClick={() => setShowAddAddress(true)}
//                     disabled={addressLoading}
//                   >
//                     <Plus size={16} />
//                     Thêm địa chỉ mới
//                   </button>
//                 </div>

//                 {addressLoading && addresses.length === 0 ? (
//                   <div className="loading-container">
//                     <div className="loading-spinner"></div>
//                     <p>Đang tải địa chỉ...</p>
//                   </div>
//                 ) : (
//                   <div className="addresses-list">
//                     {addresses.map((address) => (
//                       <div key={address.id} className="address-card">
//                         <div className="address-header">
//                           <div className="address-name">
//                             <h4>{address.fullName}</h4>
//                             {address.is_default && (
//                               <span className="default-badge">Mặc định</span>
//                             )}
//                           </div>
//                           <div className="address-actions">
//                             <button
//                               className="btn-edit-address"
//                               onClick={() => handleEditAddress(address)}
//                               disabled={addressLoading}
//                             >
//                               <Edit2 size={14} />
//                             </button>
//                             <button
//                               className="btn-delete-address"
//                               onClick={() => handleDeleteAddress(address.id)}
//                               disabled={addressLoading}
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           </div>
//                         </div>

//                         <div className="address-details">
//                           <p>
//                             <Phone size={14} /> {address.phone_number}
//                           </p>
//                           <p>
//                             <MapPin size={14} />
//                             {address.address_line1}
//                             {address.address_line2 &&
//                               `, ${address.address_line2}`}
//                             , {address.city}, {address.region}{" "}
//                             {address.postal_code}, {address.country}
//                           </p>
//                         </div>

//                         {!address.is_default && (
//                           <div className="address-footer">
//                             <button
//                               className="btn-set-default"
//                               onClick={() =>
//                                 handleSetDefaultAddress(address.id)
//                               }
//                               disabled={addressLoading}
//                             >
//                               {addressLoading
//                                 ? "Đang xử lý..."
//                                 : "Đặt làm mặc định"}
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}

//                     {addresses.length === 0 && !addressLoading && (
//                       <div className="no-data">
//                         <MapPin size={48} />
//                         <h3>Chưa có địa chỉ nào</h3>
//                         <p>Thêm địa chỉ giao hàng để mua sắm dễ dàng hơn</p>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {/* Add/Edit Address Modal */}
//                 {(showAddAddress || editingAddress) && (
//                   <div className="modal-overlay">
//                     <div className="address-modal">
//                       <div className="modal-header">
//                         <h3>
//                           {editingAddress
//                             ? "Chỉnh sửa địa chỉ"
//                             : "Thêm địa chỉ mới"}
//                         </h3>
//                         <button
//                           className="close-btn"
//                           onClick={() => {
//                             setShowAddAddress(false);
//                             setEditingAddress(null);
//                             resetAddressForm();
//                           }}
//                           disabled={addressLoading}
//                         >
//                           <X size={20} />
//                         </button>
//                       </div>

//                       <div className="modal-body">
//                         <div className="form-row">
//                           <div className="form-group">
//                             <label>Họ và tên *</label>
//                             <input
//                               type="text"
//                               value={addressForm.fullName}
//                               onChange={(e) =>
//                                 setAddressForm((prev) => ({
//                                   ...prev,
//                                   fullName: e.target.value,
//                                 }))
//                               }
//                               placeholder="Nhập họ và tên"
//                               disabled={addressLoading}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label>Số điện thoại *</label>
//                             <input
//                               type="tel"
//                               value={addressForm.phone_number}
//                               onChange={(e) =>
//                                 setAddressForm((prev) => ({
//                                   ...prev,
//                                   phone_number: e.target.value,
//                                 }))
//                               }
//                               placeholder="Nhập số điện thoại"
//                               disabled={addressLoading}
//                             />
//                           </div>
//                         </div>

//                         <div className="form-group">
//                           <label>Địa chỉ chi tiết *</label>
//                           <input
//                             type="text"
//                             value={addressForm.address_line1}
//                             onChange={(e) =>
//                               setAddressForm((prev) => ({
//                                 ...prev,
//                                 address_line1: e.target.value,
//                               }))
//                             }
//                             placeholder="Số nhà, tên đường"
//                             disabled={addressLoading}
//                           />
//                         </div>

//                         <div className="form-group">
//                           <label>Địa chỉ bổ sung</label>
//                           <input
//                             type="text"
//                             value={addressForm.address_line2}
//                             onChange={(e) =>
//                               setAddressForm((prev) => ({
//                                 ...prev,
//                                 address_line2: e.target.value,
//                               }))
//                             }
//                             placeholder="Phường, xã (tùy chọn)"
//                             disabled={addressLoading}
//                           />
//                         </div>

//                         <div className="form-row">
//                           <div className="form-group">
//                             <label>Thành phố *</label>
//                             <input
//                               type="text"
//                               value={addressForm.city}
//                               onChange={(e) =>
//                                 setAddressForm((prev) => ({
//                                   ...prev,
//                                   city: e.target.value,
//                                 }))
//                               }
//                               placeholder="Thành phố"
//                               disabled={addressLoading}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label>Tỉnh/Thành phố</label>
//                             <input
//                               type="text"
//                               value={addressForm.region}
//                               onChange={(e) =>
//                                 setAddressForm((prev) => ({
//                                   ...prev,
//                                   region: e.target.value,
//                                 }))
//                               }
//                               placeholder="Tỉnh/Thành phố"
//                               disabled={addressLoading}
//                             />
//                           </div>
//                         </div>

//                         <div className="form-row">
//                           <div className="form-group">
//                             <label>Mã bưu điện</label>
//                             <input
//                               type="text"
//                               value={addressForm.postal_code}
//                               onChange={(e) =>
//                                 setAddressForm((prev) => ({
//                                   ...prev,
//                                   postal_code: e.target.value,
//                                 }))
//                               }
//                               placeholder="Mã bưu điện"
//                               disabled={addressLoading}
//                             />
//                           </div>

//                           <div className="form-group">
//                             <label>Quốc gia</label>
//                             <input
//                               type="text"
//                               value={addressForm.country}
//                               onChange={(e) =>
//                                 setAddressForm((prev) => ({
//                                   ...prev,
//                                   country: e.target.value,
//                                 }))
//                               }
//                               placeholder="Quốc gia"
//                               disabled={addressLoading}
//                             />
//                           </div>
//                         </div>

//                         <div className="checkbox-group">
//                           <label className="checkbox-label">
//                             <input
//                               type="checkbox"
//                               checked={addressForm.is_default}
//                               onChange={(e) =>
//                                 setAddressForm((prev) => ({
//                                   ...prev,
//                                   is_default: e.target.checked,
//                                 }))
//                               }
//                               disabled={addressLoading}
//                             />
//                             <span className="checkmark"></span>
//                             Đặt làm địa chỉ mặc định
//                           </label>
//                         </div>
//                       </div>

//                       <div className="modal-footer">
//                         <button
//                           className="btn-cancel"
//                           onClick={() => {
//                             setShowAddAddress(false);
//                             setEditingAddress(null);
//                             resetAddressForm();
//                           }}
//                           disabled={addressLoading}
//                         >
//                           Hủy
//                         </button>
//                         <button
//                           className="btn-save"
//                           onClick={
//                             editingAddress
//                               ? handleUpdateAddress
//                               : handleAddAddress
//                           }
//                           disabled={addressLoading}
//                         >
//                           {addressLoading
//                             ? "Đang xử lý..."
//                             : editingAddress
//                             ? "Cập nhật"
//                             : "Thêm địa chỉ"}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Orders Tab */}
//             {activeTab === "orders" && (
//               <div className="content-section">
//                 <div className="section-header">
//                   <h2>Đơn hàng của tôi</h2>
//                   <button
//                     className="btn-refresh"
//                     onClick={() => dispatch(getUserOrdersAction())}
//                     disabled={orderLoading}
//                   >
//                     {orderLoading ? "Đang tải..." : "Làm mới"}
//                   </button>
//                 </div>

//                 {orderLoading && orders.length === 0 ? (
//                   <div className="loading-container">
//                     <div className="loading-spinner"></div>
//                     <p>Đang tải đơn hàng...</p>
//                   </div>
//                 ) : (
//                   <div className="orders-list">
//                     {orders.map((order) => (
//                       <div key={order.id} className="order-card">
//                         <div className="order-header">
//                           <div className="order-info">
//                             <h4>Đơn hàng #{order.order_code}</h4>
//                             <span className="order-date">
//                               {formatDate(order.created_at)}
//                             </span>
//                           </div>
//                           <div className={`order-status ${order.status}`}>
//                             {getStatusText(order.status)}
//                           </div>
//                         </div>

//                         <div className="order-items">
//                           {order.items?.map((item, index) => (
//                             <div key={index} className="order-item">
//                               <span className="item-name">
//                                 {item.product_name}
//                               </span>
//                               <span className="item-quantity">
//                                 x{item.quantity}
//                               </span>
//                               <span className="item-price">
//                                 {formatCurrency(item.unit_price)}
//                               </span>
//                             </div>
//                           ))}
//                         </div>

//                         <div className="order-footer">
//                           <div className="order-total">
//                             Tổng tiền:{" "}
//                             <strong>{formatCurrency(order.order_total)}</strong>
//                           </div>
//                           <button className="btn-view-order">
//                             <Eye size={16} />
//                             Xem chi tiết
//                           </button>
//                         </div>
//                       </div>
//                     ))}

//                     {orders.length === 0 && !orderLoading && (
//                       <div className="no-data">
//                         <Package size={48} />
//                         <h3>Chưa có đơn hàng nào</h3>
//                         <p>Bạn chưa có đơn hàng nào. Hãy mua sắm ngay!</p>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Security Tab */}
//             {activeTab === "security" && (
//               <div className="content-section">
//                 <div className="section-header">
//                   <h2>Bảo mật tài khoản</h2>
//                 </div>

//                 <div className="security-options">
//                   <div className="security-item">
//                     <div className="security-info">
//                       <h4>Đổi mật khẩu</h4>
//                       <p>Cập nhật mật khẩu để bảo mật tài khoản</p>
//                     </div>
//                     <button
//                       className="btn-security"
//                       onClick={() => setShowChangePassword(!showChangePassword)}
//                       disabled={updateLoading}
//                     >
//                       <Lock size={16} />
//                       {showChangePassword ? "Hủy" : "Đổi mật khẩu"}
//                     </button>
//                   </div>

//                   {showChangePassword && (
//                     <div className="password-form">
//                       <div className="form-group">
//                         <label>Mật khẩu hiện tại</label>
//                         <div className="password-input">
//                           <input
//                             type={showPassword.current ? "text" : "password"}
//                             value={passwordForm.currentPassword}
//                             onChange={(e) =>
//                               setPasswordForm((prev) => ({
//                                 ...prev,
//                                 currentPassword: e.target.value,
//                               }))
//                             }
//                             placeholder="Nhập mật khẩu hiện tại"
//                             disabled={updateLoading}
//                           />
//                           <button
//                             type="button"
//                             className="password-toggle"
//                             onClick={() =>
//                               setShowPassword((prev) => ({
//                                 ...prev,
//                                 current: !prev.current,
//                               }))
//                             }
//                             disabled={updateLoading}
//                           >
//                             {showPassword.current ? (
//                               <EyeOff size={16} />
//                             ) : (
//                               <Eye size={16} />
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       <div className="form-group">
//                         <label>Mật khẩu mới</label>
//                         <div className="password-input">
//                           <input
//                             type={showPassword.new ? "text" : "password"}
//                             value={passwordForm.newPassword}
//                             onChange={(e) =>
//                               setPasswordForm((prev) => ({
//                                 ...prev,
//                                 newPassword: e.target.value,
//                               }))
//                             }
//                             placeholder="Nhập mật khẩu mới"
//                             disabled={updateLoading}
//                           />
//                           <button
//                             type="button"
//                             className="password-toggle"
//                             onClick={() =>
//                               setShowPassword((prev) => ({
//                                 ...prev,
//                                 new: !prev.new,
//                               }))
//                             }
//                             disabled={updateLoading}
//                           >
//                             {showPassword.new ? (
//                               <EyeOff size={16} />
//                             ) : (
//                               <Eye size={16} />
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       <div className="form-group">
//                         <label>Xác nhận mật khẩu mới</label>
//                         <div className="password-input">
//                           <input
//                             type={showPassword.confirm ? "text" : "password"}
//                             value={passwordForm.confirmPassword}
//                             onChange={(e) =>
//                               setPasswordForm((prev) => ({
//                                 ...prev,
//                                 confirmPassword: e.target.value,
//                               }))
//                             }
//                             placeholder="Xác nhận mật khẩu mới"
//                             disabled={updateLoading}
//                           />
//                           <button
//                             type="button"
//                             className="password-toggle"
//                             onClick={() =>
//                               setShowPassword((prev) => ({
//                                 ...prev,
//                                 confirm: !prev.confirm,
//                               }))
//                             }
//                             disabled={updateLoading}
//                           >
//                             {showPassword.confirm ? (
//                               <EyeOff size={16} />
//                             ) : (
//                               <Eye size={16} />
//                             )}
//                           </button>
//                         </div>
//                       </div>

//                       <div className="password-actions">
//                         <button
//                           className="btn-cancel"
//                           onClick={() => {
//                             setShowChangePassword(false);
//                             setPasswordForm({
//                               currentPassword: "",
//                               newPassword: "",
//                               confirmPassword: "",
//                             });
//                           }}
//                           disabled={updateLoading}
//                         >
//                           Hủy
//                         </button>
//                         <button
//                           className="btn-change-password"
//                           onClick={handleChangePassword}
//                           disabled={updateLoading}
//                         >
//                           {updateLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default CustomerProfile;
