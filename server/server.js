const express = require("express");

const app = express();

const db = require("./db");

const { createUserTable, createDefaultAdmin } = require("./models/userModel");
const { createStoreTable } = require("./models/storeModel");
const { createRatingTable } = require("./models/ratingModel");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const storeOwnerRoutes = require("./routes/storeOwnerRoutes");

const PORT = 5000;
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/store-owner", storeOwnerRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

const initializeDatabase = () => {
  createUserTable((error) => {
    if (error) {
      console.error("Database initialization stopped.");
      return;
    }

    createDefaultAdmin((error) => {
      if (error) {
        console.error("Database initialization stopped.");
        return;
      }

      createStoreTable((error) => {
        if (error) {
          console.error("Database initialization stopped.");
          return;
        }

        createRatingTable((error) => {
          if (error) {
            console.error("Database initialization stopped.");
            return;
          }

          console.log("All database tables are ready");

          app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
          });
        });
      });
    });
  });
};

db.connect((error) => {
  if (error) {
    console.error("MySQL connection failed:", error.message);
    return;
  }

  console.log("MySQL connected successfully");

  initializeDatabase();
});
