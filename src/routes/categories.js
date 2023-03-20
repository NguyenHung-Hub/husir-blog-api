const router = require("express").Router();
const Category = require("../models/Category");

router.post("/", async (req, res) => {
    const newCategory = new Category(req.body);

    try {
        const saved = await newCategory.save();
        res.status(200).json(saved);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get("/all", async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json(error);
    }
});
router.get("/", async (req, res) => {
    try {
        // const categories = await Category.find();
        const categories = await Category.aggregate([
            {
                $lookup: {
                    from: "posts",
                    localField: "_id",
                    foreignField: "categories",
                    as: "post",
                },
            },
            { $unwind: "$post" },
            { $match: { "post.hidden": { $ne: true } } },
            {
                $group: {
                    _id: "$_id",
                    slug: { $first: "$$ROOT.slug" },
                    name: { $first: "$$ROOT.name" },
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;
