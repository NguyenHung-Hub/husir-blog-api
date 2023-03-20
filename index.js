const express = require("express");
const app = express();
const mongoose = require("mongoose");
const configs = require("./src/config");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const postRoute = require("./src/routes/posts");
const categoryRoute = require("./src/routes/categories");

app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose.connect(
    configs.DATABASE_URL_PROD,
    (error) => {
        if (error) {
            console.error("> Connect database fail: ", error);
        } else {
            console.log("> Connect database success!! ");
        }
    },
    {}
);

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },

    filename: (req, file, callback) => {
        callback(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json({
        url: `http://${req.get("host")}/images/${req.file.filename}`,
    });
});

app.use("/api/auth/", authRoute);
app.use("/api/user/", userRoute);
app.use("/api/post/", postRoute);
app.use("/api/categories/", categoryRoute);

app.listen("5000", () => {
    console.log("Server is running");
});
