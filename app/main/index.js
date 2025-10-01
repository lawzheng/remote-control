const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev')
const path = require('path')

let win
app.on('ready', () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })
  if (isDev) {
    win.loadURL('http://localhost:5173/')
  } else {
    win.loadFile(path.resolve(__dirname, '../renderer/pages/main/index.html'))
  }
})