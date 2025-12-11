import { createApp } from 'vue';
import App from './App.vue';
import { router } from './routes/router';
import { Ckeditor } from '@ckeditor/ckeditor5-vue';
import initialData from './assets/data/data.json';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Seed users from data.json into localStorage if not present
try {
    const existing = localStorage.getItem('users');
    if (!existing) {
        const seeded = (initialData.users || []).map((u) => ({
            ...u,
            // default password for seeded users (can be changed via register flow)
            password: '123456'
        }));
        localStorage.setItem('users', JSON.stringify(seeded));
    }
} catch (e) {
    // localStorage might be unavailable in some environments; ignore silently
    console.warn('Could not seed users from data.json', e);
}

const app = createApp(App);

app.use(router);
app.use(Ckeditor);

app.mount('#app');

