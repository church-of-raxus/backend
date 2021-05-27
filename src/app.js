module.exports = class {
  constructor() {
    //imports
    this.fs = require("fs-extra");
    this.yaml = require("yaml");
    this.uuid = require("uuid");
    
    //init express
    const express = require("express");
    this.server = express();
    
    //load config and generate ssl
    const config = `# The port to run the server on
# The port to run the server on
port: 5000
# The IP/hostname to run the server on
hostname: localhost
# SSL settings
ssl:
  # Use ssl
  enable: true
  # Key and fullchain location
  location:
    key: './ssl/your.key'
    fullchain: './ssl/full.chain'
  # You can generate certs with acme.sh's DNS API automatically if you want
  # Keep in mind this will delete your current certs in the location specified above and replace them with new ones and will disable auto-renewal (this way the certs are renewed every time you restart the server)
  # Also note that this only supports Cloudflare using your Global API Key
  # Refer to https://github.com/acmesh-official/acme.sh/wiki/dnsapi#1-cloudflare-option for more information
  generate-certs:
    enable: true
    key: '100% real key'
    email: 'so@real.pogger'
    # To specify your first domain, simply use the domain. To specify additional domains, append "-d your.domain" for each domain. For example:
    #   Single domain:
    #     domain: 'very.real.domain'
    #   Multiple domains:
    #     domain: 'very.real.domain -d even.realer.domain -d the.realest.domain ... '
    domain: 'very.real.domain'
    
    `;
    try {
      if(!this.fs.existsSync("./config.yml")) {
        this.fs.writeFileSync("./config.yml", config);
      }
      this.config = this.yaml.parse(this.fs.readFileSync("./config.yml", "utf8"));
      if(this.config.ssl.enable === true) {
        if(this.fs.existsSync("./src/ssl/acme")) {
          this.fs.removeSync("./src/ssl/acme");
          this.fs.mkdirsSync("./src/ssl/acme");
        }
        if(this.fs.existsSync("./src/ssl/certs")) {
          this.fs.removeSync("./src/ssl/certs");
          this.fs.mkdirsSync("./src/ssl/certs");
        }
      }
    }catch(e) {
      console.error(e);
      console.log("Config Loading Failed");
      console.log("Node.js Application Unloaded");
      process.exit(1);
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
    
    //init server
    this.server.listen(this.config.port, this.config.hostname, () => {
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