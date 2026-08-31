const db = require("../db");

const createStoreTable = (callback) => {
  const sql = `
        CREATE TABLE IF NOT EXISTS stores (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(60) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address VARCHAR(400) NOT NULL,
            owner_id INT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT fk_store_owner
                FOREIGN KEY (owner_id)
                REFERENCES users(id)
                ON DELETE SET NULL
                ON UPDATE CASCADE
        )
    `;

  db.query(sql, (error) => {
    if (error) {
      console.error("Stores table creation failed:", error.message);
      return callback(error);
    }

    console.log("Stores table ready");
    callback(null);
  });
};

module.exports = {
  createStoreTable,
};
