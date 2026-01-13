<script setup>
import { ref, computed } from 'vue'
import { useNotifications } from '@/composables/useNotifications'
import { useRoute } from 'vue-router'

/* =====================
   GLOBAL
===================== */
const { reminders, now } = useNotifications()
const route = useRoute()


/* =====================
   STATE
===================== */
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const selectedDay = ref(null)

const newReminderText = ref('')
const reminderTime = ref('12:00')

/* =====================
   CALENDAR DATA
===================== */
const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

const monthName = computed(() =>
    new Date(currentYear.value, currentMonth.value)
        .toLocaleString('ru-RU', { month: 'long', year: 'numeric' })
)

const daysInMonth = computed(() =>
    new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
)

const firstDayOffset = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value, 1).getDay()
  return d === 0 ? 6 : d - 1
})
if (route.query.year) {
  currentYear.value = Number(route.query.year)
  currentMonth.value = Number(route.query.month)
  selectedDay.value = Number(route.query.day)
}
/* =====================
   HELPERS
===================== */
function formatClock(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isToday(day) {
  const t = new Date()
  return (
      day === t.getDate() &&
      currentMonth.value === t.getMonth() &&
      currentYear.value === t.getFullYear()
  )
}

function remindersForDay(day) {
  return reminders.value.filter(r => {
    const d = new Date(r.datetime)
    return (
        d.getDate() === day &&
        d.getMonth() === currentMonth.value &&
        d.getFullYear() === currentYear.value
    )
  })
}

/* =====================
   NAVIGATION
===================== */
function prevMonth() {
  currentMonth.value === 0
      ? (currentMonth.value = 11, currentYear.value--)
      : currentMonth.value--
}

function nextMonth() {
  currentMonth.value === 11
      ? (currentMonth.value = 0, currentYear.value++)
      : currentMonth.value++
}

/* =====================
   CRUD
===================== */
function addReminder() {
  if (!newReminderText.value || selectedDay.value === null) return

  const [h, m] = reminderTime.value.split(':')

  const date = new Date(
      currentYear.value,
      currentMonth.value,
      selectedDay.value,
      Number(h),
      Number(m),
      0
  )

  if (date.getTime() <= Date.now()) {
    alert('Выберите время в будущем')
    return
  }

  reminders.value.push({
    id: Date.now(),
    text: newReminderText.value,
    datetime: date.getTime(),
    notified: false,
    isEditing: false,
    editText: '',
    editTime: '',
  })

  newReminderText.value = ''
}

function removeReminder(id) {
  reminders.value = reminders.value.filter(r => r.id !== id)
}

function startEdit(r) {
  r.isEditing = true
  r.editText = r.text
  r.editTime = formatTime(r.datetime)
}

function saveEdit(r) {
  const [h, m] = r.editTime.split(':')
  const d = new Date(r.datetime)

  d.setHours(Number(h))
  d.setMinutes(Number(m))

  r.text = r.editText
  r.datetime = d.getTime()
  r.notified = false
  r.isEditing = false
}

function cancelEdit(r) {
  r.isEditing = false
}
</script>

<template>
  <div class="w-full">

    <!-- TOP BAR -->
    <div class="flex justify-between items-center mb-4">
      <div class="flex gap-4 items-center">
        <button @click="prevMonth">◀</button>
        <div class="font-bold capitalize text-lg">{{ monthName }}</div>
        <button @click="nextMonth">▶</button>
      </div>

      <div class="text-2xl font-bold text-gray-700">
        {{ formatClock(now) }}
      </div>
    </div>

    <!-- WEEK -->
    <div class="grid grid-cols-7 text-center text-gray-500 mb-2">
      <div v-for="d in weekDays" :key="d">{{ d }}</div>
    </div>

    <!-- GRID -->
    <div class="grid grid-cols-7 gap-2">
      <div v-for="n in firstDayOffset" :key="n"></div>

      <div
          v-for="day in daysInMonth"
          :key="day"
          @click="selectedDay = day"
          class="border rounded-xl p-2 h-48 flex flex-col"
          :class="{ 'border-blue-600': isToday(day) }"
      >
        <div class="font-semibold">{{ day }}</div>

        <div class="flex-1 overflow-y-auto text-xs space-y-1">
          <div
              v-for="r in remindersForDay(day)"
              :key="r.id"
              class="bg-blue-200 rounded px-2 py-1"
          >
            <!-- VIEW -->
            <div v-if="!r.isEditing">
              <div class="font-semibold">{{ formatTime(r.datetime) }}</div>
              <div class="break-words">{{ r.text }}</div>

              <div class="flex flex-col text-[10px] mt-1">
                <button @click.stop="startEdit(r)" class="text-blue-700">
                  редактировать
                </button>
                <button @click.stop="removeReminder(r.id)" class="text-red-600">
                  удалить
                </button>
              </div>
            </div>

            <!-- EDIT -->
            <div v-else class="space-y-1">
              <input v-model="r.editText" class="w-full border px-1 text-xs" />
              <input type="time" v-model="r.editTime" class="w-full border px-1 text-xs" />
              <div class="flex flex-col text-[10px]">
                <button @click.stop="saveEdit(r)" class="text-green-700">
                  сохранить
                </button>
                <button @click.stop="cancelEdit(r)" class="text-gray-600">
                  отмена
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ADD -->
        <div v-if="selectedDay === day" class="space-y-1">
          <input
              v-model="newReminderText"
              placeholder="Напоминание"
              class="w-full border px-1 text-xs"
          />
          <input
              type="time"
              v-model="reminderTime"
              class="w-full border px-1 text-xs"
          />
          <button
              @click.stop="addReminder"
              class="bg-blue-600 text-white w-full text-xs py-1 rounded"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
