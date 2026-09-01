const db = require("../db");

const getStoreOwnerDashboard = (req, res) => {
  const ownerId = req.user.id;

  const storeSql = `
    SELECT
      s.id,
      s.name,
      COALESCE(AVG(r.rating), 0) AS averageRating
    FROM stores s
    LEFT JOIN ratings r
      ON s.id = r.store_id
    WHERE s.owner_id = ?
    GROUP BY s.id, s.name
  `;

  db.query(storeSql, [ownerId], (error, storeResults) => {
    if (error) {
      console.error(
        "Store owner dashboard failed:",
        error.message
      );

      return res.status(500).json({
        message: "Server error",
      });
    }

    if (storeResults.length === 0) {
      return res.status(404).json({
        message: "No store found for this Store Owner",
      });
    }

    const store = storeResults[0];

    const usersSql = `
      SELECT
        u.id,
        u.name,
        u.email,
        r.rating
      FROM ratings r
      INNER JOIN users u
        ON r.user_id = u.id
      WHERE r.store_id = ?
      ORDER BY u.name ASC
    `;

    db.query(usersSql, [store.id], (error, userResults) => {
      if (error) {
        console.error(
          "Store rating users lookup failed:",
          error.message
        );

        return res.status(500).json({
          message: "Server error",
        });
      }

      return res.status(200).json({
        store: {
          id: store.id,
          name: store.name,
          averageRating: store.averageRating,
        },
        users: userResults,
      });
    });
  });
};

module.exports = {
  getStoreOwnerDashboard,
};