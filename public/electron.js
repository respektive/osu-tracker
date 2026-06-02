const path = require("path");
const localVersion = require("../package.json").version;
const semver = require("semver");
const axios = require("axios").default;
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const isDev = require("electron-is-dev");
const logger = require("electron-log");
const Store = require("electron-store");
const { getOsuUser, getScoreRank } = require("./electron/api.js");
const { ALL_STATS, getValidStats } = require("./electron/constants/allStats.js");
const { EXAMPLE_TEXT_FILES } = require("./electron/constants/exampleTextFiles.js");
const CompactUser = require("./electron/CompactUser.js");
const { getStats, getWebSocketData } = require("./electron/formatter.js");
const { writeTextFiles } = require("./electron/fileWriter.js");
const { setWindowBounds, getWindowBounds } = require("./electron/windowSettings.js");
const { setupTitlebar, attachTitlebarToWindow } = require("custom-electron-titlebar/main");
setupTitlebar();

async function startWebServer() {
    try {
        const inUse = await tcpPortUsed.check(17882, "localhost");

        if (!inUse) {
            require("./express/index.js");
        } else {
            logger.info("webserver port already in use");
        }
    } catch (err) {
        logger.error(err);
    }
}

const { WebSocket, WebSocketServer } = require("ws");
const tcpPortUsed = require("tcp-port-used");
const store = new Store();
let websocketData = {};

let wss;
async function startWebSocket() {
    try {
        const inUse = await tcpPortUsed.check(17881, "localhost");

        if (!inUse) {
            wss = new WebSocketServer({ port: 17881 });
            logger.info("started WebSocket server");
            wss.on("connection", function connection(ws) {
                ws.send(JSON.stringify(websocketData));
            });
        } else {
            logger.info("websocket port already in use");
        }
    } catch (err) {
        logger.error(err);
    }
}

function debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

