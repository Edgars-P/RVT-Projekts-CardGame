<script>
	import '../app.postcss';

	import LogInButton from './LogInButton.svelte';
	import AccountButton from './AccountButton.svelte';
	import { account } from '$lib/account';

	import { Accordion, AppBar, AppShell, Modal, Toast } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	// Nepieciešams "toast" komponentam
	import { initializeStores } from '@skeletonlabs/skeleton';
	initializeStores();

	$: console.log(JSON.stringify($page.url.pathname.length));
</script>

<!--
	"Toast" ziņu pamatobjekts kas tiek izmantots lai parādītu ziņojumus lietotājam. 
-->
<Toast position="tr" />

<!--
	"Modal" komponents kas tiek izmantots lai parādītu modālo logu.
-->
<Modal />

<!--
	Galvenais lapas izkārtojums.
-->
<AppShell>
	<svelte:fragment slot="pageHeader">
		<!--
			Lapas galvene
		-->
		<AppBar gridColumns="grid-cols-3" slotDefault="place-self-center" slotTrail="place-content-end">
			<!--
				Navigācijas pogas
			-->
			<svelte:fragment slot="lead">
				<ul class="flex items-center justify-center space-x-2">
					<li>
						<a
							class="nav btn btn-sm
								{$page.url.pathname === '/' ? 'variant-outline-primary' : 'variant-filled-primary'}
							"
							href="/"
						>
							Sākums
						</a>
					</li>
					<li>
						<a
							class="nav btn btn-sm
								{$page.url.pathname === '/about' ? 'variant-outline-primary' : 'variant-filled-primary'}
							"
							href="/about"
						>
							Par mums
						</a>
					</li>
				</ul>
			</svelte:fragment>

			<!--
				Logo
			-->
			<a class="home" href="/">
				<div class="logo h3 font-bold">CardGame</div>
			</a>

			<!--
				Pārbaida vai lietotājs ir pierakstījies un parāda atbilstošu pogu.
			-->
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
