const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");
const Post = require("../models/Post");

//UPDATE
router.put("/:id", async (req, res) => {
    if (req.body.userId == req.params.id) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("User can update only your accout");
    }
});

//Update Password
router.put("/pwd/:id", async (req, res) => {
    if (req.body.userId == req.params.id) {
        const user = await User.findById(req.body.userId);

        if (!user) {
            res.status(404).json("Not found user");
            return;
        }

        const validated = await bcrypt.compare(
            req.body.password,
            user.password
        );
        if (!validated) {
            res.status(404).json("Wrong crendentials!");
            return;
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashPass = await bcrypt.hash(req.body.newPassword, salt);

            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                password: hashPass,
            });
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    } else {
        res.status(401).json("User can update only your accout");
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    if (req.body.userId == req.params.id) {
        try {
            const user = await User.findById(req.body.userId);
            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.body.userId);
                res.status(200).json("User has been deleted!");
            } catch (error) {
                res.status(500).json(error);
            }
        } catch (error) {
            res.status(404).json("User not found!");
        }
    } else {
        res.status(401).json("You can delete only your account!");
    }
});

//GET USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(500).json("User not found!");
    }
});

module.exports = router;
