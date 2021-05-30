module.exports = function(id, data) {
  const fs = require("fs-extra");
  fs.writeJsonSync(`./data/users/${id}.json`, data);
};