module.exports = function(id) {
  //return coins if user file exists, return null otherwise
  const fs = require("fs-extra");
  if(fs.pathExistsSync(`./data/users/${id}.json`)) {
    const file = fs.readJsonSync(`./data/users/${id}.json`);
    return file.bal;
  }else{
    return null;
  }
};