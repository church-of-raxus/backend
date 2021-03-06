module.exports = class {
  constructor(server, config) {
    console.log("Building endpoints");
    this.uuid = require("uuid");
    
    //root endpoint
    server.post("/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/". ID: ${uuid}`);
      res.setHeader("Content-Type", "text/plain");
      if(config.logging) {
        console.log(req.body);
      }
      res.send("{\"Seems like you didn't choose an endpoint.\": \":/\"}");
      console.log(`Response to request ${uuid} sent from endpoint "/".`);
    });
    
    //login endpoint
    server.post("/login/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/login/". ID: ${uuid}`);
      res.setHeader("Content-Type", "text/plain");
      if(config.logging) {
        console.log(req.body);
      }
      const data = JSON.parse(req.body);
      const responseBody = require("./login/login.js");
      responseBody(config, uuid, res, data.code);
    });
    
    //reauth endpoint
    server.post("/reauth/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/reauth/". ID: ${uuid}`);
      res.setHeader("Content-Type", "text/plain");
      if(config.logging) {
        console.log(req.body);
      }
      const data = JSON.parse(req.body);
      const responseBody = require("./login/reauth.js");
      responseBody(uuid, data.id, data.session, res);
    });

    //post fetcher endpoint
    server.post("/posts/fetch/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/posts/fetch/". ID: ${uuid}`);
      res.setHeader("Content-Type", "text/plain");
      if(config.logging) {
        console.log(req.body);
      }
      const data = JSON.parse(req.body);
      const responseBody = require("./posts/fetcher.js");
      responseBody(uuid, data.current ,res)
    });
    
    //send completion message
    console.log("Endpoints built");
  }
};