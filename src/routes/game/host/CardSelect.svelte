<script lang="ts">
	import GameCard from "$lib/components/GameCard.svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import type { RecordModel } from "pocketbase"
	import { writable } from "svelte/store"
	import { createGameMoveStore } from "../host/gameMoves"
	import { pb } from "$lib/database"
	import { random } from "nanoid"

	const toast = getToastStore()

	export let gameCardSets: string[]
	export let gameMoves: RecordModel[]
	export let selectNewQuestionCard: boolean
	export let gameId: string

	console.log(gameCardSets)

	const cards = writable([] as RecordModel[], (set) => {
		$pb
			?.collection("spelesKartis")
			.getFullList({
				filter: `tips = "jautajuma" && ( ${gameCardSets
					.map((cardSet) => `karsuKomplekts = "${cardSet}"`)
					.join(" || ")} )`
			})
			.then((cardSets) => {
				set(cardSets)
			})
	})
</script>

<div class="wrap">
	<div class="flex flex-wrap">
		{#each $cards.sort(() => Math.random() - 0.5).slice(0, 5) as card}
			<GameCard card={card.id}>
				<button
					class="btn variant-filled-primary absolute -bottom-2 left-1/2 -translate-x-1/2"
					on:click={() => {
						$pb
							?.collection("spelesGajieni")
							.create({
								player: undefined,
								game: gameId,
								card: card.id
							})
							.then(() => {
								toast.trigger({
									message: "Kārts izspēlēta!",
									background: "variant-filled-success"
								})
								selectNewQuestionCard = false
							})
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
