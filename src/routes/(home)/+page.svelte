<script>
	import { account } from "$lib/account"
	import StartGame from "./StartGame.svelte"
</script>

<main
	class="flex flex-col items-center justify-center flex-1 w-full max-w-4xl px-4 py-8 mx-auto md:px-8 md:py-16"
>
	<h1 class="h1">Projekts CardGame</h1>

	{#if !$account}
		<p>Ienāc vai reģistrējies lai sāktu savu pirmo spēli!</p>
	{/if}
</main>

{#if $account}
	<div class="steps mx-20 card p-3 pt-0">
		<StartGame />
	</div>
{/if}
