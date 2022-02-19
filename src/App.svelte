<script>
  import { onMount } from "svelte";
  import { username, avatar_url, mode } from "./store";	
  import Sidebar from "./components/Sidebar.svelte";
  import User from "./components/User.svelte";

  let open = false;

</script>

<Sidebar bind:open/> 
<header>
	<div class="gamemode" style="--icon: url(../{$mode}.svg)"></div>
	<p class="username">{$username}</p>
	<button class="avatar" style="--avatar-url: url({$avatar_url})" on:click={() => open = !open}></button>
</header>

<main>

	<div class='stats'>
		<User/>
	</div>
</main>

<style>

	header {
		position: fixed;
		flex-direction: row;
  		display: flex;
		width: 100%;
		height: 40px;
		background-color: #3d2932;
		filter: drop-shadow(0px 5px 2px #222);
		z-index: 3;
	}

	main {
		margin-top: 40px;
		flex-direction: row;
  		display: flex;
  		padding: 5px 10px 0px 10px;
  		overflow-x: hidden;
		z-index: 1;
		height: calc(100% - 45px);
	}

	.stats {
		overflow: visible;
		height: calc(100% - 32px);
  		font-size: 14px;
  		min-width: 400px;
	}

	.avatar {
		margin: auto 3px auto auto;
		border-radius: 50%;
		border: 2px solid transparent;
		width: 32px;
		height: 32px;
		background-repeat: no-repeat;
  		background-position: center; 
		background-size: 32px;
		background-image: var(--avatar-url);
		background-color: grey;
	}

	.avatar:hover {
		cursor: pointer;
		border-color: white;
	}

	.gamemode {
		padding: 5px;
		width: 30px;
		height: 30px;
		background-repeat: no-repeat;
  		background-position: center; 
		background-size: 28px;
		background-image: var(--icon);
	}

	.username {
		margin: 0;
		padding: 12px 6px;
	}

</style>