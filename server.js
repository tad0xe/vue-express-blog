const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const Stripe = require("stripe");

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();
const router = express.Router();
const productsRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");
const ownerRoutes = require("./routes/owner");
const userRoutes = require("./routes/auth");

const paymentRoutes = require("./routes/payment");

const orderRoutes = require("./routes/order");

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", productsRoutes);

app.use("/api", categoryRoutes);
app.use("/api", ownerRoutes);
app.use("/api", userRoutes);

app.use("/api", paymentRoutes);

app.use("/api", orderRoutes);
//connect to mongodb

/*mongoose
  .connect( process.env.CONNECTION_STRING)
  .then(() => {
    console.log(`Listening on ${ PORT }`);
  })
  .catch(err => console.log(err)); 
 */

mongoose
  .connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true,

    autoIndex: true //make this also true
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch(err => {
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

//const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
app.get("/h", (req, res) => {
  res.send("Successful response.");
});
app.use("/", router);
// get data for charge by id

//app.listen(port, function() {
//console.log(`api running on port ${port}`);
//});
