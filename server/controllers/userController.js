const db = require("../db");

const getStores = (req, res) => {
  const userId = req.user.id;
  const { name, address } = req.query;

  let sql = `
    SELECT
      s.id,
      s.name,
      s.email,
      s.address,
      COALESCE(AVG(r.rating), 0) AS overallRating,
      COALESCE(
        MAX(
          CASE
            WHEN r.user_id = ? THEN r.rating
          END
        ),
        0
      ) AS userRating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
  `;

  const values = [userId];
  const conditions = [];

  if (name) {
    conditions.push("s.name LIKE ?");
    values.push(`%${name}%`);
  }

  if (address) {
    conditions.push("s.address LIKE ?");
    values.push(`%${address}%`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  sql += `
    GROUP BY s.id, s.name, s.email, s.address
    ORDER BY s.name ASC
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

const submitRating = (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;

  if (!storeId || rating === undefined) {
    return res.status(400).json({
      message: "Store ID and rating are required",
    });
  }

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return res.status(400).json({
      message: "Rating must be an integer between 1 and 5",
    });
  }

  const storeSql = `
    SELECT id
    FROM stores
    WHERE id = ?
  `;

  db.query(storeSql, [storeId], (error, storeResults) => {
    if (error) {
      console.error("Store check failed:", error.message);

      return res.status(500).json({
        message: "Server error",
      });
    }

    if (storeResults.length === 0) {
      return res.status(404).json({
        message: "Store not found",
      });
    }

    const checkRatingSql = `
      SELECT id
      FROM ratings
      WHERE user_id = ?
      AND store_id = ?
    `;

    db.query(
      checkRatingSql,
      [userId, storeId],
      (error, ratingResults) => {
        if (error) {
          console.error(
            "Rating check failed:",
            error.message
          );

          return res.status(500).json({
            message: "Server error",
          });
        }

        if (ratingResults.length > 0) {
          return res.status(409).json({
            message:
              "You have already submitted a rating for this store",
          });
        }

        const insertSql = `
          INSERT INTO ratings
          (user_id, store_id, rating)
          VALUES (?, ?, ?)
        `;

        db.query(
          insertSql,
          [userId, storeId, numericRating],
          (error) => {
            if (error) {
              console.error(
                "Rating submission failed:",
                error.message
              );

              return res.status(500).json({
                message: "Server error",
              });
            }

            return res.status(201).json({
              message: "Rating submitted successfully",
            });
          }
        );
      }
    );
  });
};


const modifyRating = (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;

  if (!storeId || rating === undefined) {
    return res.status(400).json({
      message: "Store ID and rating are required",
    });
  }

  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    return res.status(400).json({
      message: "Rating must be an integer between 1 and 5",
    });
  }

  const sql = `
    UPDATE ratings
    SET rating = ?
    WHERE user_id = ?
    AND store_id = ?
  `;

  db.query(
    sql,
    [numericRating, userId, storeId],
    (error, result) => {
      if (error) {
        console.error(
          "Rating modification failed:",
          error.message
        );

        return res.status(500).json({
          message: "Server error",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Rating not found",
        });
      }

      return res.status(200).json({
        message: "Rating updated successfully",
      });
    }
  );
};

module.exports = {
  getStores,
  submitRating,
  modifyRating
};