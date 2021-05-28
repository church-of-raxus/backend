module.exports = class {
  constructor() {
    //load imports
    this.fs = require("fs-extra");
    this.yaml = require("yaml");
    this.uuid = require("uuid");
    this.sh = require("shelljs");
    this.sh.config.verbose = true;
    this.cors = require("cors");
    this.https = require("https");
    console.log("Modules imported");
    
    //load express
    const express = require("express");
    this.server = express();
    console.log("Express loaded");
  
    //load config
    const config = this.fs.readFileSync("./src/config.yml", "utf8");
    if(!this.fs.existsSync("./data/config.yml")) {
      this.fs.mkdirsSync("./data/");
      this.fs.writeFileSync("./data/config.yml", config);
      throw "Please setup your local data and/or config!";
    }
    this.config = this.yaml.parse(this.fs.readFileSync("./data/config.yml", "utf8"));
    console.log("Config loaded");
    
    //check if server is enabled
    if(!this.config.enable) {
      throw "Server disabled, stopping";
    }else{
      console.log("Server enabled, continuing");
    }
  
    //use CORS
    if(this.config.cors) {
      this.server.use(this.cors);
      console.log("Express using CORS");
    }
    
    //enable ssl
    this.ssl = false;
    if(this.config.ssl.enable) {
      this.ssl = true;
      if(!this.fs.existsSync(this.config.ssl.location.folder)) {
        throw `You need to put ssl certificates in ${this.config.ssl.location.key} and ${this.config.ssl.location.fullchain}`;
      }
      this.secureserver = this.https.createServer({
        key: this.fs.readFileSync(this.config.ssl.location.key),
        cert: this.fs.readFileSync(this.config.ssl.location.fullchain)
      }, this.server);
      console.log("SSL enabled");
    }
  }
  
  main() {
    //load endpoints
    this.server.get("/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/" by ${req.hostname}. ID: ${uuid}`);
      res.send("Hello World!");
      console.log(`Response to request ${uuid} from ${req.hostname} sent from endpoint "/".`);
    });
    console.log("Root endpoint loaded");
    
    //load server
    if(this.ssl) {
      this.secureserver.listen(this.config.port, this.config.hostname, () => {
        console.log(`HTTPS server listening at https://${this.config.hostname}:${this.config.port}`);
      });
    }else{
      this.server.listen(this.config.port, this.config.hostname, () => {
        console.log(`HTTP server listening at http://${this.config.hostname}:${this.config.port}`);
      });
    }
    
    //log finish
    console.log("Node.js Application Loaded");
    console.log("Async code might not have run yet");
    console.log("Send the command \"stop\" to gracefully stop the server");
    
    //stop server
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question("", command => {
      if(command === "stop") {
        console.log("SSL certs were NOT removed");
        console.log("If you need to remove them, either do it manually or stop the server with \"prodstop\"");
        console.log("Node.js Application Unloaded");
        console.log("Goodbye");
        process.exit();
      }else if(command === "prodstop") {
        if(this.fs.pathExistsSync("./data/ssl/")) {
          this.fs.removeSync("./data/ssl/");
          console.log("SSL certs removed");
        }else{
          console.log("SSL certs didn't exist, so they were not removed");
        }
        console.log("Now stop the server manually via \"stop\" again, or wait for it to stop via the power action (if this instance is the active deployment)");
        readline.question("", command => {
          if(command === "stop") {
            console.log("Stop command sent twice");
            console.log("If this was manually executed and you got here without using \"prodstop\", something's gone horribly wrong");
            console.log("Node.js Application Unloaded");
            console.log("Goodbye");
            process.exit();
          }
        });
      }
    });
    return null;
  }
};