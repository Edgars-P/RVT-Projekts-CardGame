import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"

export default defineConfig({
	server: {
		port: 8080
	},
	plugins: [sveltekit()],
	envPrefix: [
		"CODESPACES",
		"GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN",
		"CODESPACE_NAME"
	]
})
