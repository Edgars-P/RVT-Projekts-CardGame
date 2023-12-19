<script lang="ts">
	import { account } from "$lib/account"
	import { pb } from "$lib/database"
	import type { RecordModel } from "pocketbase"
	import { writable } from "svelte/store"

	const myGames = writable([] as RecordModel[], (set) => {
		$pb
			?.collection("speles")
			.getFullList({ filter: `raditajs = "${$account?.id}"`, expand: "karsuKomplekti" })
			.then((games) => {
				set(games)
			})
	})
</script>

<button
	on:click={() => {
		window.print()
	}}
	class="btn variant-filled-primary"
>
	Drukāt
</button>

<div class="wrap max-w-3xl mx-auto">
	<h1 class="h3 text-center">Manas spēles</h1>

	{#each $myGames as game}
		<div class="card my-3 p-3">
			<span class="font-bold">{game.id} </span>
			<span class="content">
				<ul>
					<li>
						Spēles noteikumi: {#each game.noteikumi ?? [] as noteikums}
							<span class="chip variant-filled m-1">
								{noteikums}
							</span>
						{/each}
					</li>
					<li>
						Kāršu komplekti: {#each game.expand?.karsuKomplekti.map((x) => x.name) ?? [] as cardSetName}
							<span class="chip variant-filled m-1">{cardSetName}</span>
						{/each}
					</li>
				</ul>
			</span>
		</div>
	{:else}
		<div class="card my-3 p-3">
			<span class="font-bold">Nav spēļu</span>
		</div>
	{/each}
</div>
