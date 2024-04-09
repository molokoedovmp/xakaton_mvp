<template>
  <div id="app">
    <div class="top-container">
      <div class="students-list">
        <h2>Список Учеников</h2>
        <input class="search-input" type="text" v-model="searchQuery" placeholder="Поиск...">
        <ul>
          <li v-for="student in filteredStudents" :key="student.id" class="student-item" @click="openChat(student)">
            {{ student.name }}
          </li>
        </ul>
        <button class="submit-button" v-if="students.length > 5" @click="showAll = !showAll">
          {{ showAll ? 'Показать меньше' : 'Показать все' }}
        </button>
      </div>

      
      <div class="students-list-time">
        <ul>
          <h2>Консультации</h2>
          <li v-for="student in students1" :key="student.name" class="student-item">
            {{ student.name }} - {{ student.time }}
          </li>
        </ul>
     </div>

      <div class="teacher-info">
        <div class="teacher-header">
          <img src="https://www.hse.ru/org/persons/cimage/181002765" class="teacher-avatar" />
          <div class="teacher-name-large">{{ teacher.name }}</div>
        </div>
        <div class="teacher-details">
          <div class="teacher-contacts">
            <form @submit.prevent="saveTeacherInfo" class="form-container">
              <div class="teacher-emails">
                <strong>Почта:</strong> <span>{{ teacher.email }}</span> <br>
                <strong>Доп. почта:</strong>
                <input type="email" v-model="teacher.additionalEmail" class="search-input">
              </div>
              <div class="teacher-communication">
                <strong>Доп. каналы связи:</strong>
                <ul>
                  <li><input type="text" v-model="teacher.contact1" class="search-input"></li>
                  <li><input type="text" v-model="teacher.contact2" class="search-input"></li>
                </ul>
              </div>  
              <button type="submit" class="submit-button">Сохранить изменения</button>
              <button type="submit" class="submit-button">Показать отчеты</button>
            </form>
          </div>
          <div class="teacher-additional-info">
            <strong>Доп. информация:</strong>
            <textarea v-model="teacher.additionalInfo" class="additional-input"></textarea>
          </div>
        </div>
      </div>
    </div>

    <div class="calendar-container">
      <ScheduleComponent :selectedDate="selectedDate" :eventSettings="eventSettings" :currentView="currentView"
        @eventClick="onEventClick">
      </ScheduleComponent>
    </div>

    <div v-if="showChat" class="chat-modal">
      <h2 class="chat-header">Чат с {{ currentStudent.name }}</h2>
      <button @click="closeChat">Закрыть</button>
      <div id="app">
        <Chat />
 </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue';
import { ScheduleComponent, Day, Week, Month } from '@syncfusion/ej2-vue-schedule';
import Chat from './Chat.vue';

components: {
    Chat
 }

const students = ref([
  { id: 1, name: "Авдеев Юрий" },
  { id: 2, name: "Мартынов Александр" },
  { id: 3, name: "Михаил Молокоедов" },
  { id: 4, name: "Иванов Иван" },
  { id: 5, name: "Петров Петр" },
  { id: 6, name: "Сидоров Сидор" },
  
]);
const students1 = ref([
 { name: 'Иванов Иван 04/07/24', time: '10:00 - 10:30' },
 { name: 'Петров Петр 04/08/24', time: '10:00 - 10:30' },
 { name: 'Сидоров Сидор 04/09/24', time: '10:00 - 10:30' },
]);
const teacher = ref({
  name: 'Сахипова Марина Станиславовна',
  email: 'email@example.com',
  additionalEmail: 'additional@example.com',
  contact1: 'Telegram',
  contact2: 'VK',
  additionalInfo: 'ПИШИТЕ МНЕ ПОЖАЛУЙСТА В ТЕЛЕГРАМ!!'
});

const searchQuery = ref("");
const showAll = ref(false);
const showChat = ref(false);
const currentStudent = ref(null);
const message = ref('');

