<script setup>
import { ref } from 'vue'
import { RouterView } from 'vue-router'
import Sidebar from '@/components/Sidebar.vue'

const sidebarOpen = ref(false)

function openSidebar() {
  sidebarOpen.value = true
}

function closeSidebar() {
  sidebarOpen.value = false
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-100 relative">

    <!-- SIDEBAR -->
    <Sidebar
        :open="sidebarOpen"
        @close="closeSidebar"
    />

    <!-- OVERLAY (mobile/tablet) -->
    <div
        v-if="sidebarOpen"
        @click="closeSidebar"
        class="fixed inset-0 bg-black/40 z-40 lg:hidden"
    />

    <!-- CONTENT -->
    <div class="flex-1 flex flex-col">

      <!-- TOP BAR -->
      <header class="h-14 bg-white border-b flex items-center px-4 lg:hidden">
        <button
            @click="openSidebar"
            class="text-2xl"
        >
          ☰
        </button>
      </header>

      <!-- PAGE -->
      <main class="flex-1 p-4 sm:p-6">
        <RouterView />
      </main>

    </div>

  </div>
</template>
