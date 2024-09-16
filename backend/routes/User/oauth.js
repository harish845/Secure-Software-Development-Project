const express = require("express");
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();
const {OAuth2Client} = require('google-auth-library');
const fetch = require('node-fetch');

async function getUserData(access_token) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`);
    if (!response.ok) throw new Error(`Failed to fetch user data: ${response.statusText}`);
    const data = await response.json();
    console.log('DATA: ',data);
    return data;
  }

  router.get('/', async function (req, res, next) {
    const code = req.query.code;
    try {
        const redirectUrl = 'http://127.0.0.1:4000/oauth';
        const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET,redirectUrl);

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        console.log('Token acquired:', tokens);
        const userData = await getUserData(tokens.access_token);
        
        res.json({ 
          success: true, 
          userData,
          redirectUrl: 'http://localhost:3000/profile-home' // URL to redirect on frontend
      });
    } catch(err) {
      console.error("Error with signing in with Google:", err);
      res.status(500).send("Error with Google authentication");
    }
  })

  module.exports = router;