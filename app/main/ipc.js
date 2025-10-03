const { ipcMain, desktopCapturer } = require("electron");
const { send: sendMainWindow } = require("./windows/main");
const { create: createControlWindow } = require("./windows/control");

module.exports = function handleIpc() {
  ipcMain.handle("login", async () => {
    return Math.random().toString().slice(2, 8);
  });
  ipcMain.on("control", async (e, remoteCode) => {
    sendMainWindow("control-state-change", remoteCode, 1);
    createControlWindow();
  });
  ipcMain.handle("getScreen", async () => {
    return new Promise((resolve) => {
      desktopCapturer.getSources({ types: ["screen"] }).then(async (sources) => {
        for (const source of sources) {
          if (source.name !== "屏幕 1") {
            return;
          }
          resolve(source.id);
        }
      });
    });
  });
};
