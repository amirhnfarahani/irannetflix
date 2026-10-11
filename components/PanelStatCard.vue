<!-- iranflix/components/PanelStatCard.vue -->
<template>
  <div class="bg-bg-card rounded-xl p-5 border border-white/5 flex items-center gap-4">
    <div
      class="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
      :class="toneClass"
      aria-hidden="true"
    >
      {{ icon }}
    </div>
    <div class="min-w-0">
      <p class="text-xs text-text-muted mb-1">{{ label }}</p>
      <p class="text-xl font-bold text-text-primary truncate">{{ value }}</p>
      <p v-if="hint" class="text-[11px] text-text-secondary mt-0.5 truncate">{{ hint }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon: string
    hint?: string
    tone?: 'accent' | 'gold' | 'blue' | 'green'
  }>(),
  { hint: '', tone: 'accent' },
)

const toneClass = computed(
  () =>
    ({
      accent: 'bg-accent/15',
      gold: 'bg-gold/15',
      blue: 'bg-blue-500/15',
      green: 'bg-green-500/15',
    })[props.tone],
)
</script>
