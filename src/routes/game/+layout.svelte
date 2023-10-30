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
