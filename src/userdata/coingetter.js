module.exports = function(id) {
  const fs = require("fs-extra");
  if(fs.pathExistsSync(`./data/users/${id}.json`)) {
    const file = fs.readJsonSync(`./data/users${id}.json`);
    return file.bal;
  }else{
    return null;
  }
};