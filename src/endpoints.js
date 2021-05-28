module.exports = class {
  constructor(server) {
    console.log("Building endpoints");
    this.uuid = require("uuid");
    server.post("/", (req, res) => {
      const uuid = this.uuid.v4();
      console.log(`New request to endpoint "/". ID: ${uuid}`);
      res.setHeader("Content-Type", "text/plain");
      res.send("{hello: \"world\"}");
      console.log(`Response to request ${uuid} sent from endpoint "/".`);
    });
    console.log("Endpoints built");
  }
};