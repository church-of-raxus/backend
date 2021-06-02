module.exports = function(uuid, id, session, res) {
  const verifier = require("../userdata/sessionchecker.js");
  const fs = require("fs-extra");
  if(verifier(id, session)) {
    let file = fs.readJsonSync(`./data/users/${id}.json`);
    file.timeout += 600000;
    res.send(JSON.stringify({
      "success": true
    }));
  }else{
    res.send(JSON.stringify({
      "success": false
    }));
  }
  console.log(`Response to request ${uuid} sent from endpoint "/reauth/".`);
};