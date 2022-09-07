const path = require('path');
const localVersion = require('../package.json').version
const semver = require('semver')
const axios = require('axios').default
const { app, BrowserWindow, ipcMain, ipcRenderer } = require('electron');
const isDev = require('electron-is-dev');
const Store = require('electron-store');
const { getOsuUser, getScoreRank } = require('./electron/api.js');
const { ALL_STATS } = require('./electron/constants/allStats.js');
const CompactUser = require("./electron/CompactUser.js")
const { getStats } = require("./electron/formatter.js")
const { setWindowBounds, getWindowBounds } = require("./electron/windowSettings.js")
const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main');
setupTitlebar();

const store = new Store();
let statsData = []

const { WebSocket, WebSocketServer } = require("ws")
const wss = new WebSocketServer({ port: 3377 });

wss.on('connection', function connection(ws) {
  ws.send(JSON.stringify(statsData));
});

function createWindow() {

  const windowBounds = getWindowBounds()
  
  // Create the browser window.
  const win = new BrowserWindow({
    minWidth: 420,
    minHeight: 420,
    autoHideMenuBar: true,
    icon: path.join(__dirname, './icon.ico'),
    titleBarStyle: 'hidden',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, './electron/preload.js'),
      enableRemoteModule: true,
      nodeIntegration: true,
    },
  });

  win.setBounds(windowBounds)

  win.on("move", () => {
    setWindowBounds(win.getBounds())
  })
  win.on("resize", () => {
    setWindowBounds(win.getBounds());
  })

  // load the index.html of the app.
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  attachTitlebarToWindow(win);

  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

app.whenReady().then( () => {
    createWindow();
    store.delete("initial_user")
    // store.delete("visible_stats")
    // store.delete("hidden_stats")
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.handle("saveSettings", async (e, arg) => {
  if (arg && Object.keys(arg).length === 0) {
    return;
  }
  store.set("settings", arg)
})

ipcMain.handle("getSettings", async () => {
  const settings = store.get("settings")
  return settings
})

ipcMain.handle("setInitalUser", async () => {
  store.set("inital_user", null)
  const osuUser = await getOsuUser()
  const scoreRank = await getScoreRank()
  if (!osuUser || !scoreRank) return null
  const initialUser = new CompactUser(osuUser, scoreRank)
  store.set("initial_user", initialUser)
})

ipcMain.handle("getStats", async () => {
  try {
    const visibleStats = store.get("visible_stats") ?? ALL_STATS
    const osuUser = await getOsuUser()
    const scoreRank = await getScoreRank()
    if (!osuUser || !scoreRank) return "Couldn't reach osu! api. (Invalid Client Credentials or User ID?)"
    const compactUser = new CompactUser(osuUser, scoreRank)
    let initialUser = store.get("initial_user")
    if (!initialUser) {
      store.set("initial_user", compactUser)
      initialUser = compactUser
    }
    statsData = getStats(compactUser, initialUser, visibleStats)
    // send stats to every websocket client
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(statsData));
      }
    });

    return statsData
  } catch (err) {
    console.log(err)
    return null
  }
})

ipcMain.handle("getUsername", async () => {
  const username = store.get("username")
  return username
})

ipcMain.handle("getVisibilityData", async () => {
  const visibleStats = store.get("visible_stats")
  const hiddenStats = store.get("hidden_stats")
  
  const visibilityData = {
    "visibleStats": {
      title: "Visible Stats",
      items: visibleStats ?? ALL_STATS,
    },
    "hiddenStats": {
      title: "Hidden Stats",
      items: hiddenStats ?? [],
    },
  }

  return visibilityData
})

ipcMain.handle("setVisibilityData", async (e, arg) => {
  const visibilityData = arg
  const visibleStats = visibilityData.visibleStats.items
  const hiddenStats = visibilityData.hiddenStats.items

  store.set("visible_stats", visibleStats)
  store.set("hidden_stats", hiddenStats)
})

ipcMain.handle("checkForUpdate", async () => {
  const res = await axios.get("https://api.github.com/repos/respektive/osu-tracker/releases")
  const latestVersion = res.data[0].name
  const updateAvail = semver.lt(localVersion, latestVersion)
  return updateAvail
})

ipcMain.handle("openExternalLink", async (e, arg) => {
  const url = arg
  require('electron').shell.openExternal(url);
})
