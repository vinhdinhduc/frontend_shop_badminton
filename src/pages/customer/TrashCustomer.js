import React, { useState, useEffect, use } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  User,
  Calendar,
  CheckSquare,
  Square,
  RotateCcw,
  AlertTriangle,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./TrashCustomer.module.scss";
import { PaginationComponent } from "../../components/ui/Pagination";
import {
  getDeletedUsers,
  restoreUserAction,
  permanentDeleteUserAction,
  permanentDeleteMultipleUsersAction,
} from "../../redux/actions/customerAction";
import ConfirmDialog from "./ConfirmDialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const TrashCustomer = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const navigate = useNavigate();
  const { listUserDeleted, loading } = useSelector(
    (state) => state.customerList
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchDeletedUsers();
  }, [dispatch]);

  useEffect(() => {
    if (listUserDeleted && listUserDeleted.data) {
      setDeletedUsers(listUserDeleted.data?.users || []);
    }
  }, [listUserDeleted]);

  const fetchDeletedUsers = async () => {
    try {
      await dispatch(
        getDeletedUsers({ page: 1, limit: 50, search: "", role: "" })
      );
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu users đã xóa:", error);
    }
  };

  const filteredUsers = deletedUsers.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone_number &&
        user.phone_number?.includes(searchTerm.toLowerCase()));

    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  useEffect(() => {
    const currentUserIds = currentUsers.map((user) => user.id);
    const allCurrentSelected =
      currentUserIds.length > 0 &&
      currentUserIds.every((id) => selectedUsers.has(id));
    setIsSelectAll(allCurrentSelected);
  }, [currentUsers, selectedUsers]);
  const handleSelectAll = () => {
    if (isSelectAll) {
      const newSelectedUsers = new Set(selectedUsers);
      currentUsers.forEach((user) => newSelectedUsers.delete(user.id));
      setSelectedUsers(newSelectedUsers);
    } else {
      const newSelected = new Set(selectedUsers);
      currentUsers.forEach((user) => newSelected.add(user.id));
      setSelectedUsers(newSelected);
    }
  };

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleRestoreUser = async (user) => {
    setConfirmAction({
      type: "restore",
      title: "Khôi phục người dùng",
      message: `Bạn có chắc chắn muốn khôi phục người dùng "${user.fullName}"?`,
      onConfirm: async () => {
        try {
          await dispatch(restoreUserAction(user.id));
          await fetchDeletedUsers();
          setSelectedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(user.id);
            return newSet;
          });
        } catch (error) {
          console.error("Lỗi khi khôi phục user:", error);
        }
      },
    });
    setShowConfirmDialog(true);
  };

  const handlePermanentDeleteUser = async (user) => {
    setConfirmAction({
      type: "delete",
      title: "Xoá vĩnh viễn người dùng",
      message: `Bạn có chắc chắn muốn xoá vĩnh viễn người dùng "${user.fullName} không?`,
      onConfirm: async () => {
        try {
          await dispatch(permanentDeleteUserAction(user.id));

          setSelectedUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(user.id);
            return newSet;
          });
        } catch (error) {
          console.error("Lỗi khi xóa vĩnh viễn user:", error);
        }
      },
    });
    setShowConfirmDialog(true);
  };

  const handleRestoreMultiple = async () => {
    if (selectedUsers.size === 0) return;

    const selectedUserNames = deletedUsers
      .filter((user) => selectedUsers.has(user.id))
      .map((user) => user.fullName)
      .join(", ");
    setConfirmAction({
      type: "restore",
      title: "Khôi phục nhiều người dùng",
      message: `Bạn có chắc chắn muốn khôi phục ${selectedUsers.size} người dùng đã chọn?\n\n${selectedUserNames}`,
      onConfirm: async () => {
        try {
          const promises = Array.from(selectedUsers).map((userId) =>
            dispatch(restoreUserAction(userId))
          );
          await Promise.all(promises);
          await fetchDeletedUsers();
          setSelectedUsers(new Set());
        } catch (error) {
          console.error("Lỗi khi khôi phục nhiều user:", error);
        }
      },
    });
    setShowConfirmDialog(true);
  };
  const handlePermanentDeleteMultiple = async () => {
    if (selectedUsers.size === 0) return;

    const selectedUserNames = deletedUsers
      .filter((user) => selectedUsers.has(user.id))
      .map((user) => user.fullName)
      .join(", ");

    setConfirmAction({
      type: "delete",
      title: "Xóa vĩnh viễn nhiều người dùng",
      message: `Bạn có chắc chắn muốn xóa vĩnh viễn ${selectedUsers.size} người dùng đã chọn? Hành động này không thể hoàn tác!\n\n${selectedUserNames}`,
      onConfirm: async () => {
        try {
          await dispatch(
            permanentDeleteMultipleUsersAction(Array.from(selectedUsers))
          );
          await fetchDeletedUsers();
          setSelectedUsers(new Set());
        } catch (error) {
          console.error("Lỗi khi xóa vĩnh viễn nhiều user:", error);
        }
      },
    });
    setShowConfirmDialog(true);
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
  const getAvatarSrc = (avatar) => {
    if (!avatar) return "/default-avatar.png";

    if (avatar.startsWith("/uploads/avatars/")) {
      return `${process.env.REACT_APP_URL_IMAGE}${avatar}`;
    }

    if (avatar.startsWith("data:image") || avatar.startsWith("http")) {
      return avatar;
    }

    return <User size={24} />;
  };

  const handleBackPre = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className={styles["trash-customer"]}>
        <div className={styles["trash-customer-loading"]}>
          <div className={styles["trash-customer-loading-spinner"]}></div>
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }
  return (
    <>
      <ConfirmDialog
        show={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        action={confirmAction}
      />

      <div className={styles["trash-customer"]}>
        <button
          className={styles["trash-customer-back"]}
          onClick={() => handleBackPre()}
        >
          <FontAwesomeIcon icon={faArrowCircleLeft} />
        </button>
        <div className={styles["trash-customer-header"]}>
          <h1 className={styles["trash-customer-title"]}>
            Thùng rác ({deletedUsers.length})
          </h1>
          <button
            className={styles["trash-customer-refresh-btn"]}
            onClick={fetchDeletedUsers}
            disabled={loading}
          >
            <RefreshCw size={20} />
            Làm mới
          </button>
        </div>

        <div className={styles["trash-customer-filters"]}>
          <div className={styles["trash-customer-search-box"]}>
            <Search
              size={20}
              className={styles["trash-customer-search-box-icon"]}
            />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên email hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles["trash-customer-search-box-input"]}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={styles["trash-customer-role-filter"]}
          >
            <option value="all">Tất cả người dùng</option>
            <option value="customer">Người dùng</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>

        {selectedUsers.size > 0 && (
          <div className={styles["trash-customer-bulk-actions"]}>
            <span className={styles["trash-customer-selected-count"]}>
              Đã chọn {selectedUsers.size} người dùng
            </span>
            <div className={styles["trash-customer-bulk-buttons"]}>
              <button
                className={styles["trash-customer-bulk-restore"]}
                onClick={handleRestoreMultiple}
              >
                <RotateCcw size={16} />
                Khôi phục đã chọn
              </button>
              <button
                className={styles["trash-customer-bulk-delete"]}
                onClick={handlePermanentDeleteMultiple}
              >
                <Trash2 size={16} />
                Xóa vĩnh viễn đã chọn
              </button>
            </div>
          </div>
        )}

        <div className={styles["trash-customer-table-container"]}>
          {filteredUsers.length === 0 ? (
            <div className={styles["trash-customer-empty-state"]}>
              <Trash2 size={48} />
              <h3>Thùng rác trống!</h3>
              <p>
                {searchTerm || filterRole !== "all"
                  ? "Không có người dùng nào khớp với tiêu chí tìm kiếm của bạn."
                  : "Không có người dùng nào trong thùng rác."}
              </p>
            </div>
          ) : (
            <>
              <table className={styles["trash-customer-table"]}>
                <thead>
                  <tr>
                    <th>
                      <button
                        className={styles["trash-customer-checkbox"]}
                        onClick={handleSelectAll}
                      >
                        {isSelectAll ? (
                          <CheckSquare size={16} />
                        ) : (
                          <Square size={16} />
                        )}
                      </button>
                    </th>
                    <th>STT</th>
                    <th>ID</th>
                    <th>Tên Khách Hàng</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Ngày xóa</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map((user, index) => (
                    <tr key={user.id}>
                      <td data-label="Chọn">
                        <button
                          className={styles["trash-customer-checkbox"]}
                          onClick={() => handleSelectUser(user.id)}
                        >
                          {selectedUsers.has(user.id) ? (
                            <CheckSquare size={16} />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>
                      <td data-label="STT">{startIndex + index + 1}</td>
                      <td data-label="ID">#{user.id}</td>
                      <td data-label="Khách hàng">
                        <div className={styles["trash-customer-info"]}>
                          <div className={styles["trash-customer-info-avatar"]}>
                            {user.avatar ? (
                              <img
                                src={getAvatarSrc(user.avatar)}
                                alt={user.fullName}
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
                            className={styles["trash-customer-info-details"]}
                          >
                            <div className={styles["trash-customer-info-name"]}>
                              {user.fullName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Email">
                        <span className={styles["trash-customer-email-text"]}>
                          {user.email}
                        </span>
                      </td>
                      <td data-label="Số điện thoại">
                        {user.phone_number || <span>Chưa có</span>}
                      </td>
                      <td data-label="Vai trò">
                        <span
                          className={`${styles["trash-customer-role-badge"]} ${
                            styles[`trash-customer-role-badge--${user.role}`]
                          }`}
                        >
                          {getRoleText(user.role)}
                        </span>
                      </td>
                      <td data-label="Ngày xóa">
                        <span title={formatDateTime(user.deleted_at)}>
                          {formatDate(user.deleted_at)}
                        </span>
                      </td>
                      <td data-label="Thao tác">
                        <div
                          className={styles["trash-customer-action-buttons"]}
                        >
                          <button
                            className={`${styles["trash-customer-action-btn"]} ${styles["trash-customer-action-btn--restore"]}`}
                            title="Khôi phục người dùng"
                            onClick={() => handleRestoreUser(user)}
                          >
                            <RotateCcw size={16} />
                          </button>
                          <button
                            className={`${styles["trash-customer-action-btn"]} ${styles["trash-customer-action-btn--delete"]}`}
                            title="Xóa vĩnh viễn"
                            onClick={() => handlePermanentDeleteUser(user)}
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

export default TrashCustomer;
