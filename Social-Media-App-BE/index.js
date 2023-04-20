const express = require("express"); //to build backend app
const app = express();
const cors = require("cors");
const mongoose = require("mongoose"); //to define modals
const dotenv = require("dotenv"); //to protect secrets
const helmet = require("helmet"); //to secure incoming requests
const morgan = require("morgan"); //to log incoming requests
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const postRouter = require("./routes/postRoutes");
const conversationRouter = require("./routes/conversationsRoutes");
const messageRouter = require("./routes/messagesRoutes");
const multer = require("multer");
const path = require("path");

dotenv.config();

mongoose.set("strictQuery", true);

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

app.use("/images", express.static(path.join(__dirname, "public/images")));
//middlewares
app.use(express.json()); //body-parser(to check body of incoming post request)
// app.use(helmet());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("common"));
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // cb(null, file.originalname);
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/v1/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploaded successfully");
  } catch (err) {
    console.log(err);
  }
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/conversation", conversationRouter);
app.use("/api/v1/messages", messageRouter);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

app.listen(process.env.PORT || 8800, () => {
  console.log("Backend server is running on port 8800...");
});
