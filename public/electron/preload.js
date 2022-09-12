const { contextBridge, ipcRenderer } = require('electron')
const { Titlebar, Color } = require('custom-electron-titlebar');
const path = require('path');
const localVersion = require('../../package.json').version

let titlebar;

window.addEventListener('DOMContentLoaded', () => {
    titlebar = new Titlebar({
      backgroundColor: Color.fromHex("#121212"),
      menu: null // = do not automatically use Menu.applicationMenu
    })
    titlebar.updateTitle(`osu!tracker (${localVersion})`);
})

contextBridge.exposeInMainWorld('api',{
  saveSettings: async (settings) => {
    if (!settings) return
    await ipcRenderer.invoke("saveSettings", settings);
  },
  getSettings: async () => {
    const result = await ipcRenderer.invoke("getSettings");
    return result
  },
  getStats: async () => {
    const result = await ipcRenderer.invoke("getStats");
    return result
  },
  setInitialUser: async () => {
    await ipcRenderer.invoke("setInitalUser");
  },
  getUsername: async () => {
    const result = await ipcRenderer.invoke("getUsername");
    return result
  },
  getVisibilityData: async () => {
    const result = await ipcRenderer.invoke("getVisibilityData");
    return result
  },
  setVisibilityData: async (visibilityData) => {
    await ipcRenderer.invoke("setVisibilityData", visibilityData);
  },
  checkForUpdate: async () => {
    const result = await ipcRenderer.invoke("checkForUpdate");
    return result
  },
  openExternalLink: async (link) => {
    await ipcRenderer.invoke("openExternalLink", link);
  },
  openLogs: async () => {
    await ipcRenderer.invoke("openLogs");
  },
  getSessions: async () => {
    const result = await ipcRenderer.invoke("getSessions");
    return result
  },
  saveSession: async () => {
    const result = await ipcRenderer.invoke("saveSession");
    return result
  },
  deleteSession: async (session) => {
    const result = await ipcRenderer.invoke("deleteSession", session);
    return result
  },
  loadSession: async (session) => {
    const result = await ipcRenderer.invoke("loadSession", session);
    return result
  },
  getCurrentSession: async () => {
    const result = await ipcRenderer.invoke("getCurrentSession");
    return result
  },
  getFiles: async () => {
    const result = await ipcRenderer.invoke("getFiles");
    return result
  },
  setFiles: async (files) => {
    await ipcRenderer.invoke("setFiles", files);
  },
  showTextFiles: async () => {
    await ipcRenderer.invoke("showTextFiles");
  },
  getAllStats: async () => {
    const result = await ipcRenderer.invoke("getAllStats");
    return result
  },
})
