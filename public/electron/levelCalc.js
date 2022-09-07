// https://olc.howl.moe/

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

module.exports = {
    GetLevelPrecise
}