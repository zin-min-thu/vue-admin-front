import Dashboard from './components/Dashboard.vue';
import Developer from './components/Developer.vue';
import Profile from './components/Profile.vue';
import Users from './components/Users.vue';

export const routes = [
    {
        name: 'dashboard',
        path: '/',
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
    }
];