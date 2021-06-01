module.exports = function(id, positive, change) {
  const fs = require("fs-extra");
  const file = fs.readJsonSync(`./data/users/${id}.json`);
  const oldBal = file.bal;
  if(positive) {
    file.bal = file.bal + change;
  }else{
    file.bal = file.bal - change;
  }
  fs.writeJsonSync(`./data/users${id}.json`, file);
  return {
    "success": true,
    "id": file.id,
    "oldBal": oldBal,
    "newBal": file.bal
  };
};