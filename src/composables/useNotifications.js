import { ref, watch } from 'vue'

/* ========= GLOBAL STATE ========= */
const reminders = ref([])
const now = ref(Date.now())
const activeAlert = ref(null)

let timerStarted = false

export function useNotifications() {
    if (!timerStarted) {
        init()
        timerStarted = true
    }

    return {
        reminders,
        now,
        activeAlert,
    }
}

/* ========= INIT ========= */
function init() {
    const saved = localStorage.getItem('reminders')
    if (saved) {
        reminders.value = JSON.parse(saved)
    }

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
    }

    setInterval(() => {
        now.value = Date.now()
        checkNotifications()
    }, 1000)

    watch(
        reminders,
        v => localStorage.setItem('reminders', JSON.stringify(v)),
        { deep: true }
    )
}

/* ========= NOTIFICATIONS ========= */
function checkNotifications() {
    reminders.value.forEach(r => {
        if (!r.notified && r.datetime <= now.value) {
            showAlert(r)
            r.notified = true
        }
    })
}

function showAlert(reminder) {
    if (document.visibilityState === 'visible') {
        activeAlert.value = reminder
        setTimeout(() => {
            if (activeAlert.value?.id === reminder.id) {
                activeAlert.value = null
            }
        }, 8000)
    } else if (Notification.permission === 'granted') {
        new Notification('Напоминание', {
            body: reminder.text,
        })
    }
}
