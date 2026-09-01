import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const StoreOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [store, setStore] = useState(null);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/store-owner/dashboard");

        setStore(response.data.store);
        setUsers(response.data.users || []);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderStars = (rating) => {
    const value = Math.round(Number(rating));

    return (
      <span>
        {"★".repeat(value)}
        {"☆".repeat(5 - value)}
      </span>
    );
  };

  if (loading) {
    return (
      <>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container">
            <span className="navbar-brand fw-bold">ShopOps</span>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </nav>

        <div className="container py-5 text-center">
          <div className="spinner-border text-dark" role="status"></div>

          <p className="mt-3 text-secondary">Loading dashboard...</p>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span className="navbar-brand fw-bold">ShopOps</span>

          <div className="d-flex align-items-center gap-3">
            <span className="text-white small">{user?.name}</span>

            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="container py-5">
        <div className="mb-5">
          <h1 className="fw-bold">Store Owner Dashboard</h1>

          <p className="text-secondary">
            Overview of your store and customer ratings.
          </p>
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Store Summary */}
        {store && (
          <div className="row g-4 mb-5">
            <div className="col-md-8">
              <div className="card border-dark shadow-sm h-100">
                <div className="card-body p-4">
                  <p className="text-secondary mb-2">YOUR STORE</p>

                  <h2 className="fw-bold">{store.name}</h2>

                  <p className="text-secondary mb-0">Store ID: {store.id}</p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card border-dark shadow-sm h-100">
                <div className="card-body p-4">
                  <p className="text-secondary mb-2">AVERAGE RATING</p>

                  <h2 className="display-5 fw-bold">
                    {Number(store.averageRating).toFixed(1)}
                  </h2>

                  <div className="fs-5">{renderStars(store.averageRating)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Ratings */}
        <div className="card border-dark shadow-sm">
          <div className="card-body p-0">
            <div className="p-4 border-bottom">
              <h4 className="fw-bold mb-1">Customer Ratings</h4>

              <p className="text-secondary mb-0">
                Users who have submitted ratings
              </p>
            </div>

            {users.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-secondary mb-0">No ratings submitted yet.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Rating</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((customer) => (
                      <tr key={customer.id}>
                        <td className="fw-semibold">{customer.name}</td>

                        <td>{customer.email}</td>

                        <td>
                          <span className="me-2">
                            {renderStars(customer.rating)}
                          </span>
                          {customer.rating}/5
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 text-secondary small">
          {users.length} rating
          {users.length !== 1 ? "s" : ""} received
        </div>
      </div>
    </>
  );
};

export default StoreOwnerDashboard;
