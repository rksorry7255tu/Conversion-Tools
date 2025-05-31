const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const ContactModel = require("./models/ContactModel");
require("dotenv").config();

const app = express();
app.use(express.json());

// Configure CORS to allow requests from your frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Allow local development
      "https://willowy-biscochitos-2af948.netlify.app", // Allow production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Connect to MongoDB with increased timeout
mongoose
  .connect(process.env.URI, {
    tls: true, // Enable TLS
    tlsInsecure: true, // Disable SSL verification (for development only)
    serverSelectionTimeoutMS: 20000, // Increase timeout to 20 seconds
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Keep your login route as-is, without changes
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (user.password === password) {
        res.json("success");
      } else {
        res.json("the password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  });
});

// Improved register route with proper status codes and error handling
app.post("/register", (req, res) => {
  EmployeeModel.create(req.body)
    .then((employee) => res.status(201).json(employee))
    .catch((err) =>
      res
        .status(400)
        .json({ error: "Failed to register employee.", details: err })
    );
});

// Improved contact route with proper response and error handling
app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  ContactModel.create({ name, email, message })
    .then((contact) => res.status(201).json(contact))
    .catch((err) =>
      res
        .status(500)
        .json({ error: "Failed to save contact data.", details: err })
    );
});

// New route: fetch all employees for demonstration
app.get("/employees", (req, res) => {
  EmployeeModel.find()
    .then((employees) => res.status(200).json(employees))
    .catch((err) =>
      res
        .status(500)
        .json({ error: "Failed to fetch employees.", details: err })
    );
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
