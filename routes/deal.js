const Product = require("../models/deal");
const express = require("express");

const upload = require("../middelwares/upload-photo");
const router = express.Router();

router.post(`/deals`, upload.single("photo"), async (req, res) => {
  console.log(res)
  try {

    let product = new Product();

    product.title = req.body.title;
    product.description = req.body.description;
   // product.photo = req.file.location;
    product.price = req.body.price;
    product.stockQuantity = req.body.stockQuantity;


    await product.save();
    console.log(Product)
    res.json({
      status: true,
      message: "save succes"
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, });
  }
});


router.get(`/deals`, async (req, res) => {

  try {
    let blogs = await Blog.find(filter)
      .populate("owner category")
      .exec();

    res.json({
      status: true,
      blogs: blogs
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
router.get(`/deals/:id`, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id})
      .populate("owner category")
      .exec();
    res.json({
      status: true,
      product: product
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});


router.put(`/deals/:id`, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          price: req.body.price,
          description: req.body.description,
          photo: req.body.photo,
          stockQuantity: req.body.stockQuantity,
          category: req.body.categoryID,
          owner: req.body.ownerID
        }
      },
      {
        upsert: true
      }
    );

    res.json({
      status: true,
      updatedProduct: product
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

router.delete(`/deals/:id`, async (req, res) => {
  try {
    let deletedProduct = await Product.findByIdAndDelete({
      _id: req.params.id
    });
    if (deletedProduct) {
      res.json({
        status: true,
        message: "sucess"
      });
    }
  } catch (error) {
    res.status(500).json({ success: false });
  }
});
module.exports = router;
