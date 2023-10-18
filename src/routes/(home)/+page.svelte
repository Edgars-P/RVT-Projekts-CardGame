<script>
	import { account } from '$lib/account';
</script>

<main>
	<h1>Projekts CardGame</h1>

	{#if !$account}
		<p>Ienāc vai reģistrējies lai sāktu savu pirmo spēli!</p>
	{/if}
</main>

<style lang="sass">
	main
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		width: 100vw
		height: 100vh
		text-align: center
		position: absolute
		top: 0
		left: 0
		z-index: -1


	h1
		font-size: 2rem
		margin-bottom: 1rem

	p
		font-size: 1.25rem
		margin-bottom: 1rem
	

</style>
