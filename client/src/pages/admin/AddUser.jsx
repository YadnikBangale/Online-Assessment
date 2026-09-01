import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

const AddUser = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
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
      const response = await api.post("/admin/users", formData);

      setSuccess(response.data.message || "User created successfully.");

      setFormData({
        name: "",
        email: "",
        password: "",
        address: "",
        role: "USER",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="mb-4">
              <h1 className="fw-bold">Add User</h1>

              <p className="text-secondary mb-0">
                Create a new user, administrator, or store owner account.
              </p>
            </div>

            <div className="card border-dark shadow-sm">
              <div className="card-body p-4 p-lg-5">
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label fw-semibold">
                        Name
                      </label>

                      <input
                        id="name"
                        type="text"
                        name="name"
                        className="form-control border-dark"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-semibold">
                        Email
                      </label>

                      <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control border-dark"
                        placeholder="Enter email address"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
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
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="role" className="form-label fw-semibold">
                        Role
                      </label>

                      <select
                        id="role"
                        name="role"
                        className="form-select border-dark"
                        value={formData.role}
                        onChange={handleChange}
                      >
                        <option value="USER">Normal User</option>

                        <option value="ADMIN">Admin</option>

                        <option value="STORE_OWNER">Store Owner</option>
                      </select>
                    </div>

                    <div className="col-12">
                      <label
                        htmlFor="address"
                        className="form-label fw-semibold"
                      >
                        Address
                      </label>

                      <textarea
                        id="address"
                        name="address"
                        className="form-control border-dark"
                        rows="3"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => navigate("/admin/users")}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-dark"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create User"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUser;
