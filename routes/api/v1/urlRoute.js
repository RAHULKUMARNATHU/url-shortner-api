const express = require("express");
const passport = require("passport");

const router = express.Router();

const urlAPI = require("../../../controllers/urlController");

router.route("/").get(urlAPI.redirectToOriginalURL);

router
  .route("/short")
  .post(passport.authenticate("jwt", { session: false }), urlAPI.create);

module.exports = router;
