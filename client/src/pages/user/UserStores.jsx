import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const UserStores = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [stores, setStores] = useState([]);

  const [search, setSearch] = useState("");

  const [sortBy, setSortBy] = useState("name");
  const [order, setOrder] = useState("ASC");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search) {
        params.append("name", search);
      }

      const response = await api.get(`/user/stores?${params.toString()}`);

      let fetchedStores = response.data.stores || [];

      // Backend currently sorts by name.
      // Apply frontend sorting for all available options.
      fetchedStores.sort((a, b) => {
        let valueA;
        let valueB;

        if (sortBy === "overallRating") {
          valueA = Number(a.overallRating);
          valueB = Number(b.overallRating);
        } else {
          valueA = String(a[sortBy] || "").toLowerCase();
          valueB = String(b[sortBy] || "").toLowerCase();
        }

        if (valueA < valueB) {
          return order === "ASC" ? -1 : 1;
        }

        if (valueA > valueB) {
          return order === "ASC" ? 1 : -1;
        }

        return 0;
      });

      setStores(fetchedStores);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  const handleSearch = (event) => {
    event.preventDefault();
    fetchStores();
  };

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

  return (
    <div className="min-vh-100 bg-white">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
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

      {/* Main Content */}
      <div className="container py-5">
        {/* Header */}
        <div className="mb-4">
          <h1 className="fw-bold">Stores</h1>

          <p className="text-secondary">
            Browse stores and submit your ratings.
          </p>
        </div>

        {/* Search & Sort */}
        <div className="card border-dark shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSearch}>
              <div className="row g-3 align-items-end">
                {/* Search */}
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Search</label>

                  <input
                    type="text"
                    className="form-control border-dark"
                    placeholder="Search stores..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />
                </div>

                {/* Sort */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Sort By</label>

                  <select
                    className="form-select border-dark"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    <option value="name">Name</option>

                    <option value="email">Email</option>

                    <option value="address">Address</option>

                    <option value="overallRating">Rating</option>
                  </select>
                </div>

                {/* Order */}
                <div className="col-md-3">
                  <label className="form-label fw-semibold">Order</label>

                  <select
                    className="form-select border-dark"
                    value={order}
                    onChange={(event) => setOrder(event.target.value)}
                  >
                    <option value="ASC">Ascending</option>

                    <option value="DESC">Descending</option>
                  </select>
                </div>

                {/* Search Button */}
                <div className="col-12">
                  <button type="submit" className="btn btn-dark">
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Error */}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-dark" role="status"></div>

            <p className="mt-3 text-secondary">Loading stores...</p>
          </div>
        ) : stores.length === 0 ? (
          /* No Stores */
          <div className="text-center py-5">
            <p className="text-secondary">No stores found.</p>
          </div>
        ) : (
          /* Store Cards */
          <div className="row g-4">
            {stores.map((store) => (
              <div className="col-md-6 col-lg-4" key={store.id}>
                <div className="card border-dark shadow-sm h-100">
                  <div className="card-body d-flex flex-column">
                    {/* Store Name */}
                    <h5 className="fw-bold">{store.name}</h5>

                    {/* Email */}
                    <p className="text-secondary mb-1">{store.email}</p>

                    {/* Address */}
                    <p className="text-secondary">{store.address}</p>

                    <hr />

                    {/* Overall Rating */}
                    <div className="mb-3">
                      <small className="text-secondary">Overall Rating</small>

                      <div className="fw-semibold">
                        {renderStars(store.overallRating)}

                        <span className="ms-2">
                          {Number(store.overallRating).toFixed(1)}
                        </span>
                      </div>
                    </div>

                    {/* User Rating */}
                    <div className="mb-4">
                      <small className="text-secondary">Your Rating</small>

                      <div className="fw-semibold">
                        {store.userRating > 0
                          ? `${store.userRating}/5`
                          : "Not rated yet"}
                      </div>
                    </div>

                    {/* Rate / Update Button */}
                    <button
                      className="btn btn-dark mt-auto"
                      onClick={() =>
                        navigate(`/user/stores/${store.id}/rate`, {
                          state: {
                            store,
                          },
                        })
                      }
                    >
                      {store.userRating > 0 ? "Update Rating" : "Rate Store"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserStores;
