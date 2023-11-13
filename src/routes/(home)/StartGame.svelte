<script lang="ts">
	import { account, pb } from '$lib/account';
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import type { RecordModel } from 'pocketbase';

	let selectedCardSets: RecordModel[] = [];

	async function onCompleteHandler(e: Event) {
		console.log('event:complete', e);

		const data = {
			creator: $account?.id,
			secret: crypto.randomUUID(),
			rules: ['rule1'],
			cardSets: selectedCardSets.map((x) => x.id)
		};

		const record = await $pb?.collection('games').create(data);

		if (record) {
			console.log('record', record);
			location.href = `/game/host?id=${record.id}`;
		}
	}
</script>

<!-- Select a card set, and hit play -->

<Stepper
	on:complete={onCompleteHandler}
	stepTerm="Solis"
	buttonNextLabel="Tālāk"
	buttonBackLabel="Atpakaļ"
	buttonCompleteLabel="Sākt spēli"
>
	<Step>
		<h1 class="h3">Izveidot jaunu spēli!</h1>
		<p>Izvēlies kāršu komplektus, dažus vienkāršus noteikumus, un sāc spēli!</p>
	</Step>

	<Step locked={selectedCardSets.length == 0}>
		<h1 class="h3">Izvēlies kāršu komplektus</h1>
		<p>Izvēlies kāršu komplektus, kuri tiks izmantoti spēlē.</p>

		<hr />

		<h1 class="h3 text-center">CardGame komplekti</h1>
		<div class="grid grid-cols-2 gap-4">
			{#await $pb?.collection('cardSets').getFullList({ filter: 'official = true' })}
				<h1>Loading...</h1>
			{:then cardSets}
				{#each cardSets ?? [] as cardSet}
					<button
						class="card card-hover bg-surface-200 {selectedCardSets.includes(cardSet)
							? '!bg-success-200'
							: ''}"
						on:click={() => {
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

			{#each [] as card}
				<p />
			{:else}
				<p class="text-center">
					Pagaidām komplektu nav.
					<a href="/account" class="underline">Pievienot jaunu komplektu</a>
				</p>
			{/each}
		</div>
	</Step>

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
