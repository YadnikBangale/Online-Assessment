require("dotenv").config();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const { name, email, address, password } = req.body;

    if (!name || !email || !address || !password) {
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

      const insertUserSql = `
        INSERT INTO users
        (name, email, password, address, role)
        VALUES (?, ?, ?, ?, 'USER')
      `;

      db.query(
        insertUserSql,
        [name, email, hashedPassword, address],
        (error) => {
          if (error) {
            console.error("User creation failed:", error.message);

            return res.status(500).json({
              message: "Server error",
            });
          }

          return res.status(201).json({
            message: "User registered successfully",
          });
        },
      );
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql = `
    SELECT id, name, email, password, address, role
    FROM users
    WHERE email = ?
  `;

  db.query(sql, [email], async (error, results) => {
    if (error) {
      console.error("Login query failed:", error.message);

      return res.status(500).json({
        message: "Server error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  });
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 characters and contain at least one uppercase letter and one special character",
      });
    }

    const sql = `
      SELECT password
      FROM users
      WHERE id = ?
    `;

    db.query(sql, [req.user.id], async (error, results) => {
      if (error) {
        console.error("Password lookup failed:", error.message);

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

      const passwordMatch = await bcrypt.compare(
        currentPassword,
        user.password,
      );

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Current password is incorrect",
        });
      }

      const samePassword = await bcrypt.compare(newPassword, user.password);

      if (samePassword) {
        return res.status(400).json({
          message: "New password must be different from current password",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updateSql = `
        UPDATE users
        SET password = ?
        WHERE id = ?
      `;

      db.query(updateSql, [hashedPassword, req.user.id], (error) => {
        if (error) {
          console.error("Password update failed:", error.message);

          return res.status(500).json({
            message: "Server error",
          });
        }

        return res.status(200).json({
          message: "Password updated successfully",
        });
      });
    });
  } catch (error) {
    console.error("Change password error:", error.message);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  signup,
  login,
  changePassword,
};
