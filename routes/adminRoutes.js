const express = require("express");
const { adminLogin, adminGetUsers, adminDeleteUser } = require("../controllers/adminController");

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", adminGetUsers);
router.delete("/users/:id", adminDeleteUser);

module.exports = router;
