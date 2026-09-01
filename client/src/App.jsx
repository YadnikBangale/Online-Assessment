import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/auth/Login";
import AdminStores from "./pages/admin/AdminStores";
import AdminUsers from "./pages/admin/AdminUsers";
import AddUser from "./pages/admin/AddUser";
import AddStore from "./pages/admin/AddStore";
import UserStores from "./pages/user/UserStores";
import RateStore from "./pages/user/RateStore";
import StoreOwnerDashboard from "./pages/storeOwner/StoreOwnerDashboard";
import Signup from "./pages/auth/SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route path="*" element={<Navigate to="/login" replace />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/stores" element={<AdminStores />} />

        <Route path="/admin/users" element={<AdminUsers />} />

        <Route path="/admin/users/add" element={<AddUser />} />

        <Route path="/admin/stores/add" element={<AddStore />} />

        <Route path="/user/stores" element={<UserStores />} />

        <Route path="/user/stores/:storeId/rate" element={<RateStore />} />

        <Route
          path="/store-owner/dashboard"
          element={<StoreOwnerDashboard />}
        />
        
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
