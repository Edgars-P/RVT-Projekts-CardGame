<script lang="ts">
	import { browser } from "$app/environment"
	import { page } from "$app/stores"
	import { pb, playerPb } from "$lib/database"
	import { onMount } from "svelte"
	import { customAlphabet } from "nanoid"
	import CardSelect from "./CardSelect.svelte"
	import type { RecordModel } from "pocketbase"
	import { derived } from "svelte/store"
	import GameCard from "$lib/components/GameCard.svelte"
	import { createCurrentGameMovesStore, createGameMoveStore } from "../host/gameMoves"

	const gameId = $page.url.searchParams.get("id") as string
	const secret = $page.url.searchParams.get("secret") as string

	if ((!gameId || !secret) && browser) {
		location.href = "/"
	}

	let playerRecord = $playerPb?.authStore.model
	console.log("playerRecord", playerRecord)

	/*
		Uzreiz kad spēlētājs pievienojas spēlei tam tiek prasīts vārds.
		Pēc tam programma mēģina izveidot spēlētāja ierakstu ar ID un noslēpumu no URL.
		Tas neizdosies ja viens vai otrs ir nepareizi.
	*/
	onMount(async () => {
		if (playerRecord && playerRecord.game == gameId) {
			return
		}

		// Izveido viltus lietotājvārdu un paroli
		// Tas ir nepieciešams lai izmantotu datu bāzes autentifikācijas funkcijas
		const username = customAlphabet("qwertyuiopasdfghjklzxcvbnm1234567890")()
		const password = crypto.randomUUID()
		const data = {
			username: username,
			email: crypto.randomUUID() + "@example.com",
			emailVisibility: true,
			password: password,
			passwordConfirm: password,
			game: gameId,
			name: localStorage.getItem("player_name") ?? "Spēlētājs",
			secret: secret
		}

		// Izveido lietotāju un izvēlas to kā aktīvo.
		const record = await $playerPb?.collection("speletaji").create(data)
		const authData = await $playerPb?.collection("speletaji").authWithPassword(username, password)

		//Saglabā lietotāju datus
		localStorage.setItem("player_user", username)
		localStorage.setItem("player_pass", password)

		location.reload()
	})

	/* 
		Seko līdzi spēles ieraksta izmaiņām
	*/
	const gameRecord = derived(
		playerPb,
		($pb, set) => {
			if (!$pb) return
			console.log("gameId", gameId)
			$pb
				.collection("speles")
				.getOne(gameId)
				.then((gameRecord) => {
					console.log("gameRecord", gameRecord)
					set(gameRecord)
				})
				.catch((e) => {
					// Ja ir notikusi kļūda, visdrīzāk spēlētājs ir idzēsts
					console.error(e)
					if (localStorage.getItem("player_pass")) {
						localStorage.clear()
						location.reload()
					}
				})

			$pb?.collection("speles").subscribe(gameId, function (e) {
				console.log(e)
				set(e.record)
			})
		},
		undefined as undefined | RecordModel
	)

	/*
		Seko līdzi jaunu spēlētāju pievienošanai
	*/
	const gamePlayers = derived(
		playerPb,
		($pb, set, update) => {
			if (!$pb) return
			$pb
				.collection("speletaji")
				.getFullList({
					filter: `game = "${gameId}"`
				})
				.then((gamePlayers) => {
					set(gamePlayers)
				})

			$pb?.collection("speletaji").subscribe("*", function (e) {
				if (e.record.game != gameId) return

				switch (e.action) {
					case "create":
						update((players) => [...players, e.record])
						break
					case "update":
						update((players) => {
							const index = players.findIndex((player) => player.id == e.record.id)
							players[index] = e.record
							return players
						})
						break
					case "delete":
						update((players) => {
							const index = players.findIndex((player) => player.id == e.record.id)
							players.splice(index, 1)
							return players
						})
						break
				}
			})
		},
		[] as RecordModel[]
	)

	/*
		Seko līdzi spēles gājieniem
	*/
	let gameMoves = createCurrentGameMovesStore(gameId, gamePlayers, playerPb)
</script>

{#if playerRecord && playerRecord.game == gameId}
	<span class="font-bold">Vārds: </span>
	{#if $gameMoves[0]}
		{playerRecord.name}

		<div class="w-max mx-auto">
			<GameCard card={$gameMoves[0].expand?.card} />
		</div>

		{#if $gameRecord?.karsuKomplekti}
			{#if $gameMoves.every((move) => move.player !== playerRecord?.id)}
				<CardSelect gameCardSets={$gameRecord?.karsuKomplekti} gameMoves={$gameMoves} />
			{:else}
				<div class="w-max mx-auto card p-5 mt-10">Spēles kārts ir izspēlēta!</div>
			{/if}
		{/if}
	{:else}
		<div class="grid justify-items-center content-center h-full p-4">
			<div class="card w-max p-4 font-bold">Spēles vadītājs izvēlas kārti...</div>
		</div>
	{/if}
{/if}
