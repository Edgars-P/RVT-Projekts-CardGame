import type PocketBase from "pocketbase"

interface Card {
	id: string
	collectionId: string
	collectionName: string
	created: string
	updated: string
	karsuKomplekts: string
	virsraksts: string
	saturs: string
	custom: string
	tips: string
}

let cardCache = new Map<string, Promise<Card>>()

export function getCard(pb: PocketBase, card: string) {
	let resCard = cardCache.get(card)
	if (resCard) return resCard
	resCard = pb?.collection("spelesKartis").getOne(card) as Promise<Card>
	cardCache.set(card, resCard)
	return resCard
}
