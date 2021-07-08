module.exports = function(uuid, current, res) {
  "use strict";
  const fs = require("fs-extra");
  let body = {posts:[]};
  if(fs.pathExistsSync(`./data/posts/${current + 1}.json`)) {
    body.posts.first = fs.readJsonSync(`./data/posts/${current + 1}.json`);
  }
  if(fs.pathExistsSync(`./data/posts/${current + 2}.json`)) {
    body.posts.second = fs.readJsonSync(`./data/posts/${current + 2}.json`);
  }
  if(fs.pathExistsSync(`./data/posts/${current + 3}.json`)) {
    body.posts.third = fs.readJsonSync(`./data/posts/${current + 3}.json`);
  }
  res.send(body);
  console.log(`Response to request ${uuid} sent from endpoint "/posts/fetch/".`);
};