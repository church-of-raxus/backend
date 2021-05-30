module.exports = function(type, code) {
  const fetch = require("node-fetch");
  fetch("https://discord.com/api/users/@me", {
    headers: {
      authorization: `${type} ${code}`,
    },
  }).then(res => res.json()).then(json => console.log(json));
};