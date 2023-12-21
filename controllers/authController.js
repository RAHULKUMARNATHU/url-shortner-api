const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const User = require("../models/userModel");
const { promisify } = require("util");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } =
    req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm
  });
  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  /*check if email and password exists */
  if (!email || !password) {
    return next(new AppError("Please Provide email and Password", 400));
  }

  /*2) Check if user exists && password is correct */
  const user = await User.findOne({ email }).select(
    "+password +loginAttempts +lockUntil"
  );
  if (!user || !(await user.correctPassword(password, user.password))) {
    if (user) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 10) {
        user.lockUntil = Date.now() + 1800000;
        await user.save({ validateBeforeSave: false });
        return next(
          new AppError("Account locked for 30 min .Try again later", 401)
        );
      }
      await user.save({ validateBeforeSave: false });
    }
    return next(new AppError("Incorrect email or password", 401));
  }
  /*3) Is everything OK, send token to client */
  if (user.lockUntil && user.lockUntil > Date.now()) {
    return next(
      new AppError("Account locked  for 30 min  . Try again later ", 401)
    );
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  /*1) Getting token and check of it's there  */
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req?.cookies?.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in ! Please log in to get access.", 401)
    );
  }
  /*2)Verification token  */

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  /*3)check if user still exists */
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError("The user belong to this token does no longer exists.", 401)
    );
  }
  /*Check if user changed password after the token was issued */
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again. ", 401)
    );
  }

  /*GRANT ACCESS TO PROTECTED ROUTE */
  res.locals.user = freshUser;
  req.user = freshUser;
  next();
});
