<script>
	import '../app.postcss';

	import LogInButton from './LogInButton.svelte';
	import AccountButton from './AccountButton.svelte';
	import { account, pb } from '$lib/account';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { Accordion, AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	$: console.log(JSON.stringify($page.url.pathname.length));
</script>

<SvelteToast
	options={{
		reversed: true,
		intro: { y: 192 }
	}}
/>

<AppShell>
	<svelte:fragment slot="pageHeader">
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<svelte:fragment slot="lead">
				<ul class="flex items-center justify-center space-x-2">
					<li>
						<a
							class="nav btn btn-sm
								{$page.url.pathname === '/' ? 'variant-outline-surface' : 'variant-filled-surface'}
							"
							href="/"
						>
							Sākums
						</a>
					</li>
					<li>
						<a
							class="nav btn btn-sm
								{$page.url.pathname === '/about' ? 'variant-outline-surface' : 'variant-filled-surface'}
							"
							href="/about"
						>
							Par mums
						</a>
					</li>
				</ul>
			</svelte:fragment>
			<a class="home" href="/">
				<div class="logo h3 font-bold">CardGame</div>
			</a>

			<svelte:fragment slot="trail">
				<ul>
					{#if $account}
						<AccountButton />
					{:else}
						<LogInButton />
					{/if}
				</ul>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<slot />
</AppShell>
