<script>
    import { user_id, delay, statsAvailable, statsVisible, client_id, client_secret, all_stats, mode } from "../store";
    import List from './List.svelte';

	export let open = false;
    let userid, clientid, clientsecret, gamemode;

    client_id.subscribe(value => {
		clientid = value;
	});

    client_secret.subscribe(value => {
		clientsecret = value;
	});

    user_id.subscribe(value => {
		userid = value;
	});

    mode.subscribe(value => {
		gamemode = value;
	});

    function showAll() {
        $statsAvailable = [];
        $statsVisible = all_stats;
    }

    function hideAll() {
        $statsAvailable = all_stats;
        $statsVisible = [];
    }

</script>

<aside class:open>

    <div class="settings">
        <h1>Settings:</h1>
        <p>Client ID</p>
        <input type=number bind:value={clientid}>
        <button on:click={client_id.set(clientid)}>Save</button>

        <p>Client Secret</p>
        <input type=password bind:value={clientsecret}>
        <button on:click={client_secret.set(clientsecret)}>Save</button>

        <p>User ID</p>
        <input type=number bind:value={userid}>
        <button on:click={user_id.set(userid)}>Save</button>

        <p>Gamemode</p>
        <select bind:value={gamemode}>
            <option value="osu">osu</option>
            <option value="taiko">taiko</option>
            <option value="fruits">catch</option>
            <option value="mania">mania</option>
          </select>
        <button on:click={mode.set(gamemode)}>Save</button>

        <p>Interval: {$delay} seconds</p>
        <input type=range min=5 max=60 bind:value={$delay} on:change={() => $delay = $delay}>
    </div>

    <div class="stats_select">
        <div class="title">
            <p>Hidden Stats</p>
            <button class="button" on:click={hideAll}>Hide All</button>
        </div>
        <div class="title">
            <p>Visible Stats</p>
            <button class="button" on:click={showAll}>Show All</button>
        </div>
        <List bind:items={$statsAvailable}/>
        <List bind:items={$statsVisible}/>     
    </div>

    <div class="info">
        <p>Version: 1.1.2</p>
    </div>
</aside>

<style>
	aside {
		position: absolute;
        padding-top: 40px;
		right: -100%;
		transition: right 0.5s ease-in-out;
		height: 100%;
		width: 100%;
		background-color: #382e32;
        z-index: 2;
        overflow: auto;
	}

	.open {
		right: 0px
	}

    .settings, .stats_select {
        margin: 10px;
    }

    .stats_select {
        height: 300px;
    }

    .title {
        float: left;
        width: 45%;
        padding-left: 10px;
    }

    .title p {
        display: inline;
    }

    .button {
        width: 56px;
        padding: 0;
        font-size: 12px;
    }

    .info {
        padding-bottom: 50px;
        padding-left: 10px;
    }

</style>
