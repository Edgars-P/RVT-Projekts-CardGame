<script lang="ts">
	import GameCard from '$lib/components/GameCard.svelte';
	import { playerPb } from '$lib/database';
	import { getToastStore } from '@skeletonlabs/skeleton';
	import type { RecordModel } from 'pocketbase';
	import { writable } from 'svelte/store';
	import { createGameMoveStore } from '../host/gameMoves';

	const toast = getToastStore();

	export let gameCardSets: string[];
	export let gameMoves: RecordModel[];
	export let selectNewQuestionCard: boolean;

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
	<div class="flex flex-wrap">
		{#each $cards as card}
			<GameCard card={card.id}>
				<button
					class="btn variant-filled-primary"
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
								selectNewQuestionCard = false;
							});
					}}
				>
					Izspēlēt
				</button>
			</GameCard>
		{:else}
			<p>Nav kāršu</p>
		{/each}
	</div>
</div>
