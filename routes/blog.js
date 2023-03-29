const Blog = require("../models/blog");
const express = require("express");

const upload = require("../middelwares/upload-photo");
const router = express.Router();
router.post("/upload", upload.single("photo"), function (req, res, next) {
  res.send({
    data: req.files,
    msg: "Successfully uploaded " + req.file.length + " files!"
  });
});
router.post(`/blogs`, upload.single("photo"), async (req, res) => {
  console.log(res);
  try {
    let blog = new Blog();
    // blog.photos.push(req.files[10].location);
    // req.files.forEach(f => blog.photos.push(f.location))
    //blog.photos.push(...req.files.map(({ location }) => location));
    blog.owner = req.body.ownerID;
    blog.category = req.body.categoryID;
    blog.title = req.body.title;
    blog.snippet = req.body.snippet;
    blog.description = req.body.description;
    blog.photo = req.file.location;

    await blog.save();
    console.log(Blog);
    res.json({
      status: true,
      message: "save succes",
      data: req.file,
      msg: "Successfully uploaded " + req.file.length + " files!"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false
    });
  }
});

router.get(`/blogs`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = {
      category: req.query.categories.split(",")
    };
  }
  try {
    let blogs = await Blog.find(filter)
      .populate("owner category")
      .exec();

    res.json({
      status: true,
      blogs: blogs
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

router.get(`/blogs/:id`, async (req, res) => {
  try {
    const blog = await Blog.findOne({
        _id: req.params.id
      })
      .populate("owner category")
      .exec();
    res.json({
      status: true,
      blog: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});
router.get(`/blogs/:title`, async (req, res) => {
  console.log(res);
  try {
    const blog = await Blog.findOne({
        _title: req.params.title
      })
      .populate("owner category")
      .exec();
    res.json({
      status: true,
      blog: blog
    });
  } catch (error) {
    console.error(error);
    //  res.status(500).json({ success: false });
  }
});

router.put(`/blogs/:id`, async (req, res) => {
  try {
    const blog = await Blog.findOneAndUpdate({
      _id: req.params.id
    }, {
      $set: {
        title: req.body.title,

        description: req.body.description,
        photo: req.body.photo,
        snippet: req.body.snippet,
        category: req.body.categoryID,
        owner: req.body.ownerID
      }
    }, {
      upsert: true
    });

    res.json({
      status: true,
      updatedBlog: blog
    });
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});

router.delete(`/blogs/:id`, async (req, res) => {
  try {
    let deletedBlog = await Blog.findByIdAndDelete({
      _id: req.params.id
    });
    if (deletedBlog) {
      res.json({
        status: true,
        message: "sucess"
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false
    });
  }
});
module.exports = router;