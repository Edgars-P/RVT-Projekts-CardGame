<script lang="ts">
	import { playerPb } from '$lib/database';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { RecordModel } from 'pocketbase';
	import { writable } from 'svelte/store';

	const toast = getToastStore();

	export let gameCardSets: string[];

	console.log(gameCardSets);

	const cards = writable([] as RecordModel[], (set) => {
		$playerPb
			?.collection('spelesKartis')
			.getFullList({
				filter: `tips = "jautajuma" && ( ${gameCardSets
					.map((cardSet) => `karsuKomplekts = "${cardSet}"`)
					.join(' || ')} )`
			})
			.then((cardSets) => {
				set(cardSets);
			});
	});
</script>

<div class="wrap">
	<h1 class="h1">Izvēlies kārti kuru izspēlēt</h1>

	{JSON.stringify(gameCardSets)}

	{#each $cards as card}
		<div class="card my-3 p-3 grid grid-cols-2">
			<div>
				<span class="font-bold">{card.virsraksts} </span>
				<span class="content">{card.saturs}</span>
			</div>
			<button
				on:click={() => {
					$playerPb
						?.collection('spelesGajieni')
						.create({
							player: $playerPb?.authStore.model?.id,
							game: $playerPb?.authStore.model?.game,
							card: card.id
						})
						.then(() => {
							toast.trigger({
								message: 'Kārts izspēlēta!',
								background: 'variant-filled-success'
							});
						});
				}}>Izspēlēt</button
			>
		</div>
	{:else}
		<p>Nav kāršu</p>
	{/each}
</div>
