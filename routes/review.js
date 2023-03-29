const router = require("express").Router();
const Review = require("../models/review");
const Blog = require("../models/blog");



// POST review
router.post(
  "/reviews/:blogID",

  async (req, res) => {
      console.log(res)
    try {
      const review = new Review();
      review.headline = req.body.headline;
      review.body = req.body.body;
      review.name = req.body.name;



      review.blogID = req.params.blogID;

      await Blog.update({
        $push: {
          reviews: review._id
        }
      });

      const savedReview = await review.save();

      if (savedReview) {
        res.json({
          success: true,
          message: "Succesfully Added Review"
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
);

// GET single review
router.get("/reviews/:blogID", async (req, res) => {
  try {
    const blogReviews = await Review.find({
        blogID: req.params.blogID
      })
      .populate("user")
      .exec();

    res.json({
      success: true,
      reviews: blogReviews
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

module.exports = router;