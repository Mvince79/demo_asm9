// stores/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('currentUser')) || null);
    const token = ref(localStorage.getItem('auth_token') || null);
    const role = ref(user.value?.role || null);
    const isAuthenticated = ref(!!user.value);

    const login = (userData, newToken) => {
        user.value = userData;
        token.value = newToken;
        role.value = userData.role;
        isAuthenticated.value = true;

        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user_role', userData.role);
    };

    const logout = () => {
        user.value = null;
        token.value = null;
        role.value = null;
        isAuthenticated.value = false;

        localStorage.removeItem('currentUser');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
    };

    return { user, token, role, isAuthenticated, login, logout };
});
