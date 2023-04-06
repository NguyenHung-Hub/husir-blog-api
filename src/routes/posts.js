const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

router.post("/", async (req, res) => {
    try {
        const newPost = new Post(req.body);

        const insertId = await User.findByIdAndUpdate(
            req.body.author,
            { $push: { posts: newPost._id } },
            { new: true }
        );

        const saved = await newPost.save();

        res.status(200).json(saved);
    } catch (error) {
        res.status(500).json(error);
    }
});

//UPDATE POST
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    { $set: req.body },
                    { new: true }
                );

                res.status(200).json(updatedPost);
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("You can update only your post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.username === req.body.username) {
            try {
                await post.delete();
                res.status(200).json("Post has been deleted!");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("You can delete only your post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/search", async (req, res) => {
    const value = req.query.value;
    console.log(`file: posts.js:191 > value:`, { value });

    try {
        const result = await Post.find({ $text: { $search: value } });
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
    }
});

router.get("/recommend", async (req, res) => {
    const number = Number(req.query?.number || 3);

    try {
        const posts = await Post.aggregate([
            {
                $match: {
                    hidden: false,
                },
            },
            { $sample: { size: number } },
        ]);

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

//HIDDEN POST
router.put("/hidden/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.username === req.body.username) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.body.postId,
                    {
                        $set: { hidden: true },
                    },
                    { new: true }
                );
                res.status(200).json("Post has been hidden!");
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(401).json("You can hide your post!");
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET POST
router.get("/:slug", async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug });
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json(error);
    }
});

//GET POSTS
router.get("/", async (req, res) => {
    const category = req.query.category;
    const recent = req.query.recent;
    const user = req.query.user;

    try {
        let posts;
        if (user) {
            const userDoc = await User.findOne({ _id: user }).populate({
                path: "posts",
                match: { hidden: false },
                options: { sort: { createdAt: -1 } },
                populate: { path: "categories" },
            });

            const { password, ...result } = userDoc._doc;
            posts = result;
        } else if (category) {
            posts = await Post.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categories",
                    },
                },
                { $unwind: "$categories" },
                {
                    $match: {
                        "categories.slug": category,
                        hidden: false,
                    },
                },
                { $sort: { createdAt: -1 } },
            ]);
        } else if (recent) {
            posts = await Post.find({ hidden: { $ne: true } }).sort({
                createdAt: -1,
            });
            posts.length = Number(recent) || 3;
        } else {
            posts = await Post.aggregate([
                {
                    $lookup: {
                        from: "categories",
                        localField: "categories",
                        foreignField: "_id",
                        as: "categories",
                    },
                },
                { $unwind: "$categories" },
                {
                    $match: {
                        hidden: { $ne: true },
                    },
                },
                { $sort: { createdAt: -1 } },
            ]);
        }
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
