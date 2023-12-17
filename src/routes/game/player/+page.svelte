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

	const gameId = $page.url.searchParams.get('id') as string;
	const secret = $page.url.searchParams.get('secret') as string;

	if ((!gameId || !secret) && browser) {
		location.href = '/';
	}

	let playerRecord = $playerPb?.authStore.model;

	/*
		Uzreiz kad spēlētājs pievienojas spēlei tam tiek prasīts vārds.
		Pēc tam programma mēģina izveidot spēlētāja ierakstu ar ID un noslēpumu no URL.
		Tas neizdosies ja viens vai otrs ir nepareizi.
	*/
	onMount(async () => {
		$playerPb?.authStore.clear();

		if (playerRecord && playerRecord.game == gameId) {
			//Vēlreiz pieraktās lai atjauninātu sesiju
			await $playerPb
				?.collection('speletaji')
				.authWithPassword(
					localStorage.getItem('player_user') as string,
					localStorage.getItem('player_pass') as string
				);

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

		playerRecord = $playerPb?.authStore.model;
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
</script>

<h1 class="h1">Spēlētāja skats</h1>

{#if playerRecord && playerRecord.game == gameId}
	Pievienots spēlei ar vārdu {playerRecord.name}!

	<hr />

	Jautājuma kārts:
	{#if $gameRecord?.jautajumaKarts}
		<GameCard card={$gameRecord?.jautajumaKarts} />
	{/if}

	<hr />
	{#if $gameRecord?.karsuKomplekti}
		<CardSelect gameCardSets={$gameRecord?.karsuKomplekti} />
	{/if}
{/if}
