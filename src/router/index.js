import { createRouter, createWebHistory } from 'vue-router'

// импортируем страницы
import TodoPage from '../pages/TodoPage.vue'
import NotesPage from '../pages/NotesPage.vue'
import CalendarPage from '../pages/CalendarPage.vue'
import HabitsPage from '../pages/HabitsPage.vue'

// список маршрутов (страниц)
const routes = [
    {
        path: '/',           // адрес в браузере
        component: TodoPage  // какую страницу показать
    },
    {
        path: '/notes',
        component: NotesPage
    },
    {
        path: '/calendar',
        component: CalendarPage
    },
    {
        path: '/habit',
        component: HabitsPage
    }
]

// создаём router
const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
