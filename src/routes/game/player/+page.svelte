<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { pb, playerPb } from '$lib/database';
	import { onMount } from 'svelte';
	import { customAlphabet } from 'nanoid';
	import CardSelect from './CardSelect.svelte';
	import type { RecordModel } from 'pocketbase';
	import { derived } from 'svelte/store';
	import GameCard from '$lib/components/GameCard.svelte';
	import { createCurrentGameMovesStore, createGameMoveStore } from '../host/gameMoves';

	const gameId = $page.url.searchParams.get('id') as string;
	const secret = $page.url.searchParams.get('secret') as string;

	if ((!gameId || !secret) && browser) {
		location.href = '/';
	}

	let playerRecord = $playerPb?.authStore.model;
	console.log('playerRecord', playerRecord);

	/*
		Uzreiz kad spēlētājs pievienojas spēlei tam tiek prasīts vārds.
		Pēc tam programma mēģina izveidot spēlētāja ierakstu ar ID un noslēpumu no URL.
		Tas neizdosies ja viens vai otrs ir nepareizi.
	*/
	onMount(async () => {
		if (playerRecord && playerRecord.game == gameId) {
			return;
		}

		// Izveido viltus lietotājvārdu un paroli
		// Tas ir nepieciešams lai izmantotu datu bāzes autentifikācijas funkcijas
		const username = customAlphabet('qwertyuiopasdfghjklzxcvbnm1234567890')();
		const password = crypto.randomUUID();
		const data = {
			username: username,
			email: crypto.randomUUID() + '@example.com',
			emailVisibility: true,
			password: password,
			passwordConfirm: password,
			game: gameId,
			name: prompt('Ievadi savu vārdu'),
			secret: secret
		};

		// Izveido lietotāju un izvēlas to kā aktīvo.
		const record = await $playerPb?.collection('speletaji').create(data);
		const authData = await $playerPb?.collection('speletaji').authWithPassword(username, password);

		//Saglabā lietotāju datus
		localStorage.setItem('player_user', username);
		localStorage.setItem('player_pass', password);

		location.reload();
	});

	const gameRecord = derived(
		playerPb,
		($pb, set) => {
			if (!$pb) return;
			console.log('gameId', gameId);
			$pb
				.collection('speles')
				.getOne(gameId)
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

	const gamePlayers = derived(
		playerPb,
		($pb, set, update) => {
			if (!$pb) return;
			$pb
				.collection('speletaji')
				.getFullList({
					filter: `game = "${gameId}"`
				})
				.then((gamePlayers) => {
					set(gamePlayers);
				});

			$pb?.collection('speletaji').subscribe('*', function (e) {
				if (e.record.game != gameId) return;

				switch (e.action) {
					case 'create':
						update((players) => [...players, e.record]);
						break;
					case 'update':
						update((players) => {
							const index = players.findIndex((player) => player.id == e.record.id);
							players[index] = e.record;
							return players;
						});
						break;
					case 'delete':
						update((players) => {
							const index = players.findIndex((player) => player.id == e.record.id);
							players.splice(index, 1);
							return players;
						});
						break;
				}
			});
		},
		[] as RecordModel[]
	);

	let gameMoves = createCurrentGameMovesStore(gameId, gamePlayers, playerPb);
</script>

<h1 class="h1">Spēlētāja skats</h1>

{#if playerRecord && playerRecord.game == gameId}
	Pievienots spēlei ar vārdu {playerRecord.name}!

	<hr />
	<p>
		<b>Jautājuma kārts:</b>
		{#if $gameMoves[0]}
			<GameCard card={$gameMoves[0].expand?.card} />
		{/if}
	</p>

	<hr />
	{#if $gameRecord?.karsuKomplekti}
		{#if $gameMoves.every((move) => move.player !== playerRecord?.id)}
			<CardSelect gameCardSets={$gameRecord?.karsuKomplekti} gameMoves={$gameMoves} />
		{:else}
			<p>Spēles kārts ir izspēlēta!</p>
		{/if}
	{/if}
{/if}
