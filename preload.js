const { Titlebar, Color } = require('custom-electron-titlebar');
const path = require('path');

let titlebar;

window.addEventListener('DOMContentLoaded', () => {
    titlebar = new Titlebar({
      backgroundColor: Color.fromHex("#1c1719"),
      maximizable: true,
      icon: path.join(__dirname, '/public', '/icon.png'),
      menu: null // = do not automatically use Menu.applicationMenu
    })

    var element = document.getElementsByClassName('cet-container')[0];
    element.style.overflow = "hidden";

})