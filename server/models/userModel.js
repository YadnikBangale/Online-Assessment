const db = require("../db");
const bcrypt = require("bcryptjs");

const createUserTable = (callback) => {
  const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(60) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            address VARCHAR(400) NOT NULL,
            role ENUM('ADMIN', 'USER', 'STORE_OWNER') NOT NULL DEFAULT 'USER',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP
        )
    `;

  db.query(sql, (error) => {
    if (error) {
      console.error("Users table creation failed:", error.message);
      return callback(error);
    }

    console.log("Users table ready");
    callback(null);
  });
};

const createDefaultAdmin = (callback) => {
  const email = "admin@assessment.com";
  const password = "Admin@123";

  const checkSql = `
    SELECT id
    FROM users
    WHERE email = ?
  `;

  db.query(checkSql, [email], async (error, results) => {
    if (error) {
      console.error("Admin check failed:", error.message);
      return callback(error);
    }

    if (results.length > 0) {
      return callback(null);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (name, email, password, address, role)
      VALUES (?, ?, ?, ?, 'ADMIN')
    `;

    db.query(
      sql,
      [
        "System Administrator Account",
        email,
        hashedPassword,
        "System Administration Office",
      ],
      (error) => {
        if (error) {
          console.error("Default admin creation failed:", error.message);

          return callback(error);
        }

        console.log("Default admin created");
        console.log("Admin email:", email);
        console.log("Admin password:", password);

        callback(null);
      },
    );
  });
};

module.exports = {
  createUserTable,
  createDefaultAdmin
};
