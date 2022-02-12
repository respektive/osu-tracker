<script>
	import Tooltip from './Tooltip.svelte';
    export let stat;
	let color;
	let title = "Click to copy!";

	function copy(stat) {
		navigator.clipboard.writeText(`${stat.name}: ${formatStat(stat)} (${stat.gained === 0 ? '' : formatGained(stat)})`);
		title = "Copied!";
		setTimeout(() => {title = "Click to copy!"}, 1000);
	}

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

	function formatNumber(n) {
		try {
			return n.toLocaleString('en-US');
		} catch(e) {
			return '0'
		}
	}

	function formatStat(s){
		switch (s.id) {
			case 0:
				return formatNumber(s.value) == 0 ? 'No Score Rank' : '#' + formatNumber(s.value);
            case 4:
            case 11: {
            	return '#' + formatNumber(s.value);
            	}
			case 7:
				return seconds2time(s.value);
			case 26:
            case 27: {
            	return formatNumber(Math.round(s.value));
            	}
			default:
			  return formatNumber(s.value);
		}
	}

	function formatGained(s){
		let r;
		if (s.gained > 0) {
			r = '+';
			color = 'green';
		} else {
			r = '-';
			color = 'red';
		}

		switch (s.id) {
			case 7:
				return r + seconds2time(s.gained);
			case 26:
            case 27: {
            	return r + formatNumber(Math.round(s.value));
            	}
			default:
				return r + formatNumber(s.gained);
		}
	}

</script>
<Tooltip title={title}>
	<dl class="stats_entry" on:click={copy(stat)}>
		<dt class='stats_key'>{stat.name}:</dt>
		<dd class='stats_value'>{isNaN(stat.value) ? '0' : formatStat(stat)}</dd>
		<dd style='color: {color};' class='gained_value'>{stat.gained === 0 || isNaN(stat.gained) ? '' : formatGained(stat)}</dd>
	</dl>
</Tooltip>


<style>
    .stats_entry {
  		display: flex;
  		justify-content: space-between;
  		margin: 5px 0;
	}

	.stats_key{
  		padding-top: 5px;
  		min-width: 130px;
	}

	.stats_value {
		margin: 0;
		background-color: #1c1719;
		padding: 5px;
		min-width: 120px;
		max-height: 16px;
		min-height: 16px;
		text-align: right;
		border-radius: 5px;
		border-style: solid;
		border-width: 1px;
		border-color: transparent;
	}

	.stats_value:hover {
		border-color: lightgray;
	}

	.gained_value {
		margin-left: 5px;
		background-color: #1c1719;
		padding: 5px;
		min-width: 110px;
		min-height: 16px;
		text-align: left;
		border-radius: 5px;
		border-style: solid;
		border-width: 1px;
		border-color: transparent;
	}
	.gained_value:hover {
		border-color: lightgray;
	}

</style>