const { ALL_STATS } = require("./constants/allStats")
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

function getWebSocketData(currentUser, initialUser) {
    let data = {}
    for (key of Object.keys(currentUser)) {
        if (ALL_STATS.some( (e) => e.id === key)) {
            data[key] = formatCurrent(key, currentUser[key] ?? 0)
            data[key + "_gained"] = formatGained(key, (currentUser[key] ?? 0) - (initialUser[key] ?? 0))
        }
    }
    return data
}

function getStats(currentUser, initialUser, visibleStats) {
    let data = []
    for (var stat of visibleStats) {
        data.push({
            name: stat["name"],
            value: formatCurrent(stat["id"], currentUser[stat["id"]] ?? 0),
            gained: formatGained(stat["id"], (currentUser[stat["id"]] ?? 0) - (initialUser[stat["id"]] ?? 0))
        })
    }
    return data
}

function formatCurrent(key, data) {
    switch (key) {
        case "score_rank": {
            return data == 0 ? "No Score Rank" : "#" + formatNumber(data)
        }
        case "country_rank":
        case "global_rank": {
            return "#" + formatNumber(data)
        }
        case "accuracy": {
            return formatNumber(data) + "%"
        }
        case "play_time": {
            return seconds2time(data)
        }
        default: {
            return formatNumber(data)
        }
    }
}

function formatGained(key, data) {
    let pre, color;
    if (data > 0) {
        pre = '+';
        color = 'green';
    } else {
        pre = '';
        color = 'red';
    }

    switch (key) {
        case "score_rank":
        case "country_rank":
        case "global_rank": {
            if (data > 0) {
                pre = '-';
                color = 'red';
            } else {
                pre = '+';
                color = 'green';
                data = Math.abs(data)
            }
            return { value: data == 0 ? null : pre + formatNumber(data), color: color }
        }
        case "accuracy": {
            return { value: data == 0 ? null : pre + formatNumber(data) + "%", color: color }
        }
        case "play_time": {
            return { value: data == 0 ? null : pre + seconds2time(data), color: color }
        }
        default: {
            return { value: data == 0 ? null : pre + formatNumber(data), color: color }
        }
    }
}

function formatNumber(n) {
    try {
        return n ? n.toLocaleString('en-US') : 0
    } catch(e) {
        return '0'
    }
}

module.exports = {
    getStats,
    getWebSocketData,
}