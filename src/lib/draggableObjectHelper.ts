import { writable } from "svelte/store"

// Definē augstāko z-index, lai DraggableObject var vienmēr savu objektu uzlikt kā
// z-index: 20 ja tas tika pēdējais izmantots, bet tas neiet zem popup logiem.
export const topZIndex = writable(20)
