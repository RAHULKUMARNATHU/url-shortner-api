const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UrlModel = mongoose.model("ShortUrl", urlSchema);

module.exports = UrlModel;
