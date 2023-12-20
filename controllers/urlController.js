const crypto = require("crypto");
const handlerFactory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const UrlModel = require('../models/urlModel')



exports.getAll = (req, res) => {
  res.end("This is test route");
};


function generateUniqueString() {
  return Math.random().toString(36).substring(2, 8);
}

exports.create = catchAsync(async (req, res, next) => {
  const { originalUrl } = req.body;
  const shortUrl = `https://shrot.url.com/${generateUniqueString()}`;

  // Save the mapping in MongoDB
  await UrlModel.create({ shortUrl, originalUrl });

  // Respond with both original and short URLs
  res.json({ originalUrl, shortUrl });
});
