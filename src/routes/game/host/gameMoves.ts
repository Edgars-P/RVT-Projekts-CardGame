import type { RecordModel } from "pocketbase"
import { derived, writable, type Readable, type Writable } from "svelte/store"
import type PocketBase from "pocketbase"
import { getCard } from "$lib/cardCache"
import { getPlayer } from "$lib/playerCache"

export function createGameMoveStore(gameId: string, pb: Writable<PocketBase | undefined>) {
	// subscribe to all speluGajieni creation events that have the game id we are interested in
	return derived(
		pb,
		($pb, set, update) => {
			if ($pb) {
				// fetch all speluGajieni that have the game id we are interested in
				$pb
					.collection("spelesGajieni")
					.getFullList({
						filter: `game = "${gameId}"`,
						sort: "created",
						expand: "card, player"
					})
					.then((r) => {
						set(r)

						// subscribe to all speluGajieni creation events that have the game id we are interested in
						$pb.collection("spelesGajieni").subscribe("*", async (event) => {
							console.log("gamemoves rt", event)
							if (event.action === "create" && event.record.game == gameId) {
								let x = event.record

								// Expand nestrādā ar reāllaika datiem
								if (!x.expand) x.expand = {}

								if (x.card) {
									x.expand.card = await getCard($pb, x.card)
								}

								if (x.player) {
									x.expand.player = await $pb.collection("speletaji").getOne(x.player)
								}

								console.log("gamemoves", x)

								// Pievieno jauno gājienu pie store
								update((prev) => [...prev, x])
							}
						})
					})
			}
			return undefined
		},
		[] as RecordModel[]
	)
}

// Games moves since the last type "jautajuma" card got played
export function createCurrentGameMovesStore(
	gameId: string,
	playerStore: Readable<RecordModel[]>,
	pb: Writable<PocketBase | undefined>
) {
	const allGameMoves = createGameMoveStore(gameId, pb)

	return derived(
		allGameMoves,
		($allGameMoves, set) => {
			console.log("allMoves", $allGameMoves)

			const lastQuestionIndex = $allGameMoves.findLastIndex(
				(x) => x.expand?.card?.tips == "jautajuma" || x.card == ""
			)

			console.log("lastQuestionIndex", lastQuestionIndex)

			let moves = $allGameMoves.slice(lastQuestionIndex)

			console.log(moves)

			set(moves.at(0)?.card == "" ? [] : moves)
		},
		[] as RecordModel[]
	)
}
