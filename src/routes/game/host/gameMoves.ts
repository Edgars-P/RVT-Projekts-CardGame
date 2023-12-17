import { pb } from '$lib/database';
import type { RecordModel } from 'pocketbase';
import { derived, type Readable } from 'svelte/store';

export function createGameMoveStore(gameId: string) {
	// subscribe to all speluGajieni creation events that have the game id we are interested in
	let moves: RecordModel[] = [];
	return derived(
		pb,
		($pb, set) => {
			if ($pb) {
				// fetch all speluGajieni that have the game id we are interested in
				$pb
					.collection('spelesGajieni')
					.getFullList({
						filter: `game = "${gameId}"`
					})
					.then((r) => {
						moves = r;
						set(r);

						// subscribe to all speluGajieni creation events that have the game id we are interested in
						$pb.collection('spelesGajieni').subscribe('*', (event) => {
							console.log('gamemoves rt', event);
							if (event.action === 'create' && event.record.game == gameId) {
								moves = [...moves, event.record];
								set(moves);
							}
						});
					});
			}
			return undefined;
		},
		undefined as RecordModel[] | undefined
	);
}
