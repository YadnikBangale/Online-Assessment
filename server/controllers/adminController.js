const db = require("../db");
const bcrypt = require("bcryptjs");

const getDashboard = (req, res) => {
  const queries = {
    users: "SELECT COUNT(*) AS totalUsers FROM users",
    stores: "SELECT COUNT(*) AS totalStores FROM stores",
    ratings: "SELECT COUNT(*) AS totalRatings FROM ratings",
  };

  db.query(queries.users, (error, userResult) => {
    if (error) {
      console.error("Users count failed:", error.message);

      return res.status(500).json({
        message: "Server error",
      });
    }

    db.query(queries.stores, (error, storeResult) => {
      if (error) {
        console.error("Stores count failed:", error.message);

        return res.status(500).json({
          message: "Server error",
        });
      }

      db.query(queries.ratings, (error, ratingResult) => {
        if (error) {
          console.error("Ratings count failed:", error.message);

          return res.status(500).json({
            message: "Server error",
          });
        }

        return res.status(200).json({
          totalUsers: userResult[0].totalUsers,
          totalStores: storeResult[0].totalStores,
          totalRatings: ratingResult[0].totalRatings,
        });
      });
    });
  });
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({
        message: "Name must be between 20 and 60 characters",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (address.length > 400) {
      return res.status(400).json({
        message: "Address cannot exceed 400 characters",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    if (!["USER", "ADMIN"].includes(role)) {
      return res.status(400).json({
        message: "Role must be USER or ADMIN",
      });
    }

    const checkEmailSql = `
      SELECT id
      FROM users
      WHERE email = ?
    `;

    db.query(checkEmailSql, [email], async (error, results) => {
      if (error) {
        console.error("Email check failed:", error.message);

        return res.status(500).json({
          message: "Server error",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO users
        (name, email, password, address, role)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(sql, [name, email, hashedPassword, address, role], (error) => {
        if (error) {
          console.error("User creation failed:", error.message);

          return res.status(500).json({
            message: "Server error",
          });
        }

        return res.status(201).json({
          message: `${role === "ADMIN" ? "Admin" : "User"} created successfully`,
        });
      });
    });
  } catch (error) {
    console.error("Create user error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const createStore = (req, res) => {
  const { name, email, address } = req.body;

  if (!name || !email || !address) {
    return res.status(400).json({
      message: "Name, email and address are required",
    });
  }

  if (name.length < 20 || name.length > 60) {
    return res.status(400).json({
      message: "Name must be between 20 and 60 characters",
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Please enter a valid email address",
    });
  }

  if (address.length > 400) {
    return res.status(400).json({
      message: "Address cannot exceed 400 characters",
    });
  }

  const sql = `
    INSERT INTO stores
    (name, email, address)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, email, address], (error) => {
    if (error) {
      console.error("Store creation failed:", error.message);

      return res.status(500).json({
        message: "Server error",
      });
    }

    return res.status(201).json({
      message: "Store created successfully",
    });
  });
};

const getStores = (req, res) => {
  const { name, email, address, sortBy = "name", order = "ASC" } = req.query;

  const allowedSortFields = {
    name: "s.name",
    email: "s.email",
    address: "s.address",
  };

  const sortColumn = allowedSortFields[sortBy] || allowedSortFields.name;

  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let sql = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      COALESCE(AVG(r.rating), 0) AS rating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE 1 = 1
  `;

  const values = [];

  if (name) {
    sql += " AND s.name LIKE ?";
    values.push(`%${name}%`);
  }

  if (email) {
    sql += " AND s.email LIKE ?";
    values.push(`%${email}%`);
  }

  if (address) {
    sql += " AND s.address LIKE ?";
    values.push(`%${address}%`);
  }

  sql += `
    GROUP BY
      s.id,
      s.name,
      s.email,
      s.address
    ORDER BY ${sortColumn} ${sortOrder}
  `;

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error("Store listing failed:", error.message);

      return res.status(500).json({
        message: "Server error",
      });
    }

    return res.status(200).json({
      stores: results,
    });
  });
};

// Get Normal Users and Admin Users
const getUsers = (req, res) => {
  const {
    name,
    email,
    address,
    role,
    sortBy = "name",
    order = "ASC",
  } = req.query;

  const allowedSortFields = {
    name: "u.name",
    email: "u.email",
    address: "u.address",
    role: "u.role",
  };

  const sortColumn = allowedSortFields[sortBy] || allowedSortFields.name;

  const sortOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let sql = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.address,
      u.role
    FROM users u
    WHERE u.role IN ('USER', 'ADMIN')
  `;

  const values = [];

  if (name) {
    sql += " AND u.name LIKE ?";
    values.push(`%${name}%`);
  }

  if (email) {
    sql += " AND u.email LIKE ?";
    values.push(`%${email}%`);
  }

  if (address) {
    sql += " AND u.address LIKE ?";
    values.push(`%${address}%`);
  }

  if (role && ["USER", "ADMIN"].includes(role)) {
    sql += " AND u.role = ?";
    values.push(role);
  }

  sql += ` ORDER BY ${sortColumn} ${sortOrder}`;

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error("User listing failed:", error.message);

      return res.status(500).json({
        message: "Server error",
      });
    }

    return res.status(200).json({
      users: results,
    });
  });
};

// Get User Details
const getUserDetails = (req, res) => {
  const userId = req.params.id;

  const sql = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.address,
      u.role
    FROM users u
    WHERE u.id = ?
  `;

  db.query(sql, [userId], (error, results) => {
    if (error) {
      console.error("User details failed:", error.message);

      return res.status(500).json({
        message: "Server error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = results[0];

    // If Store Owner, get their store's rating
    if (user.role === "STORE_OWNER") {
      const ratingSql = `
        SELECT
          s.id AS storeId,
          s.name AS storeName,
          COALESCE(AVG(r.rating), 0) AS rating
        FROM stores s
        LEFT JOIN ratings r
          ON s.id = r.store_id
        WHERE s.owner_id = ?
        GROUP BY s.id, s.name
      `;

      db.query(ratingSql, [userId], (error, ratingResults) => {
        if (error) {
          console.error("Store owner rating lookup failed:", error.message);

          return res.status(500).json({
            message: "Server error",
          });
        }

        return res.status(200).json({
          user,
          stores: ratingResults,
        });
      });

      return;
    }

    return res.status(200).json({
      user,
    });
  });
};

module.exports = {
  getDashboard,
  createUser,
  createStore,
  getStores,
  getUsers,
  getUserDetails,
};
