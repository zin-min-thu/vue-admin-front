require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
import moment from 'moment';
import {routes} from './router';

// Gate permission
import Gate from './Gate';
Vue.prototype.$gate = new Gate(window.user); // Prototype format can access anywhere from vue js

import Swal from 'sweetalert2';
window.Swal = Swal;

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
window.Toast = Toast;

// Pagination
Vue.component('pagination', require('laravel-vue-pagination'));

import VueProgressBar from 'vue-progressbar';

Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    thickness: '5px'
})

Vue.use(VueRouter)

import Form from 'vform';

window.Form = Form;

import {
    HasError,
    AlertError,
    AlertErrors,
    AlertSuccess
  } from 'vform/src/components/bootstrap4'

Vue.component(HasError.name, HasError);
Vue.component(AlertError.name, AlertError);
Vue.component(AlertErrors.name, AlertErrors);
Vue.component(AlertSuccess.name, AlertSuccess);

// const Dashboard = { template: '<div>Dashboard</div>' }
// const Profile = { template: '<div>Profile</div>' }

// import Dashboard from './components/Dashboard.vue';
// import Developer from './components/Developer.vue';
// import Profile from './components/Profile.vue';
// import Users from './components/Users.vue';

// const routes = [
//     { path: '/dashboard', component: Dashboard },
//     { path: '/developer', component: Developer },
//     { path: '/users', component: Users },
//     { path: '/profile', component: Profile }
// ];

const router = new VueRouter({
    mode: 'history',
    routes : routes
})

// Global filter function
Vue.filter('upText', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('newDate', (date) => {
    return moment(date).format("MMM Do YY");
})

// Custom event , component communication
window.Fire = new Vue();

Vue.component('example-component', require('./components/ExampleComponent.vue').default);

// passport
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

// Admin not foud component
Vue.component('admin-notfound', require('./components/AdminNotFound.vue').default);

const app = new Vue({
    el: '#app',
    router:router,
    // render: h => h(App),
});
