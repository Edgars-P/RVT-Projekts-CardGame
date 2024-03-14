<script lang="ts">
	import QRCode from "qrcode"
	let display: HTMLCanvasElement

	export let url = "https://example.com"
	let dataUrl = ""

	$: QRCode.toDataURL(url, {}).then((url) => (dataUrl = url))
</script>

<img src={dataUrl} alt={url} class="rounded-lg" />
