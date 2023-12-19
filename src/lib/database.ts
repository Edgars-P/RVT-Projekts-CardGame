import { browser } from "$app/environment"
import { derived, readable, writable } from "svelte/store"
import PocketBase, {
	AsyncAuthStore,
	BaseAuthStore,
	LocalAuthStore,
	type AuthModel
} from "pocketbase"

export const pb = writable<PocketBase | undefined>(undefined, (set) => {
	if (browser) {
		const pb = new PocketBase("http://localhost:8090")
		set(pb)
	}
})

// Īpaša implementācija lai spēlētāja autentifikācijas dati tiktu saglabāti atsevišķi no lietotāja
class PlayerAuthStore extends BaseAuthStore {
	private storageFallback: { [key: string]: any } = {}
	private storageKey: string

	constructor(storageKey = "pocketbase_auth") {
		super()

		this.storageKey = storageKey

		this._bindStorageEvent()
	}

	/**
	 * @inheritdoc
	 */
	get token(): string {
		const data = this._storageGet(this.storageKey) || {}

		return data.token || ""
	}

	/**
	 * @inheritdoc
	 */
	get model(): AuthModel {
		const data = this._storageGet(this.storageKey) || {}

		return data.model || null
	}

	/**
	 * @inheritdoc
	 */
	save(token: string, model?: AuthModel) {
		this._storageSet(this.storageKey, {
			token: token,
			model: model
		})

		super.save(token, model)
	}

	/**
	 * @inheritdoc
	 */
	clear() {
		this._storageRemove(this.storageKey)

		super.clear()
	}

	private _storageGet(key: string): any {
		if (typeof window !== "undefined" && window?.localStorage) {
			const rawValue = window.localStorage.getItem("player_" + key) || ""
			try {
				return JSON.parse(rawValue)
			} catch (e) {
				// not a json
				return rawValue
			}
		}

		// fallback
		return this.storageFallback[key]
	}

	private _storageSet(key: string, value: any) {
		if (typeof window !== "undefined" && window?.localStorage) {
			// store in local storage
			let normalizedVal = value
			if (typeof value !== "string") {
				normalizedVal = JSON.stringify(value)
			}
			window.localStorage.setItem("player_" + key, normalizedVal)
		} else {
			// store in fallback
			this.storageFallback[key] = value
		}
	}

	private _storageRemove(key: string) {
		// delete from local storage
		if (typeof window !== "undefined" && window?.localStorage) {
			window.localStorage?.removeItem("player_" + key)
		}

		// delete from fallback
		delete this.storageFallback[key]
	}

	private _bindStorageEvent() {
		if (typeof window === "undefined" || !window?.localStorage || !window.addEventListener) {
			return
		}

		window.addEventListener("storage", (e) => {
			if (e.key != this.storageKey) {
				return
			}

			const data = this._storageGet(this.storageKey) || {}

			super.save(data.token || "", data.model || null)
		})
	}
}

export const playerPb = writable<PocketBase | undefined>(undefined, (set) => {
	if (browser) {
		const pb = new PocketBase("http://localhost:8090", new PlayerAuthStore())
		set(pb)
	}
})

// Īpaša implementācija lai administratora autentifikācijas dati tiktu saglabāti atsevišķi no lietotāja
class AdminAuthStore extends BaseAuthStore {
	private storageFallback: { [key: string]: any } = {}
	private storageKey: string

	constructor(storageKey = "pocketbase_auth") {
		super()

		this.storageKey = storageKey

		this._bindStorageEvent()
	}

	/**
	 * @inheritdoc
	 */
	get token(): string {
		const data = this._storageGet(this.storageKey) || {}

		return data.token || ""
	}

	/**
	 * @inheritdoc
	 */
	get model(): AuthModel {
		const data = this._storageGet(this.storageKey) || {}

		return data.model || null
	}

	/**
	 * @inheritdoc
	 */
	save(token: string, model?: AuthModel) {
		this._storageSet(this.storageKey, {
			token: token,
			model: model
		})

		super.save(token, model)
	}

	/**
	 * @inheritdoc
	 */
	clear() {
		this._storageRemove(this.storageKey)

		super.clear()
	}

	private _storageGet(key: string): any {
		if (typeof window !== "undefined" && window?.localStorage) {
			const rawValue = window.localStorage.getItem("admin_" + key) || ""
			try {
				return JSON.parse(rawValue)
			} catch (e) {
				// not a json
				return rawValue
			}
		}

		// fallback
		return this.storageFallback[key]
	}

	private _storageSet(key: string, value: any) {
		if (typeof window !== "undefined" && window?.localStorage) {
			// store in local storage
			let normalizedVal = value
			if (typeof value !== "string") {
				normalizedVal = JSON.stringify(value)
			}
			window.localStorage.setItem("admin_" + key, normalizedVal)
		} else {
			// store in fallback
			this.storageFallback[key] = value
		}
	}

	private _storageRemove(key: string) {
		// delete from local storage
		if (typeof window !== "undefined" && window?.localStorage) {
			window.localStorage?.removeItem("admin_" + key)
		}

		// delete from fallback
		delete this.storageFallback[key]
	}

	private _bindStorageEvent() {
		if (typeof window === "undefined" || !window?.localStorage || !window.addEventListener) {
			return
		}

		window.addEventListener("storage", (e) => {
			if (e.key != this.storageKey) {
				return
			}

			const data = this._storageGet(this.storageKey) || {}

			super.save(data.token || "", data.model || null)
		})
	}
}

export const adminPb = writable<PocketBase | undefined>(undefined, (set) => {
	if (browser) {
		const pb = new PocketBase("http://localhost:8090", new AdminAuthStore())
		set(pb)
	}
})
