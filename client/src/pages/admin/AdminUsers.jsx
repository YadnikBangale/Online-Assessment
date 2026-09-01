import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  });

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");

  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
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

      if (filters.role) {
        params.append("role", filters.role);
      }

      params.append("sortBy", sortBy);
      params.append("order", order);

      const response = await api.get(`/admin/users?${params.toString()}`);

      setUsers(response.data.users);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sortBy, order]);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value,
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchUsers();
  };

  const handleClear = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
      role: "",
    });

    setTimeout(() => {
      fetchUsers();
    }, 0);
  };

  const handleViewDetails = async (userId) => {
    try {
      setDetailsLoading(true);
      setError("");

      const response = await api.get(`/admin/users/${userId}`);

      setSelectedUser(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load user details");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container py-5">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="fw-bold mb-1">Users</h1>

            <p className="text-secondary mb-0">
              View and manage registered users
            </p>
          </div>

          <button
            className="btn btn-dark"
            onClick={() => navigate("/admin/users/add")}
          >
            + Add User
          </button>
        </div>

        {/* Filters */}
        <div className="card border-dark shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Search & Filter</h5>

            <form onSubmit={handleSearch}>
              <div className="row g-3">
                {/* Name */}
                <div className="col-md-3">
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
                <div className="col-md-3">
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
                <div className="col-md-3">
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

                {/* Role */}
                <div className="col-md-3">
                  <label className="form-label">Role</label>

                  <select
                    name="role"
                    className="form-select border-dark"
                    value={filters.role}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Roles</option>

                    <option value="USER">Normal User</option>

                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                {/* Sort By */}
                <div className="col-md-3">
                  <label className="form-label">Sort By</label>

                  <select
                    className="form-select border-dark"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="name">Name</option>

                    <option value="email">Email</option>

                    <option value="address">Address</option>

                    <option value="role">Role</option>
                  </select>
                </div>

                {/* Order */}
                <div className="col-md-3">
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
                <div className="col-md-6 d-flex align-items-end gap-2">
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

        {/* Users Table */}
        <div className="card border-dark shadow-sm">
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-dark" role="status"></div>

                <p className="mt-3 text-secondary">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-secondary mb-0">No users found.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="fw-semibold">{user.name}</td>

                        <td>{user.email}</td>

                        <td>{user.address}</td>

                        <td>
                          <span
                            className={`badge ${
                              user.role === "ADMIN"
                                ? "text-bg-dark"
                                : "text-bg-secondary"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => handleViewDetails(user.id)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* User Details */}
        {detailsLoading && (
          <div className="text-center mt-4">
            <div className="spinner-border text-dark" role="status"></div>
          </div>
        )}

        {selectedUser && !detailsLoading && (
          <div className="card border-dark shadow-sm mt-4">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">User Details</h5>

              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>

            <div className="card-body">
              <div className="row g-4">
                <div className="col-md-6">
                  <small className="text-secondary">Name</small>

                  <p className="fw-semibold mb-0">{selectedUser.user.name}</p>
                </div>

                <div className="col-md-6">
                  <small className="text-secondary">Email</small>

                  <p className="fw-semibold mb-0">{selectedUser.user.email}</p>
                </div>

                <div className="col-md-6">
                  <small className="text-secondary">Address</small>

                  <p className="fw-semibold mb-0">
                    {selectedUser.user.address}
                  </p>
                </div>

                <div className="col-md-6">
                  <small className="text-secondary">Role</small>

                  <p className="fw-semibold mb-0">{selectedUser.user.role}</p>
                </div>
              </div>

              {/* Store Owner Details */}
              {selectedUser.user.role === "STORE_OWNER" && (
                <div className="mt-4">
                  <hr />

                  <h6 className="fw-bold mb-3">Store Information</h6>

                  {selectedUser.stores?.length > 0 ? (
                    selectedUser.stores.map((store) => (
                      <div
                        key={store.storeId}
                        className="border rounded p-3 mb-2"
                      >
                        <div className="fw-semibold">{store.storeName}</div>

                        <div className="text-secondary">
                          Rating: {store.rating}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-secondary">No store assigned.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-3 text-secondary small">
          Showing {users.length} user
          {users.length !== 1 ? "s" : ""}
        </div>
      </div>
    </>
  );
};

export default AdminUsers;
