// routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../config/db.js");

router.post("/addUser", (req, res) => {
  const sql =
    "INSERT INTO employee_details (`name`, `email`, `age`) VALUES (?, ?, ?)";
  const values = [req.body.name, req.body.email, req.body.age];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json({ message: "User added successfully" });
  });
});

router.get("/get_all_users", (req, res) => {
  const sql = "SELECT * FROM employee_details";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    return res.status(200).json(results);
  });
});

router.delete("/delete_user/:id", (req, res) => {
  const sql = "DELETE FROM employee_details WHERE id = ?";
  const userId = req.params.id;

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error("Error occurred:", err);
      return res.status(500).json({ message: "Something went wrong" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  });
});

module.exports = router;
