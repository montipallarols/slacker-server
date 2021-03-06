const User = require("../models").user;
const Profile = require("../models").profile;
const List = require("../models").list;
const { toData } = require("./jwt");

async function auth(req, res, next) {
  const auth =
    req.headers.authorization && req.headers.authorization.split(" ");


  if (!auth || !auth[0] === "Bearer" || !auth[1]) {
    res.status(401).send({
      message:
        "This endpoint requires an Authorization header with a valid token"
    });
  }

  try {
    const data = toData(auth[1]);

    const user = await User.findByPk(data.userId, {include: {model: Profile}});
    
    if (!user) {
      return res.status(404).send({ message: "User does not exist" });
    }
    console.log("USER WITH PROFILE", user.dataValues.profile)

    const userProfile = await Profile.findOne({
        where: { userId: user.dataValues.id}
      })
    console.log("Middleware user Profile", userProfile.dataValues)
    
    
    

    // add user object to request
    req.user = user
  
    // res.send({profile: userProfile.dataValues.profile})
    // next handler
    return next();
  } catch (error) {
    console.log("ERROR IN AUTH MIDDLEWARE", error);

    switch (error.name) {
      case "TokenExpiredError":
        return res
          .status(401)
          .send({ error: error.name, message: error.message });

      case "JsonWebTokenError":
        return res
          .status(400)
          .send({ error: error.name, message: error.message });

      default:
        return res.status(400).send({
          message: "Something went wrong, sorry"
        });
    }
  }
}

module.exports = auth;
