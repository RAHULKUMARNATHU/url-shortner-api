const express = require("express");
const passport = require("passport");

const router = express.Router();

const urlApi = require("../../../controllers/urlController");

router.route("/:shortUrl").get(urlApi.getShortUrl);

router
  .route("/short")
  .post(passport.authenticate("jwt", { session: false }), urlApi.create);

module.exports = router;