function createWindow() {
    const windowBounds = getWindowBounds();

    // newer electron version seems to cache the initial width and height as its minimum
    // regardless of what we set here for whatever reason.
    // so we set them to our minimum here and hide the window, before applying the actual saved bounds below.
    const win = new BrowserWindow({
        width: 420,
        height: 190,
        minWidth: 420,
        minHeight: 190,
        show: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "./icon.ico"),
        titleBarStyle: "hidden",
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, "./electron/preload.js"),
            enableRemoteModule: true,
            nodeIntegration: true,
        },
    });

    // once the window is ready we set the actual saved bounds and then show it.
    win.once("ready-to-show", () => {
        win.setMinimumSize(420, 190);

        win.setBounds({
            width: Math.max(windowBounds.width, 420),
            height: Math.max(windowBounds.height, 190),
            x: Math.max(windowBounds.x, 0),
            y: Math.max(windowBounds.y, 0),
        });

        win.show();
    });

    // debounce bounds saving to avoid any other random race conditions issues...
    const saveBoundsDebounced = debounce(() => {
        if (!win.isDestroyed()) {
            const bounds = win.getBounds();
            setWindowBounds(bounds);
        }
    }, 300);

    win.on("move", saveBoundsDebounced);
    win.on("resize", saveBoundsDebounced);

    // load the index.html of the app.
    win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`);

    attachTitlebarToWindow(win);

    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: "detach" });
    }
}

app.whenReady().then(() => {
    createWindow();
    // clear logs on startup
    logger.transports.file.getFile().clear();
    store.delete("initial_user");
    // store.delete("visible_stats")
    // store.delete("hidden_stats")
    // store.delete("output_files")
    startWebSocket();
    startWebServer();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.handle("saveSettings", async (e, arg) => {
    if (arg && Object.keys(arg).length === 0) {
        return;
    }
    store.set("settings", arg);
});

ipcMain.handle("getSettings", async () => {
    const settings = store.get("settings");
    return settings;
});

ipcMain.handle("setInitialUser", async () => {
    store.set("initial_user", null);
    const osuUser = await getOsuUser();
    if (!osuUser) return null;
    const scoreRank = await getScoreRank(osuUser);
    const initialUser = new CompactUser(osuUser, scoreRank);
    store.set("initial_user", initialUser);
});

ipcMain.handle("getStats", async () => {
    try {
        const visibleStats = getValidStats(store.get("visible_stats"));
        const osuUser = await getOsuUser();
        if (!osuUser) return "Couldn't reach osu! api. (Invalid Client Credentials or User ID?)";
        const scoreRank = await getScoreRank(osuUser);
        const compactUser = new CompactUser(osuUser, scoreRank);
        let initialUser = store.get("initial_user");
        if (!initialUser) {
            store.set("initial_user", compactUser);
            initialUser = compactUser;
        }
        const statsData = getStats(compactUser, initialUser, visibleStats);
        websocketData = getWebSocketData(compactUser, initialUser);
        // send stats to websocket clients
        if (wss) {
            wss.clients.forEach(function each(client) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(websocketData));
                }
            });
        }
        // write stats to text files
        const files = store.get("output_files") ?? [];
        writeTextFiles(websocketData, files);

        return statsData;
    } catch (err) {
        logger.error(err);
        return null;
    }
});

ipcMain.handle("getUsername", async () => {
    const username = store.get("username");
    return username;
});

ipcMain.handle("getVisibilityData", async () => {
    const visibleStats = getValidStats(store.get("visible_stats"));
    const hiddenStats = ALL_STATS.filter((s) => !visibleStats.map((vs) => vs.id).includes(s.id));

    const visibilityData = {
        visibleStats: {
            title: "Visible Stats",
            items: visibleStats ?? ALL_STATS,
        },
        hiddenStats: {
            title: "Hidden Stats",
            items: hiddenStats ?? [],
        },
    };

    return visibilityData;
});

ipcMain.handle("setVisibilityData", async (e, arg) => {
    const visibilityData = arg;
    const visibleStats = getValidStats(visibilityData.visibleStats.items);
    const hiddenStats = getValidStats(visibilityData.hiddenStats.items);

    store.set("visible_stats", visibleStats);
    store.set("hidden_stats", hiddenStats);
});

ipcMain.handle("checkForUpdate", async () => {
    const res = await axios.get("https://api.github.com/repos/respektive/osu-tracker/releases");
    const latestVersion = res.data[0].name;
    const updateAvail = semver.lt(localVersion, latestVersion);
    return updateAvail;
});

ipcMain.handle("openExternalLink", async (e, arg) => {
    const url = arg;
    shell.openExternal(url);
});

ipcMain.handle("openLogs", () => {
    const logFile = logger.transports.file.getFile();
    const filePath = logFile.path;
    shell.showItemInFolder(filePath);
});

ipcMain.handle("getSessions", async () => {
    const sessions = store.get("sessions") ?? [];
    return sessions;
});

ipcMain.handle("saveSession", async () => {
    const sessions = store.get("sessions") ?? [];
    const initialUser = store.get("initial_user");
    if (!sessions.some((user) => user.date === initialUser.date)) {
        sessions.push(initialUser);
        store.set("sessions", sessions);
    }
    return sessions;
});

ipcMain.handle("deleteSession", async (e, arg) => {
    const session = arg;
    const sessions = store.get("sessions");
    const newSessions = sessions.filter((s) => s.date !== session.date);
    store.set("sessions", newSessions);
    return newSessions;
});

ipcMain.handle("loadSession", async (e, arg) => {
    const session = arg;
    const sessions = store.get("sessions");
    const newSession = sessions.find((s) => s.date === session.date);
    store.set("initial_user", newSession);
    return sessions;
});

ipcMain.handle("getCurrentSession", async () => {
    const session = store.get("initial_user") ?? {};
    return session;
});

ipcMain.handle("getFiles", async () => {
    const files = store.get("output_files");
    if (!files) {
        store.set("output_files", EXAMPLE_TEXT_FILES);
        return EXAMPLE_TEXT_FILES;
    }
    return files;
});

ipcMain.handle("setFiles", async (e, arg) => {
    const files = arg;
    store.set("output_files", files);
});

ipcMain.handle("showTextFiles", () => {
    const filePath = path.join(app.getPath("documents"), "osu-tracker/");
    shell.openPath(filePath);
});

ipcMain.handle("getAllStats", async () => {
    return ALL_STATS;
});
