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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      require: [true, "short url must belong to User!"],
    },
  },
  {
    timestamps: true,
  }
);

const UrlModel = mongoose.model("ShortUrl", urlSchema);

module.exports = UrlModel;
