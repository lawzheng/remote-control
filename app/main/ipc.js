const { ipcMain } = require("electron");
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
};
