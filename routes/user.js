const express = require("express");

// Controller functions
const { registerUser, loginUser } = require("../controller/userController");

const router = express.Router();

// Login route
router.post("/login", loginUser);

// Signup route
router.post("/register", registerUser);



module.exports = router;
