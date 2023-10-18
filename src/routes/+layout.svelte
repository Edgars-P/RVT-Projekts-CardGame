<script>
	import 'sanitize.css';
	import 'sanitize.css/typography.css';
	import 'sanitize.css/forms.css';
	import AccountButton from './AccountButton.svelte';
	import { account, pb } from '$lib/account';
	import { SvelteToast } from '@zerodevx/svelte-toast';
</script>

<SvelteToast
	options={{
		reversed: true,
		intro: { y: 192 }
	}}
/>

<nav>
	<ul>
		<li><a class="home" href="/"><div class="logo">CardGame</div></a></li>
		<li><a class="nav" href="/about">Par mums</a></li>
	</ul>

	<ul>
		<li>
			{#if $account}
				<div class="account">
					<div class="name">
						{$account.name ?? $account.username}
					</div>
					<button
						on:click={() => {
							$pb && $pb.authStore.clear();
							location.reload();
						}}>Izrakstīties</button
					>
				</div>
			{:else}
				<AccountButton />
			{/if}
		</li>
	</ul>
</nav>

<div class="content">
	<slot />
</div>

<style lang="sass">

	:root 
		--toastContainerTop: auto
		--toastContainerRight: 1rem
		--toastContainerBottom: 1rem
		--toastContainerLeft: auto
  

	.logo
		font-size: 1.5rem
		font-weight: bold
		width: max-content
		background: #1F363D
		color: white
		padding: 0.3rem 1rem
		border-radius: 0.5rem

	nav
		display: flex
		justify-content: space-between
		align-items: center
		padding: 1rem
		background: #40798C

	ul
		display: flex
		list-style: none
		margin: 0
		padding: 0
		align-items: center

	li
		margin-right: 1rem
		a
			color: black
			text-decoration: none
		a.nav
			background: #9EC1A3
			padding: 0.2rem 0.5rem
			border-radius: 0.3rem

	.content
		width: 50%
		min-width: 20rem
		max-width: 50rem
		margin: auto

	.account
		display: flex
		flex-direction: row

		.name
			display: flex
			flex-direction: row
			align-items: center
			justify-content: center
			background: #9EC1A3
			padding: 0.2rem 0.5rem
			border-radius: 0.3rem
			color: black
			text-decoration: none
			&:before
				content: '👤'
				margin-right: 0.5rem

		button
			background: #CFE0C3
			border: none
			border-radius: 0.3rem
			padding: 0.5rem
			margin-left: 0.5rem
			cursor: pointer
			&:hover
				background: #9EC1A3


</style>
