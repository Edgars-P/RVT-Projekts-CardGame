<script>
	import { pb } from "$lib/database"
	import { createPopover, createTabs, melt } from "@melt-ui/svelte"
	import { Tab, TabGroup, getToastStore } from "@skeletonlabs/skeleton"

	import { fade, slide } from "svelte/transition"

	const toast = getToastStore()

	const tabs = [
		{ id: "login", label: "Ienākt" },
		{ id: "register", label: "Reģistrēties" }
	]

	let currentTab = "login"

	const {
		elements: { trigger: pTrigger, content: pContent, arrow, close },
		states: { open }
	} = createPopover({
		forceVisible: true
	})

	const {
		elements: { root, list, content: tContent, trigger: tTrigger },
		states: { value }
	} = createTabs({
		defaultValue: "login"
	})

	/*
		Ievaddati tiek saglabāti lai pārslēdot uz reģistrācijas formu tie nepazūd.
	*/
	let input = {
		username: "",
		password: "",
		confirmPassword: ""
	}
</script>

<!--
	Ja lietotājs ir izrakstījies, tad tiek parādīta poga, kura atver
	pierakstīšanās un reģistrācijas Drop-Down izvēlni.
-->
<button use:melt={$pTrigger} type="button" class="btn variant-filled">
	Ienākt vai reģistrēties
</button>

<!--
	Drop-Down izvēlne ar pierakstīšanās un reģistrācijas formām.
-->
{#if $open}
	<div class="card" use:melt={$pContent}>
		<div class="card-header p-0">
			<!--
				Tabu grupa, kura izvēlas kuru no divām izvēlēm rādīt.
			-->
			<TabGroup>
				{#each tabs as tabItem}
					<Tab bind:group={currentTab} name={tabItem.label} value={tabItem.id}>
						{tabItem.label}
					</Tab>
				{/each}
			</TabGroup>
		</div>

		<div class="content p-3">
			{#if currentTab == "login"}
				<!--
					Pierakstīšanās forma.
				-->
				<form
					on:submit|preventDefault={(e) => {
						/*
						Pierakstās ar lietotājvārdu un paroli.
						Ja tas izdodas, tad atjauno lapu.
					*/
						$pb &&
							$pb
								.collection("lietotaji")
								.authWithPassword(input.username, input.password)
								.then((x) => {
									location.reload()
								})
								.catch((err) => {
									console.log(err)
									toast.trigger({
										message: "Nepareizs lietotājvārds vai parole!",
										background: "variant-filled-warning"
									})
								})
					}}
				>
					<label class="label">
						<span>Lietotājvārds</span>
						<input type="text" class="input" bind:value={input.username} required />
					</label>
					<label class="label">
						<span>Parole</span>
						<input class="input" type="password" bind:value={input.password} required />
					</label>
					<button type="submit" class="btn variant-filled block mt-3 mx-auto"> Ienākt </button>
				</form>
			{:else if currentTab == "register"}
				<!--
					Reģistrācijas forma.
				-->
				<form
					on:submit|preventDefault={async (e) => {
						/*
								Pārbauda vai paroles sakrīt.
							*/
						if (input.password != input.confirmPassword) {
							toast.trigger({
								message: "Paroles nesakrīt!",
								background: "variant-filled-warning"
							})
							return
						}

						/*
								Izveido lietotāju ar ievadīto lietotājvārdu un paroli.
								Ja tas izdodas, tad atjauno lapu.
							*/
						$pb &&
							$pb
								.collection("lietotaji")
								.create({
									name: input.username,
									email: Math.random().toString(36).substring(2, 15) + "@example.com",
									username: input.username,
									password: input.password,
									passwordConfirm: input.confirmPassword
								})
								.then((x) => {
									alert(
										"Reģistrācija izdevās! Lūdams pierakstīties ar Jūsu lietotājvārdu un paroli."
									)
									location.reload()
								})
								.catch((err) => {
									console.log(err.data.data)
									toast.trigger({
										message: "Reģistrācija neizdevās!",
										background: "variant-filled-warning"
									})
								})
					}}
				>
					<label class="label">
						<span>Lietotājvārds</span>
						<input type="text" class="input" bind:value={input.username} required />
					</label>
					<label class="label">
						<span>Parole</span>
						<input type="password" class="input" bind:value={input.password} required />
					</label>
					<label class="label">
						<span>Parole (atkārtoti)</span>
						<input type="password" class="input" bind:value={input.confirmPassword} required />
					</label>
					<button type="submit" class="btn variant-filled block mt-3 mx-auto">
						Reģistrēties
					</button>
				</form>
			{/if}
		</div>
	</div>
{/if}
