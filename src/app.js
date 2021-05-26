module.exports = class {
  constructor() {
    const fs = require("fs");
    const yaml = require("yaml");
    const express = require("express");
    this.server = express();
    try {
      this.config = yaml.parse(fs.readFileSync("./config.yml", "utf8"));
    }catch(e) {
      console.error(e);
      console.log("Node.js Application Failed");
      process.exit(1);
    }
  }
  
  get main() {
    this.server.get("/", (req, res) => {
      res.send("Hello World!");
    });
    this.server.listen(this.config.port, () => {
      console.log(`Express server listening at http://0.0.0.0:${this.config.port}`);
    });
    console.log("Node.js Application Loaded");
    return null;
  }
};