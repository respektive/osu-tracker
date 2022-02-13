<script>
    import { onMount } from "svelte";
    import { user_id, username, avatar_url, delay, client_id, client_secret, statsVisible, mode, cached_score_rank } from '../store';
    import Stat from "./Stat.svelte";   
    let user, stats, start_user, userid, gamemode, score_rank;
    let user_name, avatarurl, delay_value;

    $: $client_secret, getStats();
    $: $client_id, getStats();
    $: $statsVisible, updateStats();

    delay.subscribe(value => {
		  delay_value = value;
	  });

    user_id.subscribe(value => {
		userid = value;
    getStats(true);
	  });
    mode.subscribe(value => {
		gamemode = value;
    getStats(true);
	  });
    username.subscribe(value => {
      user_name = value;
    });
    avatar_url.subscribe(value => {
      avatarurl = value;
    });

    async function getStatsLoop() {
      await getStats();
      setTimeout(getStatsLoop, 1000 * delay_value);
    }

    async function fetchWithTimeout(resource, options = {}) {
      const { timeout = 8000 } = options;
      
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      const response = await fetch(resource, {
        ...options,
        signal: controller.signal  
      });
      clearTimeout(id);
      return response;
    }

    async function getScoreRank() {
      try {
        const response = await fetchWithTimeout(`https://score.respektive.pw/u/${userid}?mode=${gamemode}`, {
          timeout: 5000
        });
        if (response.status >= 200 && response.status <= 299) {
          const jsonResponse = await response.json();
          return jsonResponse[0].rank;
        } else {
          return $cached_score_rank;
        }
      } catch {
        return $cached_score_rank;
      }
    }

    async function getUser(token) {
      const url = new URL(
                `https://osu.ppy.sh/api/v2/users/${userid}/${gamemode}`
      );

      const params = {
              "key": "id",
          };
      Object.keys(params)
          .forEach(key => url.searchParams.append(key, params[key]));

      const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": "Bearer " + token,
      };

      const response = await fetch(url, {
          method: "GET",
          headers,
      });
      if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return jsonResponse;
      } else {
        return;
      }
    }

    async function getToken() {
      if ($client_secret != 'someverylongstring') {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
        };

        const body = {
            "client_id": $client_id,
            "client_secret": $client_secret,
            "grant_type": "client_credentials",
            "scope": "public"
        }

        const response = await fetch("https://osu.ppy.sh/oauth/token", {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        });
        if (response.status >= 200 && response.status <= 299) {
        const jsonResponse = await response.json();
        return jsonResponse.access_token;
      } else {
        return;
      }
    } else {
      return;
    }
  }
    async function getStats(first = false) {
      const token = await getToken();
      if (!token) {
        return;
      } else {
        const data = await getUser(token);
        if (!data) {
          return;
        } else {
          if (first) {
            start_user = data;
            username.set(start_user.username);
            avatar_url.set(start_user.avatar_url);
          }
          user = data;
          const score_rank = await getScoreRank();
          console.log($cached_score_rank);
          if (first)
            start_user.score_rank = isNaN(score_rank) ? '0' : score_rank;
            user.score_rank = isNaN(score_rank) ? '0' : score_rank;
            $cached_score_rank = isNaN(score_rank) ? '0' : score_rank;
            updateStats();
        }
      }
    }

    onMount(async () => {
      getStatsLoop();
    });

    function updateStats() {
      stats = [];
      if (user && start_user) {
      $statsVisible.forEach(stat => {
          switch (stat.id) {
            case 0:
              stats.push({id: stat.id, name: stat.name, value: user.score_rank, gained: user.score_rank - start_user.score_rank});
              break;
            case 12:
              stats.push({id: stat.id, name: stat.name, value: user.statistics.level.current + '.' + user.statistics.level.progress, gained: parseInt(user.statistics.level.current + '.' + user.statistics.level.progress) - parseInt(start_user.statistics.level.current + '.' + start_user.statistics.level.progress)});
              break;
            case 13:
            case 14:
            case 15:
            case 16:
            case 17: {
              stats.push({id: stat.id, name: stat.name, value: user.statistics.grade_counts[stat.api], gained: user.statistics.grade_counts[stat.api] - start_user.statistics.grade_counts[stat.api]});
              break;
            }
            case 18:
              stats.push({id: stat.id, name: stat.name, value: user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh, gained: (user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh) - (start_user.statistics.grade_counts.ss + start_user.statistics.grade_counts.ssh)});
              break;
            case 19:
              stats.push({id: stat.id, name: stat.name, value: user.statistics.grade_counts.s + user.statistics.grade_counts.sh, gained: (user.statistics.grade_counts.s + user.statistics.grade_counts.sh) - (start_user.statistics.grade_counts.s + start_user.statistics.grade_counts.sh)});
              break;
            case 20:
            stats.push({id: stat.id, name: stat.name,
              value: user.statistics.grade_counts.s + user.statistics.grade_counts.sh + user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh + user.statistics.grade_counts.a,
              gained: (user.statistics.grade_counts.s + user.statistics.grade_counts.sh + user.statistics.grade_counts.ss + user.statistics.grade_counts.ssh + user.statistics.grade_counts.a) -
              (start_user.statistics.grade_counts.s + start_user.statistics.grade_counts.sh + start_user.statistics.grade_counts.ss + start_user.statistics.grade_counts.ssh + start_user.statistics.grade_counts.a)});
              break;
            case 21:
              stats.push({id: stat.id, name: stat.name, value: user.statistics.total_hits / user.statistics.play_count, gained: (user.statistics.total_hits / user.statistics.play_count) - (start_user.statistics.total_hits / start_user.statistics.play_count)});
              break;
            case 22:
            case 23: {
              stats.push({id: stat.id, name: stat.name, value: user[stat.api], gained: user[stat.api] - start_user[stat.api]});
              break;
            }
            case 24:
            case 25: {
              stats.push({id: stat.id, name: stat.name, value: user[stat.api].length, gained: user[stat.api].length - start_user[stat.api].length});
              break;
            }
            case 26:
            case 27: {
              stats.push({id: stat.id, name: stat.name, value: user.statistics[stat.api] / user.statistics.play_count, gained: (user.statistics[stat.api] / user.statistics.play_count) - (start_user.statistics[stat.api] / start_user.statistics.play_count)});
              break;
            }
            default:
              stats.push({id: stat.id, name: stat.name, value: user.statistics[stat.api], gained: user.statistics[stat.api] - start_user.statistics[stat.api]});
          }
        });
      } else {
        console.log("loading...");
        return;
      }
    }
</script>

{#if user && start_user && String(score_rank)} 
  {#each stats as stat }
        <Stat {stat} />
  {/each}
{:else}
  <p class="loading">loading...</p>
{/if}

<style>
  .loading {
    text-align: center;
    font-size: 20px;
    opacity: 0;
    animation: 0.4s 0.8s forwards fade-in;
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

</style>