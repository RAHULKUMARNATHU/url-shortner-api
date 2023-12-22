const catchAsync = require("../utils/catchAsync");
const UrlModel = require("../models/urlModel");
const AppError = require("../utils/appError");


function generateUniqueString() {
  return Math.random().toString(36).substring(2, 8);
}

exports.create = catchAsync(async (req, res, next) => {
  const user = req.user.id
  const { originalUrl } = req.body;
  const shortUrl = `https://short.url.com/${generateUniqueString()}`;

  // Save the mapping in MongoDB
  const result = await UrlModel.create({ shortUrl, originalUrl, user });

  if(!result){
    return next(new AppError("Error ! Error in creating short Url 😥"))
  }
  // Respond with both original and short URLs
  return  res.status(201).json({
     status: "OK",
     data: {
       originalUrl: originalUrl,
       shortUrl: shortUrl,
     },
   });

});

exports.redirectToOriginalURL = catchAsync( async (req, res , next) => {
  const { shortUrl } = req.query;
  const url = await UrlModel.findOne({ shortUrl });

  if (url) {
    return res.redirect(302 ,url.originalUrl);
  }

  return res.status(404).json({error:"Ohh Noo ! URL Not Found !😥"})
});