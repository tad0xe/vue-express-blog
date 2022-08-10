const router = require("express").Router();
const Order = require("../models/order");
const verifyToken = require("../middelwares/verify-token");

router.get("/orders", verifyToken, async (req, res) => {
  try {
    let products = await Order.find({ owner: req.decoded._id })
      .deepPopulate("owner products.productID.owner")
      .exec();
    res.json({
      success: true,
      products: products
    });
  } catch (err) {
      console.log(err)
    res.status(500).json({
      success: false, 
      message: err.messaage
    });
  }
});

module.exports = router;