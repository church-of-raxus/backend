module.exports = class {
  constructor() {
    //imports
    this.fs = require("fs-extra");
    this.yaml = require("yaml");
    this.uuid = require("uuid");
    this.sh = require("shelljs");
    this.sh.config.verbose = true;
    console.log("Modules imported");
    
    //init express
    const express = require("express");
    this.server = express();
    console.log("Express initated");
  
    //load config
    const config = this.fs.readFileSync("./src/config.yml", "utf8");
    if(!this.fs.existsSync("./data/config.yml")) {
      this.fs.mkdirsSync("./data/");
      this.fs.writeFileSync("./data/config.yml", config);
      throw "Please setup your local data and/or config!";
    }
    this.config = this.yaml.parse(this.fs.readFileSync("./data/config.yml", "utf8"));
    console.log("Config loaded");
    
    if(!this.config.enable) {
      throw "Config disabled, server is not allowed to start";
    }else{
      console.log("Config enabled, continuing");
    }
    
    //enable ssl
    this.ssl = false;
    if(this.config.ssl.enable === true) {
      this.ssl = true;
      if(!this.fs.existsSync("./src/ssl/")) {
        throw "You need to put ssl certificates in ./src/ssl/";
      }
    }
  }
  
  main() {
    //init endpoints
    this.server.get("/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/" by ${req.hostname}. ID: ${uuid}`);
      res.send("Hello World!");
      console.log(`Response to request ${uuid} from ${req.hostname} sent from endpoint "/".`);
    });
    console.log("Root endpoint initated");
    
    //init server
    this.server.listen(this.config.port, this.config.hostname, () => {
      if(this.ssl === true) {
        console.log(`Express server listening at https://${this.config.hostname}:${this.config.port}`);
      }else{
        console.log(`Express server listening at http://${this.config.hostname}:${this.config.port}`);
      }
    });
    
    //log finish
    console.log("Node.js Application Loaded");
    console.log("Async code might not have run yet");
    console.log("Send the command \"stop\" to gracefully stop the server");
    
    //wait for stop command
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question("", command => {
      if(command === "stop") {
        if(this.config.ssl.forceRegen && this.fs.pathExistsSync("./src/ssl/")) {
          this.fs.removeSync("./src/ssl/");
        }
        process.exit();
      }
    });
    return null;
  }
};