<script setup>
import { ref, watch, onMounted } from 'vue'

/* =====================
   STATE
===================== */
const newHabit = ref('')
const habits = ref([])

/* =====================
   HELPERS
===================== */
function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function getLastDays(count = 7) {
  const days = []
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

/* =====================
   LOAD / SAVE
===================== */
onMounted(() => {
  const saved = localStorage.getItem('habits')
  if (saved) habits.value = JSON.parse(saved)
})

watch(
    habits,
    v => localStorage.setItem('habits', JSON.stringify(v)),
    { deep: true }
)

/* =====================
   ACTIONS
===================== */
function addHabit() {
  if (!newHabit.value.trim()) return

  habits.value.unshift({
    id: Date.now(),
    title: newHabit.value,
    createdAt: Date.now(),
    days: {},
    isEditing: false,
    editTitle: '',
  })

  newHabit.value = ''
}

function removeHabit(id) {
  habits.value = habits.value.filter(h => h.id !== id)
}

function isDoneToday(habit) {
  return !!habit.days[todayKey()]
}

function toggleToday(habit) {
  const key = todayKey()

  if (habit.days[key]) {
    delete habit.days[key]
  } else {
    habit.days[key] = true
  }
}

/* =====================
   EDIT
===================== */
function startEdit(habit) {
  habit.isEditing = true
  habit.editTitle = habit.title
}

function saveEdit(habit) {
  if (!habit.editTitle.trim()) return
  habit.title = habit.editTitle
  habit.isEditing = false
}

function cancelEdit(habit) {
  habit.isEditing = false
}

/* =====================
   STREAK
===================== */
function getStreak(habit) {
  let streak = 0
  const date = new Date()

  while (true) {
    const key = date.toISOString().slice(0, 10)
    if (habit.days[key]) {
      streak++
      date.setDate(date.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}
</script>

<template>
  <div class="max-w-3xl">

    <h1 class="text-2xl font-bold mb-6">
      Привычки
    </h1>

    <!-- ADD -->
    <div class="mb-6 flex gap-2">
      <input
          v-model="newHabit"
          placeholder="Новая привычка"
          class="flex-1 border rounded-xl px-4 py-2"
      />
      <button
          @click="addHabit"
          class="bg-blue-600 text-white px-4 py-2 rounded-xl"
      >
        Добавить
      </button>
    </div>

    <!-- LIST -->
    <div class="flex flex-col gap-4">

      <div
          v-for="habit in habits"
          :key="habit.id"
          class="p-4 rounded-xl border"
          :class="isDoneToday(habit)
          ? 'bg-green-50 border-green-300'
          : 'bg-blue-50 border-blue-200'"
      >

        <!-- HEADER -->
        <div class="flex items-center justify-between">

          <!-- TITLE / EDIT -->
          <div class="flex-1">
            <div v-if="!habit.isEditing" class="font-semibold">
              {{ habit.title }}
            </div>

            <input
                v-else
                v-model="habit.editTitle"
                class="w-full border rounded px-2 py-1 text-sm"
            />
          </div>

          <!-- TODAY BUTTON -->
          <button
              @click="toggleToday(habit)"
              class="text-xs px-3 py-1 rounded-full ml-2"
              :class="isDoneToday(habit)
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-700'"
          >
            {{ isDoneToday(habit) ? '✓ Сегодня' : 'Отметить' }}
          </button>
        </div>

        <!-- ACTIONS -->
        <div class="flex flex-col items-start mt-1 text-[11px]">
          <button
              v-if="!habit.isEditing"
              @click="startEdit(habit)"
              class="text-blue-600"
          >
            редактировать
          </button>

          <button
              v-if="habit.isEditing"
              @click="saveEdit(habit)"
              class="text-green-700"
          >
            сохранить
          </button>

          <button
              v-if="habit.isEditing"
              @click="cancelEdit(habit)"
              class="text-gray-600"
          >
            отмена
          </button>

          <button
              @click="removeHabit(habit.id)"
              class="text-red-600"
          >
            удалить
          </button>
        </div>

        <!-- META -->
        <div class="text-xs text-gray-500 mt-1">
          Создано: {{ formatDate(habit.createdAt) }}
        </div>

        <!-- STREAK -->
        <div class="text-xs mt-1">
          🔥 Серия: {{ getStreak(habit) }} дн.
        </div>

        <!-- MINI CALENDAR -->
        <div class="flex gap-1 mt-2">
          <div
              v-for="day in getLastDays(7)"
              :key="day"
              class="w-6 h-6 rounded flex items-center justify-center text-[10px]"
              :class="habit.days[day]
              ? 'bg-green-400 text-white'
              : 'bg-gray-200 text-gray-500'"
          >
            {{ day.slice(8, 10) }}
          </div>
        </div>

      </div>

    </div>

  </div>
</template>
