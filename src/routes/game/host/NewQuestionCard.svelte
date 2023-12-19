<script lang="ts">
	import { browser } from "$app/environment"
	import { page } from "$app/stores"
	import { pb } from "$lib/database"
	import type { RecordModel } from "pocketbase"
	import { derived, readable, type Readable } from "svelte/store"
	import { createCurrentGameMovesStore, createGameMoveStore } from "./gameMoves"
	import GameCard from "$lib/components/GameCard.svelte"
	import CardSelect from "./CardSelect.svelte"

	export let gameRecord: Readable<RecordModel>
	export let gameMoves: Readable<RecordModel[]>
	export let selectNewQuestionCard: boolean
	export let gameId: string
</script>

<div class="absolute inset-0 bg-surface-100 bg-opacity-75 z-50" style="display: block;">
	<div
		class="card absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 h-5/6 overflow-y-scroll"
	>
		<div class="modal-header">
			<h2 class="h2 text-center">Izvēlies jautājuma karti</h2>
		</div>
		<div class="modal-body">
			<div class="flex flex-wrap">
				<CardSelect
					gameCardSets={$gameRecord?.karsuKomplekti}
					gameMoves={$gameMoves}
					bind:selectNewQuestionCard
					{gameId}
				/>
			</div>
		</div>
	</div>
</div>
