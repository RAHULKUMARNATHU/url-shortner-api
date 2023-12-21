const express = require("express");

const router = express.Router();

const userAPI = require("../../../controllers/authController");

router.post("/signup", userAPI.signup);
router.post("/login", userAPI.login);

module.exports = router;
