<script lang="ts">
	import { page } from "$app/stores"
	import { derived } from "svelte/store"
	import { pb } from "$lib/database"
	import { createGameMoveStore } from "../gameMoves"
	import { Table, filter, type TableSource, tableMapperValues } from "@skeletonlabs/skeleton"

	const gameId = $page.url.searchParams.get("id") as string

	if (!gameId) {
		location.href = "/"
	}

	const gameMoves = createGameMoveStore(gameId, pb)

	// Function to get the move details in a printable format
	const formatMove = (move: any) => {
		const playerName = move.expand?.player?.name ?? "Spēles vadītājs"
		const cardTitle = move.expand?.card?.virsraksts
		const cardContent = move.expand?.card?.saturs
		const time = new Date(move.created).toLocaleString()
		return {
			playerName,
			cardTitle,
			cardContent,
			time
		}
	}

	function createSource(data: any) {
		const tableSimple: TableSource = {
			// A list of heading labels.
			head: ["Laiks", "Vārds", "Kārts"],
			// The data visibly shown in your table body UI.
			body: data
				.filter((x: any) => x.card)
				.map((move: any) => {
					return [
						new Date(move.created).toLocaleString(),
						move.expand?.player?.name,
						`[${move.expand?.card?.virsraksts}] ${move.expand?.card?.saturs}`
					]
				})
		}

		return tableSimple
	}
</script>

<div class="game-summary p-3 print:p-0">
	<h2 class="h1 text-center">Spēles gājieni</h2>

	<Table source={createSource($gameMoves)}></Table>

	<button
		on:click={() => {
			window.print()
		}}
		class="btn variant-filled-primary print:hidden"
	>
		Drukāt
	</button>
</div>
