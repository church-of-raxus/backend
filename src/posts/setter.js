module.exports = function(uuid, id, session, title, bodyTitle, body, color, img, res) {
  "use strict";
  //imports
  const verifier = require("../users/authenticator.js");
  const fse = require("fs-extra");
  const fs = require("fs");
  //auth user, then make post and return success or return failure if user isnt authenticated
  if(verifier(id, session)) {
    //build post
    const postId = fs.readdirSync("../data/posts/").length + 1;
    const colors = ["rgba(156, 39, 176, 1)", "rgba(255, 64, 129, 1)", "rgba(244, 67, 54, 1)", "rgba(33, 150, 243, 1)", "rgba(76, 175, 80, 1)"];
    /* TODO: add this in when ready to add type checking and xss protection
     * let postColor = "";
     * if(color <= 4 && color >= 0) {
     *   postColor = colors[color];
     * }else{
     *   postColor = "ff4081";
     * }
     */
    const postColor = colors[color];
    const post = {
      header: title,
      author: id,
      color: postColor,
      image: img,
      body: {
        title: bodyTitle,
        description: body,
      }
    };
    //save post
    fse.writeJsonSync(`../data/posts/${postId}.json`, post);
    res.send(JSON.stringify({
      success: true
    }));
    console.log(`Response to ${uuid} sent from endpoint /posts/make/`);
  }else{
    res.send(JSON.stringify({
      success: false
    }));
    console.log(`Response to ${uuid} sent from endpoint /posts/make/`);
  }
};