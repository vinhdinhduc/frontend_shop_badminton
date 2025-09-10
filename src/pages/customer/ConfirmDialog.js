import styles from "./TrashCustomer.module.scss";
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
const ConfirmDialog = ({ show, action, onClose }) => {
  if (!show || !action) return null;

  return (
    <div className={styles["confirm-dialog-overlay"]}>
      <div className={styles["confirm-dialog"]}>
        <div className={styles["confirm-dialog-header"]}>
          <div className={styles["confirm-dialog-icon"]}>
            {action.type === "delete" ? (
              <AlertTriangle size={24} />
            ) : (
              <RotateCcw size={24} />
            )}
          </div>
          <h3 className={styles["confirm-dialog-title"]}>{action.title}</h3>
          <button className={styles["confirm-dialog-close"]} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className={styles["confirm-dialog-body"]}>
          <p style={{ whiteSpace: "pre-line" }}>{action.message}</p>
        </div>
        <div className={styles["confirm-dialog-footer"]}>
          <button className={styles["confirm-dialog-cancel"]} onClick={onClose}>
            Hủy
          </button>
          <button
            className={`${styles["confirm-dialog-confirm"]} ${
              action.type === "delete"
                ? styles["confirm-dialog-confirm--danger"]
                : styles["confirm-dialog-confirm--success"]
            }`}
            onClick={() => {
              action.onConfirm();
              onClose();
            }}
          >
            {action.type === "delete" ? "Xóa vĩnh viễn" : "Khôi phục"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;
