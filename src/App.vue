<script setup>
import Sidebar from './components/Sidebar.vue'
import { useNotifications } from '@/composables/useNotifications'

const { activeAlert, goToReminder } = useNotifications()
</script>

<template>
  <div class="min-h-screen flex bg-gray-100">

    <Sidebar />

    <main class="flex-1 p-6">
      <RouterView />
    </main>

    <!-- GLOBAL ALERT -->
    <div
        v-if="activeAlert"
        class="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-4 rounded-xl shadow-xl z-50"
    >
      <div class="font-semibold mb-1">⏰ Напоминание</div>
      <div class="cursor-pointer" @click="goToReminder(activeAlert)">
        {{ activeAlert.text }}
      </div>
      <button
          class="mt-2 text-xs underline"
          @click="activeAlert = null"
      >
        закрыть
      </button>
    </div>

  </div>
</template>
