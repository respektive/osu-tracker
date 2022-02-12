<script>
    import { user_id, delay, statsAvailable, statsVisible, client_id, client_secret, all_stats } from "../store";
    import List from './List.svelte';

	export let open = false;
    let userid, clientid, clientsecret;

    client_id.subscribe(value => {
		clientid = value;
	});

    client_secret.subscribe(value => {
		clientsecret = value;
	});

    user_id.subscribe(value => {
		userid = value;
	});

    function resetStats() {
        $statsAvailable = [];
        $statsVisible = all_stats;
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

        <p>Interval: {$delay} seconds</p>
        <input type=range min=5 max=60 bind:value={$delay} on:change={() => $delay = $delay}>
    </div>

    <div class="stats_select">
        <p style="float: left; margin-right: 30%; margin-top: 0px;">Hidden Stats</p>
        <p>Visible Stats</p><br>
        <List bind:items={$statsAvailable}/>
        <List bind:items={$statsVisible}/>
        <button on:click={resetStats}>Reset</button>
    </div>
</aside>

<style>
	aside {
		position: absolute;
        margin-top: 40px;
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
        padding-bottom: 50px;
    }

</style>