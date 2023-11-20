<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { playerPb } from '$lib/database';
	import { onMount } from 'svelte';
	import { customAlphabet } from 'nanoid';
	import { alphanumeric } from 'nanoid-dictionary';

	const gameId = $page.url.searchParams.get('id') as string;
	const secret = $page.url.searchParams.get('secret') as string;

	if ((!gameId || !secret) && browser) {
		location.href = '/';
	}

	let playerRecord = $playerPb?.authStore.model;

	onMount(async () => {
		if (playerRecord && playerRecord.game == gameId) {
			return;
		}

		const username = customAlphabet(alphanumeric)();
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

		const record = await $playerPb?.collection('speletaji').create(data);
		const authData = await $playerPb?.collection('speletaji').authWithPassword(username, password);

		playerRecord = $playerPb?.authStore.model;
	});
</script>

<h1 class="h1">Spēlētāja skats</h1>

{#if playerRecord && playerRecord.game == gameId}
	Pievienots spēlei ar vārdu {playerRecord.name}!
{/if}
