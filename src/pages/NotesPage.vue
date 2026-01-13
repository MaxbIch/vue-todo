<script setup>
import { ref, watch, onMounted } from 'vue'

/* =====================
   STATE
===================== */
const newNote = ref('')
const notes = ref([])

/* =====================
   LOAD FROM STORAGE
===================== */
onMounted(() => {
  const saved = localStorage.getItem('notes')
  if (saved) {
    notes.value = JSON.parse(saved)
  }
})

/* =====================
   SAVE TO STORAGE
===================== */
watch(
    notes,
    (v) => {
      localStorage.setItem('notes', JSON.stringify(v))
    },
    { deep: true }
)

/* =====================
   ADD NOTE
===================== */
function addNote() {
  if (!newNote.value.trim()) return

  notes.value.unshift({
    id: Date.now(),
    text: newNote.value,
    createdAt: Date.now(),
    isEditing: false,
  })

  newNote.value = ''
}

/* =====================
   EDIT
===================== */
function startEditing(note) {
  note.isEditing = true
}

function stopEditing(note) {
  note.isEditing = false
}

/* =====================
   REMOVE
===================== */
function removeNote(id) {
  notes.value = notes.value.filter(n => n.id !== id)
}

/* =====================
   FORMAT DATE
===================== */
function formatDate(ts) {
  return new Date(ts).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="w-full">

    <!-- ADD NOTE -->
    <div class="mb-6 max-w-3xl">
      <textarea
          v-model="newNote"
          placeholder="Новая заметка"
          class="
          w-full
          h-28
          border
          rounded-xl
          p-4
          resize-none
          text-sm
          whitespace-pre-wrap
          break-words
        "
      ></textarea>

      <button
          @click="addNote"
          class="mt-2 bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500"
      >
        Добавить заметку
      </button>
    </div>

    <!-- NOTES (MASONRY LAYOUT) -->
    <div
        class="
        columns-1
        sm:columns-2
        md:columns-3
        lg:columns-4
        gap-4
      "
    >
      <div
          v-for="note in notes"
          :key="note.id"
          class="
          bg-yellow-100
          rounded-xl
          p-4
          shadow-sm
          mb-4
          break-inside-avoid
        "
      >
        <!-- VIEW MODE -->
        <div v-if="!note.isEditing">
          <div
              class="
              text-gray-800
              text-sm
              whitespace-pre-wrap
              break-words
            "
          >
            {{ note.text }}
          </div>

          <div class="text-xs text-gray-500 mt-3">
            {{ formatDate(note.createdAt) }}
          </div>

          <div class="flex gap-4 mt-3 text-sm">
            <button
                class="text-blue-600 hover:underline"
                @click="startEditing(note)"
            >
              редактировать
            </button>

            <button
                class="text-red-500 hover:underline"
                @click="removeNote(note.id)"
            >
              удалить
            </button>
          </div>
        </div>

        <!-- EDIT MODE -->
        <div v-else>
          <textarea
              v-model="note.text"
              class="
              w-full
              min-h-[6rem]
              border
              rounded-lg
              p-2
              resize-none
              text-sm
              whitespace-pre-wrap
              break-words
            "
              @blur="stopEditing(note)"
              autofocus
          ></textarea>

          <div class="text-xs text-gray-400 mt-1">
            клик вне поля — сохранить
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
