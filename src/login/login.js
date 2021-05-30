module.exports = function(config, uuid, res, code) {
  const fetch = require("node-fetch");
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
          res.send(JSON.stringify({
            "id": json.id,
            "username": json.username,
            "avatar": json.avatar,
            "discriminator": json.discriminator
          }));
        }else{
          res.send(JSON.stringify(json));
        }
      });
    }else{
      res.send(JSON.stringify(json));
    }
    console.log(`Response to request ${uuid} sent from endpoint "/login/".`);
  });
};