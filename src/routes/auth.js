const router = require("express").Router();
const bcrypt = require("bcrypt");

const User = require("../models/User");

//REGISTER
router.post("/register", async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashPass,
        });

        const saved = await newUser.save();

        res.status(200).json(saved);
    } catch (error) {
        res.status(500).json(error);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        console.log(Date.now(), user);

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

        const { password, ...others } = user._doc;

        res.status(200).json(others);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
