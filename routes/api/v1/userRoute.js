const express = require("express");

const router = express.Router();

const usersApi = require("../../../controllers/authController");

router.post("/signup", usersApi.signup);
router.post("/login", usersApi.login);

module.exports = router;
