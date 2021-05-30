module.exports = function(id, data) {
  const fs = require("fs-extra");
  fs.ensureFileSync(`./data/users/${id}.json`);
  const file = fs.readJsonSync(`./data/users/${id}.json`);
  if("id" in file && "username" in file && "avatar" in file && "discriminator" in file) {
    data.data = 1;
    return data;
  }else{
    fs.writeJsonSync(`./data/users/${id}.json`, data);
    data.data = 0;
    return data;
  }
};