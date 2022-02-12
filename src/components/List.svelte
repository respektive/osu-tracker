<script>
    import {flip} from "svelte/animate";
    import {dndzone} from "svelte-dnd-action";
	export let items = [];
    const flipDurationMs = 300;
	function handleSort(e) {
		items = e.detail.items;
	}
	function handleFinal(e) {
		items = e.detail.items;
	}
</script>

<style>
    section {
        float: left;
        background-color: #2a2226;
        width: 45%;
        padding: 5px;
        padding-right: 10px;
        border-radius: 5px;
        /* this will allow the dragged element to scroll the list */
        overflow: hidden scroll;
        height: 250px;
    }
    div {
        background-color: #46393f;
        width: 95%;
        padding: 5px;
        border-radius: 5px;
        margin: 3px;
    }
</style>
<section use:dndzone={{items, flipDurationMs, dropTargetStyle: {outline: '#ac396d solid 2px'}}} on:consider={handleSort} on:finalize={handleFinal}>
    {#each items as item(item.id)}
    <div animate:flip="{{duration: flipDurationMs}}">{item.name}</div>
    {/each}
</section>