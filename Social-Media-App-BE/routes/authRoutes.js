const router = require("express").Router();
const USER = require("../models/userModel");
const bcrypt = require("bcryptjs");

const { sign, verify } = require("jsonwebtoken");

const signToken = (id, email) =>
  //console.log(id);
  sign({ id: id, email: email }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: process.env.ACCESS_JWT_EXPIRES_IN,
  });

const signRefreshToken = (id, email) =>
  sign({ id: id, email: email }, process.env.REFRESH_JWT_SECRET, {
    expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id, user.email);
  const refreshToken = signRefreshToken(user._id, user.email);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.ACCESS_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };
  const cookieRefreshOptions = {
    expires: new Date(
      Date.now() +
        process.env.REFRESH_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", token, cookieOptions);
  res.cookie("jwtRefresh", refreshToken, cookieRefreshOptions);

  //Remove password from output
  user.password = undefined;

  //Sending new user to client
  res.status(statusCode).json({
    status: "success",
    token,
    refreshToken,
    data: user,
  });
};

router.post("/register", async (req, res) => {
  try {
    // const salt = bcrypt.genSalt(10);
    // const hashedPassword = bcrypt.hash(req.body.password, salt);
    const newUser = await USER.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });
    createSendToken(newUser, 201, req, res);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await USER.findOne({ email: req.body.email }).select(
      "+password"
    ); //field:variable

    if (!user) {
      return res.status(404).json("No user found");
    }
    // !user && res.status(404).json("No user found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.status(404).json("Incorrect username or password");
    }

    // !validPassword && res.status(404).json("Incorrect username or password");
    createSendToken(user, 200, req, res);
    // res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/logout", (req, res) => {
  res.cookie("jwt", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
});
module.exports = router;
