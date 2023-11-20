<script>
	import { account } from '$lib/account';
	import { pb } from '$lib/database';
</script>

{#if $account}
	<slot />
{:else}
	<p class="loadingMsg">Loading account...</p>
{/if}
