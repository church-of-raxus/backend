module.exports = function(config) {
  //updates files daily
  const fs = require("fs");
  const fse = require("fs-extra");
  const time = Date.now() - 86400000;
  fs.readdir("./data/users/", function(files) {
    for(let file of files) {
      const contents = fse.readJsonSync(`./data/users/${file}`);
      if(contents.timeout > time) {
        contents.bal += config.daily;
        fse.writeJsonSync(`./data/users/${file}`, contents);
      }
    }
  });
};