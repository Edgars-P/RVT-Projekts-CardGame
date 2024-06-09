<script>
	import { account } from "$lib/account"
	import StartGame from "./StartGame.svelte"
</script>

<!--
	Sākumlapa
	Rāda dažādus elementus atkarībā no tā, vai lietotājs ir reģistrēts
-->

{#if !$account}
	<main
		class="flex flex-col items-center justify-center px-6 py-6 bg-surface-100 mx-auto my-[40vh] w-max rounded-lg shadow-xl"
	>
		<h1 class="text-4xl font-bold">Projekts CardGame</h1>

		<p class="text-lg mt-6">Ienāc vai reģistrējies, lai sāktu savu pirmo spēli!</p>
	</main>
{:else}
	<div class="w-full max-w-4xl p-6 mx-auto my-[25vh] bg-white rounded-lg shadow-md">
		<h2 class="text-2xl font-semibold mb-4">Sāciet jaunu spēli</h2>
		<StartGame />
	</div>
{/if}

<!-- FAQ Section -->
<div class="w-full max-w-4xl p-6 mx-auto mt-10 card shadow-xl rounded-lg">
	<h2 class="text-2xl font-semibold mb-4">Biežāk uzdotie jautājumi</h2>
	<div class="space-y-4">
		<div>
			<h3 class="text-lg font-medium">Kas šis ir?</h3>
			<p class="">
				CardGame ir tiešsaistes platforma, kas ļauj spēlēt interaktīvas kartīšu spēles ar draugiem
				un kolēģiem.
			</p>
		</div>
		<div>
			<h3 class="text-lg font-medium">Kam ir CardGame domāts?</h3>
			<p class="">
				CardGame ir paredzēts ikvienam, kas vēlas izklaidēties un veicināt komandas garu, izmantojot
				jautras un izglītojošas spēles.
			</p>
		</div>
		<div>
			<h3 class="text-lg font-medium">Kā es varu sākt?</h3>
			<p class="">
				Lai sāktu, vienkārši reģistrējies vai ienāc savā kontā, izveido jaunu spēli un uzaicini
				draugus pievienoties.
			</p>
		</div>
	</div>
</div>

<div class="pb-10"></div>
