<script>
	import '../app.postcss';

	import LogInButton from './LogInButton.svelte';
	import AccountButton from './AccountButton.svelte';
	import { account } from '$lib/account';
	import { SvelteToast } from '@zerodevx/svelte-toast';

	import { Accordion, AppBar, AppShell } from '@skeletonlabs/skeleton';
	import { page } from '$app/stores';

	$: console.log(JSON.stringify($page.url.pathname.length));
</script>

<!--
	"Toast" ziņu pamatobjekts kas tiek izmantots lai parādītu ziņojumus lietotājam. 
-->
<SvelteToast
	options={{
		reversed: true,
		intro: { y: 192 }
	}}
/>

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
