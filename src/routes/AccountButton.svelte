<script lang="ts">
	import { account } from '$lib/account';
	import { pb } from '$lib/database';
	import { createPopover, melt } from '@melt-ui/svelte';
	import { Avatar } from '@skeletonlabs/skeleton';

	const {
		elements: { trigger: pTrigger, content: pContent, arrow, close },
		states: { open }
	} = createPopover({
		forceVisible: true
	});
</script>

<ul>
	<li>
		{#if $account}
			<!--
				Lietotāja profila poga, kura atver lietotāja profila Drop-Down izvēlni.
			-->
			<div class="account">
				<div class="name" use:melt={$pTrigger}>
					<Avatar
						initials={$account.name ?? $account.username}
						border="border-2 border-surface-300-600-token hover:!border-primary-500"
						cursor="cursor-pointer"
						width="w-10"
					/>
				</div>

				<!--
					Drop-Down izvēlne ar lietotāja vārdu un izrakstīšanās pogu.
				-->
				{#if $open}
					<div class="card" use:melt={$pContent}>
						<div class="card-header h5">
							{$account.name ?? $account.username}
						</div>
						<div class="content p-3">
							<!--
								Izrakstīšanās poga. Tā izraksta lietotāju un atjauno lapu.
							-->
							<button
								class="btn variant-filled-error"
								on:click={() => {
									$pb && $pb.authStore.clear();
									location.reload();
								}}
							>
								Izrakstīties
							</button>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</li>
</ul>
