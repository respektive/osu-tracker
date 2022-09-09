const { GetLevelPrecise } = require("./levelCalc.js")

class CompactUser {
    constructor(user, scoreRank) {
        this.date = Date.now()
        this.user_id = user?.id
        this.avatar_url = user?.avatar_url
        this.username = user?.username
        this.cover_url = user?.cover_url
        this.score_rank = scoreRank?.rank
        this.follower_count = user?.follower_count
        this.scores_first_count = user?.scores_first_count
        this.global_rank = user?.statistics?.global_rank
        this.pp = user?.statistics?.pp
        this.ranked_score = user?.statistics?.ranked_score
        this.total_score = user?.statistics?.total_score
        this.level = GetLevelPrecise(this.total_score ?? 0)
        this.accuracy = user?.statistics?.hit_accuracy
        this.play_count = user?.statistics?.play_count
        this.play_time = user?.statistics?.play_time
        this.total_hits = user?.statistics?.total_hits
        this.maximum_combo = user?.statistics?.maximum_combo
        this.replays_watched_by_others = user?.statistics?.replays_watched_by_others
        this.ss_count = user?.statistics?.grade_counts?.ss
        this.ssh_count = user?.statistics?.grade_counts?.ssh
        this.s_count = user?.statistics?.grade_counts?.s
        this.sh_count = user?.statistics?.grade_counts?.sh
        this.a_count = user?.statistics?.grade_counts?.a
        this.total_ss = (this.ss_count ?? 0) + (this.ssh_count ?? 0)
        this.total_s = (this.s_count ?? 0) + (this.sh_count ?? 0)
        this.clears = (this.total_ss ?? 0) + (this.total_s ?? 0) + (this.a_count ?? 0)
        this.country_rank = user?.statistics?.country_rank
        this.medal_count = user?.user_achievements?.length
        this.badge_count = user?.badges?.length
        this.total_score_per_play = this.total_score / this.play_count
        this.ranked_score_per_play = this.ranked_score / this.play_count
        this.hits_per_play = this.total_hits / this.play_count
    }
}

module.exports = CompactUser