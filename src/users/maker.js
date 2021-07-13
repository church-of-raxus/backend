module.exports = function(id, data, session) {
  "use strict";
  //imports
  const fs = require("fs-extra");
  const file = fs.readJsonSync(`../data/users/${id}.json`);
  //dynamic values
  if("join" in file) {
    data.join = file.join;
  }else{
    const date = Date().split(" ");
    data.join = `${date[1]} ${date[2]} ${date[3]}`;
  }
  if("bal" in file) {
    data.bal = file.bal;
  }else{
    data.bal = 0;
  }
  if("rank" in file) {
    data.rank = file.rank;
  }else{
    data.rank = 0;
  }
  //save
  fs.writeJsonSync(`../data/users/${id}.json`, data);
  data.session = session;
  delete data.timeout;
  data.success = true;
  return data;
};