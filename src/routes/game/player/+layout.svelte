<script>
    import {onMount} from "svelte"

    let name = ""

    onMount(() => {
        name = localStorage.getItem("player_name") ?? ""
    })
</script>

<!-- 
    Palūdz lietotāja vārdu
-->

{#if !name}
    <form on:submit|preventDefault={(e) => {
        let data = new FormData(e.currentTarget)
        console.log(data);
        let formName = data.get("name")?.toString() ?? ""
        console.log(formName);
        localStorage.setItem("player_name", formName)
        name = formName
    }}>
        <h1>Vārds?</h1>
        <input type="text" name="name" id="name" required>
        <button>Pievienoties!</button>
    </form>

{:else}
    <slot />
{/if}