module.exports = function(uuid, current, res) {
  //strict mode and imports
  "use strict";
  const fs = require("fs-extra");
  //create post obj
  let body = {posts:[], success: true};
  //check if next 3 posts exists, if they do add them
  current++;
  if(fs.pathExistsSync(`./data/posts/${current}.json`)) {
    body.posts.push(fs.readJsonSync(`./data/posts/${current}.json`));
  }
  current++;
  if(fs.pathExistsSync(`./data/posts/${current}.json`)) {
    body.posts.push(fs.readJsonSync(`./data/posts/${current}.json`));
  }
  current++;
  if(fs.pathExistsSync(`./data/posts/${current}.json`)) {
    body.posts.push(fs.readJsonSync(`./data/posts/${current}.json`));
  }
  //send response
  res.send(JSON.stringify(body));
  console.log(`Response to request ${uuid} sent from endpoint "/posts/fetch/".`);
};