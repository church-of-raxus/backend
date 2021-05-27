init();

function init() {
  console.log("Starting Application");
  try {
    let App = require("./src/app.js");
    App = new App();
    App.main();
  }catch(e) {
    console.error(e);
    console.log("Node.js Application Failed");
    console.log("Node.js Application Unloaded");
    process.exit();
  }
}