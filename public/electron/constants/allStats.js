const ALL_STATS = [
    { id: "score_rank", name: "Score Rank" },
    { id: "follower_count", name: "Followers" },
    { id: "scores_first_count", name: "First Places" },
    { id: "global_rank", name: "PP Rank" },
    { id: "pp", name: "PP" },
    { id: "ranked_score", name: "Ranked Score" },
    { id: "total_score", name: "Total Score" },
    { id: "level", name: "Level" },
    { id: "accuracy", name: "Accuracy" },
    { id: "play_count", name: "Play Count" },
    { id: "play_time", name: "Play Time" },
    { id: "total_hits", name: "Total Hits" },
    { id: "maximum_combo", name: "Max Combo" },
    { id: "replays_watched_by_others", name: "Replays Seen" },
    { id: "ss_count", name: "Gold SS" },
    { id: "ssh_count", name: "Silver SS" },
    { id: "s_count", name: "Gold S" },
    { id: "sh_count", name: "Silver S" },
    { id: "a_count", name: "A Ranks" },
    { id: "total_ss", name: "Total SS" },
    { id: "total_s", name: "Total S" },
    { id: "clears", name: "Clears" },
    { id: "total_gold", name: "Total Gold" },
    { id: "total_silver", name: "Total Silver" },
    { id: "country_rank", name: "Country Rank" },
    { id: "medal_count", name: "Medals" },
    { id: "badge_count", name: "Badges" },
    { id: "total_score_per_play", name: "T. Score/Play" },
    { id: "ranked_score_per_play", name: "R. Score/Play" },
    { id: "hits_per_play", name: "Hits per Play" },
    { id: "next_score_rank", name: "Next Rank" },
    { id: "count_300", name: "Total 300s" },
    { id: "count_100", name: "Total 100s" },
    { id: "count_50", name: "Total 50s" },
    { id: "count_miss", name: "Total Misses" },
];

function getValidStats(statsArray) {
    if (!Array.isArray(statsArray)) return ALL_STATS;

    return statsArray.filter((stat) => {
        if (!stat | !stat.id | !stat.name | Array.isArray(stat) | (typeof stat !== "object")) return false;

        return ALL_STATS.some((validStat) => validStat.id === stat.id && validStat.name === stat.name);
    });
}

module.exports = {
    ALL_STATS,
    getValidStats,
};
