<script lang="ts">
	import { topZIndex } from "$lib/draggableObjectHelper"
	import { createEventDispatcher } from "svelte"

	const emit = createEventDispatcher()

	let isPickedUp = false

	let thisZIndex = 0

	const mouseDown = (e: MouseEvent) => {
		// Uzstāda mainīgos
		const card = e.currentTarget as HTMLDivElement
		const rect = card.getBoundingClientRect()
		const offsetX = e.clientX - rect.left
		const offsetY = e.clientY - rect.top

		isPickedUp = true

		// Palielina globālo z-index lai pārējās kārtis sev uzliek mazāku.
		// Šādā veidā z-index nebūs lielāks par 100 un kārtis nerādīsies virs pop-up logiem.
		$topZIndex++
		thisZIndex = $topZIndex

		// Ja pele kustas, tad lai kārts tai seko.
		const onMouseMove = (e: MouseEvent) => {
			card.style.position = "absolute"
			card.style.left = `${e.clientX - offsetX}px`
			card.style.top = `${e.clientY - offsetY}px`
		}

		// Pelei paceļoties satīra aiz sevis
		const onMouseUp = (e: MouseEvent) => {
			window.removeEventListener("mousemove", onMouseMove)
			window.removeEventListener("mouseup", onMouseUp)

			isPickedUp = false

			// Ja kārts ir ārpus loga, to izņemt
			const rect = card.getBoundingClientRect()
			if (
				rect.left < 0 ||
				rect.right > window.innerWidth ||
				rect.top < 0 ||
				rect.bottom > window.innerHeight
			) {
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
	style="z-index: {Math.max(20 - ($topZIndex - thisZIndex), 1)}"
	on:mousedown={mouseDown}
>
	<slot />
</div>
