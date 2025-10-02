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
import ProductDetail from "./pages/user/products/ProductDetail";
import OrderManagement from "./pages/admin/order/OrderManagement";
import Cart from "./pages/user/cart/Cart";
import CheckOut from "./pages/user/checkout/CheckOut";
import BrandManagement from "./pages/admin/brand/BrandManagement";
import OrderTracking from "./pages/user/order_user/OrderTracking";
import CustomerProfile from "./pages/user/profile/CustomerProfile";

function App() {
  return (
    <>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<CheckOut />} />
          <Route path="/profile" element={<CustomerProfile />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/view-order" element={<OrderTracking />} />
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
            <Route path="orders" element={<OrderManagement />} />
            <Route path="customers" element={<ManageCustomer />} />
            <Route path="brands" element={<BrandManagement />} />
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
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
}

export default App;
