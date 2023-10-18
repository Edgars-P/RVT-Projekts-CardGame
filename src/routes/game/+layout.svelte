<script>
	import { account, pb } from '$lib/account';
</script>

{#if $account}
	<p>
		{JSON.stringify(pb)}
	</p>
	<slot />
{:else}
	<p class="loadingMsg">Loading account...</p>
{/if}

<style lang="sass">
	.loadingMsg
		font-size: 1.5rem
		font-weight: bold
		width: max-content
		margin: auto
		margin-top: 1rem
		margin-bottom: 1rem
</style>
