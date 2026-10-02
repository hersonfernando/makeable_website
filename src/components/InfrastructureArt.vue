<script setup>
import { ref } from 'vue'
const activeNode = ref('cloud')
const nodes = [
  { id: 'cloud', label: 'Cloud', detail: 'Room to grow. Built in.' },
  { id: 'network', label: 'Network', detail: 'Every connection counts.' },
  { id: 'systems', label: 'Systems', detail: 'Your workflow. Reimagined.' },
]
</script>

<template>
  <div class="infrastructure-art">
    <svg class="architecture" viewBox="0 0 580 490" role="img" aria-label="An interconnected cloud, network, and business system, built around Makeable.IO Information Technology Solutions">
      <defs>
        <linearGradient id="platform-top" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffffff" /><stop offset="1" stop-color="#e5e7fa" /></linearGradient>
        <linearGradient id="core-top" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8278ff" /><stop offset="1" stop-color="#5551e8" /></linearGradient>
        <linearGradient id="core-left" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#6556eb" /><stop offset="1" stop-color="#4542cf" /></linearGradient>
        <linearGradient id="core-right" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#5046d5" /><stop offset="1" stop-color="#342dac" /></linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#edeaff" stop-opacity=".9" /><stop offset="1" stop-color="#cfc9ff" stop-opacity=".7" /></linearGradient>
        <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="13" /></filter>
        <pattern id="grid" width="44" height="26" patternUnits="userSpaceOnUse" patternTransform="matrix(1 .56 -1 .56 290 -55)"><path d="M44 0H0V26" fill="none" stroke="#dfe2ef" stroke-width=".75" /></pattern>
      </defs>
      <ellipse cx="303" cy="363" rx="191" ry="39" fill="#5750b5" opacity=".08" filter="url(#soft-shadow)" />
      <path d="M-90 261 290 47 676 264 293 481Z" fill="url(#grid)" />
      <g fill="none" stroke-linejoin="round">
        <path d="m281 221 131-76 91 53" stroke="#bab5ea" stroke-width="2" />
        <path d="m280 280-145 84-94-54" stroke="#bab5ea" stroke-width="2" />
        <path d="m301 284 112 65 79-46" stroke="#bab5ea" stroke-width="2" />
        <path class="connection-pulse" d="m281 221 131-76 91 53M280 280l-145 84-94-54M301 284l112 65 79-46" stroke="#7165ed" stroke-width="2.5" stroke-dasharray="8 180" />
        <path d="m146 181 134-78 76 44M169 401l107 61 66-38" stroke="#d4d7e8" stroke-width="1.5" stroke-dasharray="4 5" />
      </g>
      <g class="network-satellite">
        <path d="m34 278 69-40 69 40v17l-69 40-69-40Z" fill="#dcdff0" />
        <path d="m34 278 69 40 69-40-69-40Z" fill="url(#platform-top)" stroke="#fff" />
        <path d="m54 265 49-28 49 28v13l-49 28-49-28Z" fill="#bfc2e4" />
        <path d="m54 265 49 28 49-28-49-28Z" fill="#fff" stroke="#dfe1f1" />
        <path d="m75 260 28-16 28 16-28 16Z" fill="#e9e5ff" stroke="#c8c0f7" />
        <g fill="#6a5af0"><circle cx="82" cy="263" r="2" /><circle cx="89" cy="267" r="2" /><circle cx="96" cy="271" r="2" /></g>
        <path d="m111 282 18-10" stroke="#8d85d7" stroke-width="2" />
      </g>
      <g class="cloud-satellite">
        <path d="m402 187 60-35 60 35v17l-60 35-60-35Z" fill="#d7dbee" />
        <path d="m402 187 60 35 60-35-60-35Z" fill="url(#platform-top)" stroke="#fff" />
        <path d="M446 161c-15 0-24-10-24-22 0-11 8-20 19-22 4-17 27-24 39-10 10-2 20 5 20 16 13 5 18 21 9 31-4 5-10 7-17 7Z" fill="#f8f8ff" stroke="#bcb5f4" stroke-width="1.5" />
        <path d="m456 135 7-7 7 7m-7-7v22" stroke="#7b6ce8" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </g>
      <g class="systems-satellite">
        <path d="m420 309 65-37 65 37v17l-65 37-65-37Z" fill="#d6daee" />
        <path d="m420 309 65 37 65-37-65-37Z" fill="url(#platform-top)" stroke="#fff" />
        <path d="m446 287 57 33v-65l-57-33Z" fill="#b5afe6" stroke="#9288d3" stroke-linejoin="round" />
        <path d="m452 280 45 26v-47l-45-26Z" fill="#f6f5ff" />
        <path d="m459 250 29 17m-29-8 19 11" stroke="#c1bbed" stroke-width="3" />
        <path d="m459 273 7 4v10l-7-4Zm11-1 7 4v18l-7-4Zm11 1 7 4v23l-7-4Z" fill="#7465e9" />
        <path d="m468 302 9 5v12l14 8-7 4-28-16 12-7Z" fill="#bbb5e5" />
      </g>
      <g class="core-platform">
        <path d="m183 300 109-63 109 63v24l-109 63-109-63Z" fill="#d8dcef" />
        <path d="m183 300 109 63 109-63-109-63Z" fill="url(#platform-top)" stroke="#fff" stroke-width="1.5" />
        <path d="m198 295 94-54 94 54-94 54Z" fill="none" stroke="#bbb2f5" stroke-width="1.5" />
        <path d="m215 315 14 8m8 5 14 8" stroke="#b4aed6" stroke-width="2" stroke-linecap="round" />
        <circle cx="367" cy="308" r="3" fill="#8373ef" />
      </g>
      <g class="core-cube">
        <path d="m211 215 81-47 81 47v80l-81 47-81-47Z" fill="url(#core-left)" />
        <path d="m292 262 81-47v80l-81 47Z" fill="url(#core-right)" />
        <path d="m211 215 81-47 81 47-81 47Z" fill="url(#core-top)" stroke="#a198ff" stroke-width="1" />
        <path d="m265 216 27-15 27 15m-46 4 19-11 19 11m-37 9v-9m36 9v-9" fill="none" stroke="white" stroke-width="4" stroke-linecap="square" stroke-linejoin="miter" />
        <path d="m226 258 49 28m-49-17 36 21" stroke="#aea3ff" stroke-width="2" opacity=".6" />
        <g fill="#b9ffb1"><ellipse cx="321" cy="286" rx="2.5" ry="3" /><ellipse cx="332" cy="280" rx="2.5" ry="3" /><ellipse cx="343" cy="274" rx="2.5" ry="3" /></g>
        <path d="m312 308 38-22" stroke="#8d7ded" stroke-width="2" />
      </g>
      <g class="floating-layer">
        <path d="m211 175 81-47 81 47v11l-81 47-81-47Z" fill="#b5aaf5" fill-opacity=".5" />
        <path d="m211 175 81-47 81 47-81 47Z" fill="url(#glass)" stroke="#b5a7f0" />
        <path d="m229 175 63-36 63 36-63 36Z" fill="none" stroke="#afa0ec" />
        <path d="m271 175 21-12 21 12-21 12Z" fill="#8d7ee0" fill-opacity=".22" />
      </g>
      <g class="floating-layer upper-layer">
        <path d="m235 127 57-33 57 33v7l-57 33-57-33Z" fill="#e3ddfc" fill-opacity=".6" />
        <path d="m235 127 57-33 57 33-57 33Z" fill="#f8f6ff" fill-opacity=".6" stroke="#c3b8ed" />
        <path d="m280 127 12-7 12 7-12 7Z" fill="#b0a3ec" />
      </g>
      <g fill="#9183ed"><circle cx="146" cy="181" r="3" /><circle cx="356" cy="147" r="3" /><circle cx="169" cy="401" r="3" /></g>
      <g fill="none" stroke="#d4d7e6" stroke-width="1"><path d="M269 74h10m-5-5v10M542 261h10m-5-5v10M169 117h8m-4-4v8M349 417h8m-4-4v8" /></g>
    </svg>
    <button v-for="node in nodes" :key="node.id" class="diagram-label" :class="[`label-${node.id}`, { active: activeNode === node.id }]" :aria-pressed="activeNode === node.id" @click="activeNode = node.id">
      <span class="node-dot"></span>{{ node.label }}<span class="node-plus" aria-hidden="true">+</span>
    </button>
    <div class="diagram-caption" aria-live="polite"><span class="status-dot"></span>{{ nodes.find(node => node.id === activeNode).detail }}</div>
    <div class="art-corner"><span>FIG. 01</span> EVERYTHING, CONNECTED.</div>
  </div>
</template>
