<script lang="ts">
	import { adminPb } from '$lib/database';
	import Login from './Login.svelte';
</script>

{#if $adminPb?.authStore.model}
	<slot />
{:else}
	<Login />
{/if}
