module.exports = class {
  constructor() {
    console.log("Building app");
    //load dependencies
    this.fs = require("fs-extra");
    this.yaml = require("yaml");
    console.log("Config depencencies loaded");
  
    //load config
    const config = this.fs.readFileSync("./src/config.yml", "utf8");
    if(!this.fs.existsSync("../data/config.yml")) {
      this.fs.mkdirsSync("../data/");
      this.fs.writeFileSync("../data/config.yml", config);
      throw "Please setup your local data and/or config!";
    }
    this.config = this.yaml.parse(this.fs.readFileSync("../data/config.yml", "utf8"));
    console.log("Config loaded");
    
    //check if server is enabled
    if(!this.config.enable) {
      throw "Server disabled, stopping";
    }else{
      console.log("Server enabled, continuing");
    }
    
    //load data
    this.fs.ensureDirSync("../data/users/");
    this.fs.ensureDirSync("../data/posts");
    console.log("Server data loaded");
    
    //load more dependencies
    this.cors = require("cors");
    this.https = require("https");
    this.bodyParser = require("body-parser");
    this.EndpointHandler = require("./endpoints.js");
    console.log("Server dependencies loaded");
  
    //load express
    const express = require("express");
    this.server = express();
    this.server.use(this.bodyParser.text());
    console.log("Express loaded");
  
    //use CORS
    if(this.config.cors) {
      this.server.use(this.cors());
      console.log("Express using CORS");
    }
    
    //enable ssl
    console.log("Configuring ssl");
    this.ssl = false;
    if(this.config.ssl.enable) {
      this.ssl = true;
      console.log("SSL enabled, searching for certs");
      if(!this.fs.existsSync(this.config.ssl.location.folder)) {
        console.log("Certs not found");
        throw `You need to put ssl certificates in ${this.config.ssl.location.key} and ${this.config.ssl.location.fullchain}`;
      }
      console.log("Certs found, generating server");
      this.secureserver = this.https.createServer({
        key: this.fs.readFileSync(this.config.ssl.location.key),
        cert: this.fs.readFileSync(this.config.ssl.location.fullchain)
      }, this.server);
      console.log("Server generated");
      console.log("SSL configured");
    }else{
      console.log("SSL disabled, continuing without SSL");
    }
    
    //final log of constructor
    console.log("App built");
  }
  
  main() {
    //first log of main
    console.log("Running app");
    
    //update daily coin balances
    console.log("Updating coin balances of users who have logged in within the past 24 hours");
    const daily = require("./userdata/coinsetter.js");
    daily(this.config);
    console.log("Balances updated");
    
    //load endpoints
    new this.EndpointHandler(this.server, this.config);
    
    //load server
    console.log("Starting server");
    if(this.ssl) {
      console.log("SSL enabled, using HTTPS server");
      this.secureserver.listen(this.config.port, this.config.hostname, () => {
        console.log("Server running");
        console.log(`HTTPS server listening at https://${this.config.hostname}:${this.config.port}`);
      });
    }else{
      console.log("SSL disabled, using HTTP server");
      this.server.listen(this.config.port, this.config.hostname, () => {
        console.log("Server running");
        console.log(`HTTP server listening at http://${this.config.hostname}:${this.config.port}`);
      });
    }
    
    //log finish
    const origHead = this.fs.readFileSync("./.git/FETCH_HEAD").toString();
    let commit = origHead.split("\t\t")[0];
    let branch = origHead.split("\t\t")[1].split("' of")[0].split("branch '")[1];
    console.log(`Version: ${branch}.${commit}`);
    console.log("Node.js Application Loaded");
    console.log("Async code might not have run yet");
    console.log("Send the command \"stop\" to gracefully stop the server");
    this.listen();
    return null;
  }
  
  async listen() {
    //command handler
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout
    });
    readline.question("", command => {
      switch(command) {
        case "stop":
          console.log("SSL certs were NOT removed");
          console.log("If you need to remove them, either do it manually or stop the server with \"prodstop\"");
          console.log("Node.js Application Unloaded");
          console.log("Goodbye");
          process.exit();
          break;
        case "prodstop":
          if(this.fs.pathExistsSync(this.config.ssl.location.folder)) {
            this.fs.removeSync(this.config.ssl.location.folder);
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
          break;
        case "version":
          const origHead = this.fs.readFileSync("./.git/FETCH_HEAD").toString();
          let commit = origHead.split("\t\t")[0];
          let branch = origHead.split("\t\t")[1].split("' of")[0].split("branch '")[1];
          console.log(`Version: ${branch}.${commit}`);
          break;
        case "help":
          console.log("Commands:");
          console.log("stop - Stops the server.");
          console.log("prodstop - Removes SSL certificates. Is meant to be used in deployment.");
          console.log("version - Displays the branch and commit of the current build.");
          break;
        default:
          console.log("Command not found. Use \"help\" for a list of available commands");
          break;
      }
      this.listen();
    });
  }
};