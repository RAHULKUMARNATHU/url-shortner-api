const AppError = require("../utils/appError");

const handleCasteErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value} .`;
  return new AppError(message, 400);
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

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, name: err.name };
    error.message = err.message;

    if (error.name === "CastError") error = handleCasteErrorDB(error);
    sendErrorProd(error, req, res);
  }

  next();
};
