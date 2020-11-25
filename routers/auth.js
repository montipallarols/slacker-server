const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models").user;
const Profile = require("../models").profile;
const List = require("../models").list
const { SALT_ROUNDS } = require("../config/constants");

const router = new Router();

router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res
          .status(400)
          .send({ message: "Please provide both email and password" });
      }
  
      const user = await User.findOne({ where: { email } });
  
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).send({
          message: "User with that email not found or password incorrect"
        });
      }
  
      const userProfile = await Profile.findOne({
        where: { userId: user.dataValues.id},
        include: [List],
      })
      console.log("userProfile", userProfile)
  
      delete user.dataValues["password"]; // don't send back the password hash
      const token = toJWT({ userId: user.id });
      return res.status(200).send({ token, ...user.dataValues, profile: userProfile });
    } catch (error) {
      console.log(error);
      return res.status(400).send({ message: "Something went wrong, sorry" });
    }
  });
  
  router.post("/signup", async (req, res) => {
    const { email, password, fullName, imageUrl } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).send("Please provide an email, password and a name");
    }
    
    try {
        const newUser = await User.create({
        fullName,
        email,
        password: bcrypt.hashSync(password, SALT_ROUNDS)
      });
      console.log("new user id", newUser.id)

      delete newUser.dataValues["password"]; // don't send back the password hash
  
      const token = toJWT({ userId: newUser.id });

      const newProfile = await Profile.create({
        fullName: newUser.fullName,
        imageUrl: "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png",
        userId: newUser.id
      })

      const newList = await List.create([{
        type:`${newUser.fullName}'s Favourites`,
        profileId: newProfile.id,
      }, 
    { 
        type: `${newUser.fullName}'s Library`,
        profileId: newProfile.id,
    }, 
    { 
        type: `${newUser.fullName}'s Wishlist`,
        profileId: newProfile.id,
    }, 
]);
  
      console.log("New user", newUser)
      console.log("New profile", newProfile)
     
      console.log("New Profile created on signup", newProfile.dataValues)
  
      res.status(201).json({ token, ...newUser.dataValues, ...newProfile.dataValues, ...newList.dataValues });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res
          .status(400)
          .send({ message: "There is an existing account with this email" });
      }
  
      return res.status(400).send({ message: "Something went wrong, sorry" });
    }
  });
  

//   router.post("/profile", async (req, res) => {
//     const newProfile = await Profile.create({
//         // fullName,
//         // imageUrl,
//         userId: newUser.id
//       })
//       console.log("new profile", newProfile)
//       res.status(200).send(newProfile);
//   })

  
  



  // The /me endpoint can be used to:
  // - get the users email & name using only their token
  // - checking if a token is (still) valid
  router.get("/me", authMiddleware, async (req, res) => {
    // don't send back the password hash
    
    delete req.user.dataValues["password"];
  
    res.status(200).send({ ...req.user.dataValues });
    console.log("Req User DataValues", req.user.dataValues)
  });


  module.exports = router;