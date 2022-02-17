const { app, BrowserWindow, ipcMain } = require('electron');
const windowStateKeeper = require('electron-window-state');
require('electron-reload')(__dirname);
const {autoUpdater} = require("electron-updater");
const fs = require("fs");
const os = require('os');
const tempPath = os.tmpdir();

const all_stats = [
    {id:0, name: 'Score Rank'},
    {id:1, name: 'Ranked Score', api: 'ranked_score'},
    {id:2, name: 'Total Score', api: 'total_score'},
    {id:3, name: 'Play Count', api: 'play_count'},
    {id:4, name: 'PP Rank', api: 'global_rank'},
    {id:5, name: 'PP', api: 'pp'},
    {id:6, name: 'Accuracy', api: 'hit_accuracy'},
    {id:7, name: 'Play Time', api: 'play_time'},
    {id:8, name: 'Total Hits', api: 'total_hits'},
    {id:9, name: 'Max. Combo', api: 'maximum_combo'},
    {id:10, name: 'Replays Seen', api: 'replays_watched_by_others'},
    {id:11, name: 'Country Rank', api: 'country_rank'},
    {id:12, name: 'Level'},
    {id:13, name: 'Gold SS', api: 'ss'},
    {id:14, name: 'Silver SS', api: 'ssh'},
    {id:15, name: 'Gold S', api: 's'},
    {id:16, name: 'Silver S', api: 'sh'},
    {id:17, name: 'A Ranks', api: 'a'},
    {id:18, name: 'Total SS'},
    {id:19, name: 'Total S'},
    {id:20, name: 'Clears'},
    {id:21, name: 'Hits per Play'},
    {id:22, name: 'First Places', api: 'scores_first_count'},
    {id:23, name: 'Followers', api: 'follower_count'},
    {id:24, name: 'Medals', api: 'user_achievements'},
    {id:25, name: 'Badges', api: 'badges'},
    {id:26, name: 'Ranked Score per Play', api: 'ranked_score'},
    {id:27, name: 'Total Score per Play', api: 'total_score'}
];

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
let user, start_user;

app.whenReady().then( () => {

    let mainWindowState = windowStateKeeper({
        defaultWidth: 420,
        defaultHeight: 900
      });

    ipcMain.on("start_user", (e, data) => {
        start_user = data.data;
    });

    ipcMain.on("user", (e, data) => {
        if (!start_user) {
            return;
        }
        user = data.data;
        all_stats.forEach(stat => {
            writeStats(stat);
        })
    })

    createWindow(mainWindowState);
    mainWindowState.manage(window);
});

app.on('ready', function()  {
    autoUpdater.checkForUpdatesAndNotify();
  });

app.on('window-all-closed', () => app.quit());

function writeFile(stat, gained, path, content) {
    let output;
    if (gained) {
        output = content === 0 || isNaN(content) ? '' : formatGained(stat, content);
    } else {
        output = isNaN(content) ? '0' : formatStat(stat, content);
    }

    fs.writeFile(path, String(output), err => {
        if (err) {
            console.error(err)
            return
        }
    })
}

