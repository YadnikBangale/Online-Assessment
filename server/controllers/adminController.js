const db = require("../db");
const bcrypt = require("bcryptjs");

const getDashboard = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM stores) AS totalStores,
      (SELECT COUNT(*) FROM ratings) AS totalRatings
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to load dashboard",
      });
    }

    res.json(results[0]);
  });
};

const getUsers = (req, res) => {
  const {
    name = "",
    email = "",
    address = "",
    role = "",
    sortBy = "name",
    order = "ASC",
  } = req.query;

  const allowedSortColumns = ["name", "email", "address", "role"];

  const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "name";

  const safeOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  let sql = `
    SELECT id, name, email, address, role
    FROM users
    WHERE name LIKE ?
      AND email LIKE ?
      AND address LIKE ?
  `;

  const params = [`%${name}%`, `%${email}%`, `%${address}%`];

  if (role) {
    sql += ` AND role = ?`;
    params.push(role);
  }

  sql += ` ORDER BY ${safeSortBy} ${safeOrder}`;

  db.query(sql, params, (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch users",
      });
    }

    res.json({
      users: results,
    });
  });
};

const getUserDetails = (req, res) => {
  const { id } = req.params;

  const userSql = `
    SELECT id, name, email, address, role
    FROM users
    WHERE id = ?
  `;

  db.query(userSql, [id], (error, userResults) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch user details",
      });
    }

    if (userResults.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const user = userResults[0];

    if (user.role !== "STORE_OWNER") {
      return res.json({
        user,
        stores: [],
      });
    }

    const storeSql = `
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

    db.query(storeSql, [id], (storeError, stores) => {
      if (storeError) {
        return res.status(500).json({
          message: "Failed to fetch store details",
        });
      }

      res.json({
        user,
        stores,
      });
    });
  });
};

const createUser = async (req, res) => {
  const { name, email, password, address, role = "USER" } = req.body;

  if (!name || !email || !password || !address) {
    return res.status(400).json({
      message: "Name, email, password and address are required",
    });
  }

  const allowedRoles = ["USER", "ADMIN", "STORE_OWNER"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  try {
    const checkSql = `
      SELECT id
      FROM users
      WHERE email = ?
    `;

    db.query(checkSql, [email], async (checkError, results) => {
      if (checkError) {
        return res.status(500).json({
          message: "Failed to check email",
        });
      }

      if (results.length > 0) {
        return res.status(409).json({
          message: "Email already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
        INSERT INTO users
        (name, email, password, address, role)
        VALUES (?, ?, ?, ?, ?)
      `;

      db.query(
        sql,
        [name, email, hashedPassword, address, role],
        (error, result) => {
          if (error) {
            return res.status(500).json({
              message: "Failed to create user",
            });
          }

          res.status(201).json({
            message: "User created successfully",
            user: {
              id: result.insertId,
              name,
              email,
              address,
              role,
            },
          });
        },
      );
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create user",
    });
  }
};

const getStores = (req, res) => {
  const {
    name = "",
    email = "",
    address = "",
    sortBy = "name",
    order = "ASC",
  } = req.query;

  const allowedSortColumns = ["name", "email", "address"];

  const safeSortBy = allowedSortColumns.includes(sortBy) ? sortBy : "name";

  const safeOrder = order.toUpperCase() === "DESC" ? "DESC" : "ASC";

  const sql = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      COALESCE(AVG(r.rating), 0) AS rating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE s.name LIKE ?
      AND s.email LIKE ?
      AND s.address LIKE ?
    GROUP BY s.id, s.name, s.email, s.address
    ORDER BY ${safeSortBy} ${safeOrder}
  `;

  db.query(
    sql,
    [`%${name}%`, `%${email}%`, `%${address}%`],
    (error, results) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to fetch stores",
        });
      }

      res.json({
        stores: results,
      });
    },
  );
};

const createStore = (req, res) => {
  const { name, email, address, ownerId } = req.body;

  if (!name || !email || !address || !ownerId) {
    return res.status(400).json({
      message: "Name, email, address and ownerId are required",
    });
  }

  const ownerSql = `
    SELECT id
    FROM users
    WHERE id = ?
      AND role = 'STORE_OWNER'
  `;

  db.query(ownerSql, [ownerId], (ownerError, ownerResults) => {
    if (ownerError) {
      return res.status(500).json({
        message: "Failed to verify store owner",
      });
    }

    if (ownerResults.length === 0) {
      return res.status(400).json({
        message: "Invalid store owner",
      });
    }

    const sql = `
        INSERT INTO stores
        (name, email, address, owner_id)
        VALUES (?, ?, ?, ?)
      `;

    db.query(sql, [name, email, address, ownerId], (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to create store",
        });
      }

      res.status(201).json({
        message: "Store created successfully",
        store: {
          id: result.insertId,
          name,
          email,
          address,
          ownerId,
        },
      });
    });
  });
};

const getStoreOwners = (req, res) => {
  const sql = `
    SELECT id, name, email, address, role
    FROM users
    WHERE role = 'STORE_OWNER'
    ORDER BY name ASC
  `;

  db.query(sql, (error, results) => {
    if (error) {
      return res.status(500).json({
        message: "Failed to fetch store owners",
      });
    }

    res.json({
      owners: results,
    });
  });
};

module.exports = {
  getDashboard,
  getUsers,
  getUserDetails,
  createUser,
  getStores,
  createStore,
  getStoreOwners,
};
