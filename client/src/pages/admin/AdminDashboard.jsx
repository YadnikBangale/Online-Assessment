import { useEffect, useState } from "react";
import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");

        setStats({
          users: response.data.totalUsers,
          stores: response.data.totalStores,
          ratings: response.data.totalRatings,
        });
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-dark" role="status"></div>
        <p className="mt-3 text-secondary">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
    <AdminNavbar/>
      <div className="container py-5">
        <div className="mb-5">
          <h1 className="fw-bold">Admin Dashboard</h1>
          <p className="text-secondary">Overview of the platform</p>
        </div>

        {error && <div className="alert alert-dark">{error}</div>}

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-dark shadow-sm h-100">
              <div className="card-body p-4">
                <p className="text-secondary mb-2">TOTAL USERS</p>

                <h2 className="display-5 fw-bold">{stats.users}</h2>

                <p className="text-secondary mb-0">Registered users</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-dark shadow-sm h-100">
              <div className="card-body p-4">
                <p className="text-secondary mb-2">TOTAL STORES</p>

                <h2 className="display-5 fw-bold">{stats.stores}</h2>

                <p className="text-secondary mb-0">Registered stores</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-dark shadow-sm h-100">
              <div className="card-body p-4">
                <p className="text-secondary mb-2">TOTAL RATINGS</p>

                <h2 className="display-5 fw-bold">{stats.ratings}</h2>

                <p className="text-secondary mb-0">Submitted ratings</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
