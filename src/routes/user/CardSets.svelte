<script lang="ts">
	import { account } from '$lib/account';
	import { pb } from '$lib/database';
	import { readable, writable } from 'svelte/store';
	import type { RecordModel } from 'pocketbase';

	// Izveido un pārvalda kāršu komplektus

	const myCardSets = writable([] as RecordModel[], (set) => {
		// Ielādē lietotāja izveidotos kāršu komplektus
		$pb
			?.collection('karsuKomplekti')
			.getFullList({ filter: `creator = "${$account?.id}"` })
			.then((cardSets) => {
				set(cardSets);
			});
	});

	async function createCardSet(name: string, description: string) {
		// Izveido jaunu kāršu komplektu
		const cardSet = await $pb?.collection('karsuKomplekti').create({
			name,
			description,
			creator: $account?.id
		});

		// Atjauno kāršu komplektu sarakstu
		$pb
			?.collection('karsuKomplekti')
			.getFullList({ filter: `creator = "${$account?.id}"` })
			.then((cardSets) => {
				myCardSets.set(cardSets);
			});

		return cardSet;
	}
</script>

<div class="wrap">
	<h1 class="h1">Mani kāršu komplekti</h1>

	{#each $myCardSets as cardSet}
		<div class="card my-3 p-3">
			<span class="font-bold">{cardSet.name} </span>
			<span class="content">{cardSet.description}</span>

			<div>
				<a class="btn btn-sm variant-filled-primary" href="/user/cards?cardSet={cardSet.id}">
					Rediģēt
				</a>
				<button class="btn btn-sm variant-filled-error"> Dzēst </button>
			</div>
		</div>
	{/each}

	<div class="card p-3">
		<div class="card-header font-bold">Izveidot jaunu kāršu komplektu</div>
		<div class="content">
			<form
				on:submit={async (e) => {
					e.preventDefault();
					const form = e.currentTarget;
					const formData = new FormData(form);
					const data = Object.fromEntries(formData.entries());
					await createCardSet(data.name.toString(), data.description.toString());
				}}
			>
				<div>
					<label class="label">
						Nosaukums
						<input type="text" name="name" class="input" />
					</label>
				</div>

				<div>
					<label class="label">
						Apraksts
						<textarea name="description" class="input" />
					</label>
				</div>

				<button type="submit" class="btn btn-lg variant-filled-primary mx-auto block mt-3">
					Izveidot
				</button>
			</form>
		</div>
	</div>
</div>
