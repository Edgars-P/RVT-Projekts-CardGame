<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { account } from '$lib/account';
	import { pb } from '$lib/database';
	import { TabGroup, Tab, TabAnchor } from '@skeletonlabs/skeleton';
	import CardSets from './CardSets.svelte';
	import MyGames from './MyGames.svelte';

	let tabSet = parseInt($page.url.searchParams.get('tab') ?? '') || 0;
	$: {
		$page.url.searchParams.set('tab', tabSet.toString());
		goto(`?${$page.url.searchParams.toString()}`, {
			replaceState: true
		});
	}
</script>

<div class="card max-w-5xl mx-auto mt-4 variant-glass">
	<TabGroup>
		<Tab bind:group={tabSet} name="Iestatījumi" value={0}>Iestatījumi</Tab>
		<Tab bind:group={tabSet} name="Drošība" value={1}>Drošība</Tab>
		<Tab bind:group={tabSet} name="Komplekti" value={2}>Kāršu komplekti</Tab>
		<Tab bind:group={tabSet} name="Vesture" value={3}>Spēļu vēsture</Tab>

		<div slot="panel" class="p-4">
			{#if tabSet == 0}
				<form
					on:submit={async (e) => {
						e.preventDefault();
						const form = e.currentTarget;
						const formData = new FormData(form);
						const data = Object.fromEntries(formData.entries());
						$pb && (await $pb.collection('lietotaji').update($account?.id ?? '', data));
						location.reload();
					}}
				>
					<div>
						<div>
							<label class="label">
								Vārds
								<input type="text" name="name" class="input" value={$account?.name} />
							</label>
						</div>

						<div>
							<label class="label">
								E-pasts
								<input type="email" name="email" class="input" value={$account?.email} />
							</label>
						</div>
					</div>

					<button type="submit" class="btn btn-lg variant-filled-primary mx-auto block mt-3">
						Saglabāt
					</button>
				</form>
			{:else if tabSet == 1}
				<!-- Mainīt paroli -->
				<form
					on:submit={async (e) => {
						e.preventDefault();
						const form = e.currentTarget;
						const formData = new FormData(form);
						const data = Object.fromEntries(formData.entries());
						$pb && (await $pb.collection('lietotaji').update($account?.id ?? '', data));
						location.reload();
					}}
				>
					<div>
						<div>
							<label class="label">
								Parole
								<input type="password" name="oldPassword" class="input" />
							</label>
						</div>

						<div>
							<label class="label">
								Jaunā parole
								<input type="password" name="password" class="input" />
							</label>
						</div>

						<div>
							<label class="label">
								Jaunā parole atkārtoti
								<input type="password" name="passwordConfirm" class="input" />
							</label>
						</div>
					</div>

					<button type="submit" class="btn btn-lg variant-filled-primary mx-auto block mt-3">
						Saglabāt
					</button>
				</form>
			{:else if tabSet == 2}
				<CardSets />
			{:else if tabSet == 3}
				<MyGames />
			{/if}
		</div>
	</TabGroup>
</div>
