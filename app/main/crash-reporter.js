const { crashReporter } = require("electron");

function init() {
  crashReporter.start({
    productName: "remote-control",
    companyName: "lawz",
    submitURL: "http://127.0.0.1:33855/crash",
  });
}
module.exports = { init };
