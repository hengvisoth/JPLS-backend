const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
