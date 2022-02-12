import { writable } from 'svelte/store';

export const all_stats = [
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
    {id:25, name: 'Badges', api: 'badges'}
];

const storedClientId = localStorage.getItem('client_id');
export const client_id = writable(storedClientId === null ? 1337 : storedClientId);
client_id.subscribe(value => {
    localStorage.setItem('client_id', value)
});

const storedClientSecret = localStorage.getItem('client_secret');
export const client_secret = writable(storedClientSecret === null ? 'someverylongstring' : storedClientSecret);
client_secret.subscribe(value => {
    localStorage.setItem('client_secret', value)
});

const storedUser_id = localStorage.getItem('user_id');
export const user_id = writable(isNaN(storedUser_id) || storedUser_id === null ? 2 : storedUser_id);
user_id.subscribe(value => {
    localStorage.setItem('user_id', value)
});

const storedMode = localStorage.getItem('mode');
export const mode = writable(storedMode === null ? 'osu' : storedMode);
mode.subscribe(value => {
    localStorage.setItem('mode', value)
});

const storedUsername = localStorage.getItem('username');
export const username = writable(storedUsername);
username.subscribe(value => {
    localStorage.setItem('username', value)
});

const storedAvatarUrl = localStorage.getItem('avatar_url');
export const avatar_url = writable(storedAvatarUrl === null || undefined ? 'https://a.ppy.sh/' : storedAvatarUrl);
avatar_url.subscribe(value => {
    localStorage.setItem('avatar_url', value)
});

const storedDelay = localStorage.getItem('delay');
export const delay = writable(isNaN(storedDelay) || storedDelay === null ? 30 : storedDelay);
delay.subscribe(value => {
    localStorage.setItem('delay', value)
});

const sa_retrieved = localStorage.getItem("stats_available");
const sa_parsed = JSON.parse(sa_retrieved);
export const statsAvailable = writable(sa_parsed === null ? [] : sa_parsed);

statsAvailable.subscribe(value =>
  localStorage.setItem("stats_available", JSON.stringify(value))
);

const sv_retrieved = localStorage.getItem("stats_visible");
const sv_parsed = JSON.parse(sv_retrieved);
export const statsVisible = writable(sv_parsed === null || sv_parsed.length == 0 ? all_stats : sv_parsed);

statsVisible.subscribe(value =>
  localStorage.setItem("stats_visible", JSON.stringify(value))
);
