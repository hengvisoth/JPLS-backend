const userModel = require("../models/user");
const bcrypt = require("bcrypt");

module.exports = async () => {
  try {
    //check if the default user has already been created
    const user = await userModel.findOne();
    //if not, create it.
    if (!user) {
      //hash the password.
      bcrypt.hash(
        process.env.pw,
        parseInt(process.env.salt_rounds),
        async (err, hashedPassword) => {
          if (err) {
            console.log(err);
            return;
          }
          const newUser = await userModel.create({
            password: hashedPassword,
            username: process.env.admin,
          });
          console.log("Root user created successfully");
        }
      );
    }
  } catch (error) {
    console.log(error.message);
  }
};
