module.exports = function(id, change) {
  "use strict";
  const fse = require("fs-extra");
  if(fse.pathExistsSync(`../data/users/${id}.json`)) {
    const file = fse.readJsonSync(`../data/users/${id}.json`);
    file.bal += change;
    fse.writeJsonSync(`../data/users/${file}`, file);
  }
};