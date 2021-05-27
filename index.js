init();

function init() {
  console.log("Starting Application");
  let App = require("./src/app.js");
  App = new App();
  App.main();
}