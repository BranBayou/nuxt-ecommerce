<script setup lang="ts">
definePageMeta({ layout: 'auth', middleware: 'guest' })
useSeoMeta({ title: 'Create Account', robots: 'noindex' })

const route = useRoute()
const { register } = useAuth()

const form = reactive({ firstName: '', lastName: '', email: '', password: '', confirm: '' })
const agreed = ref(false)
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const strength = computed(() => {
  const p = form.password
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})
const strengthLabel = computed(() => ['Too short', 'Weak', 'Fair', 'Good', 'Strong'][strength.value])
const mismatch = computed(() => form.confirm.length > 0 && form.confirm !== form.password)

const redirectTo = computed(() => {
  const r = route.query.redirect
  return typeof r === 'string' && r.startsWith('/') && !r.startsWith('//') ? r : '/account'
})

async function submit() {
  if (mismatch.value) return
  loading.value = true
  error.value = ''
  try {
    await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password })
    await navigateTo(redirectTo.value)
  } catch (err) {
    error.value = errorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h1 class="display text-5xl">Register</h1>
    <p class="mt-3 text-sm text-muted">Create an account for faster checkout, order tracking and early access to drops.</p>

    <form class="mt-10 space-y-5" @submit.prevent="submit">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label for="firstName" class="label">First name</label>
          <input id="firstName" v-model="form.firstName" required autocomplete="given-name" class="input" />
        </div>
        <div>
          <label for="lastName" class="label">Last name</label>
          <input id="lastName" v-model="form.lastName" required autocomplete="family-name" class="input" />
        </div>
      </div>
      <div>
        <label for="email" class="label">Email</label>
        <input id="email" v-model="form.email" type="email" required autocomplete="email" class="input" />
      </div>
      <div>
        <label for="password" class="label">Password</label>
        <div class="relative">
          <input
            id="password"
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            required
            minlength="8"
            autocomplete="new-password"
            class="input pr-12"
            aria-describedby="password-strength"
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
        <div v-if="form.password" id="password-strength" class="mt-2 flex items-center gap-3">
          <div class="flex-1 grid grid-cols-4 gap-1">
            <span v-for="n in 4" :key="n" class="h-1 transition-colors" :class="n <= strength ? 'bg-ink' : 'bg-field'" />
          </div>
          <span class="text-xs text-muted w-16 text-right">{{ strengthLabel }}</span>
        </div>
      </div>
      <div>
        <label for="confirm" class="label">Confirm password</label>
        <input id="confirm" v-model="form.confirm" :type="showPassword ? 'text' : 'password'" required autocomplete="new-password" class="input" :class="{ '!border-sale': mismatch }" />
        <p v-if="mismatch" class="mt-1 text-xs text-sale">Passwords don't match.</p>
      </div>

      <label class="flex items-start gap-3 text-xs text-muted cursor-pointer">
        <input v-model="agreed" type="checkbox" required class="mt-0.5 w-4 h-4 accent-black" />
        I agree to the Terms of Service and Privacy Policy.
      </label>

      <p v-if="error" class="p-3 border border-sale/40 bg-sale/5 text-sm text-sale" role="alert">{{ error }}</p>

      <button class="btn-primary w-full justify-between" :disabled="loading || mismatch">
        {{ loading ? 'Creating account…' : 'Create account' }}
        <Icon :name="loading ? 'lucide:loader-circle' : 'lucide:arrow-right'" size="18" :class="{ 'animate-spin': loading }" />
      </button>
    </form>

    <p class="mt-10 text-sm text-muted">
      Already have an account?
      <NuxtLink :to="{ path: '/login', query: route.query.redirect ? { redirect: route.query.redirect } : {} }" class="text-ink underline">Sign in</NuxtLink>
    </p>
  </div>
</template>
