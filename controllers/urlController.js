const catchAsync = require("../utils/catchAsync");
const UrlModel = require("../models/urlModel");

exports.getAll = (req, res) => {
  res.end("This is test route");
};

function generateUniqueString() {
  return Math.random().toString(36).substring(2, 8);
}

exports.create = catchAsync(async (req, res, next) => {
  const { originalUrl } = req.body;
  const shortUrl = `https://short.url.com/${generateUniqueString()}`;

  // Save the mapping in MongoDB
  await UrlModel.create({ shortUrl, originalUrl });

  // Respond with both original and short URLs
  res.json({ originalUrl, shortUrl });
});

exports.getShortUrl = catchAsync(async (req, res, next) => {
  const { shortUrl } = req.params;
  const url =`https://short.url.com/${shortUrl}`
  console.log(url);

  // Find the original URL in MongoDB
  const urlMapping = await UrlModel.findOne({url});

  console.log(urlMapping);
  if (urlMapping) {
    // Redirect to the original URL
    res.redirect(urlMapping.originalUrl);
  } else {
    // Handle case when short URL is not found
    res.status(404).json({ error: "Short URL not found" });
  }
});
