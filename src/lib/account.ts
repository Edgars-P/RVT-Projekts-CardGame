import { browser } from "$app/environment"
import { derived, readable, writable } from "svelte/store"
import PocketBase from "pocketbase"
import { pb } from "./database"

interface user {
	id: string
	collectionId: string
	collectionName: string
	username: string
	verified: boolean
	emailVisibility: boolean
	email: string
	created: string
	updated: string
	name: string
	avatar: string
}

export const account = derived(
	pb,
	($pb) => {
		// return null if loading
		if (!$pb) return null

		console.log($pb.authStore.model)

		return $pb.authStore.model as user
	},
	null as null | user
)
