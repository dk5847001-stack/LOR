require("dotenv").config();

const path = require("path");
const express = require("express");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");

const connectDB = require("./config/dbConfig");
require("./config/cloudConfig");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const lorRoutes = require("./routes/lorRoutes");
const publicRoutes = require("./routes/publicRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(express.json({ limit: "2mb" }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
  name: "internovatech_lor.sid",
  secret: process.env.SESSION_SECRET || "dev-secret-change-me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" ? "auto" : false,
    maxAge: 1000 * 60 * 60 * 24,
  },
};

if (process.env.MONGO_URL) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions",
    touchAfter: 24 * 60 * 60,
  });
}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.currentAdmin = req.session.admin || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  next();
});

app.use("/", publicRoutes);
app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/admin/lor", lorRoutes);

app.use((req, res) => {
  res.status(404).render("public/home", {
    title: "Page Not Found",
    notFound: true,
  });
});

app.use((err, req, res, next) => {
  console.error("APP ERROR:", err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).render("public/home", {
    title: "Server Error",
    serverError: statusCode >= 500,
  });
});

app.listen(PORT, () => {
  console.log(`InternovaTech LOR app running on port ${PORT}`);
});
