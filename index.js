const { app, BrowserWindow, screen } = require('electron');
const windowStateKeeper = require('electron-window-state');
require('electron-reload')(__dirname);
const {autoUpdater} = require("electron-updater");

const createWindow = (mainWindowState) => {

    window = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            autoHideMenuBar: true,
            contextIsolation: false,
        },
        icon: __dirname + '/build/icon.png'
    });
    window.removeMenu();
    window.loadFile('public/index.html');
};

let window = null;

app.whenReady().then( () => {

    let mainWindowState = windowStateKeeper({
        defaultWidth: 420,
        defaultHeight: 900
      });

    createWindow(mainWindowState);
    mainWindowState.manage(window);
});

app.on('ready', function()  {
    autoUpdater.checkForUpdatesAndNotify();
  });

app.on('window-all-closed', () => app.quit());