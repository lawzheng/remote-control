const { app } = require("electron");
const handleIpc = require("./ipc");
const { create: createMainWindow, show: showMainWindow, close: closeMainWindow } = require("./windows/main");
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    showMainWindow();
  });
  app.on("ready", () => {
    createMainWindow();
    handleIpc();
    require('./trayAndMenu')
    require("./robot")();
  });
  app.on("before-quit", () => {
    closeMainWindow();
  });
  app.on("activate", () => {
    showMainWindow();
  });
}
