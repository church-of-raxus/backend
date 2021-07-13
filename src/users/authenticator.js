module.exports = function(id, session) {
  "use strict";
  //imports
  const hasher = require("crypto-js/sha256");
  const fs = require("fs-extra");
  //time and hash
  const time = Date.now();
  session = hasher(session).toString();
  if(fs.pathExistsSync(`../data/users/${id}.json`)) {
    const file = fs.readJsonSync(`../data/users/${id}.json`);
    if(file.session === session && file.timeout > time) {
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
};