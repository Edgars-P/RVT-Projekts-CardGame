<script lang="ts">
	import NewQuestionCard from "./NewQuestionCard.svelte"

	import { browser } from "$app/environment"
	import { page } from "$app/stores"
	import { pb } from "$lib/database"
	import type { RecordModel } from "pocketbase"
	import { derived, readable } from "svelte/store"
	import { createCurrentGameMovesStore, createGameMoveStore } from "./gameMoves"
	import GameCard from "$lib/components/GameCard.svelte"
	import CardSelect from "./CardSelect.svelte"
	import QrCode from "$lib/components/QrCode.svelte"

	const gameId = $page.url.searchParams.get("id") as string

	if (!gameId && browser) {
		location.href = "/"
	}

	const gameRecord = derived(
		pb,
		($pb, set) => {
			if (!$pb) return
			console.log("gameId", gameId)
			$pb
				.collection("speles")
				.getOne(gameId, {
					expand: "jautajumaKarts"
				})
				.then((gameRecord) => {
					console.log("gameRecord", gameRecord)
					set(gameRecord)
				})

			$pb?.collection("speles").subscribe(gameId, function (e) {
				console.log(e)
				set(e.record)
			})
		},
		undefined as undefined | RecordModel
	)

	const gamePlayers = derived(
		pb,
		($pb, set, update) => {
			if (!$pb) return

			$pb
				.collection("speletaji")
				.getFullList({
					filter: `game = "${gameId}"`
				})
				.then((gamePlayers) => {
					set(gamePlayers)

					$pb?.collection("speletaji").subscribe("*", function (e) {
						if (e.record.game != gameId) return

						switch (e.action) {
							case "create":
								update((players) => [...players, e.record])
								break
							case "update":
								update((players) => {
									const index = players.findIndex((player) => player.id == e.record.id)
									players[index] = e.record
									return players
								})
								break
							case "delete":
								update((players) => {
									const index = players.findIndex((player) => player.id == e.record.id)
									players.splice(index, 1)
									return players
								})
								break
						}
					})
				})
		},
		[] as RecordModel[]
	)

	const gameMoves = createCurrentGameMovesStore(gameId, gamePlayers, pb)

	let selectNewQuestionCard = false
</script>

<div class="gameBoard">
	{#if selectNewQuestionCard}
		<!--
	Izveido popup logu kurā tiek parādītas visas kārtis no izvēlētājiem komplektiem.
-->
		<NewQuestionCard {gameRecord} {gameMoves} bind:selectNewQuestionCard {gameId}></NewQuestionCard>
	{/if}

	{#if $gameRecord}
		{@const gameUrl = new URL(
			`/game/player?id=${gameId}&secret=${$gameRecord?.secret}`,
			$page.url.href
		).href}
		<div class="qr card p-2 grid grid-rows-[max-content_1fr] h-max m-2 justify-center text-center">
			<h3 class="font-bold text-lg w-full">Noskenē QR kodu lai pievienotos!</h3>
			<a href={gameUrl} target="_blank" class="flex">
				<QrCode url={gameUrl} />
			</a>
		</div>

		<div class="players">
			Spēlētāji:
			{#each $gamePlayers ?? [] as player}
				<div class="chip variant-filled m-1 px-5">
					{player.name}
				</div>
			{/each}
		</div>

		<hr />

		<div class="questionCard">
			{#if $gameMoves[0]}
				<GameCard card={$gameMoves[0].expand?.card}>
					<button
						class="btn variant-filled-primary absolute -bottom-2 left-1/2 -translate-x-1/2"
						on:click={() => {
							selectNewQuestionCard = true
						}}
					>
						Jauna kārts
					</button>
				</GameCard>
			{:else}
				<button
					class="btn variant-filled-primary"
					on:click={() => {
						selectNewQuestionCard = true
					}}
				>
					Jauna kārts
				</button>
			{/if}
		</div>

		<div class="flex flex-row flex-wrap answers">
			{#each $gameMoves.splice(1) ?? [] as move}
				<GameCard card={move.card}>
					<div
						class="chip variant-filled m-1 absolute top-0 right-1/2 translate-x-1/2 -translate-y-4"
					>
						{move.expand?.player?.name}
					</div>
				</GameCard>
			{/each}
		</div>
	{/if}
</div>

<style>
	.gameBoard {
		display: grid;
		grid-template-columns: 1fr 1fr 15rem;
		grid-template-rows: min-content min-content 1fr;
		grid-column-gap: 0px;
		grid-row-gap: 0px;
		min-height: calc(100vh - 5rem);
	}

	.qr {
		grid-area: 1 / 3 / 3 / 4;
	}
	.questionCard {
		grid-area: 1 / 1 / 2 / 3;
	}
	.answers {
		grid-area: 2 / 1 / 4 / 3;
	}
	.players {
		grid-area: 3 / 3 / 4 / 4;
	}
</style>
