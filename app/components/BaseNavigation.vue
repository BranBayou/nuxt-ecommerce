<script setup lang="ts">
const route = useRoute()
const { count, isOpen: cartOpen } = useCart()
const { items: wishlist } = useWishlist()
const { loggedIn, user } = useAuth()

const menuOpen = ref(false)
watch(() => route.fullPath, () => (menuOpen.value = false))

const links = [
  { label: 'Home', to: '/' },
  { label: 'Collections', to: '/collections' },
  { label: 'New', to: '/products?new=true' },
]

const isActive = (to: string) => {
  const [path, qs] = to.split('?')
  if (path === '/') return route.path === '/'
  if (qs) return route.path === path && route.query.new === 'true'
  return route.path.startsWith(path!)
}

const menuGroups = [
  {
    title: 'Shop',
    links: [
      { label: 'Men', to: '/products?gender=men' },
      { label: 'Women', to: '/products?gender=women' },
      { label: 'New Arrivals', to: '/products?new=true' },
      { label: 'Sale', to: '/products?sale=true' },
      { label: 'All Products', to: '/products' },
    ],
  },
  {
    title: 'Discover',
    links: [
      { label: 'Collections', to: '/collections' },
      { label: 'About Us', to: '/about' },
      { label: 'Wishlist', to: '/wishlist' },
    ],
  },
]
</script>

<template>
  <header class="sticky top-0 z-40 bg-paper/85 backdrop-blur-md">
    <nav class="container grid grid-cols-[1fr_auto_1fr] items-center h-20" aria-label="Main">
      <!-- Left: menu + links -->
      <div class="flex items-center gap-8">
        <button
          class="p-2 -ml-2 hover:opacity-70 transition-opacity"
          :aria-expanded="menuOpen"
          aria-label="Open menu"
          @click="menuOpen = true"
        >
          <Icon name="lucide:align-left" size="24" />
        </button>
        <ul class="hidden md:flex items-center gap-8 text-sm">
          <li v-for="link in links" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="relative py-1 hover:opacity-70 transition-opacity after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-ink after:transition-all"
              :class="isActive(link.to) ? 'after:w-full' : 'after:w-0'"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Center: logo -->
      <NuxtLink to="/" aria-label="Nuxtwear home" class="hover:opacity-80 transition-opacity">
        <AppLogo :size="36" />
      </NuxtLink>

      <!-- Right: wishlist, cart pill, account -->
      <div class="flex items-center justify-end gap-2 sm:gap-3">
        <NuxtLink to="/wishlist" class="icon-btn relative hidden sm:inline-flex" aria-label="Wishlist">
          <Icon name="lucide:heart" size="18" />
          <span v-if="wishlist.length" class="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-white text-ink border border-ink text-[10px] font-semibold grid place-items-center">
            {{ wishlist.length }}
          </span>
        </NuxtLink>

        <button class="flex items-center group" aria-label="Open shopping bag" @click="cartOpen = true">
          <span class="hidden sm:flex items-center h-11 pl-6 pr-4 -mr-2 rounded-full bg-ink text-white text-sm group-hover:bg-ink-soft transition-colors">
            Cart
          </span>
          <span class="relative grid place-items-center w-11 h-11 rounded-full bg-white border-[3px] border-ink">
            <Icon name="lucide:shopping-bag" size="16" />
            <span v-if="count" class="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-ink text-white text-[10px] font-semibold grid place-items-center">
              {{ count }}
            </span>
          </span>
        </button>

        <NuxtLink
          :to="loggedIn ? '/account' : '/login'"
          class="icon-btn overflow-hidden"
          :aria-label="loggedIn ? 'My account' : 'Sign in'"
        >
          <img v-if="user?.image" :src="user.image" alt="" class="w-full h-full object-cover bg-white" />
          <Icon v-else name="lucide:user-round" size="18" />
        </NuxtLink>
      </div>
    </nav>

    <!-- Slide-out menu -->
    <Teleport to="body">
      <Transition enter-from-class="opacity-0" leave-to-class="opacity-0" enter-active-class="transition-opacity duration-300" leave-active-class="transition-opacity duration-200">
        <div v-if="menuOpen" class="fixed inset-0 z-50 bg-black/40" @click="menuOpen = false" />
      </Transition>
      <Transition enter-from-class="-translate-x-full" leave-to-class="-translate-x-full" enter-active-class="transition-transform duration-300 ease-out" leave-active-class="transition-transform duration-200 ease-in">
        <aside v-if="menuOpen" class="fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-paper flex flex-col" aria-label="Menu">
          <div class="flex items-center justify-between h-20 px-6">
            <AppLogo :size="32" />
            <button class="p-2 -mr-2 hover:opacity-70" aria-label="Close menu" @click="menuOpen = false">
              <Icon name="lucide:x" size="24" />
            </button>
          </div>
          <div class="px-6 pb-6">
            <SearchField />
          </div>
          <div class="flex-1 overflow-y-auto px-6 space-y-10">
            <div v-for="group in menuGroups" :key="group.title">
              <p class="eyebrow mb-4">{{ group.title }}</p>
              <ul class="space-y-3">
                <li v-for="link in group.links" :key="link.to">
                  <NuxtLink :to="link.to" class="display text-3xl hover:opacity-60 transition-opacity">{{ link.label }}</NuxtLink>
                </li>
              </ul>
            </div>
          </div>
          <div class="p-6 border-t border-line text-sm">
            <NuxtLink v-if="loggedIn" to="/account" class="flex items-center gap-2 hover:opacity-70">
              <Icon name="lucide:user-round" size="16" /> {{ user?.firstName }} {{ user?.lastName }}
            </NuxtLink>
            <div v-else class="flex gap-6">
              <NuxtLink to="/login" class="hover:opacity-70">Sign in</NuxtLink>
              <NuxtLink to="/register" class="hover:opacity-70">Create account</NuxtLink>
            </div>
          </div>
        </aside>
      </Transition>
    </Teleport>
  </header>
</template>
