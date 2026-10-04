<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
useSeoMeta({ title: 'Sign In', robots: 'noindex' })

const route = useRoute()
const { login } = useAuth()

const identifier = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Only allow same-site relative redirects
const redirectTo = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') && !r.startsWith('//') ? r : '/account'
})

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await login(identifier.value, password.value)
    await navigateTo(redirectTo.value)
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    loading.value = false
  }
}

// Public demo account from https://dummyjson.com/docs/auth
function useDemoAccount() {
  identifier.value = 'emilys'
  password.value = 'emilyspass'
}
</script>

<template>
  <div>
    <h1 class="display text-5xl">Login</h1>
    <p class="mt-3 text-sm text-muted">Welcome back. Sign in to track orders and check out faster.</p>

    <form class="mt-10 space-y-5" @submit.prevent="submit">
      <div>
        <label for="identifier" class="label">Email or username</label>
        <input id="identifier" v-model="identifier" required autocomplete="username" class="input" />
      </div>
      <div>
        <div class="flex items-center justify-between">
          <label for="password" class="label">Password</label>
        </div>
        <div class="relative">
          <input
            id="password"
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            autocomplete="current-password"
            class="input pr-12"
          />
          <button
            type="button"
            class="absolute right-0 inset-y-0 px-4 text-muted hover:text-ink"
            :aria-label="showPassword ? 'Hide password' : 'Show password'"
            @click="showPassword = !showPassword"
          >
            <Icon :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'" size="18" />
          </button>
        </div>
      </div>

      <p v-if="error" class="p-3 border border-sale/40 bg-sale/5 text-sm text-sale" role="alert">{{ error }}</p>

      <button class="btn-primary w-full justify-between" :disabled="loading">
        {{ loading ? 'Signing in…' : 'Login' }}
        <Icon :name="loading ? 'lucide:loader-circle' : 'lucide:arrow-right'" size="18" :class="{ 'animate-spin': loading }" />
      </button>
    </form>

    <div class="mt-6 p-4 border border-dashed border-line text-xs text-muted flex items-center justify-between gap-4">
      <span>Just exploring? Use a DummyJSON demo account.</span>
      <button type="button" class="shrink-0 underline text-ink" @click="useDemoAccount">Fill demo login</button>
    </div>

    <p class="mt-10 text-sm text-muted">
      New to Nuxtwear?
      <NuxtLink :to="{ path: '/register', query: route.query.redirect ? { redirect: route.query.redirect } : {} }" class="text-ink underline">Create an account</NuxtLink>
    </p>
  </div>
</template>
