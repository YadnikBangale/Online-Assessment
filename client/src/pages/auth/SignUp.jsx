import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/auth/signup", formData);

      setSuccess(response.data.message || "User registered successfully.");

      setFormData({
        name: "",
        email: "",
        address: "",
        password: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-white d-flex align-items-center">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="fw-bold">ShopOps</h1>

              <p className="text-secondary">Create your user account</p>
            </div>

            {/* Card */}
            <div className="card border-dark shadow-sm">
              <div className="card-body p-4 p-lg-5">
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label fw-semibold">
                      Full Name
                    </label>

                    <input
                      id="name"
                      type="text"
                      name="name"
                      className="form-control border-dark"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />

                    <small className="text-secondary">
                      Name must be 20–60 characters.
                    </small>
                  </div>

                  {/* Email */}
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

                  {/* Address */}
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label fw-semibold">
                      Address
                    </label>

                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      className="form-control border-dark"
                      placeholder="Enter your address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />

                    <small className="text-secondary">
                      Maximum 400 characters.
                    </small>
                  </div>

                  {/* Password */}
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
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />

                    <small className="text-secondary">
                      8–16 characters, with at least one uppercase letter and
                      one special character.
                    </small>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="btn btn-dark w-100"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>

                {/* Login */}
                <div className="text-center mt-4">
                  <span className="text-secondary">
                    Already have an account?{" "}
                  </span>

                  <button
                    type="button"
                    className="btn btn-link text-dark fw-semibold p-0"
                    onClick={() => navigate("/login")}
                  >
                    Login
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

export default Signup;
