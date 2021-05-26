module.exports = class {
  constructor() {
    //imports
    this.fs = require("fs");
    this.yaml = require("yaml");
    this.uuid = require("uuid");
    
    //init express
    const express = require("express");
    this.server = express();
    
    //load config
    try {
      this.config = this.yaml.parse(this.fs.readFileSync("./config.yml", "utf8"));
    }catch(e) {
      console.error(e);
      console.log("Config Loading Failed");
      console.log("Node.js Application Unloaded");
      process.exit(1);
    }
  }
  
  get main() {
    //init endpoints
    this.server.get("/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/" by ${req.hostname}. ID: ${uuid}`);
      res.send("Hello World!");
      console.log(`Response to request ${uuid} from ${req.hostname} sent from endpoint "/".`);
    });
    
    //init server
    this.server.listen(this.config.port, () => {
      console.log(`Express server listening at http://0.0.0.0:${this.config.port}`);
    });
    
    //log success
    console.log("Node.js Application Loaded");
    
    //wait for stop command
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question("", command => {
      if(command === "stop") {
        process.exit();
      }
    });
    return null;
  }
};