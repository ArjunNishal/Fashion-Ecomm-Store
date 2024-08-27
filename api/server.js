const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const app = express();

const paneluserRoutes = require("./routes/panel/userRoutes");
const panelcatRoutes = require("./routes/panel/categoryRoutes");
const webcatRoutes = require("./routes/website/categoryRoutes");
const productroutespanel = require("./routes/panel/productRoutes");
const productroutes = require("./routes/website/productRoutes");
const authProductRoutes = require("./routes/website/auth Routes/AuthProductRoutes");
const authUserRoutes = require("./routes/website/auth Routes/AuthUserRoutes");
const paneluserLoginRoutes = require("./routes/panel/loginRoutes");
const webuserLoginRoutes = require("./routes/website/userloginRoutes");
const querypanelRoutes = require("./routes/panel/Query$ContactRoutes");
const queryWebRoutes = require("./routes/website/Query$ContactRoutes");
const orderRoutes = require("./routes/website/OrderRoutes");
const orderAuthRoutes = require("./routes/website/auth Routes/OrderRoutes");
const cartRoutes = require("./routes/website/cartRoutes");
const paymentRoutes = require("./routes/panel/Payment");
const panelOrderRoutes = require("./routes/panel/OrderRoutes");
const OffersRoutespanel = require("./routes/panel/offersRoutes");
const OffersRoutes = require("./routes/website/offersRoutes");
const newsletterRoutes = require("./routes/website/newsletterRoutes");
const newsletterRoutesPanel = require("./routes/panel/newsletterRoutes");

const authenticate = require("./middlewares/auth");
const userauth = require("./middlewares/userauth");

require("dotenv").config();

app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/uploads", express.static("./uploads"));

// routes============================= =========================
// panel routes
app.use("/api/panel/query", authenticate, querypanelRoutes);
app.use("/api/panel/user", authenticate, paneluserRoutes);
app.use("/api/panel/cat", authenticate, panelcatRoutes);
app.use("/api/panel/product", authenticate, productroutespanel);
app.use("/api/panel/order", authenticate, panelOrderRoutes);
app.use("/api/panel/offer", authenticate, OffersRoutespanel);
app.use("/api/panel/newsletter", authenticate, newsletterRoutesPanel);
app.use("/api/panel/auth", paneluserLoginRoutes);

// website routes
app.use("/api/client/product", productroutes);
app.use("/api/client/auth", webuserLoginRoutes);
app.use("/api/client/cat", webcatRoutes);
app.use("/api/client/query", queryWebRoutes);
app.use("/api/client/order", orderRoutes);
app.use("/api/client/offer", OffersRoutes);
app.use("/api/client/newsletter", newsletterRoutes);
// auth wb routes
app.use("/api/client/cart", userauth, cartRoutes);
app.use("/api/auth/client/order", userauth, orderAuthRoutes);
app.use("/api/auth/client/product", userauth, authProductRoutes);
app.use("/api/auth/client/user", userauth, authUserRoutes);

// payment routes
app.use("/api/payment", paymentRoutes);

// ============================================================

// db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("connected to mongo"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`App Listening on port ${process.env.PORT}`)
);
