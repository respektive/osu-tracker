<script>
  import { onMount } from "svelte";
  import { username, avatar_url } from "./store";	
  import Sidebar from "./components/Sidebar.svelte";
  import User from "./components/User.svelte";

  let open = false;

</script>

<Sidebar bind:open/> 
<header>
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
  		padding: 5px 10px 10px 10px;
  		overflow-x: hidden;
		z-index: 1;
	}

	.stats {
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

	.username {
		margin: 0;
		padding: 10px 15px;
	}

</style>