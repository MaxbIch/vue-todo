<script setup>
defineProps({
  open: Boolean,
})

defineEmits(['close'])
</script>

<template>
  <aside
      class="
      fixed lg:static
      top-0 left-0
      h-full
      w-64
      bg-white
      border-r
      z-50
      transform
      transition-transform
      duration-300
      ease-in-out
      lg:translate-x-0
    "
      :class="open ? 'translate-x-0' : '-translate-x-full'"
  >

    <!-- HEADER (mobile) -->
    <div class="h-14 flex items-center justify-between px-4 border-b lg:hidden">
      <span class="font-semibold">Меню</span>
      <button @click="$emit('close')" class="text-xl">
        ✕
      </button>
    </div>

    <!-- NAV -->
    <nav class="p-4 space-y-2">

      <RouterLink
          to="/todo"
          class="block px-3 py-2 rounded hover:bg-blue-100"
          @click="$emit('close')"
      >
        Todo
      </RouterLink>

      <RouterLink
          to="/notes"
          class="block px-3 py-2 rounded hover:bg-blue-100"
          @click="$emit('close')"
      >
        Заметки
      </RouterLink>

      <RouterLink
          to="/calendar"
          class="block px-3 py-2 rounded hover:bg-blue-100"
          @click="$emit('close')"
      >
        Напоминания
      </RouterLink>

      <RouterLink
          to="/habits"
          class="block px-3 py-2 rounded hover:bg-blue-100"
          @click="$emit('close')"
      >
        Привычки
      </RouterLink>

    </nav>

  </aside>
</template>
