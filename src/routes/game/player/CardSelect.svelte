<script lang="ts">
	import GameCard from "$lib/components/GameCard.svelte"
	import { playerPb } from "$lib/database"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import type { RecordModel } from "pocketbase"
	import { writable } from "svelte/store"
	import { createGameMoveStore } from "../host/gameMoves"

	const toast = getToastStore()

	export let gameCardSets: string[]
	export let gameMoves: RecordModel[]

	console.log(gameCardSets)

	/* 
		Atrod visas atbilžu kārtis kuras var izspēlēt
	*/
	const cards = writable([] as RecordModel[], (set) => {
		$playerPb
			?.collection("spelesKartis")
			.getFullList({
				filter: `tips = "atbilzu" && ( ${gameCardSets
					.map((cardSet) => `karsuKomplekts = "${cardSet}"`)
					.join(" || ")} )`
			})
			.then((cardSets) => {
				set(cardSets)
			})
	})
</script>

<div class="wrap">
	<div class="flex flex-nowrap overflow-x-scroll snap-x snap-mandatory">
		{#each $cards.sort(() => Math.random() - 0.5) as card}
			<div class="flex-shrink-0 snap-center">
				<GameCard card={card.id}>
					<button
						class="btn variant-filled-primary absolute -bottom-2 left-1/2 -translate-x-1/2"
						on:click={() => {
							/* 
							Izspēlē izvēlēto kārti
						*/
							$playerPb
								?.collection("spelesGajieni")
								.create({
									player: $playerPb?.authStore.model?.id,
									game: $playerPb?.authStore.model?.game,
									card: card.id
								})
								.then(() => {
									toast.trigger({
										message: "Kārts izspēlēta!",
										background: "variant-filled-success"
									})
								})
						}}
					>
						Izspēlēt
					</button>
				</GameCard>
			</div>
		{:else}
			<p>Nav kāršu</p>
		{/each}
	</div>
</div>
