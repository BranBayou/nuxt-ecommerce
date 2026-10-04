<template>
  <div class="min-h-screen flex flex-col">
    <BaseNavigation />
    <main class="flex-1">
      <slot />
    </main>
    <BaseFooter />
    <CartDrawer />
  </div>
</template>
