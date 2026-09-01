import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const RateStore = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const location = useLocation();

  const { user, logout } = useAuth();

  const store = location.state?.store;

  const existingRating = store?.userRating || 0;

  const [rating, setRating] = useState(existingRating);
  const [hoverRating, setHoverRating] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isUpdate = existingRating > 0;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rating < 1 || rating > 5) {
      setError("Please select a rating from 1 to 5.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = "/user/ratings";

      const requestData = {
        storeId: Number(storeId),
        rating: Number(rating),
      };

      let response;

      if (isUpdate) {
        response = await api.patch(endpoint, requestData);
      } else {
        response = await api.post(endpoint, requestData);
      }

      setSuccess(
        response.data.message ||
          (isUpdate
            ? "Rating updated successfully."
            : "Rating submitted successfully."),
      );

      setTimeout(() => {
        navigate("/user/stores");
      }, 1000);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit rating.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
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

      {/* Content */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            <div className="mb-4">
              <button
                className="btn btn-outline-dark btn-sm mb-3"
                onClick={() => navigate("/user/stores")}
              >
                ← Back to Stores
              </button>

              <h1 className="fw-bold">
                {isUpdate ? "Update Rating" : "Rate Store"}
              </h1>

              <p className="text-secondary">
                {isUpdate
                  ? "Update your rating for this store."
                  : "Share your experience with this store."}
              </p>
            </div>

            <div className="card border-dark shadow-sm">
              <div className="card-body p-4 p-lg-5">
                {/* Store Information */}
                <div className="mb-4">
                  <h4 className="fw-bold">{store?.name || "Store"}</h4>

                  {store?.email && (
                    <p className="text-secondary mb-1">{store.email}</p>
                  )}

                  {store?.address && (
                    <p className="text-secondary mb-0">{store.address}</p>
                  )}
                </div>

                <hr />

                {error && <div className="alert alert-danger">{error}</div>}

                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="text-center">
                    <label className="form-label fw-semibold d-block">
                      Your Rating
                    </label>

                    <div
                      className="mb-3"
                      style={{
                        fontSize: "2.5rem",
                        cursor: "pointer",
                        letterSpacing: "5px",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(star)}
                          style={{
                            color:
                              star <= (hoverRating || rating) ? "#000" : "#ddd",
                          }}
                        >
                          ★
                        </span>
                      ))}
                    </div>

                    <p className="text-secondary">
                      {rating === 0 ? "Select a rating" : `${rating} out of 5`}
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100 mt-3"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : isUpdate
                        ? "Update Rating"
                        : "Submit Rating"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateStore;
