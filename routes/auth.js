import express from "express";
import User from "../admin/user.js";
import { body, validationResult } from 'express-validator';
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
const router = express.Router();

router.post("/createAdmin", [
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
body('email', "Enter a valid email").isEmail()], async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const numberOfRows = await User.countDocuments();

    if (numberOfRows > 0) {
      return res.status(400).send("Admin already exists, Login");
    }

    // Continue with saving the user if validation passes
   // const saltRounds = 10

    const user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
     req.body.password = await bcrypt.hash(req.body.password, salt)
    await user.save();
    res.send(req.body);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
      user: 'rohitpotnuru2003@gmail.com', // Your Gmail email address
      pass: 'acsqcrequanwmgso' // Your Gmail password
  }
});

router.get('/forgot-password', (req, res) => {
  // Email content
  const mailOptions = {
      from: 'rohitpotnuru2003@gmail.com', // Sender address
      to: '421242@student.nitandhra.ac.in', // List of recipients
      subject: 'Forgot Password', // Subject line
      text: 'Please reset your password using the link provided in the email.' // Plain text body
  };

  // Send email
  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.error('Error occurred:', error.message);
          res.status(500).send('Failed to send email');
      } else {
          console.log('Email sent successfully!');
          console.log('Message ID:', info.messageId);
          res.send('Email sent successfully!');
      }
  });
});
router.post("/login", body('email', "Enter a valid email").isEmail(),
 async (req, res) => {
    try {
        let success = false;
        let eml = req.body.email;
        let pwd = req.body.password;
        let user = await User.findOne( { email: eml } );
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const { _id, username, email, password, __v } = user;
        // const salt = await bcrypt.genSalt(10);
        // const secPass = await bcrypt.hash(req.body.password, salt)
        if(email===eml && password===pwd) {
            success = true;
            res.json({success, username:username, email:email, password:password});
        }
        else {
            res.status(400).json({success, message:"Invalid credentials"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({success, message:"Internal Server Error"});
    }
})  
  

export default router;
