module.exports = function(config, uuid, id, session, positive, change, res) {
  const sessionChecker = require("../userdata/sessionchecker.js");
  if(sessionChecker(id, session)) {
    const setter = require("../userdata/coinsetter.js");
    const response = setter(id, positive, change);
    res.send(JSON.stringify(response));
  }else{
    res.send(JSON.stringify({
      "success": false
    }));
  }
  console.log(`Response to request ${uuid} sent from endpoint "/coin/set/".`);
};