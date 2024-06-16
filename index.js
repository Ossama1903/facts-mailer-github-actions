const express = require("express");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Load fun facts
const funFacts = JSON.parse(fs.readFileSync("fun_facts.json", "utf8"));

// Email configuration
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const generateEmailHTML = (fact) => {
  const template = fs.readFileSync(
    path.join(__dirname, "emailTemplate.html"),
    "utf8"
  );
  return template.replace("{{facts}}", fact);
};

// Route to send fun fact email
app.get("/send-fun-fact", (req, res) => {
  // Select a random fun fact
  const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)].fact;

  // List of recipients
  const recipients = [
    "sheikhusamabilal@gmail.com",
    // "m.zainhassanbaloch@gmail.com",
    "zain57ul@gmail.com",
    "dev.mzain@gmail.com",
  ];

  // Email content
  let mailOptions = {
    from: process.env.EMAIL,
    to: recipients.join(", "),
    subject: "Here's your fun fact of the day!",
    html: generateEmailHTML(randomFact),
  };

  // Send email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.send("Email sent successfully");
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
