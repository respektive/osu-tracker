const { app, BrowserWindow, screen } = require('electron');
require('electron-reload')(__dirname);

const createWindow = () => {

    window = new BrowserWindow({
        width: 420,
        height: 736,
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

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit());