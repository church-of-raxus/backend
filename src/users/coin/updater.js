module.exports = function(config) {
  //updates files daily
  "use strict";
  const fs = require("fs");
  const fse = require("fs-extra");
  const time = Date.now() - 86400000;
  fs.readdir("../data/users/", function(err, files) {
    if(err) {
      throw err;
    }
    for(let file of files) {
      const contents = fse.readJsonSync(`../data/users/${file}`);
      if(contents.timeout > time) {
        const balUpdater = require("./setter.js");
        file = file.split(".json")[0];
        balUpdater(file, config.daily);
      }
    }
  });
};