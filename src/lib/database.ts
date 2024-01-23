import { browser } from "$app/environment"
import { derived, readable, writable } from "svelte/store"
import PocketBase, {
	AsyncAuthStore,
	BaseAuthStore,
	LocalAuthStore,
	type AuthModel
} from "pocketbase"

// Ja kods tiek testēts codespaces, ir nepieciešams izmantot puplisi pieejamo datu bāzes URL
const PB_ADDRESS = import.meta.env.CODESPACES ? `https://${import.meta.env.CODESPACE_NAME}-8090.${import.meta.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}` : "http://localhost:8090"

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
