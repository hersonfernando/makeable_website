<script setup>
defineProps({ name: { type: String, default: 'arrow' }, size: { type: [Number, String], default: 24 } })
</script>

<template>
  <svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <template v-if="name === 'arrow'"><path d="M4 12h15M13 5l7 7-7 7" /></template>
    <template v-else-if="name === 'arrow-up'"><path d="M5 19 19 5M5 5h14v14" /></template>
    <template v-else-if="name === 'down'"><path d="M12 4v16M6 14l6 6 6-6" /></template>
    <template v-else-if="name === 'cloud'"><path d="M7 18h11a4 4 0 0 0 .6-8 6.6 6.6 0 0 0-12.8-1.3A4.7 4.7 0 0 0 7 18Z" /><path d="m9 13 3-3 3 3M12 10v11" /></template>
    <template v-else-if="name === 'network'"><rect x="8" y="2" width="8" height="6" rx="1.5" /><rect x="2" y="16" width="7" height="6" rx="1.5" /><rect x="15" y="16" width="7" height="6" rx="1.5" /><path d="M12 8v4M5.5 16v-4h13v4" /></template>
    <template v-else-if="name === 'consulting'"><path d="M18 9a6 6 0 1 0-10 4.5V16h8v-2.5A6 6 0 0 0 18 9ZM9 20h6M10 23h4M12 1v2" /><path d="m9.5 9 2 2 3-3" /></template>
    <template v-else-if="name === 'code'"><rect x="2" y="3" width="20" height="18" rx="3" /><path d="M2 8h20m-14 4-3 3 3 3m8-6 3 3-3 3m-3-6-2 6M6 5.5h.01M9 5.5h.01" /></template>
    <template v-else-if="name === 'check'"><path d="m5 12 4 4L19 6" /></template>
    <template v-else-if="name === 'close'"><path d="m6 6 12 12M6 18 18 6" /></template>
    <template v-else-if="name === 'menu'"><path d="M4 7h16M4 12h16M4 17h16" /></template>
    <template v-else-if="name === 'mail'"><rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 6 9 7 9-7" /></template>
    <template v-else-if="name === 'globe'"><circle cx="12" cy="12" r="9" /><ellipse cx="12" cy="12" rx="4" ry="9" /><path d="M3 12h18M5 6h14M5 18h14" /></template>
    <template v-else-if="name === 'spark'"><path d="m12 2 2.6 7.4L22 12l-7.4 2.6L12 22l-2.6-7.4L2 12l7.4-2.6L12 2Z" /></template>
  </svg>
</template>
