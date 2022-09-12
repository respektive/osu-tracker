const { app } = require('electron')
const fs = require('fs')
const path = require('path')
const logger = require('electron-log')
const { ALL_STATS } = require("./constants/allStats")
const documentsPath = app.getPath("documents")

function writeTextFiles(statsData, files) {
    for (const file of files) {
        try {
            const filePath = path.join(documentsPath, `osu-tracker/${file.file_name}`)
            let text = file.content

            for (const stat of ALL_STATS) {
                text = text.replaceAll(`%${stat.id}_gained%`, statsData[stat.id].gained ?? "")
                text = text.replaceAll(`%${stat.id}%`, statsData[stat.id].current ?? "")
            }
            
            if (!fs.existsSync(path.join(documentsPath, "osu-tracker/"))) {
                fs.mkdirSync(path.join(documentsPath, "osu-tracker/"))
            }

            fs.writeFileSync(filePath, text, 'utf-8') 
        } catch(e) {
             logger.error("failed to write file")
             logger.error(e)
        }
    }
}

module.exports = {
    writeTextFiles,
}
