const router = require("express").Router();
const moment = require("moment");
const Stripe = require("stripe");
const stripe = Stripe("sk_test_bLc");

const nodemailer = require("nodemailer");
const verifyToken = require("../middelwares/verify-token");
const Order = require("../models/order");

router.post("/pay", verifyToken, (req, res) => {
  let totalPrice = Math.round(req.body.totalPrice * 100);
  stripe.customers
    .create({
      email: req.decoded.email
    })
    .then(customer => {
      return stripe.customers.createSource(customer.id, {
        source: "tok_visa"
      });
    })
    .then(source => {
      return stripe.charges.create(
        {
          amount: totalPrice,
          currency: "usd",
          customer: source.customer,
          email: req.body.email
        },

        function(err, charge) {
          if (err) {
            console.log(err);
          } else {
            var emailTemplate = `Hello ${req.decoded.name}, \n
  thank you for your order! \n

  Amount: ${charge.amount / 100} \n
  Your full order details are available at ecart.io/#/order-complete/${
    charge.id
  } \n
  For questions contact your_support_email@gmail.com \n 
  Thank you!`;
            let mailTransporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: process.env.GOOGLE_APP_EMAIL,
                pass: process.env.GOOGLE_APP_PW
              }
            });

            let details = {
              from: process.env.GOOGLE_APP_EMAIL,
              to: `${req.decoded.email}`,
              subject: "shipping",
              text: emailTemplate
            };
            mailTransporter.sendMail(details, err => {
              if (err) {
                console.log(err);
              } else {
                console.log("email sent");
              }
            });
          }
        }
      );
    })
    .then(async charge => {
      console.log("charge>", charge);
      let order = new Order();
      let cart = req.body.cart;

      cart.map(product => {
        order.products.push({
          productID: product._id,
          quantity: parseInt(product.quantity),
          price: product.price
        });
      });

      order.owner = req.decoded._id;
      order.estimatedDelivery = req.body.estimatedDelivery;
      await order.save();

      res.json({
        success: true,
        message: "Successfully made a payment"
      });
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
});

// get data for charge by id
router.get("/charge/:id", function(req, res) {
  stripe.charges.retrieve(req.params.id, function(err, charge) {
    if (err) {
      res.json({ error: err, charge: false });
    } else {
      res.json({ error: false, charge: charge });
    }
  });
});

module.exports = router;
