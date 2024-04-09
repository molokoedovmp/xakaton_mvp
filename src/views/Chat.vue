<!-- ChatAndMessage.vue -->
<template>
    <div class="chat-container">
       <div class="messages-container">
         <div v-for="(message, index) in messages" :key="index" :class="message.sender === 'me' ? 'message mine' : 'message'">
           <p>{{ message.text }}</p>
         </div>
         <div>
            <input v-model="newMessage" placeholder="Введите сообщение...">
            <button @click="sendMessage">Отправить</button>
        </div>
       </div>
    </div>
   </template>
   
   <script>
   export default {
    data() {
       return {
         messages: [
           { text: 'Здравствуйте! Я хочу чтобы вы проверили мой отчет', sender: 'other' },
           { text: 'Здравствуйте! Скину правки через 2 дня.', sender: 'me' }
         ],
         newMessage: ''
       };
    },
    methods: {
       sendMessage() {
         if (this.newMessage.trim() === '') return;
         this.messages.push({ text: this.newMessage, sender: 'me' });
         this.newMessage = '';
       }
    }
   }
   </script>
   
   <style scoped>
   .chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
   }
   
   .messages-container {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
    box-sizing: border-box;
   }
   
   .message {
    max-width: 60%;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 7px;
    background-color: #e5e5ea;
   }
   
   .message.mine {
    margin-left: auto;
    background-color: #007bff;
    color: white;
   }
   
   .input-container {
    display: flex;
    padding: 10px;
    background-color: #f0f0f0;
   }
   
   .input-container input {
    flex-grow: 1;
    margin-right: 10px;
    padding: 10px;
    border-radius: 3px;
    border: 1px solid #ccc;
   }
   input {
    border-radius: 10px; /* Закругленные края */
    border: 2px solid #007bff; /* Синий бортик */
    padding: 5px; /* Добавляем внутренний отступ для удобства ввода */
    }
   .input-container button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
   }
   button {
    background-color: #0042c4;
    border: none;
    color: white;
    padding: 10px 20px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 10px;
    cursor: pointer;
    border-radius: 25px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    transition: background-color 0.3s ease;
    }
   </style>
   