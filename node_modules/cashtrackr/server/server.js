const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { pool } = require("./db");

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CashTrackr API is running");
});

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Expense routes
const expenseRoutes = require('./routes/expenses');
app.use('/expenses', expenseRoutes);

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS current_time");
    res.json({
      message: "Connected to PostgreSQL",
      currentTime: result.rows[0].current_time,
    });
  } catch (error) {
    console.error("PostgreSQL connection error:", error);
    res.status(500).json({
      message: "Failed to connect to PostgreSQL",
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});