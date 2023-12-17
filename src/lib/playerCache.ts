import type { RecordModel, default as PocketBase } from 'pocketbase';

let playerCache = new Map<string, Promise<RecordModel>>();

export function getPlayer(pb: PocketBase, player: string) {
	let resPlayer = playerCache.get(player);
	if (resPlayer) return resPlayer;
	resPlayer = pb?.collection('speletaji').getOne(player) as Promise<RecordModel>;
	playerCache.set(player, resPlayer);
	return resPlayer;
}
