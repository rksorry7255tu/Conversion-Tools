express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeModel = require("./models/Employee");
const ContactModel = require("./models/ContactModel");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.URI);

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

app.post("/register", (req, res) => {
  EmployeeModel.create(req.body)
    .then((employees) => res.json(employees))
    .catch((err) => res.json(err));
});

app.post("/contact", (req, res) => {
  const { name, email, message } = req.body;
  // Create a new contact entry
  ContactModel.create({ name, email, message })
    .then((contact) => res.json(contact))
    .catch((err) =>
      res.status(500).json({ error: "Failed to save contact data." })
    );
});

app.listen(process.env.PORT, () => {
  console.log("server is running");
});
