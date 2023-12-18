<script lang="ts">
	import { adminPb } from '$lib/database';
	import { getToastStore } from '@skeletonlabs/skeleton';

	console.log('adminPb', $adminPb?.authStore.model);

	const toast = getToastStore();
</script>

<form
	class="card card-body card-flat max-w-lg p-3 mx-auto mt-4"
	on:submit={async (e) => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		$adminPb?.admins
			.authWithPassword(
				(data.get('username') ?? '').toString(),
				(data.get('password') ?? '').toString()
			)
			.then((result) => {
				console.log('result', result);
				location.reload();
			})
			.catch((error) => {
				console.log('error', error);
				toast.trigger({
					message: 'Nepareizs lietotājvārds vai parole',
					background: 'variant-filled-error'
				});
			});
	}}
>
	<h3 class="h3 text-center">Administrators</h3>

	<label class="label">
		Lietotājvārds
		<input type="text" name="username" class="input input-bordered" placeholder="Lietotājvārds" />
	</label>

	<label class="label">
		Parole
		<input type="password" name="password" class="input input-bordered" placeholder="Parole" />
	</label>

	<button class="btn btn-primary variant-filled-primary mt-3 mx-auto block">Ienākt</button>
</form>
