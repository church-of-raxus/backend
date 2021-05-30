module.exports = function(type, code, res) {
  const fetch = require("node-fetch");
  fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${type} ${code}`,
    },
  }).then(res => res.json()).then(json => {
    console.log(json);
    res.send(JSON.stringify(json));
    console.log(`Response to request ${uuid} sent from endpoint "/login/".`);
  });
};