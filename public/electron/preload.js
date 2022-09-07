const { contextBridge, ipcRenderer } = require('electron')
const { Titlebar, Color } = require('custom-electron-titlebar');
const path = require('path');

let titlebar;

window.addEventListener('DOMContentLoaded', () => {
    titlebar = new Titlebar({
      backgroundColor: Color.fromHex("#121212"),
      menu: null // = do not automatically use Menu.applicationMenu
    })
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
})  