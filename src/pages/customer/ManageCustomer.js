import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Phone,
  Shield,
  Calendar,
  X,
  Archive,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ManageCustomer.module.scss";
import CustomerModal from "./CustomerModal";
import { PaginationComponent } from "../../components/ui/Pagination";
import {
  createNewUserAction,
  getAllUser,
  softDeleteUserAction,
  updateUserAction,
} from "../../redux/actions/customerAction";
import { useNavigate } from "react-router-dom";

const ManageCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomerDeleted, setTotalCustomerDeleted] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { arrUsers, loading } = useSelector((state) => state.customerList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(
          getAllUser({ page: 1, limit: 100, search: "", role: "" })
        );
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu users:", error);
      }
    };
    fetchUsers();
  }, [dispatch]);

  useEffect(() => {
    if (arrUsers && arrUsers.data) {
      setCustomers(arrUsers.data?.users);
    }
  }, [arrUsers]);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone_number &&
        customer.phone_number?.includes(searchTerm.toLowerCase()));
    console.log("Ckecl role", customer.role);

    const matchesRole = filterRole === "all" || customer.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalItems = filteredCustomers.length;
  console.log("Check totalItems", totalItems);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log("Check totalPages", totalPages);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  const handleOpenModal = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  const handleSubmitCustomer = async (customerData) => {
    try {
      if (editingCustomer) {
        await dispatch(updateUserAction(editingCustomer.id, customerData));
      } else {
        await dispatch(createNewUserAction(customerData));
      }

      // await dispatch(getAllUser({ page: 1, limit: 100, search: "", role: "" }));
    } catch (error) {
      console.error("Lỗi khi submit customer:", error);
    }
  };

  const handleDeleteCustomer = (customer) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xoá khách hàng ${customer.fullName} ?`
      )
    ) {
      dispatch(softDeleteUserAction(customer.id));
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize) => {
    setItemsPerPage(newPageSize);
    setCurrentPage(1);
  };

  const getRoleText = (role) => {
    return role === "admin" ? "Quản trị viên" : "Người dùng";
  };

  const formatDateTime = (date) => {
    if (!date) return "Chưa có";
    return new Date(date).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const existingEmails = customers.map((customer) => customer.email);
  const getAvatarSrc = (avatar) => {
    if (!avatar) return "/default-avatar.png";

    if (avatar.startsWith("/uploads/avatars/")) {
      return `http://localhost:8080${avatar}`;
    }

    if (avatar.startsWith("data:image") || avatar.startsWith("http")) {
      return avatar;
    }

    return "/default-avatar.png";
  };

  const handleViewDeletedUsers = () => {
    navigate("/admin/trash-customers");
  };

  const deletedUserCounts = totalCustomerDeleted.length;
  if (loading) {
    return (
      <div className={styles["manage-customer"]}>
        <div className={styles["manage-customer-loading"]}>
          <div className={styles["manage-customer-loading-spinner"]}></div>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomerModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        customer={editingCustomer}
        loading={loading}
        onSubmit={handleSubmitCustomer}
        existingEmail={existingEmails}
      />

      <div className={styles["manage-customer"]}>
        <div className={styles["manage-customer-header"]}>
          <h1 className={styles["manage-customer-title"]}>
            Quản lý khách hàng
          </h1>
          <div className={styles["manage-customer-header-actions"]}>
            <button
              className={styles["trash-btn-customer"]}
              onClick={handleViewDeletedUsers}
              title="Xem sản phẩm đã xóa"
            >
              <Archive size={16} />
              Thùng rác
              {deletedUserCounts > 0 && (
                <span className={styles["trash-count-customer"]}>
                  {deletedUserCounts}
                </span>
              )}
            </button>
            <button
              className={styles["manage-customer-add-btn"]}
              onClick={() => handleOpenModal()}
            >
              <Plus size={20} />
              Thêm khách hàng
            </button>
          </div>
        </div>

        <div className={styles["manage-customer-filters"]}>
          <div className={styles["manage-customer-search-box"]}>
            <Search
              size={20}
              className={styles["manage-customer-search-box-icon"]}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles["manage-customer-search-box-input"]}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={styles["manage-customer-role-filter"]}
          >
            <option value="all">Tất cả người dùng</option>
            <option value="customer">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        <div className={styles["manage-customer-table-container"]}>
          {filteredCustomers.length === 0 ? (
            <div className={styles["manage-customer-empty-state"]}>
              <User size={48} />
              <h3>Không tìm thấy khách hàng nào!</h3>
              <p>
                {searchTerm || filterRole !== "all"
                  ? "Không có khách hàng nào khớp với tiêu chí tìm kiếm của bạn."
                  : "Chưa có khách hàng nào trong hệ thống."}
              </p>
            </div>
          ) : (
            <>
              <table className={styles["manage-customer-table"]}>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>ID</th>
                    <th>Tên Khách Hàng</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCustomers.map((customer, index) => (
                    <tr key={customer.id}>
                      <td data-label="STT">{startIndex + index + 1}</td>
                      <td data-label="ID">#{customer.id}</td>
                      <td data-label="Khách hàng">
                        <div className={styles["manage-customer-info"]}>
                          <div
                            className={styles["manage-customer-info-avatar"]}
                          >
                            {customer.avatar ? (
                              <img
                                src={getAvatarSrc(customer.avatar)}
                                alt={customer.fullName}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                  display: "block",
                                }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/default-avatar.png";
                                }}
                              />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div
                            className={styles["manage-customer-info-details"]}
                          >
                            <div
                              className={styles["manage-customer-info-name"]}
                            >
                              {customer.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Email">
                        <span className={styles["manage-customer-email-text"]}>
                          {customer.email}
                        </span>
                      </td>
                      <td data-label="Số điện thoại">
                        {customer.phone_number || <span>Chưa có</span>}
                      </td>
                      <td data-label="Vai trò">
                        <span
                          className={`${styles["manage-customer-role-badge"]} ${
                            styles[
                              `manage-customer-role-badge--${customer.role}`
                            ]
                          }`}
                        >
                          {getRoleText(customer.role)}
                        </span>
                      </td>
                      <td data-label="Ngày tạo">
                        <span title={formatDateTime(customer.created_at)}>
                          {formatDate(customer.created_at)}
                        </span>
                      </td>
                      <td data-label="Thao tác">
                        <div
                          className={styles["manage-customer-action-buttons"]}
                        >
                          <button
                            className={`${styles["manage-customer-action-btn"]} ${styles["manage-customer-action-btn--edit"]}`}
                            title="Chỉnh sửa thông tin"
                            onClick={() => handleOpenModal(customer)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className={`${styles["manage-customer-action-btn"]} ${styles["manage-customer-action-btn--delete"]}`}
                            title="Xoá khách hàng"
                            onClick={() => handleDeleteCustomer(customer)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totalPages > 0 && (
                <PaginationComponent
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                  pageSizeOptions={[5, 10, 20, 50]}
                  showPageInfo={true}
                  showPageSizeSelector={true}
                  maxVisiblePages={5}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageCustomer;
