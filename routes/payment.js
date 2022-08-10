const router = require("express").Router();
const moment = require("moment");
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51KGqWkHCcyZvTrDrTFSj7pSEPV59Cxo9blz5hlp01Li4YRv78lRagNBSNcTRQTfG5dWeIH9Y3QzwBAKYbGqY6LhZ00fZ1SgbLc"
);

const nodemailer = require("nodemailer");
const verifyToken = require("../middelwares/verify-token");
const Order = require("../models/order");

const SHIPMENT = {
  normal: {
    price: 13.98,
    days: 7
  },
  fast: {
    price: 49.98,
    days: 3
  }
};

function shipmentPrice(shipmentOption) {
  let estimated = moment()
    .add(shipmentOption.days, "d")
    .format("dddd MMMM Do");

  return { estimated, price: shipmentOption.price };
}

router.post("/shipment", (req, res) => {
  let shipment;
  if (req.body.shipment === "normal") {
    shipment = shipmentPrice(SHIPMENT.normal);
  } else {
    shipment = shipmentPrice(SHIPMENT.fast);
  }

  res.json({ success: true, shipment: shipment });
});

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
                user: "ajibadetolu23@gmail.com",
                pass: "sqnofymygviktpgp"
              }
            });

            let details = {
              from: "ajibadetolu23@gmail.com",
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

router.post("/payment", verifyToken, function(req, res) {
  let totalPrice = Math.round(req.body.totalPrice * 100);

  var newCharge = {
    amount: totalPrice,
    currency: "usd",
    source: req.body.token_from_stripe, // obtained with Stripe.js
    description: req.body.engravingText,
    email: req.body.email,
    name: req.body.name,
    shipping: {}
  };

  // trigger charge
  stripe.charges
    .create(newCharge, function(err, charge) {
      console.log(req.decoded.email);
      // send response
      if (err) {
        console.error(err);
        res.json({ error: err, charge: false });
      } else {
        var emailTemplate = `Hello ${req.decoded.name}, \n
        thank you for your order! \n
        Engraving: ${newCharge.description} \n
        Amount: ${newCharge.amount / 100} \n
        Your full order details are available at ecart.io/#/order-complete/${
          charge.id
        } \n
        For questions contact your_support_email@gmail.com \n 
        Thank you!`;
        let mailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "ajibadetolu23@gmail.com",
            pass: "sqnofymygviktpgp"
          }
        });

        let details = {
          from: "ajibadetolu23@gmail.com",
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
        // send response with charge data
        res.json({ error: false, charge: charge });
      }
    })
    .then(async charge => {
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
    })
    .catch(err => {
      res.status(500).json({
        success: false,
        message: err.message
      });
    });
});
router.post("/paymen", function(req, res) {
  let totalPrice = Math.round(req.body.totalPrice * 100);

  var newCharge = {
    amount: totalPrice,
    currency: "usd",
    source: "tok_visa", // obtained with Stripe.js
    email: email
    //  description: req.body.engravingText,
  };

  // trigger charge
  stripe.charges
    .create(newCharge, function(err, charge) {
      console.log(err);
      if (err) {
        console.error(err);
        //  res.json({ error: err, charge: false });
      } else {
        var emailTemplate = `Hello , \n
        thank you for your order! \n
        Engraving: ${newCharge.description} \n
        Amount: ${newCharge.amount / 100} \n
        Your full order details are available at ecart.io/#/order-complete/${
          charge.id
        } \n
        For questions contact your_support_email@gmail.com \n 
        Thank you!`;
        let mailTransporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "ajibadetolu23@gmail.com",
            pass: "sqnofymygviktpgp"
          }
        });

        let details = {
          from: "ajibadetolu23@gmail.com",
          to: "toluarejibadey@gmail.com",
          // to: `${req.decoded.email}`,
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
    })
    .then(async charge => {
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
