<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb } from '$lib/database';
	import type { RecordModel } from 'pocketbase';
	import { derived, readable } from 'svelte/store';

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
</script>

<h1 class="h1">Spēles vadītāja skats</h1>

{#if $gameRecord}
	<p>
		<br />
		Pievienojies šai spēlei: https://example.com/game/player?id={gameId}&secret={$gameRecord?.secret}
	</p>

	<p>
		Jautājuma kārts: {$gameRecord.expand?.jautajumaKarts}
	</p>

	<button
		on:click={() => {
			$pb?.collection('speles').update(gameId, {
				secret: crypto.randomUUID()
			});
		}}
	>
		aaa
	</button>
{/if}
