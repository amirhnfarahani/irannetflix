<!-- iranflix/components/ConfirmDialog.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
      dir="rtl"
      @click.self="$emit('cancel')"
      @keydown.esc="$emit('cancel')"
    >
      <div class="w-full max-w-sm bg-bg-card rounded-2xl border border-white/10 p-6 font-vazir shadow-2xl">
        <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
        <p class="text-sm text-text-secondary mb-6 leading-7">{{ message }}</p>
        <div class="flex gap-3 justify-end">
          <button
            type="button"
            class="px-4 py-2 rounded-lg text-sm text-text-secondary hover:bg-white/10 transition-colors"
            @click="$emit('cancel')"
          >
            انصراف
          </button>
          <button
            type="button"
            class="px-5 py-2 rounded-lg text-sm font-bold text-white transition-colors"
            :class="danger ? 'bg-red-600 hover:bg-red-500' : 'bg-accent hover:bg-accent-hover'"
            @click="$emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    open: boolean
    title: string
    message: string
    confirmText?: string
    danger?: boolean
  }>(),
  { confirmText: 'تأیید', danger: false },
)

defineEmits<{ confirm: []; cancel: [] }>()
</script>
