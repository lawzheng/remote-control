const { BrowserWindow, desktopCapturer } = require("electron");
const path = require("path");
let win;
function create() {
  win = new BrowserWindow({
    width: 1000,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async (sources) => {
      for (const source of sources) {
        send("SET_SOURCE", source.id);
      }
    });
  win.loadFile(
    path.resolve(__dirname, "../../renderer/pages/control/index.html")
  );
}

function send(channel, ...args) {
  win.webContents.send(channel, ...args);
}

module.exports = { create, send };
