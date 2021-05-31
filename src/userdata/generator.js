module.exports = function(id, data) {
  const fs = require("fs-extra");
  fs.writeJsonSync(`./data/users/${id}.json`, data);
  const file = fs.readJsonSync(`./data/users/${id}.json`);
  if(!("join" in file)) {
    data.join = parseInt(Date().split(" ")[3]);
    fs.writeJsonSync(`./data/users/${id}.json`, data);
  }
  return data;
};