const filteredStudents = computed(() => {
  let filtered = students.value;
  if (searchQuery.value) {
    filtered = filtered.filter(student =>
      student.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  }
  if (!showAll.value) {
    filtered = filtered.slice(0, 5);
  }
  return filtered;
});

function openChat(student) {
  currentStudent.value = student;
  showChat.value = true;
}

function sendMessage() {
  if (message.value.trim() !== '') {
    console.log("Сообщение отправлено:", message.value);
    message.value = '';
  }
}

function closeChat() {
  showChat.value = false;
}

function saveTeacherInfo() {
  console.log("Информация о преподавателе сохранена:", teacher.value);
  alert('Информация о преподавателе сохранена!');
}

const eventSettings = ref({
  dataSource: [
    {
      Id: 1,
      Subject: "Консультация ПИ",
      StartTime: new Date(2024, 3, 7, 10, 0),
      EndTime: new Date(2024, 3, 7, 12, 30)
    },
    {
      Id: 1,
      Subject: "Консультация ПИ",
      StartTime: new Date(2024, 3, 8, 10, 0),
      EndTime: new Date(2024, 3, 8, 12, 30)
    },
    {
      Id: 1,
      Subject: "Консультация ПИ",
      StartTime: new Date(2024, 3, 9, 10, 0),
      EndTime: new Date(2024, 3, 9, 12, 30)
    },
  ]
});

const selectedDate = ref(new Date(2024, 3, 6));
const currentView = ref("Month");
provide('schedule', [Day, Week, Month]);

onMounted(() => {
  const spanElements = document.querySelectorAll('span');
  spanElements.forEach((span) => {
    if (span.textContent.includes('trial version')) {
      const parentDiv = span.closest('div');
      if (parentDiv) {
        parentDiv.remove();
      }
    }
  });
});


const onEventClick = (args) => {
  if (args.event.Id === 1) {
    openConsultation(args.event.Id);
  }
};

const openConsultation = () => {
 const studentsList = students.value
    .slice(0, 3)
    .map((student, index) => ({
      name: student.name,
      time: `10:${15 * index} - 10:${15 * (index + 1)}`
    }));

 studentsList.push({
    name: 'Евдокимов Роман',
    time: '11:00 - 11:15',
    isGrayedOut: true
 });

 consultations.value = studentsList.map(student => ({
    ...student,
    checked: false
 }));
};

</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body {
 font-family: 'Roboto', sans-serif;
 margin: 0;
 font-family: Arial, sans-serif;
}
.chat-header {
  color: white;
  font-size: 24px;
  padding: 10px 20px;
  background-color: #0042c4; /* Зеленый цвет фона */
  border-radius: 10px; /* Радиус скругления углов */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); /* Тень */
  text-align: center; /* Выравнивание текста по центру */
}
.students-list {
 padding: 10px;
 margin-bottom: 20px;
 border-radius: 5px;
 padding-left: 0;
 margin: 0;
}
.students-list ul {
 padding-left: 0;
 margin: 0;
 list-style-type: none;
}
.students-list-time ul li {
 white-space: nowrap; /* Prevents text from wrapping */
 overflow: hidden; /* Hides overflowing text */
 text-overflow: ellipsis; /* Adds an ellipsis for overflowing text */
 max-width: 100%; /* Ensures the list item does not exceed its container's width */
}

.students-list-time{
  display: grid;
  grid-template-columns: fit-content(100%) 2fr; /* Используем fit-content для первой колонки */
  gap: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.student-item {
 list-style: none;
 margin-top: 5px;
 margin-bottom: 5px;
 padding: 10px;
 background-color: #e0e0e0; 
 border-radius: 5px;
 max-width: 170px;
 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Тень для каждого элемента */
 transition: transform 0.3s ease; /* Анимация при наведении */
}
.student-item:hover {
 transform: scale(1.02); /* Увеличение размера при наведении */
 background-color: #d0d0d0; 
 box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Увеличение тени при наведении */
}
.student-item:active {
 transform: scale(0.98); /* Уменьшение размера при нажатии */
}
.chat-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

button:hover {
 background-color: #002da5;
 box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.chat-modal textarea {
  width: 80%;
  height: 50%;
  margin-bottom: 10px;
}

.submit-button {
 background-color: #0042c4;
 border: none;
 color: white;
 padding: 10px 20px;
 text-align: center;
 text-decoration: none;
 display: inline-block;
 font-size: 16px;
 margin-bottom: 10px;
 cursor: pointer;
 border-radius: 25px;
 transition: background-color 0.3s ease;
}

.submit-button:hover {
 background-color: #002da5;
 box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.search-input {
  max-width: 300px;
  padding: 8px;
  border: 1px solid #ccc;
}

.additional-input {
  min-width: 400px;
  max-width: 400px;
  min-height: 40px;
  max-height: 40px;
  padding: 8px;
  border: 1px solid #ccc;
}

.search-button {
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  cursor: pointer;
}

.search-button:hover {
  background-color: #45a049;
}

.form-container form {
  display: flex;
  flex-direction: column;
}

.form-container label {
  margin-bottom: 5px;
}

.form-container input[type='text'],
.form-container input[type='email'] {
  width: 100%;
  padding: 5px;
  border: 2px solid #ccc;
  margin-bottom: 10px;
}

.form-container h2 {
  font-size: 20px;
  margin-bottom: 10px;
}

.form-container div {
  display: flex;
  flex-direction: column;
}

.top-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
}

.teacher-info {
 display: grid;
 grid-template-columns: 1fr 2fr;
 gap: 20px;
 padding: 20px;
 border: 1px solid #ccc;
 border-radius: 10px;
 box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.calendar-container {
  padding: 0px;
}

.teacher-big-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-header {
  display: flex;
  align-items: center;
}

.teacher-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.teacher-name-large {
  margin-left: 10px;
  font-weight: bold;
  font-size: 32px;
}

.teacher-emails,
.teacher-communication,
.additional-info {
  font-size: 24px;
}

.teacher-details {
  display: flex;
  flex-direction: row;
}

.teacher-contacts,
.teacher-additional-info {
  flex: 1;
}

.consultation-item {
  list-style: none;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: lightblue;
  border-radius: 5px;
  font-weight: bold;
}

.consultation-item.grayed-out {
  background-color: darkgray;
}

.consultation-checkbox {
  margin-right: 10px;
}

.teacher-avatar {
 transition: transform 0.3s ease;
}

.teacher-avatar:hover {
 transform: scale(1.1);
}


</style>