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
  
    //coin setter endpoint
    server.post("/coin/set/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/coin/set/". ID: ${uuid}`);
      res.setHeader("Content-Type", "text/plain");
      if(config.logging) {
        console.log(req.body);
      }
      const data = JSON.parse(req.body);
      const responseBody = require("./coin/set.js");
      responseBody(config, uuid, data.id, data.session, data.positive, data.change, res);
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
    
    //send completion message
    console.log("Endpoints built");
  }
};