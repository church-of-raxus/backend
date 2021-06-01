module.exports = function(config, uuid, id, res) {
  const getter = require("../userdata/coingetter.js");
  const bal = getter(id);
  if(config.logging) {
    console.log(bal);
  }
  res.send(JSON.stringify({
    "id": id,
    "balance": bal
  }));
  console.log(`Response to request ${uuid} sent from endpoint "/coin/get/".`);
};