module.exports = function(id, data, session) {
  const fs = require("fs-extra");
  fs.writeJsonSync(`./data/users/${id}.json`, data);
  const file = fs.readJsonSync(`./data/users/${id}.json`);
  if(!("join" in file)) {
    const date = Date().split(" ");
    data.join = `${date[1]} ${date[2]} ${date[3]}`;
    fs.writeJsonSync(`./data/users/${id}.json`, data);
  }
  data.session = session;
  delete data.timeout;
  return data;
};