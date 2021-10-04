import Dashboard from './components/Dashboard.vue';
import Developer from './components/Developer.vue';
import Profile from './components/Profile.vue';
import Users from './components/Users.vue';
import AdminNotFound from './components/AdminNotFound.vue'

export const routes = [
    {
        name: 'dashboard',
        path: '/dashboard',
        component: Dashboard
    },
    {
        name: 'developer',
        path: '/developer',
        component: Developer
    },
    {
        name: 'users',
        path: '/users',
        component: Users
    },
    {
        name: 'profile',
        path: '/profile',
        component: Profile
    },
    {
        name: 'adminNotFound',
        path: '*',
        component: AdminNotFound
    }
];