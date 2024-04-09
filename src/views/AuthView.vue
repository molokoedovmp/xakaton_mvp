<template>
    <div class="login-container">
        <div class="login-form">
            <h2>Авторизация</h2>
            <input type="email" placeholder="Почта" v-model="email" />
            <input type="password" placeholder="Пароль" v-model="password" />
            <button @click="login">Войти</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

function login() {
    if (email.value === 'student@edu.hse.ru' && password.value === '123321') {
        router.push({ name: 'student' });
    } else if (email.value === 'teacher@edu.hse.ru' && password.value === '123321') {
        router.push({ name: 'teacher' });
    } else {
        alert('Неправильный адрес электронной почты или пароль');
    }
}

</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-form {
    width: 300px;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    text-align: center;
}

.login-form input {
    width: 280px;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.login-form button {
    width: 50%;
    padding: 10px;
    background-color: #87CEEB;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
}

.login-form button:hover {
    background-color: #0042c4;
}
</style>