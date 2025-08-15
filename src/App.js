import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/auth/Auth";
function App() {
  return (
    <>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </div>
      <ToastContainer
        position="top-right" // Vị trí hiển thị
        autoClose={3000} // Tự đóng sau 3s
        hideProgressBar={false} // Hiện thanh tiến trình
        newestOnTop={false} // Toast mới xuất hiện ở dưới
        closeOnClick // Click vào toast để đóng
        rtl={false} // Hỗ trợ ngôn ngữ RTL
        pauseOnFocusLoss // Tạm dừng khi mất focus
        draggable // Cho phép kéo toast
        pauseOnHover // Tạm dừng khi hover
        theme="colored" // Giao diện màu
      />
    </>
  );
}

export default App;
