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
      responseBody(data.type, data.code, res);
      // res.send("{\"Seems like you didn't choose an endpoint.\": \":/\"}");
    });
    
    //send completion message
    console.log("Endpoints built");
  }
};