import type { RecordModel } from 'pocketbase';
import { derived, writable, type Readable, type Writable } from 'svelte/store';
import type PocketBase from 'pocketbase';
import { getCard } from '$lib/cardCache';
import { getPlayer } from '$lib/playerCache';

export function createGameMoveStore(gameId: string, pb: Writable<PocketBase | undefined>) {
	// subscribe to all speluGajieni creation events that have the game id we are interested in
	return derived(
		pb,
		($pb, set, update) => {
			if ($pb) {
				// fetch all speluGajieni that have the game id we are interested in
				$pb
					.collection('spelesGajieni')
					.getFullList({
						filter: `game = "${gameId}"`,
						sort: 'created'
					})
					.then((r) => {
						set(r);

						// subscribe to all speluGajieni creation events that have the game id we are interested in
						$pb.collection('spelesGajieni').subscribe('*', (event) => {
							console.log('gamemoves rt', event);
							if (event.action === 'create' && event.record.game == gameId) {
								update((prev) => [...prev, event.record]);
							}
						});
					});
			}
			return undefined;
		},
		[] as RecordModel[]
	);
}

// Games moves since the last type "jautajuma" card got played
export function createCurrentGameMovesStore(
	gameId: string,
	playerStore: Readable<RecordModel[]>,
	pb: Writable<PocketBase | undefined>
) {
	const allGameMoves = createGameMoveStore(gameId, pb);

	return derived(
		derived(
			[allGameMoves, pb, playerStore],
			([$allGameMoves, $pb, $playerStore], set) => {
				if (!$pb) return;

				// Manuāli izveidojam expand.card un expand.card laukus,
				// jo PocketBase nevar izveidot expand lauku, ja tas klausās realtime notikumus
				Promise.all(
					$allGameMoves.map(async (x) => {
						if (x.card) {
							// Pagaida mazu laiku lai nesakristu ar realtime un neapturētu izpildi
							await new Promise((resolve) => setTimeout(resolve, 100));
							if (!x.expand) x.expand = {};
							x.expand.card = await getCard($pb, x.card);
							x.expand.player = $playerStore.find((p) => p.id == x.player);
						}
						return x;
					})
				).then((r) => set(r));
			},
			[] as RecordModel[]
		),
		($allGameMoves, set) => {
			console.log('allMoves', $allGameMoves);

			const lastQuestionIndex = $allGameMoves.findLastIndex(
				(x) => x.expand?.card.tips == 'jautajuma'
			);

			console.log('lastQuestionIndex', lastQuestionIndex);

			set($allGameMoves.slice(lastQuestionIndex));
		},
		[] as RecordModel[]
	);
}
