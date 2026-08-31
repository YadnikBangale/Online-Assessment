const db = require("../db");

const createRatingTable = (callback) => {
  const sql = `
        CREATE TABLE IF NOT EXISTS ratings (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            store_id INT NOT NULL,
            rating TINYINT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                ON UPDATE CURRENT_TIMESTAMP,

            CONSTRAINT chk_rating
                CHECK (rating BETWEEN 1 AND 5),

            CONSTRAINT unique_user_store_rating
                UNIQUE (user_id, store_id),

            CONSTRAINT fk_rating_user
                FOREIGN KEY (user_id)
                REFERENCES users(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE,

            CONSTRAINT fk_rating_store
                FOREIGN KEY (store_id)
                REFERENCES stores(id)
                ON DELETE CASCADE
                ON UPDATE CASCADE
        )
    `;

  db.query(sql, (error) => {
    if (error) {
      console.error("Ratings table creation failed:", error.message);
      return callback(error);
    }

    console.log("Ratings table ready");
    callback(null);
  });
};

module.exports = {
  createRatingTable,
};