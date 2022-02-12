const { app, BrowserWindow, screen } = require('electron');
const windowStateKeeper = require('electron-window-state');
require('electron-reload')(__dirname);

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
        }
    });
    //window.removeMenu();
    window.loadFile('public/index.html');
};

let window = null;

app.whenReady().then( () => {

    let mainWindowState = windowStateKeeper({
        defaultWidth: 420,
        defaultHeight: 800
      });

    createWindow(mainWindowState);
    mainWindowState.manage(window);
})
app.on('window-all-closed', () => app.quit());