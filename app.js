const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();

/*Development Logging */
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/*RATE LIMITER :- limit req. from same API */
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000 /*1 hr 100 req */,
  message: "Too many requests from this IP , please try again in an hour",
});

app.use("/api", limiter);

/*Body parser , reading data from body into req.body */
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

module.exports = app;
