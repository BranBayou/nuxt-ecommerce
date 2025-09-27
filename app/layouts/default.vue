<script setup>

</script>

<template>
    <div class="min-h-screen flex flex-col">
        <BaseNavigation />
        <main class="flex-1">
            <slot />
        </main>
        <BaseFooter />
    </div>
</template>



<style lang="scss" scoped>

</style>