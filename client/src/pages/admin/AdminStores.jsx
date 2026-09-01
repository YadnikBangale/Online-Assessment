import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

const AdminStores = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (filters.name) {
        params.append("name", filters.name);
      }

      if (filters.email) {
        params.append("email", filters.email);
      }

      if (filters.address) {
        params.append("address", filters.address);
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      const response = await api.get(`/admin/stores?${params.toString()}`);

      setStores(response.data.stores || []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchStores();
  };

  const handleClear = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
    });

    setTimeout(() => {
      fetchStores();
    }, 0);
  };

  return (
    <>
      <AdminNavbar />

      <div className="container py-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">Stores</h1>

            <p className="text-secondary mb-0">
              View and manage registered stores
            </p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() => navigate("/admin/stores/add")}
          >
            + Add Store
          </button>
        </div>

        {/* Filters */}
        <div className="card border-dark shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Search & Filter</h5>

            <form onSubmit={handleSearch}>
              <div className="row g-3">
                {/* Name */}
                <div className="col-md-4">
                  <label className="form-label">Name</label>

                  <input
                    type="text"
                    name="name"
                    className="form-control border-dark"
                    placeholder="Search by name"
                    value={filters.name}
                    onChange={handleFilterChange}
                  />
                </div>

                {/* Email */}
                <div className="col-md-4">
                  <label className="form-label">Email</label>

                  <input
                    type="text"
                    name="email"
                    className="form-control border-dark"
                    placeholder="Search by email"
                    value={filters.email}
                    onChange={handleFilterChange}
                  />
                </div>

                {/* Address */}
                <div className="col-md-4">
                  <label className="form-label">Address</label>

                  <input
                    type="text"
                    name="address"
                    className="form-control border-dark"
                    placeholder="Search by address"
                    value={filters.address}
                    onChange={handleFilterChange}
                  />
                </div>

                {/* Sort By */}
                <div className="col-md-4">
                  <label className="form-label">Sort By</label>

                  <select
                    className="form-select border-dark"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="name">Name</option>

                    <option value="email">Email</option>

                    <option value="address">Address</option>
                  </select>
                </div>

                {/* Order */}
                <div className="col-md-4">
                  <label className="form-label">Order</label>

                  <select
                    className="form-select border-dark"
                    value={order}
                    onChange={(event) => setOrder(event.target.value)}
                  >
                    <option value="ASC">Ascending</option>

                    <option value="DESC">Descending</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="col-md-4 d-flex align-items-end gap-2">
                  <button type="submit" className="btn btn-dark">
                    Search
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline-dark"
                    onClick={handleClear}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-dark">{error}</div>}

        {/* Store Table */}
        <div className="card border-dark shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>

                <p className="mt-3 text-secondary">Loading stores...</p>
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-secondary mb-0">No stores found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Rating</th>
                    </tr>
                  </thead>

                  <tbody>
                    {stores.map((store) => (
                      <tr key={store.id}>
                        <td className="fw-semibold">{store.name}</td>

                        <td>{store.email}</td>

                        <td>{store.address}</td>

                        <td>{Number(store.rating).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Store Count */}
        <div className="mt-3 text-secondary small">
          Showing {stores.length} store
          {stores.length !== 1 ? "s" : ""}
        </div>
      </div>
    </>
  );
};

export default AdminStores;
