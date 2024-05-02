<script lang="ts">
	import GameCard from "$lib/components/GameCard.svelte"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import type { RecordModel } from "pocketbase"
	import { writable } from "svelte/store"
	import { createGameMoveStore } from "../host/gameMoves"
	import { pb } from "$lib/database"
	import { random } from "nanoid"

	const toast = getToastStore()

	// Spēles kāršu komplekti
	export let gameCardSets: string[]
	// Spēles gājieni
	export let gameMoves: RecordModel[]
	// Vai rādīt šo izvēlni
	export let selectNewQuestionCard: boolean
	// Spēles ID
	export let gameId: string
	// Kāršu daudzums
	export let cardAmount: number

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
		{#each $cards.sort(() => Math.random() - 0.5).slice(0, cardAmount) as card}
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
