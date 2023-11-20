<script>
	import { pb } from '$lib/database';
	import { createPopover, createTabs, melt } from '@melt-ui/svelte';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import { toast } from '@zerodevx/svelte-toast';
	import { fade, slide } from 'svelte/transition';

	const tabs = [
		{ id: 'login', label: 'Ienākt' },
		{ id: 'register', label: 'Reģistrēties' }
	];

	let currentTab = 'login';

	const {
		elements: { trigger: pTrigger, content: pContent, arrow, close },
		states: { open }
	} = createPopover({
		forceVisible: true
	});

	const {
		elements: { root, list, content: tContent, trigger: tTrigger },
		states: { value }
	} = createTabs({
		defaultValue: 'login'
	});

	let input = {
		username: '',
		password: '',
		confirmPassword: ''
	};
</script>

<button use:melt={$pTrigger} type="button" class="btn variant-filled">
	Ienākt vai reģistrēties
</button>

{#if $open}
	<div class="card" use:melt={$pContent}>
		<div class="card-header p-0">
			<TabGroup>
				{#each tabs as tabItem}
					<Tab bind:group={currentTab} name={tabItem.label} value={tabItem.id}>
						{tabItem.label}
					</Tab>
				{/each}
			</TabGroup>
		</div>

		<div class="content p-3">
			{#if currentTab == 'login'}
				<form>
					<label class="label">
						<span>Lietotājvārds</span>
						<input type="text" class="input" bind:value={input.username} />
					</label>
					<label class="label">
						<span>Parole</span>
						<input class="input" type="password" bind:value={input.password} />
					</label>
					<button
						type="submit"
						class="btn variant-filled block mt-3 mx-auto"
						on:click={() => {
							$pb &&
								$pb
									.collection('lietotaji')
									.authWithPassword(input.username, input.password)
									.then((x) => {
										location.reload();
									})
									.catch((err) => {
										console.log(err);
										toast.push('Nepareizs lietotājvārds vai parole!');
									});
						}}>Ienākt</button
					>
				</form>
			{:else if currentTab == 'register'}
				<form>
					<label class="label">
						<span>Lietotājvārds</span>
						<input type="text" class="input" bind:value={input.username} />
					</label>
					<label class="label">
						<span>Parole</span>
						<input type="password" class="input" bind:value={input.password} />
					</label>
					<label class="label">
						<span>Parole (atkārtoti)</span>
						<input type="password" class="input" bind:value={input.confirmPassword} />
					</label>
					<button
						type="submit"
						class="btn variant-filled block mt-3 mx-auto"
						on:click={() => {
							$pb &&
								$pb
									.collection('lietotaji')
									.create({
										name: input.username,
										email: Math.random().toString(36).substring(2, 15) + '@example.com',
										username: input.username,
										password: input.password,
										passwordConfirm: input.confirmPassword
									})
									.then((x) => {
										alert(
											'Reģistrācija izdevās! Lūdams pierakstīties ar Jūsu lietotājvārdu un paroli.'
										);
										location.reload();
									})
									.catch((err) => {
										console.log(err.data.data);
									});
						}}>Reģistrēties</button
					>
				</form>
			{/if}
		</div>
	</div>
{/if}
