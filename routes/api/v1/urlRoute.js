const express = require("express");

const router = express.Router();

const urlApi = require("../../../controllers/urlController");

router.route("/:shortUrl").get(urlApi.getShortUrl);

router.route("/").post(urlApi.create);

module.exports = router;
