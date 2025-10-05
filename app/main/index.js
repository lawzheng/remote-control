const { app } = require("electron");
const handleIpc = require("./ipc");
const {
  create: createMainWindow,
  show: showMainWindow,
  close: closeMainWindow,
} = require("./windows/main");
if (require("electron-squirrel-startup")) app.quit();
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("will-finish-launching", () => {
    // if (!isDev) {
    require("./updater.js");
    // }
    // require("./crash-reporter").init();
  });
  app.on("second-instance", () => {
    showMainWindow();
  });
  app.on("ready", () => {
    createMainWindow();
    handleIpc();
    require("./trayAndMenu");
    require("./robot")();
  });
  app.on("before-quit", () => {
    closeMainWindow();
  });
  app.on("activate", () => {
    showMainWindow();
  });
}
