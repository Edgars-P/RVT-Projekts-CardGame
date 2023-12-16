<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/database';
	import type { RecordModel } from 'pocketbase';
	import { derived, readable } from 'svelte/store';
	import { createGameMoveStore } from './gameMoves';
	import GameCard from '$lib/components/GameCard.svelte';

	const gameId = $page.url.searchParams.get('id') as string;

	if (!gameId && browser) {
		location.href = '/';
	}

	const gameRecord = derived(
		pb,
		($pb, set) => {
			if (!$pb) return;
			console.log('gameId', gameId);
			$pb
				.collection('speles')
				.getOne(gameId, {
					expand: 'jautajumaKarts'
				})
				.then((gameRecord) => {
					console.log('gameRecord', gameRecord);
					set(gameRecord);
				});

			$pb?.collection('speles').subscribe(gameId, function (e) {
				console.log(e);
				set(e.record);
			});
		},
		undefined as undefined | RecordModel
	);

	const gameMoves = createGameMoveStore(gameId);

	const gameBoard = derived(gameMoves, ($gameMoves) => {
		// Visas atbildes kārtis kopš pēdējās jautājuma kārtis

		const lastQuestionCardIndex = $gameMoves?.findIndex((move) => move.card.type === 'question');
	});
</script>

<h1 class="h1">Spēles vadītāja skats</h1>

{#if $gameRecord}
	<p>
		<br />
		<b>Pievienojies šai spēlei</b>: https://example.com/game/player?id={gameId}&secret={$gameRecord?.secret}
	</p>

	<p>
		<b>Jautājuma kārts:</b>
		{JSON.stringify($gameRecord.expand?.jautajumaKarts)}
	</p>

	<hr />
	<hr />
	<hr />

	<h1 class="h3">Spēles gājieni</h1>

	<div class="flex flex-row flex-wrap">
		{#each $gameMoves ?? [] as move}
			<GameCard card={move.card} />
		{/each}
	</div>

	<button
		class="btn variant-filled variant-filled-primary"
		on:click={() => {
			const data = {
				player: '1yvx62nbhqbmelt',
				game: gameId,
				card: 'o1uecs779949rfp'
			};

			$pb?.collection('spelesGajieni').create(data);
		}}>Veikt gājienu</button
	>
{/if}
