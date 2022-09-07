const Store = require('electron-store');
const store = new Store();

function getWindowBounds() {
    const default_bounds = { x: 0, y: 0, width: 420, height: 600 };
    const bounds = store.get("windowBounds")

    if (bounds) {
        return bounds
    } else {
        store.set("windowBounds", default_bounds)
        return default_bounds
    }
}

function setWindowBounds(bounds) {
    store.set("windowBounds", bounds)
}

module.exports = {
    setWindowBounds,
    getWindowBounds
}