module.exports = function(id, data, session) {
  const fs = require("fs-extra");
  const file = fs.readJsonSync(`./data/users/${id}.json`);
  console.log(data);
  console.log(file);
  if(!("join" in file)) {
    const date = Date().split(" ");
    data.join = `${date[1]} ${date[2]} ${date[3]}`;
  }
  console.log(data);
  if(!("bal" in file)) {
    data.bal = 0;
  }
  console.log(data);
  fs.writeJsonSync(`./data/users/${id}.json`, data);
  data.session = session;
  delete data.timeout;
  return data;
};