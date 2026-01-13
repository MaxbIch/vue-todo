<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

/* =====================
   STATE
===================== */
const newTask = ref('')
const tasks = ref([])

const selectedHours = ref(0)
const selectedMinutes = ref(0)
const showTimePicker = ref(false)

const now = ref(Date.now())
let timerId = null

/* =====================
   DATA
===================== */
const hoursList = Array.from({ length: 101 }, (_, i) => i)
const minutesList = Array.from({ length: 60 }, (_, i) => i)

/* =====================
   LIFECYCLE
===================== */
onMounted(() => {
  const saved = localStorage.getItem('tasks')
  if (saved) tasks.value = JSON.parse(saved)

  timerId = setInterval(() => {
    now.value = Date.now()
    tasks.value.forEach(checkTaskFinished)
  }, 1000)
})

onUnmounted(() => clearInterval(timerId))

watch(
    tasks,
    v => localStorage.setItem('tasks', JSON.stringify(v)),
    { deep: true }
)

/* =====================
   TASKS
===================== */
function addTask() {
  if (!newTask.value.trim()) return

  const createdAt = Date.now()
  const totalMinutes = selectedHours.value * 60 + selectedMinutes.value
  const deadline = totalMinutes
      ? createdAt + totalMinutes * 60 * 1000
      : null

  // 👇 ВАЖНО: добавляем В НАЧАЛО
  tasks.value.unshift({
    id: createdAt,
    text: newTask.value,
    done: false,
    createdAt,
    deadline,
    finishedAt: null,
    isEditing: false,
  })

  newTask.value = ''
  selectedHours.value = 0
  selectedMinutes.value = 0
}

function removeTask(id) {
  tasks.value = tasks.value.filter(t => t.id !== id)
}

function startEditing(task) {
  task.isEditing = true
}

function stopEditing(task) {
  task.isEditing = false
}

/* =====================
   TIMER
===================== */
function checkTaskFinished(task) {
  if (!task.deadline || task.finishedAt) return
  if (task.deadline <= now.value) {
    task.finishedAt = now.value
  }
}

function timeLeft(task) {
  if (!task.deadline) return null

  if (task.finishedAt) {
    return `вышло в ${formatDate(task.finishedAt)}`
  }

  const diff = task.deadline - now.value
  if (diff <= 0) return 'время вышло'

  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff / 60000) % 60)
  const s = Math.floor((diff / 1000) % 60)

  return `${String(h).padStart(2, '0')}ч ${String(m).padStart(2, '0')}м ${String(s).padStart(2, '0')}с`
}

/* =====================
   FORMAT
===================== */
function formatDate(ts) {
  return new Date(ts).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}
</script>

<template>
  <div class="w-full">

    <!-- HEADER -->
    <h1 class="text-2xl font-bold mb-6">
      Todo
    </h1>

    <!-- ADD TASK -->
    <div class="mb-6 max-w-4xl space-y-3">
      <input
          v-model="newTask"
          placeholder="Введите задачу"
          class="w-full border rounded-xl px-4 py-3 text-sm"
      />

      <button
          @click="showTimePicker = true"
          class="w-full border rounded-xl px-4 py-3 text-left text-gray-400"
      >
        {{
          selectedHours || selectedMinutes
              ? `${selectedHours}ч ${selectedMinutes}м`
              : 'Выберите длительность задачи'
        }}
      </button>

      <button
          @click="addTask"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Добавить задачу
      </button>
    </div>

    <!-- TASK LIST -->
    <div class="flex flex-col gap-3 max-w-4xl">

      <div
          v-for="(task, index) in tasks"
          :key="task.id"
          class="w-full p-4 rounded-xl shadow-sm bg-blue-50"
          :class="{ 'bg-red-100': task.finishedAt && !task.done }"
      >
        <div class="flex gap-3 items-start">

          <!-- 🔢 НОМЕР -->
          <span class="text-sm font-semibold text-gray-500 w-6 text-right">
            {{ index + 1 }}.
          </span>

          <input
              type="checkbox"
              v-model="task.done"
              class="mt-1"
          />

          <div class="flex-1">
            <!-- TEXT / EDIT -->
            <span
                v-if="!task.isEditing"
                class="block text-sm whitespace-pre-wrap break-words"
                :class="{ 'line-through text-gray-400': task.done }"
            >
              {{ task.text }}
            </span>

            <input
                v-else
                v-model="task.text"
                @blur="stopEditing(task)"
                @keyup.enter="stopEditing(task)"
                @keyup.esc="stopEditing(task)"
                class="w-full border rounded px-2 py-1 text-sm"
                autofocus
            />
          </div>

          <button
              @click="removeTask(task.id)"
              class="text-red-500 text-sm"
          >
            ✕
          </button>
        </div>

        <!-- META -->
        <div class="mt-2 text-xs text-gray-400">
          Добавлено: {{ formatDate(task.createdAt) }}
        </div>

        <!-- EDIT -->
        <button
            v-if="!task.isEditing"
            @click="startEditing(task)"
            class="text-xs text-blue-600 mt-1 hover:underline"
        >
          редактировать
        </button>

        <!-- TIMER -->
        <div
            v-if="timeLeft(task)"
            class="mt-1 text-xs text-gray-500"
        >
          ⏱ {{ timeLeft(task) }}
        </div>
      </div>

    </div>

  </div>

  <!-- TIME PICKER -->
  <div
      v-if="showTimePicker"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
  >
    <div class="bg-white rounded-xl w-[220px] h-[300px] p-4">

      <div class="flex justify-between mb-2">
        <span class="text-sm font-semibold">Время</span>
        <button
            class="text-blue-600"
            @click="showTimePicker = false"
        >
          Готово
        </button>
      </div>

      <div class="flex justify-between pl-6 pr-5 text-sm text-gray-500">
        <div>Часы</div>
        <div>Минуты</div>
      </div>

      <div class="flex justify-between mt-4">
        <div class="w-1/2 h-[224px] overflow-y-scroll snap-y snap-mandatory">
          <div
              v-for="h in hoursList"
              :key="h"
              class="h-8 flex items-center justify-center snap-center cursor-pointer"
              :class="{
              'text-blue-600 font-bold': h === selectedHours,
              'text-gray-400': h !== selectedHours
            }"
              @click="selectedHours = h"
          >
            {{ h }}
          </div>
        </div>

        <div class="w-1/2 h-[224px] overflow-y-scroll snap-y snap-mandatory">
          <div
              v-for="m in minutesList"
              :key="m"
              class="h-8 flex items-center justify-center snap-center cursor-pointer"
              :class="{
              'text-blue-600 font-bold': m === selectedMinutes,
              'text-gray-400': m !== selectedMinutes
            }"
              @click="selectedMinutes = m"
          >
            {{ m }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
