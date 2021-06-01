module.exports = function(config, uuid, res) {
  const getter = require("../userdata/coingetter.js");
  const bal = getter(uuid);
  if(config.logging) {
    console.log(bal);
  }
  res.send({
    "balance": bal
  });
};