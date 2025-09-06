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
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import "./ManageCustomer.scss";
import CustomerModal from "./CustomerModal";
import { PaginationComponent } from "../../components/ui/Pagination";
import { getAllUser } from "../../redux/actions/customerAction";

const ManageCustomer = () => {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { arrUsers, loading } = useSelector((state) => state.customerList);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await dispatch(
          getAllUser({ page: 1, limit: 50, search: "", role: "" })
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

  console.log("Check arr", arrUsers);
  console.log("Check customer", customers);
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone_number &&
        customer.phone_number?.includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === "all" || customer.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalItems = filteredCustomers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);
  //reset về trang 1 khi thay đổi filter

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
      }
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
  if (loading) {
    return (
      <div className="manage-customer">
        <div className="loading">
          <div className="loading-spinner"></div>
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
        onSubmit={handleSubmitCustomer}
        existingEmail={existingEmails}
      />

      <div className="manage-customer">
        <div className="manage-customer__header">
          <h1 className="manage-customer__title">Quản lý khách hàng</h1>
          <button
            className="manage-customer__add-btn"
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} />
            Thêm khách hàng
          </button>
        </div>
        <div className="manage-customer__filters">
          <div className="search-box">
            <Search size={20} className="search-box__icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-box__input"
            />
          </div>
          <select
            name=""
            id=""
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="role-filter"
          >
            <option value="all">Tất cả người dùng</option>
            <option value="user">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
        <div className="manage-customer__table-container">
          {filteredCustomers.length === 0 ? (
            <div className="empty-state">
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
              <table className="customer-table">
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
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {customer.avatar ? (
                              <img
                                src={customer.avatar}
                                alt={customer.fullName}
                              />
                            ) : (
                              <User size={20} />
                            )}
                          </div>
                          <div className="customer-details">
                            <div className="customer-name">
                              {customer.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Email">
                        <span className="email-text">{customer.email}</span>
                      </td>
                      <td data-label="Số điện thoại">
                        {customer.phone_number || <span>Chưa có</span>}
                      </td>
                      <td data-label="Vai trò">
                        <span
                          className={`role-badge role-badge--${customer.role}`}
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
                        <div className="action-buttons">
                          <button
                            className="action-btn action-btn--edit"
                            title="Chỉnh sửa thông tin"
                            onClick={() => handleOpenModal(customer)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="action-btn action-btn--delete"
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
              {totalPages > 1 && (
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
