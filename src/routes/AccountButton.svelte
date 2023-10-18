<script>
	import { pb } from '$lib/account';
	import { createPopover, createTabs, melt } from '@melt-ui/svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import { fade, slide } from 'svelte/transition';

	const tabs = [
		{ id: 'login', label: 'Ienākt' },
		{ id: 'register', label: 'Reģistrēties' }
	];

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

<button use:melt={$pTrigger} type="button" class="trigger"> Ienākt vai reģistrēties </button>

{#if $open}
	<div class="dropdownbox" use:melt={$pContent} transition:fade={{ duration: 100 }}>
		<div class="tabs" use:melt={$list}>
			{#each tabs as tabItem}
				<button use:melt={$tTrigger(tabItem.id)} class="tab" data-active={$value === tabItem.id}>
					{tabItem.label}
				</button>
			{/each}
		</div>

		<div class="content" use:melt={$tContent('login')} transition:slide={{ duration: 100 }}>
			<form>
				<label>
					<span>Lietotājvārds</span>
					<input type="text" bind:value={input.username} />
				</label>
				<label>
					<span>Parole</span>
					<input type="password" bind:value={input.password} />
				</label>
				<button
					type="submit"
					on:click={() => {
						$pb &&
							$pb
								.collection('users')
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
		</div>

		<div class="content" use:melt={$tContent('register')} transition:slide={{ duration: 100 }}>
			<form>
				<label>
					<span>Lietotājvārds</span>
					<input type="text" bind:value={input.username} />
				</label>
				<label>
					<span>Parole</span>
					<input type="password" bind:value={input.password} />
				</label>
				<label>
					<span>Parole (atkārtoti)</span>
					<input type="password" bind:value={input.confirmPassword} />
				</label>
				<button
					type="submit"
					on:click={() => {
						$pb &&
							$pb
								.collection('users')
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
		</div>
	</div>
{/if}

<style lang="sass">
	.trigger
		background: #70A9A1
		border: none
		border-radius: 0.3rem
		padding: 0.5rem
		cursor: pointer
		transition: background 0.1s ease-in-out

		&:hover
			background: #9EC1A3

		&[data-state="open"]
			background: #CFE0C3

		&:focus
			outline: none
		
	div.dropdownbox
		width: 17rem
		background: #9EC1A3
		padding: 0
		border-radius: 0.5rem
		overflow: hidden
		box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.2)

	form
		display: flex
		flex-direction: column
		align-items: center
		justify-content: center
		padding: 0.5rem

		input
			background: #CFE0C3
			border: none
			border-radius: 0.3rem

		button
			background: #CFE0C3
			border: none
			border-radius: 0.3rem
			padding: 0.5rem

	label
		display: flex
		flex-direction: column
		margin-bottom: 1rem

	.tabs
		// fills the width of the dropdownbox
		display: flex
		flex-direction: row
		justify-content: stretch
		align-items: stretch
		margin: 0
		padding: 0

	.tab
		flex: 1
		padding: 0.5rem 1rem
		border: none
		background: none
		cursor: pointer
		transition: background 0.1s ease-in-out
		background: #70A9A1

		&:hover
			background: #70A9A1

		&[data-state='active']
			background: #9EC1A3

</style>
