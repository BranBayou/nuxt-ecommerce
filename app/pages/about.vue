<script setup lang="ts">
useSeoMeta({
  title: 'About',
  description: 'Who we are, how we ship, our returns policy and size guide.',
})

const values = [
  { title: 'Considered design', text: 'Fewer, better pieces with clean lines that outlast the season they were launched in.' },
  { title: 'Honest materials', text: 'We choose fabrics for how they wear over years — not just how they look on day one.' },
  { title: 'Fair pricing', text: 'No inflated markdowns. When something is on sale, the saving is real.' },
]

const sizes = [
  { size: 'XS', chest: '84–88', waist: '68–72' },
  { size: 'S', chest: '88–94', waist: '72–78' },
  { size: 'M', chest: '94–100', waist: '78–84' },
  { size: 'L', chest: '100–106', waist: '84–90' },
  { size: 'XL', chest: '106–112', waist: '90–96' },
  { size: '2X', chest: '112–120', waist: '96–104' },
]
</script>

<template>
  <div class="container pt-4">
    <Breadcrumb :items="[{ label: 'About' }]" />

    <section class="mt-6 grid lg:grid-cols-2 gap-10 items-end">
      <h1 class="display text-5xl sm:text-7xl">Our Approach<br />to Fashion</h1>
      <p class="text-muted leading-relaxed max-w-lg">
        Nuxtwear started with a simple idea: buying clothes online should be calm, clear and quick.
        We curate a tight edit of shirts, dresses, shoes and accessories — and build a store that gets out of the way.
      </p>
    </section>

    <section class="mt-20 grid md:grid-cols-3 gap-px bg-line border border-line">
      <div v-for="(v, i) in values" :key="v.title" class="bg-paper p-8">
        <p class="text-xs text-muted">0{{ i + 1 }}</p>
        <h2 class="display text-2xl mt-4">{{ v.title }}</h2>
        <p class="mt-3 text-sm text-muted leading-relaxed">{{ v.text }}</p>
      </div>
    </section>

    <section id="shipping" class="mt-24 scroll-mt-28 grid lg:grid-cols-[20rem_1fr] gap-10">
      <h2 class="display text-3xl">Shipping &amp; Returns</h2>
      <div class="grid sm:grid-cols-2 gap-6 text-sm">
        <div class="border border-line bg-white/50 p-6">
          <Icon name="lucide:truck" size="22" />
          <p class="font-semibold mt-4">Standard — 3–5 days</p>
          <p class="text-muted mt-1">Free on orders over $150, otherwise $9.99.</p>
        </div>
        <div class="border border-line bg-white/50 p-6">
          <Icon name="lucide:zap" size="22" />
          <p class="font-semibold mt-4">Express — 1–2 days</p>
          <p class="text-muted mt-1">$19.99 flat rate on any order.</p>
        </div>
        <div class="border border-line bg-white/50 p-6 sm:col-span-2">
          <Icon name="lucide:refresh-ccw" size="22" />
          <p class="font-semibold mt-4">Returns</p>
          <p class="text-muted mt-1">Most items can be returned within 30 days of delivery, unworn and with tags attached. Refunds are issued to the original payment method within 5 business days of receiving your return.</p>
        </div>
      </div>
    </section>

    <section id="sizes" class="mt-24 scroll-mt-28 grid lg:grid-cols-[20rem_1fr] gap-10">
      <div>
        <h2 class="display text-3xl">Size Guide</h2>
        <p class="mt-3 text-sm text-muted">Body measurements in centimetres. Shoes use EU sizing (39–45).</p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm border border-line bg-white/50">
          <thead>
            <tr class="text-left eyebrow">
              <th class="p-4 font-normal">Size</th>
              <th class="p-4 font-normal">Chest</th>
              <th class="p-4 font-normal">Waist</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="row in sizes" :key="row.size">
              <td class="p-4 font-medium">{{ row.size }}</td>
              <td class="p-4">{{ row.chest }}</td>
              <td class="p-4">{{ row.waist }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section id="contact" class="mt-24 scroll-mt-28 border border-line bg-ink text-white p-10 sm:p-16 flex flex-col md:flex-row gap-8 md:items-end justify-between">
      <div>
        <h2 class="display text-4xl sm:text-5xl">Need a hand?</h2>
        <p class="mt-3 text-white/70 text-sm">Our team replies within one business day.</p>
      </div>
      <a href="mailto:hello@nuxtwear.example" class="btn bg-white text-ink hover:bg-paper">hello@nuxtwear.example</a>
    </section>
  </div>
</template>
