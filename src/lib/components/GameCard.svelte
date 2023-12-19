<script lang="ts">
	import { pb } from "$lib/database"
	import type { RecordModel } from "pocketbase"
	export let card: string | RecordModel

	import { getCard } from "$lib/cardCache"
</script>

<div class="card w-[13rem] h-[20rem] m-4 p-4 relative">
	{#if $pb}
		{#await typeof card == "string" ? getCard($pb, card) : card then data}
			<h1 class="h3">{data?.virsraksts}</h1>
			<p>{data?.saturs}</p>
		{/await}
	{/if}

	<slot />
</div>
