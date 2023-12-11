<script lang="ts">
	import { account } from '$lib/account';
	import { pb } from '$lib/database';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import type { RecordModel } from 'pocketbase';

	let selectedCardSets: RecordModel[] = [];

	/**
	 * Funkcija tiek izsaukta, kad tiek pabeigts pēdējais solis.
	 * Izveido spēli datubāzē un pāradresē uz to.
	 */
	async function onCompleteHandler() {
		const data = {
			raditajs: $account?.id,
			secret: crypto.randomUUID(),
			noteikumi: ['rule1'],
			karsuKomplekti: selectedCardSets.map((x) => x.id)
		};

		const record = await $pb?.collection('speles').create(data);

		if (record) {
			console.log('record', record);
			location.href = `/game/host?id=${record.id}`;
		}
	}
</script>

<Stepper
	on:complete={onCompleteHandler}
	stepTerm="Solis"
	buttonNextLabel="Tālāk"
	buttonBackLabel="Atpakaļ"
	buttonCompleteLabel="Sākt spēli"
>
	<!--
		Solis 1
		Ievadsolis ar sākuma tekstu.
	-->
	<Step>
		<h1 class="h3">Izveidot jaunu spēli!</h1>
		<p>Izvēlies kāršu komplektus, dažus vienkāršus noteikumus, un sāc spēli!</p>
	</Step>

	<!--
		Solis 2
		Izvēles solis, kurā tiek izvēlēti kāršu komplekti.
	-->
	<Step locked={selectedCardSets.length == 0}>
		<h1 class="h3">Izvēlies kāršu komplektus</h1>
		<p>Izvēlies kāršu komplektus, kuri tiks izmantoti spēlē.</p>

		<hr />

		<h1 class="h3 text-center">CardGame komplekti</h1>
		<div class="grid grid-cols-2 gap-4">
			<!--
				Ielādē visus oficiālos kāršu komplektus un tos parāda kā izvēles pogas.
			-->
			{#await $pb
				?.collection('karsuKomplekti')
				.getFullList({ filter: 'official = true', requestKey: 'officialCardSets' })}
				<h1>Loading...</h1>
			{:then cardSets}
				{#each cardSets ?? [] as cardSet}
					<button
						class="card card-hover bg-surface-200 {selectedCardSets.includes(cardSet)
							? '!bg-success-200'
							: ''}"
						on:click={() => {
							/*
								Ja komplekts tiek izvēlēts, tas tiek pievienots selectedCardSets masīvam
							*/
							if (selectedCardSets.includes(cardSet)) {
								selectedCardSets = selectedCardSets.filter((x) => x !== cardSet);
							} else {
								selectedCardSets = [...selectedCardSets, cardSet];
							}
						}}
					>
						<div class="card-header font-bold">{cardSet.name}</div>
						<div class="content">{cardSet.description}</div>
					</button>
				{/each}
			{/await}
		</div>

		<div>
			<h1 class="h3 text-center">Mani komplekti</h1>

			<div class="grid grid-cols-2 gap-4">
				{#await $pb
					?.collection('karsuKomplekti')
					.getFullList({ filter: `creator = "${$account?.id}"`, requestKey: 'myCardSets' })}
					<h1>Ielādē...</h1>
				{:then cardSets}
					{#each cardSets ?? [] as cardSet}
						<button
							class="card card-hover bg-surface-200 {selectedCardSets.includes(cardSet)
								? '!bg-success-200'
								: ''}"
							on:click={() => {
								/*
							Ja komplekts tiek izvēlēts, tas tiek pievienots selectedCardSets masīvam
						*/
								if (selectedCardSets.includes(cardSet)) {
									selectedCardSets = selectedCardSets.filter((x) => x !== cardSet);
								} else {
									selectedCardSets = [...selectedCardSets, cardSet];
								}
							}}
						>
							<div class="card-header font-bold">{cardSet.name}</div>
							<div class="content">{cardSet.description}</div>
						</button>
					{/each}
				{/await}
			</div>
		</div>
	</Step>

	<!--
		Solis 3
		Izvēles solis, kurā tiek izvēlēti noteikumi.
	-->
	<Step>
		<h1 class="h3">Izvēlies noteikumus</h1>
		<p>Izvēlies kādus noteikumus vēlies izmantot spēlē.</p>

		<div class="form">
			<label class="label">
				<input type="checkbox" class="checkbox" />
				<span>AAAAA</span>
			</label>
			<label class="label">
				<input type="checkbox" class="checkbox" />
				<span>AAAAA</span>
			</label>
			<label class="label">
				<input type="checkbox" class="checkbox" />
				<span>AAAAA</span>
			</label>
		</div>
	</Step>
</Stepper>
