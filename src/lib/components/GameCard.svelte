<script lang="ts">
	import { pb } from '$lib/database';
	import type { RecordModel } from 'pocketbase';
	export let card: string;

	import { getCard } from '$lib/cardCache';
</script>

<div class="card w-[13rem] h-[20rem] m-4 p-4">
	{#if $pb}
		{#await getCard($pb, card) then data}
			<h1 class="h3">{data?.virsraksts}</h1>
			<p>{data?.saturs}</p>
		{/await}
	{/if}
</div>
