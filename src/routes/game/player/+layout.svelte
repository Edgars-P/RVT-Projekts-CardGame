<script>
	import { onMount } from "svelte"

	let name = ""

	onMount(() => {
		name = localStorage.getItem("player_name") ?? ""
	})
</script>

<!-- 
    Palūdz lietotāja vārdu pirms rāda UI
-->

{#if !name}
	<form
		on:submit|preventDefault={(e) => {
			let data = new FormData(e.currentTarget)
			console.log(data)
			let formName = data.get("name")?.toString() ?? ""
			console.log(formName)
			localStorage.setItem("player_name", formName)
			name = formName
		}}
		class="card max-w-96 p-3 mx-auto mt-20 text-center grid grid-cols-1 gap-4"
	>
		<h1 class="h3 text-center">Vārds?</h1>
		<input type="text" name="name" id="name" class="input" required />
		<button class="btn variant-filled-primary">Ienākt</button>
	</form>
{:else}
	<slot />
{/if}
