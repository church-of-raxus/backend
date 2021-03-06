module.exports = function(config, uuid, res, code) {
  const fetch = require("node-fetch");
  const uuidGen = require("uuid");
  const hasher = require("crypto-js/sha256");
  //fetch discord token from auth code
  fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: new URLSearchParams({
      client_id: config.discord.id,
      client_secret: config.discord.secret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.discord.url,
      scope: "identify",
    }),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  }).then(data => data.json()).then(json => {
    if(config.logging) {
      console.log(json);
    }
    //if auth was successful, fetch user metadata
    //if not, return error
    if(!("error" in json)) {
      fetch("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${json.token_type} ${json.access_token}`,
        },
      }).then(data => data.json()).then(json => {
        if(config.logging) {
          console.log(json);
        }
        //if auth was successful, return user metadata
        //if not, return error
        if(!("message" in json)) {
          //generate session id
          let session = uuidGen.v4();
          let timeout = Date.now() + 600000;
          let hashedSession = hasher(session).toString();
          let data = {
            "id": json.id,
            "username": json.username,
            "avatar": json.avatar,
            "discriminator": json.discriminator,
            "session": hashedSession,
            "timeout": timeout
          };
          const userDataGenerator = require("../userdata/generator.js");
          const response = userDataGenerator(json.id, data, session);
          res.send(JSON.stringify(response));
        }else{
          res.send(JSON.stringify({
            "success": false
          }));
        }
      });
    }else{
      res.send(JSON.stringify({
        "success": false
      }));
    }
    console.log(`Response to request ${uuid} sent from endpoint "/login/".`);
  });
};