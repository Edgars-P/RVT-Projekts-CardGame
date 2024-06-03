<script lang="ts">
	import { page } from "$app/stores"
	import { pb } from "$lib/database"
	import type { RecordModel } from "pocketbase"
	import { writable } from "svelte/store"
	import { faker } from "@faker-js/faker"
	import { goto } from "$app/navigation"

	const cards = writable([] as RecordModel[], (set) => {
		$pb
			?.collection("spelesKartis")
			.getFullList({
				filter: `karsuKomplekts = "${$page.url.searchParams.get("cardSet")}"`
			})
			.then((cardSets) => {
				set(cardSets)
			})
	})

	const cardSet = writable({} as RecordModel, (set) => {
		$pb
			?.collection("karsuKomplekti")
			.getOne($page.url.searchParams.get("cardSet") ?? "")
			.then((cardSet) => {
				set(cardSet)
			})
	})

	async function generateExampleCards() {
		for (let i = 0; i < 20; i++) {
			const tips = i % 2 === 0 ? "jautajuma" : "atbilzu"

			const card = {
				virsraksts: `Kārts ${tips} ${i}`,
				saturs: faker.lorem.sentence(),
				karsuKomplekts: $page.url.searchParams.get("cardSet"),
				tips: tips,
				custom: "{}"
			}
			await $pb?.collection("spelesKartis").create(card)
		}
	}
</script>

<!--
	Kāršu komplekta rediģēšana
-->

<div class="card mx-5 my-3 p-3">
	<div class="font-bold text-center">Kāršu komplekts: {$cardSet.name}</div>
	<div class="content">
		<form
			on:submit|preventDefault={async (e) => {
				e.preventDefault()
				const form = e.currentTarget
				const formData = new FormData(form)
				const data = Object.fromEntries(formData.entries())
				$pb && (await $pb.collection("karsuKomplekti").update($cardSet.id ?? "", data))
				goto("/user?tab=2")
			}}
		>
			<label class="label">
				Nosaukums
				<input class="input" type="text" name="name" id="name" value={$cardSet.name} required />
			</label>
			<label class="label">
				Apraksts
				<textarea class="input" name="description" id="description" required
					>{$cardSet.description}</textarea
				>
			</label>
			<button class="btn variant-filled-primary">Saglabāt</button>
		</form>
	</div>
</div>

<div class="max-w-2xl mx-auto">
	{#each $cards as card}
		<div class="card p-3 my-3 relative">
			<div class="font-bold">
				{card.virsraksts}
			</div>
			<div class="content">
				{card.saturs}
			</div>
			<button
				on:click={() => {
					$pb
						?.collection("spelesKartis")
						.delete(card.id)
						.then(() => {
							cards.update((cards) => cards.filter((c) => c.id !== card.id))
						})
				}}
				class="btn btn-sm variant-outline-error absolute top-0 right-0"
			>
				Dzēst
			</button>
		</div>
	{:else}
		<div class="card p-3 my-3">
			<div class="content text-center">Komplektā kāršu nav!</div>
			<button
				on:click={async () => {
					await generateExampleCards()
					location.reload()
				}}
				class="btn variant-filled-primary block mx-auto mt-3"
			>
				Izveidot piemēra kārtis
			</button>
		</div>
	{/each}
</div>

<div class="card max-w-xl mx-auto p-3 mb-12">
	<div class="font-bold text-center">Izveidot jaunas kārtis</div>
	<div class="content">
		<form
			on:submit|preventDefault={async (e) => {
				e.preventDefault()
				const form = e.currentTarget
				const formData = new FormData(form)

				const allCards = formData.get("saturi")?.toString().trim().split("\n")

				if (!allCards?.length) {
					throw new Error("Kārtis nav definētas!")
				}

				for (const card of allCards) {
					await $pb
						?.collection("spelesKartis")
						.create({
							virsraksts: formData.get("title")?.toString(),
							saturs: card,
							karsuKomplekts: $page.url.searchParams.get("cardSet"),
							tips: formData.get("tips")?.toString() ?? "jautajuma",
							custom: JSON.parse(formData.get("custom")?.toString() ?? "{}")
						})
						.then((card) => {
							cards.update((cards) => [...cards, card])
							form.reset()
						})
				}
			}}
		>
			<label class="label">
				Virsraksts
				<input class="input" type="text" name="title" id="title" required />
			</label>
			<label class="label">
				Saturs (katra kārts jaunā rindā)
				<textarea class="input" name="saturi" id="saturi" required></textarea>
			</label>
			<label class="label">
				Tips
				<select class="input" name="tips" id="tips" required>
					<option value="jautajuma">Jautājuma</option>
					<option value="atbilzu">Atbildes</option>
				</select>
			</label>
			<label class="label">
				Papildus dati (piem. krāsa, īpašas darbības, utt.)
				<textarea class="input" name="custom" id="custom" required></textarea>
			</label>
			<button class="btn variant-filled-primary block mx-auto mt-3">Izveidot</button>
		</form>
	</div>
</div>

<!-- Fix cards with "custom" as string instead of JSON -->
<button
	on:click={() => {
		let toUpdate = $cards.length
		$cards.forEach((card, i) => {
			if (typeof card.custom == "string") {
				console.log("fix", card.custom)

				setTimeout(async () => {
					await $pb?.collection("spelesKartis").update(card.id, {
						custom: eval(`let i = ${card.custom}; i`)
					})
					toUpdate--
					console.log(toUpdate)
				}, 100 * i)
			}
		})
	}}
	class="btn variant-filled-primary block mx-auto my-5"
>
	Salabot datu struktūru
</button>