function writeStats(stat) {
    const dir = `${tempPath}/osu-tracker/`;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    let filePath = `${tempPath}/osu-tracker/${stat.name}.txt`;
    let filePathGained = `${tempPath}/osu-tracker/${stat.name}_gained.txt`;

    switch (stat.id) {
        case 0:
            writeFile(stat, false, filePath, user.score_rank);
            writeFile(stat, true, filePathGained, user.score_rank - start_user.score_rank);
            break;
        case 12:
            writeFile(stat, false, filePath, GetLevelPrecise(user.statistics.total_score));
            writeFile(stat, true, filePathGained, GetLevelPrecise(user.statistics.total_score) - GetLevelPrecise(start_user.statistics.total_score));
            break;
        case 13:
        case 14:
        case 15:
        case 16:
        case 17: {
            writeFile(stat, false, filePath, user.statistics.grade_counts[stat.api]);
            writeFile(stat, true, filePathGained, user.statistics.grade_counts[stat.api] - start_user.statistics.grade_counts[stat.api]);
            break;
        }
        case 18:
            writeFile(stat, false, filePath, user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh);
            writeFile(stat, true, filePathGained, (user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh) - (start_user.statistics.grade_counts.ss + start_user.statistics.grade_counts.ssh));
            break;
        case 19:
            writeFile(stat, false, filePath, user.statistics.grade_counts.s + user.statistics.grade_counts.sh);
            writeFile(stat, true, filePathGained, (user.statistics.grade_counts.s + user.statistics.grade_counts.sh) - (start_user.statistics.grade_counts.s + start_user.statistics.grade_counts.sh));
            break;
        case 20:
            writeFile(stat, false, filePath, user.statistics.grade_counts.s + user.statistics.grade_counts.sh + user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh + user.statistics.grade_counts.a);
            writeFile(stat, true, filePathGained, (user.statistics.grade_counts.s + user.statistics.grade_counts.sh + user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh + user.statistics.grade_counts.a) - (start_user.statistics.grade_counts.s + start_user.statistics.grade_counts.sh + start_user.statistics.grade_counts.ss + start_user.statistics.grade_counts.ssh + start_user.statistics.grade_counts.a));
            break;
        case 21:
            writeFile(stat, false, filePath, user.statistics.total_hits / user.statistics.play_count);
            writeFile(stat, true, filePathGained, (user.statistics.total_hits / user.statistics.play_count) - (start_user.statistics.total_hits / start_user.statistics.play_count));
            break;
        case 22:
        case 23: {
            writeFile(stat, false, filePath, user[stat.api]);
            writeFile(stat, true, filePathGained, user[stat.api] - start_user[stat.api]);
            break;
        }
        case 24:
        case 25: {
            writeFile(stat, false, filePath, user[stat.api].length);
            writeFile(stat, true, filePathGained, user[stat.api].length - start_user[stat.api].length);
            break;
        }
        case 26:
        case 27: {
            writeFile(stat, false, filePath, user.statistics[stat.api] / user.statistics.play_count);
            writeFile(stat, true, filePathGained, (user.statistics[stat.api] / user.statistics.play_count) - (start_user.statistics[stat.api] / start_user.statistics.play_count));
            break;
        }
        default:
            writeFile(stat, false, filePath, user.statistics[stat.api]);
            writeFile(stat, true, filePathGained, user.statistics[stat.api] - start_user.statistics[stat.api]);
    }
}

function GetLevel(score) {
	var i = 1;
	for (;;) {
		var lScore = GetRequiredScoreForLevel(i);
		if (score < lScore) {
			return i - 1;
		}
		i++;
	}
}

function GetRequiredScoreForLevel(level) {
	if (level <= 100) {
		if (level > 1) {
			return Math.floor(5000/3*(4*Math.pow(level, 3)-3*Math.pow(level, 2)-level) + Math.floor(1.25*Math.pow(1.8, level-60)));
		}
		return 1;
	}
	return 26931190829 + 100000000000*(level-100);
}

function GetLevelPrecise(score) {
	var baseLevel             = GetLevel(score);
	var baseLevelScore        = GetRequiredScoreForLevel(baseLevel);
	var scoreProgress         = score - baseLevelScore;
	var scoreLevelDifference  = GetRequiredScoreForLevel(baseLevel+1) - baseLevelScore;
	var res                   = scoreProgress/scoreLevelDifference + baseLevel;
	if (!isFinite(res)) {
		return 0;
	}
	return res.toFixed(3);
}

//https://stackoverflow.com/a/7579799
function seconds2time (seconds) {
    var hours   = Math.floor(seconds / 3600);
    var minutes = Math.floor((seconds - (hours * 3600)) / 60);
    var seconds = seconds - (hours * 3600) - (minutes * 60);
    var time = "";

    if (hours != 0) {
    time = hours+"h ";
    }
    if (minutes != 0 || time !== "") {
    minutes = (minutes < 10 && time !== "") ? "0"+minutes : String(minutes);
    time += minutes+"m ";
    }
    if (time === "") {
    time = seconds+"s";
    }
    else {
    seconds = (seconds < 10) ? "0"+seconds : String(seconds);
    time += seconds+"s";
    }
    return time;
}

function formatNumber(n) {
    try {
        return n.toLocaleString('en-US');
    } catch(e) {
        return '0'
    }
}

function formatStat(s, content){
    switch (s.id) {
        case 0:
            return formatNumber(content) == 0 ? 'No Score Rank' : '#' + formatNumber(content);
        case 4:
        case 11: {
            return '#' + formatNumber(content);
            }
        case 6:
            return formatNumber(content) + '%';
        case 7:
            return seconds2time(content);
        case 26:
        case 27: {
            return formatNumber(Math.round(content));
            }
        default:
            return formatNumber(content);
    }
}

function formatGained(s, content){
    let r;
    if (content > 0) {
        r = '+';
    } else {
        r = '';
    }

    switch (s.id) {
        case 0:
        case 4:
        case 11: {
            if (content > 0) {
                r = '-';
            } else {
                r = '+';
                content = Math.abs(content)
            }
            return r + formatNumber(content);
        }
        case 7:
            return r + seconds2time(content);
        case 26:
        case 27: {
            return r + formatNumber(Math.round(content));
            }
        default:
            return r + formatNumber(content);
    }
}
