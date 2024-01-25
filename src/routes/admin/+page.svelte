<script lang="ts">
	import { goto, invalidateAll } from "$app/navigation"
	import { page } from "$app/stores"
	import { adminPb } from "$lib/database"
	import { Tab, TabGroup, Table, tableMapperValues } from "@skeletonlabs/skeleton"
	import type { RecordModel } from "pocketbase"
	import { fade, fly } from "svelte/transition"

	/*
		Tabu navigācijas mainīgie
		TabSet nosaka kuru tabu parādīt
		Filter nosaka kādu filtru lietot tabu saturam
	*/
	let tabSet = parseInt($page.url.searchParams.get("tab") ?? "") || 0
	let filter = $page.url.searchParams.get("filter") as string | undefined

	$: {
		/*
			Atjaunojam lapas URL ja mainīgie mainās, lai pēc lapas atjaunošanas
			parādītu to pašu saturu.
		*/
		$page.url.searchParams.set("tab", tabSet.toString())
		filter
			? $page.url.searchParams.set("filter", filter.toString())
			: $page.url.searchParams.delete("filter")
		goto(`?${$page.url.searchParams.toString()}`, {
			replaceState: true
		})
		selectedItemId = undefined
	}

	let selectedItemId: string | undefined
</script>

<!--
	Spēles administrācijas lapa
	Satur informāciju par lietoājiem, kārtīm, spēlēm, un citu saturu.
-->
<div class="flex justify-center gap-5 pt-3">
	<h1 class="h1">Administratora rīki</h1>

	<button
		class="btn btn-primary variant-filled-primary"
		on:click={() => {
			$adminPb?.authStore.clear()
			location.reload()
		}}
	>
		Izrakstīties
	</button>
</div>

<!--
	Administrāciojas lapas navigācija
-->
<div class="mx-5 mb-5">
	<TabGroup>
		<Tab bind:group={tabSet} name="Lietotāji" value={0}>Lietotāji</Tab>
		<Tab bind:group={tabSet} name="Kāršu komplekti" value={1}>Kāršu komplekti</Tab>
		<Tab bind:group={tabSet} name="Kārtis" value={2}>Kārtis</Tab>
		<Tab bind:group={tabSet} name="Spēles" value={3}>Spēles</Tab>

		<svelte:fragment slot="panel">
			{#if filter}
				<button
					class="btn btn-primary variant-filled-primary"
					on:click={() => {
						filter = undefined
					}}
				>
					Noņemt filtrus
				</button>
			{/if}

			{#if tabSet == 0}
				{#await $adminPb?.collection("lietotaji").getFullList({ filter })}
					<p>Ielādē...</p>
				{:then data}
					<Table
						interactive={true}
						on:selected={(e) => {
							selectedItemId = e.detail[0]
						}}
						source={{
							head: ["Lietotājvārds", "Vārds", "Izveidots", "Pēdējās izmaiņas"],
							body: tableMapperValues(data ?? [], ["username", "name", "created", "updated"]),
							meta: tableMapperValues(data ?? [], ["id"])
						}}
					/>
				{/await}
			{:else if tabSet == 1}
				{#await $adminPb?.collection("karsuKomplekti").getFullList({ filter })}
					<p>Ielādē...</p>
				{:then data}
					<Table
						interactive={true}
						on:selected={(e) => {
							selectedItemId = e.detail[0]
						}}
						source={{
							head: [
								"ID",
								"Nosaukums",
								"Oficiāls",
								"Izveidotājs",
								"Apraksts",
								"Izveidots",
								"Pēdējās izmaiņas"
							],
							body: tableMapperValues(data ?? [], [
								"id",
								"name",
								"official",
								"creator",
								"description",
								"created",
								"updated"
							]),
							meta: tableMapperValues(data ?? [], ["id"])
						}}
					/>
				{/await}
			{:else if tabSet == 2}
				{#await $adminPb?.collection("spelesKartis").getFullList({ filter })}
					<p>Ielādē...</p>
				{:then data}
					<Table
						interactive={true}
						on:selected={(e) => {
							selectedItemId = e.detail[0]
						}}
						source={{
							head: ["ID", "Kāršu komplekts", "Tips", "Virsraksts", "Saturs", "Izveidots"],
							body: tableMapperValues(data ?? [], [
								"id",
								"karsuKomplekts",
								"tips",
								"virsraksts",
								"saturs",
								"created"
							]),
							meta: tableMapperValues(data ?? [], ["id"])
						}}
					/>
				{/await}
			{:else if tabSet == 3}
				{#await $adminPb?.collection("speles").getFullList({ filter })}
					<p>Ielādē...</p>
				{:then data}
					<Table
						interactive={true}
						on:selected={(e) => {
							selectedItemId = e.detail[0]
						}}
						source={{
							head: ["ID", "Radītājs", "Noslēpums", "Noteikumi", "Komplekti", "Izveidots"],
							body: tableMapperValues(data ?? [], [
								"id",
								"raditajs",
								"secret",
								"noteikumi",
								"karsuKomplekti",
								"created"
							]),
							meta: tableMapperValues(data ?? [], ["id"])
						}}
					/>
				{/await}
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>

{#key selectedItemId}
	<div
		transition:fly={{ y: 100, duration: 200 }}
		class="absolute bottom-5 w-10/12 right-1/2 translate-x-1/2"
	>
		{#if selectedItemId}
			<div class="flex justify-center align-middle gap-5 p-3 card shadow-lg">
				<button
					class="btn btn-primary variant-filled-error"
					on:click={() => {
						$adminPb
							?.collection(["lietotaji", "karsuKomplekti", "spelesKartis", "speles"][tabSet])
							.delete(selectedItemId ?? "")
						selectedItemId = undefined
						location.reload()
					}}
				>
					Dzēst
				</button>
				<button
					class="btn btn-primary variant-filled"
					on:click={() => {
						selectedItemId = undefined
					}}
				>
					Atcelt
				</button>

				<!--
					Īpašas darbības atkarībā no tabu satura
					piem. skatīt kārtis komplektā no kāršu komplekta lapas
				-->
				{#if tabSet == 0}
					<button
						class="btn btn-primary variant-filled"
						on:click={() => {
							tabSet = 3
							filter = `raditajs = "${selectedItemId}"`
						}}
					>
						Skatīt spēles
					</button>
				{:else if tabSet == 1}
					<button
						class="btn btn-primary variant-filled"
						on:click={() => {
							tabSet = 2
							filter = `karsuKomplekts = "${selectedItemId}"`
						}}
					>
						Skatīt kārtis komplektā
					</button>
				{/if}
			</div>
		{/if}
	</div>
{/key}
