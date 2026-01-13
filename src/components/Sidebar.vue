<script setup>
</script>
<template>
  <aside class="w-60 bg-white border-r p-4">
    <h2 class="text-lg font-bold mb-6">
      Моё приложение
    </h2>

    <nav class="flex flex-col gap-2">
      <RouterLink
          to="/"
          class="px-3 py-2 rounded hover:bg-gray-100"
          active-class="bg-blue-100 text-blue-700 font-semibold"
      >
        📝 Список дел
      </RouterLink>

      <RouterLink
          to="/notes"
          class="px-3 py-2 rounded hover:bg-gray-100"
          active-class="bg-blue-100 text-blue-700 font-semibold"
      >
        📌 Заметки
      </RouterLink>

      <RouterLink
          to="/calendar"
          class="px-3 py-2 rounded hover:bg-gray-100"
          active-class="bg-blue-100 text-blue-700 font-semibold"
      >
        📅 Календарь
      </RouterLink>

      <RouterLink
          to="/habit"
          class="px-3 py-2 rounded hover:bg-gray-100"
          active-class="bg-blue-100 text-blue-700 font-semibold"
      >
        🎯 Ежедневные цели
      </RouterLink>

    </nav>
  </aside>
</template>
