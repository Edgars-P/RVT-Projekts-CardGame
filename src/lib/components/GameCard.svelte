<script lang="ts">
	import { pb } from "$lib/database"
	import type { RecordModel } from "pocketbase"
	export let card: string | RecordModel

	import { getCard } from "$lib/cardCache"
</script>

{#if $pb}
	{#await typeof card == "string" ? getCard($pb, card) : card}
		<div class="card w-[13rem] h-[20rem] m-4 p-4 relative shadow-lg flex-shrink-0" />
	{:then data}
		<div
			class="card w-[13rem] h-[20rem] m-4 p-4 relative shadow-lg flex-shrink-0"
			style="background-color: color-mix(in hsl, {data?.custom
				?.color} 40%, rgb(var(--color-surface-100)))"
		>
			<h1 class="h3">{data?.virsraksts}</h1>
			<p>{data?.saturs}</p>

			<slot />
		</div>
	{/await}
{:else}
	<div class="card w-[13rem] h-[20rem] m-4 p-4 relative shadow-lg flex-shrink-0" />
{/if}
