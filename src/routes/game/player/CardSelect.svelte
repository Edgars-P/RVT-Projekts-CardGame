<script lang="ts">
	import GameCard from "$lib/components/GameCard.svelte"
	import { playerPb } from "$lib/database"
	import { getToastStore } from "@skeletonlabs/skeleton"
	import type { RecordModel } from "pocketbase"
	import { writable } from "svelte/store"
	import { createGameMoveStore } from "../host/gameMoves"
	import AccountButton from "../../AccountButton.svelte"

	const toast = getToastStore()

	export let gameCardSets: string[]
	export let gameMoves: RecordModel[]
	export let maxCards: number

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

	// Samaisa kārtis, garantējos ka vismaz viena kārts no katras kategorijas
	// tiks parādīta
	function shuffleCards(cards: RecordModel[], maxCards: number): RecordModel[] {
		// Ja neviena kārts neatbilst, atgriez tukšu
		if (!cards.length) return []

		// Izveido masīvu ar visiem virsrakstiem
		let allTitles = Object.keys(
			cards.reduce((acc: Record<string, boolean>, card) => {
				console.log(card.virsraksts)
				// Viegls veids kā tikt vaļā no duplikātiem
				acc[card.virsraksts as string] = true
				return acc
			}, {})
			// Uzreiz samaisa virsrakstus, lai pat ja ir vairāk virsrakstu nekā kārts
			// visiem ir iespēja parādīties
		).sort(() => Math.random() - 0.5)

		console.log({ allTitles })

		// Sadala pašas kārtis un tās samaisa
		let cardsPerTitle: Record<string, RecordModel[]> = {}
		for (const title of allTitles) {
			cardsPerTitle[title] = cards
				.filter((card) => card.virsraksts == title)
				.sort(() => Math.random() - 0.5)
		}

		console.log({ cardsPerTitle })

		// Izvelk vienu kārti no katras virsrakstu kaudzes līdz ir sasniegts maxCards
		let finalCards: RecordModel[] = []
		for (let i = 0; finalCards.length < maxCards; i++) {
			const title = allTitles[i % allTitles.length]
			console.log({ title })

			// Ja kaudze tukša, mēģināt nākamo
			// TODO: Ja visas kaudzes beidzas, šis būs bezgalīgs
			if (!cardsPerTitle[title].length) {
				continue
			}

			// Izvelk kārti un pievieno gala masīvam
			const card = cardsPerTitle[title].shift() as RecordModel
			finalCards.push(card)
		}

		return finalCards
	}
</script>

<div class="wrap">
	<div class="flex flex-nowrap overflow-x-scroll snap-x snap-mandatory">
		{maxCards}
		{#each shuffleCards($cards ?? [], maxCards) as card}
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
