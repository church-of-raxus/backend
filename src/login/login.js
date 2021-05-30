module.exports = function(config, uuid, exp, code) {
  const fetch = require("node-fetch");
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
  }).then(res => res.json()).then(json => {
    console.log(json);
    exp.send("yee haw");
    // fetch("https://discord.com/api/users/@me", {
    //   headers: {
    //     authorization: `${type} ${code}`,
    //   },
    // }).then(res => res.json()).then(json => {
    //   console.log(json);
    //   res.send(JSON.stringify(json));
    //   console.log(`Response to request ${uuid} sent from endpoint "/login/".`);
    // });
  });
};