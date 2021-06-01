module.exports = function(uuid) {
  const fs = require("fs-extra");
  if(fs.pathExistsSync(`./data/users/${uuid}.json`)) {
    const file = fs.readJsonSync(`./data/users${uuid}.json`);
    return file.bal;
  }else{
    return null;
  }
};