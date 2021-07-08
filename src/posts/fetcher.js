module.exports = function(uuid, current, res) {
  //strict mode and imports
  "use strict";
  const fs = require("fs-extra");
  //create post obj
  let body = {posts:[], success: true};
  //check if next 3 posts exists, if they do add them
  if(fs.pathExistsSync(`./data/posts/${current + 1}.json`)) {
    body.posts.push(fs.readJsonSync(`./data/posts/${current + 1}.json`));
  }
  if(fs.pathExistsSync(`./data/posts/${current + 2}.json`)) {
    body.posts.push(fs.readJsonSync(`./data/posts/${current + 2}.json`));
  }
  if(fs.pathExistsSync(`./data/posts/${current + 3}.json`)) {
    body.posts.push(fs.readJsonSync(`./data/posts/${current + 3}.json`));
  }
  //send response
  res.send(JSON.stringify(body));
  console.log(`Response to request ${uuid} sent from endpoint "/posts/fetch/".`);
};