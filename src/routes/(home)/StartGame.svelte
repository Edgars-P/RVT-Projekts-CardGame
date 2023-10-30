<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';

	const cardSets = [
		{ name: 'Cards against humanity (base game)', id: 'cah-base' },
		{ name: 'Cards against humanity (90s nostalgia)', id: 'cah-90s' },
		{ name: 'Cards against humanity (absurd box)', id: 'cah-absurd' },
		{ name: 'Cards against humanity (ai pack)', id: 'cah-ai' }
	];

	let selectedCardSets: typeof cardSets = [];

	function onCompleteHandler(e: Event): void {
		console.log('event:complete', e);
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
			{#each cardSets as cardSet}
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
					<div class="card-header">{cardSet.name}</div>
					<div class="content">aaaaa</div>
				</button>
			{/each}
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
