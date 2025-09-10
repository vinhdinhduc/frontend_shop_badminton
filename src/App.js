import "./App.css";
import { Router, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import { ToastContainer } from "react-toastify";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/admin/Dashboard";
import AddProduct from "./pages/admin/products/AddProduct";
import AdminLayout from "./pages/admin/layout/AdminLayout";
import ProductList from "./pages/user/products/ProductList";
import About from "./components/about/About";
import Contact from "./components/contact/Contact";
import AdminProductList from "./pages/admin/products/AdminProductList";
import EditProduct from "./pages/admin/products/EditProduct";
import AdminDeletedProductList from "./pages/admin/products/trash/AdminDeletedProductList";
import AdminRoute from "./routes/AdminRoute";
import NotFound from "./pages/user/not found/NotFound";
import ManageCustomer from "./pages/customer/ManageCustomer";
import TrashCustomer from "./pages/customer/TrashCustomer";

function App() {
  return (
    <>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/intro" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                {" "}
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="list-products" element={<AdminProductList />} />
            <Route path="customers" element={<ManageCustomer />} />
            <Route
              path="trash-products"
              element={<AdminDeletedProductList />}
            />
            <Route path="trash-customers" element={<TrashCustomer />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="*" element={<NotFound />} />
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
