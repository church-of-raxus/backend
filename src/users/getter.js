module.exports = function(uuid, user, res) {
  "use strict";
  //check if user exists, if so return user's name and pfp url, if not return false success
  const fs = require("fs-extra");
  if(fs.pathExistsSync(`../data/users/${user}.json`)) {
    const data = fs.readJsonSync(`../data/users/${user}.json`);
    res.send(JSON.stringify({
      success: true,
      id: data.id,
      username: `${data.username}#${data.discriminator}`,
      pfp: data.avatar,
      rank: data.rank,
      bal: data.bal
    }));
  }else{
    res.send(JSON.stringify({
      success: false
    }));
  }
  console.log(`Response to request ${uuid} sent from endpoint "/user/get/".`);
};