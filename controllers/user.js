/* eslint-disable */

const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")

exports.user_get = async (req, res) => {
  try {
    const { username } = req.userData;
    const user = await User.findOne({ username });
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json(null);
  }
};


exports.user_signup = async (req, res) => {
  try {
    //destructure username and password from req.body
    const { username, password } = req.body;
    // check if username exists
    const user = await User.findOne({ username });
    if (user)
      return res.status(409).json({ message: "username already exists"});
    // if the user doesn't exist we create a new user
    const newUser = new User({
      username,
      password,
    });
    // encrypt the password
    bcrypt.genSalt(parseInt(process.env.salt_rounds), (err, salt) => {
      bcrypt.hash(newUser.password, salt, async (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        await newUser.save();
        return res.status(201).json({ message: "User created successfully" });
      });
    });

  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message});
  }
};


exports.user_login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(404).json({ message: "Incorrect username", token: null });
    //if user is found we compare the password that the user entered (not the hashed one) with the
    // hashed password that is stored in the database
    bcrypt.compare(password, user.password).then((result) => {
      //result is boolean. it's true if the compare is succesful, else false.
      if (!result)
        return res
          .status(401)
          .json({ message: "Incorrect password", token: null });
      const token = jwt.sign(
        { username: user.username, userId: user._id },
        process.env.JWT_KEY,
        {
          expiresIn: "30d",
        }
      );
      return res.status(200).json({ message: "Logged in successfully", token });
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, token: null });
  }
};

exports.user_forgetPassword = async (req,res) => {
  try {
    let user = await User.findOne({ username: req.body.username });
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Generate OTP
    let otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

    // Update user with OTP and expiration time (30 minutes)
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now
    await user.save();


    // Send OTP to user email
    var transport = nodemailer.createTransport({
      service : "gmail",
      auth: {
        user: "hengsoth68@gmail.com",
        pass: "qwgzcocppdiersnw"
      }
    });
    let info = await transport.sendMail({
        from: 'hengsoth68@gmail.com',
        to: user.username,
        subject: 'Optimus Veritification Code',
        text: `Your OTP code is ${otp}`
    });

    res.send({ message: 'OTP sent to email', info : info });
} catch (error) {
  console.log("Error in forget password",error)
    res.status(500).send({ message: error.message });
}
}

exports.verifyOTP = async(req,res) => {
  try {
    let user = await User.findOne({ username: req.body.email });
    console.log(user)
    if (!user) {
        return res.status(404).send({ message: 'User not found' });
    }

    // Check OTP and expiration
    if (user.otp === req.body.otp && Date.now() <= user.otpExpires) {
      console.log("BODY PASSWORD",req.body.newPassword)
      bcrypt.genSalt(parseInt(process.env.salt_rounds), (err, salt) => {
        bcrypt.hash(req.body.newPassword, salt, async (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.otp = undefined;
          user.otpExpires = undefined;
          await user.save();
  
          res.send({ message: 'Password updated successfully' });
        });
      });
        
    } else {
        res.status(400).send({ message: 'Invalid OTP or OTP has expired' });
    }
} catch (error) {
  console.log("Error in verify password",error)

    res.status(500).send({ message: error.message });
}
}
