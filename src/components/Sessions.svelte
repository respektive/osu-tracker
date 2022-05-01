<script>
	import { startUser, savedSessions } from "../store";
    const { ipcRenderer } = require("electron");

    let start_user, saved_sessions, start_date, count;

    startUser.subscribe(value => {
        start_user = value;
    });

    savedSessions.subscribe(value => {
        saved_sessions = value;
        count = saved_sessions.length;
    });

    function getDate(d) {
        if(!d) {
            return "no date"
        }
        let date = new Date(d).toISOString().replaceAll("T", " ");
        date = date.substring(0, date.indexOf('.'));
        return date;
    }

    function saveSession() {
        if(!saved_sessions.includes(start_user))
            saved_sessions.push(start_user)
        $savedSessions = saved_sessions;
        count = saved_sessions.length;
        console.log("saved sessions: " + saved_sessions.length)
        console.log(saved_sessions)
    }

    function deleteSession(s) {
        saved_sessions.splice(saved_sessions.findIndex(item => item.date === s.date), 1)
        $savedSessions = saved_sessions;
        count = saved_sessions.length;
    }

    function loadSession(s) {
        $startUser = s;
        start_user = s;
        ipcRenderer.send("start_user", {data: start_user});
    }

</script>

{#each saved_sessions as session}
<div class="session">
    <p>Start Date: {getDate(session.date)}</p>
    <button class="button" on:click={loadSession(session)}>Load</button>
    <button class="button" on:click={deleteSession(session)}>Delete</button>
</div>
{/each}

<div class="current">
    <p>Current Session: {getDate(start_user.date)}</p>
    <button class="button" on:click={saveSession}>Save</button>
</div>

<style>
    .button {
        padding: 5px;
        font-size: 14px;
    }

    .current {
        padding-top: 10px;
    }

    p {
        display: inline;
        padding: 10px;
        font-size: 16px;
    }
</style>