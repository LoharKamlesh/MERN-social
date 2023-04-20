const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const validator = require("validator");

const { isEmail } = validator;

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      min: 6,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not same",
      },
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    following: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: ["single", "married", "dnd"],
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  //we have to encrypt password only if password has been updated or created
  //'this' here on document is the user
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12); //hash is async function

  this.confirmPassword = undefined; //we dont want to persist passwordConfirm to database we just need it in early stages to validate user entered password

  next();
});

module.exports = mongoose.model("USER", UserSchema);
