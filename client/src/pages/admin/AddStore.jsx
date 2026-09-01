import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import AdminNavbar from "../../components/AdminNavbar";

const AddStore = () => {
  const navigate = useNavigate();

  const [owners, setOwners] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [loading, setLoading] = useState(false);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const response = await api.get("/admin/store-owners");

        setOwners(response.data.owners || []);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load store owners.",
        );
      } finally {
        setOwnersLoading(false);
      }
    };

    fetchOwners();
  }, []);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post("/admin/stores", formData);

      setSuccess(response.data.message || "Store created successfully.");

      setFormData({
        name: "",
        email: "",
        address: "",
        ownerId: "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create store.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AdminNavbar />

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="mb-4">
              <h1 className="fw-bold">Add Store</h1>

              <p className="text-secondary">
                Register a new store and assign its owner.
              </p>
            </div>

            <div className="card border-dark shadow-sm">
              <div className="card-body p-4">
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Store Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        className="form-control border-dark"
                        placeholder="Enter store name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        Store Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        className="form-control border-dark"
                        placeholder="Enter store email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Address</label>

                      <textarea
                        name="address"
                        rows="3"
                        className="form-control border-dark"
                        placeholder="Enter store address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Store Owner
                      </label>

                      <select
                        name="ownerId"
                        className="form-select border-dark"
                        value={formData.ownerId}
                        onChange={handleChange}
                        required
                        disabled={ownersLoading}
                      >
                        <option value="">
                          {ownersLoading
                            ? "Loading store owners..."
                            : "Select Store Owner"}
                        </option>

                        {owners.map((owner) => (
                          <option key={owner.id} value={owner.id}>
                            {owner.name} — {owner.email}
                          </option>
                        ))}
                      </select>

                      {!ownersLoading && owners.length === 0 && (
                        <small className="text-danger">
                          No store owners available. Create one first.
                        </small>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() => navigate("/admin/stores")}
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      className="btn btn-dark"
                      disabled={loading || ownersLoading || owners.length === 0}
                    >
                      {loading ? "Creating..." : "Create Store"}
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

export default AddStore;
