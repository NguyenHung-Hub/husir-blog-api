const express = require("express");
const app = express();
const mongoose = require("mongoose");
const configs = require("./src/config");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const cloudinary = require("cloudinary").v2;

const authRoute = require("./src/routes/auth");
const userRoute = require("./src/routes/user");
const postRoute = require("./src/routes/posts");
const categoryRoute = require("./src/routes/categories");
const formatBufferTo64 = require("./src/utils/formatBufferTo64");
const {
    PORT,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
} = require("./src/config");

app.use(express.json());
app.use(
    cors({
        origin: "https://husir-blog-api-byt3.vercel.app",
    })
);
app.use("/images", express.static(path.join(__dirname, "/images")));
mongoose.connect(
    configs.DATABASE_URL_PROD,
    (error) => {
        if (error) {
            console.error("> Connect database fail: ", error);
        } else {
            console.log("> Connect database success!!! ");
        }
    },
    {}
);

// Configuration
cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("image"), async (req, res) => {
    try {
        const file64 = formatBufferTo64(req.file);
        const result = await cloudinary.uploader.upload(file64.content, {
            folder: "husir_blog/post",
        });

        res.status(200).json({
            // cloudinaryId: result.public_id,
            url: result.secure_url,
        });
    } catch (error) {
        console.log(error);
    }
});

app.get("/", (req, res) => {
    return res.json("husir blog");
});

app.use("/api/auth/", authRoute);
app.use("/api/user/", userRoute);
app.use("/api/post/", postRoute);
app.use("/api/categories/", categoryRoute);

app.listen(PORT, () => {
    console.log("\n> Server is running on port:", PORT);
});
