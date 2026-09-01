import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const { token, user } = response.data;

      login(token, user);

      if (user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (user.role === "STORE_OWNER") {
        navigate("/store-owner/dashboard");
      } else {
        navigate("/user/stores");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-white">
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <span
            className="navbar-brand fw-bold"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            ShopOps
          </span>

          <button
            type="button"
            className="btn btn-outline-light btn-sm"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Login Section */}
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="text-center mb-4">
              <h1 className="fw-bold">Welcome Back</h1>

              <p className="text-secondary">Login to your ShopOps account</p>
            </div>

            <div className="card border-dark shadow-sm">
              <div className="card-body p-4">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control border-dark"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold"
                    >
                      Password
                    </label>

                    <input
                      id="password"
                      type="password"
                      name="password"
                      className="form-control border-dark"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-secondary">
                    Don't have an account?{" "}
                  </span>

                  <button
                    type="button"
                    className="btn btn-link text-dark fw-semibold p-0"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
