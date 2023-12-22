const AppError = require("../utils/appError");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const handleCasteErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value} .`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};
const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTExpired = () => {
  return new AppError("Your token has expired! Please log in again.", 401);
};

const sendErrorDev = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //B) RENDERED WEBSITE
  console.error("Error💥", err);
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong! ",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith("/api")) {
    /*A) Operational Error , trusted Error : send message to client */
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.statusCode,
        message: err.message,
      });
    }
    /*B) Programming Error or other unknown error : don't leak error details */
    /*1) Log the error*/
    console.error("Error💥", err);
    /*2) Send the generic message */
    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
  //B) RENDER WEBSITE
  /*A) Operational Error , trusted Error : send message to client */
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message,
    });
  }
  /*B) Programming Error or other unknown error : don't leak error details */
  /*1) Log the error*/
  console.error("Error💥", err);
  /*2) Send the generic message */
  return res.status(500).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later",
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  
  console.log(process.env.NODE_ENV, ">>>>>>>>>>>>>>>>>>>>>>");
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, name: err.name };
    error.message = err.message;

    if (error.name === "CastError") error = handleCasteErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpired();
    sendErrorProd(error, req, res);
  }

  next();
};
