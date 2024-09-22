const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require("jsonwebtoken");
dotenv.config();
const {OAuth2Client} = require('google-auth-library');
const fetch = require('node-fetch');
const User = require("../../models/User_model");

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1d'})
}

async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    if (!response.ok) throw new Error(`Failed to fetch user data: ${response.statusText}`);
    const data = await response.json();
    console.log('DATA: ',data);
    return data;
  }

  const createUserFromGoogle = async (userData) => {
    try {
      const user = await User.create({
        firstname: userData.given_name,
        lastname: userData.family_name,
        googleId: userData.sub,
        email: "dilhariedissanayake@gmail.com",
        password: null,
      });
  
      const token = createToken(user._id);
      return { user, token };
    } catch (err) {
      throw new Error(`Error creating user from Google data: ${err.message}`);
    }
  };

  router.get('/', async function (req, res) {
    const code = req.query.code;
    try {
        const redirectUrl = 'http://127.0.0.1:4000/oauth';
        const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET,redirectUrl);

        const { tokens } = await oAuth2Client.getToken(code);
        console.log('TOKENS: ',tokens);

        oAuth2Client.setCredentials(tokens);

        const userData = await getUserData(tokens.access_token);

        let user = await User.findOne({ email: "dilhariedissanayake@gmail.com" });
        if (!user) {
          const { user: newUser, token } = await createUserFromGoogle(userData);
          user = newUser;
          res.redirect(`http://localhost:3000/oauth-callback?token=${token}`);
        } else {
          const token = createToken(user._id);
          res.redirect(`http://localhost:3000/oauth-callback?token=${token}`);
        }
    } catch(err) {
      console.error("Error with signing in with Google:", err);
      res.status(500).send("Error with Google authentication");
    }
  });

  router.get('/oauth-callback', (req, res) => {
    res.send("OAuth callback processed");
  });

  module.exports = router;