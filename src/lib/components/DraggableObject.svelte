<script lang="ts">
	import { createEventDispatcher } from "svelte"

	const emit = createEventDispatcher()

	let isPickedUp = false

	const mouseDown = (e: MouseEvent) => {
		// Drag and drop logic
		const card = e.currentTarget as HTMLDivElement
		const rect = card.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top

		isPickedUp = true

		globalThis.zIndex ||= 20

		card.style.zIndex = (globalThis.zIndex++).toString()

		const onMouseMove = (e) => {
			card.style.position = "absolute"
			card.style.left = `${e.clientX - offsetX}px`
			card.style.top = `${e.clientY - offsetY}px`
		}

		const onMouseUp = (e: MouseEvent) => {
			window.removeEventListener("mousemove", onMouseMove)
			window.removeEventListener("mouseup", onMouseUp)

			isPickedUp = false

			// If card is partially off screen either horisonally and vertically
			const rect = card.getBoundingClientRect()

			if (
				rect.left < 0 ||
				rect.right > window.innerWidth ||
				rect.top < 0 ||
				rect.bottom > window.innerHeight
			) {
				// Remove card from hand
				emit("remove")
			}
		}

		window.addEventListener("mousemove", onMouseMove)
		window.addEventListener("mouseup", onMouseUp)
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="select-none transition-[transform] {isPickedUp && 'rotate-6 scale-110'}"
	on:mousedown={mouseDown}
>
	<slot />
</div>
