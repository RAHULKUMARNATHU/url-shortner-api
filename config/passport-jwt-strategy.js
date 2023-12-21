const passport = require("passport");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const User = require("./../models/userModel");
const catchAsync = require("../utils/catchAsync");

let opts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};


passport.use(
  new JWTStrategy(
    opts,
    catchAsync(async  (jwtPayload, done) => {       
      const user = await User.findById(jwtPayload.id);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    })
  )
);



module.exports = passport;
