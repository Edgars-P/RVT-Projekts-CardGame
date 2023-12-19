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

<h1 class="h1">Spēles vadītāja skats</h1>

{#if selectNewQuestionCard}
	<!--
	Izveido popup logu kurā tiek parādītas visas kārtis no izvēlētājiem komplektiem.
-->
	<NewQuestionCard {gameRecord} {gameMoves} bind:selectNewQuestionCard {gameId}></NewQuestionCard>
{/if}

{#if $gameRecord}
	<p>
		<br />
		<b>Pievienojies šai spēlei</b>:
		<a href="/game/player?id={gameId}&secret={$gameRecord?.secret}" target="_blank">
			https://example.com/game/player?id={gameId}&secret={$gameRecord?.secret}
		</a>
	</p>

	<hr />

	<p>
		Spēlētāji:
		{#each $gamePlayers ?? [] as player}
			<div class="chip variant-filled m-1 px-5">
				{player.name}
			</div>
		{/each}
	</p>

	<hr />

	<p>
		<b>Jautājuma kārts:</b>
		{#if $gameMoves[0]}
			<GameCard card={$gameMoves[0].expand?.card}>
				<button
					class="btn variant-filled-primary"
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
	</p>

	<hr />
	<hr />
	<hr />

	<h1 class="h3">Spēles gājieni</h1>

	<div class="flex flex-row flex-wrap">
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
