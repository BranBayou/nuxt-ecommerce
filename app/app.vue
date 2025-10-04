<template>
  <div class="font-Montserrat">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
/* Custom scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #f79f1a;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d65f09;
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: #f79f1a #f1f1f1;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom text selection */
::selection {
  background-color: #f79f1a;
  color: white;
}

::-moz-selection {
  background-color: #f79f1a;
  color: white;
}
</style>
