import { browser } from "$app/environment"
import { derived, get, readable, writable } from "svelte/store"
import PocketBase, {
	AsyncAuthStore,
	BaseAuthStore,
	LocalAuthStore,
	type AuthModel
} from "pocketbase"
import { page } from "$app/stores"

// Izmanto pašreizējo URL ja ir prod.
const PB_ADDRESS = import.meta.env.DEV ? "http://localhost:8090" : globalThis?.location?.origin

/*
	Atsevišķas AuthStore implementācijas lai 
	varētu būt reizē gan kā spēlētājs, gan lietotājs.
*/

export const pb = writable<PocketBase | undefined>(undefined, (set) => {
	if (browser) {
		const pb = new PocketBase(PB_ADDRESS, new LocalAuthStore("user_auth"))
		set(pb)
	}
})

export const playerPb = writable<PocketBase | undefined>(undefined, (set) => {
	if (browser) {
		const pb = new PocketBase(PB_ADDRESS, new LocalAuthStore("player_auth"))
		set(pb)
	}
})

export const adminPb = writable<PocketBase | undefined>(undefined, (set) => {
	if (browser) {
		const pb = new PocketBase(PB_ADDRESS, new LocalAuthStore("admin_auth"))
		set(pb)
	}
})
