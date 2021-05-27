module.exports = class {
  constructor() {
    //imports
    this.fs = require("fs-extra");
    this.yaml = require("yaml");
    this.uuid = require("uuid");
    this.sh = require("shelljs");
    this.sh.config.verbose = true;
    
    //init express
    const express = require("express");
    this.server = express();
    
    //load config and generate ssl
    this.ssl = false;
    const config = `# The port to run the server on
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
  generatecerts:
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
        this.ssl = true;
        if(this.fs.existsSync("./src/ssl/acme")) {
          this.fs.removeSync("./src/ssl/acme");
          this.fs.mkdirsSync("./src/ssl/acme");
        }
        if(this.fs.existsSync("./src/ssl/certs")) {
          this.fs.removeSync("./src/ssl/certs");
          this.fs.mkdirsSync("./src/ssl/certs");
        }
        if(this.fs.existsSync("./acme.sh/")) {
          this.fs.removeSync("./acme.sh/");
        }
        this.sh.exec("ls ./data/ssl");
        // this.sh.exec("ls");
        // console.log("Installing acme.sh dependencies...");
        // this.sh.exec("bash ./src/ssl/ssl.sh");
        // // this.sh.exec("sudo apt update");
        // // this.sh.exec("sudo apt install curl");
        // console.log("Dependencies installed");
        // console.log("Installing acme.sh...");
        // this.sh.exec("git clone https://github.com/acmesh-official/acme.sh.git");
        // this.sh.exec(`bash ./acme.sh/acme.sh --install --accountemail ${this.config.ssl.generatecerts.email} --home ../src/ssl/acme/ --cert-home ../src/ssl/certs`);
        // console.log("Acme.sh installed");
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
      if(this.ssl === true) {
        console.log(`Express server listening at https://${this.config.hostname}:${this.config.port}`);
      }else{
        console.log(`Express server listening at http://${this.config.hostname}:${this.config.port}`);
      }
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