<template>
  <div class="container">
    <div class="upper-section">
      <div class="left-panel">
        <input type="text" class="input-box" placeholder="ФИО преподавателя" v-model="teacherName"
          @keyup.enter="fetchTeacherData" />
        <div v-if="teacherData.length > 0" class="teachers-list">
          <div v-for="(postPerson, index) in teacherData" :key="index" class="post-person-container"
            @click="selectTeacher(postPerson)">
            <div class="post-person">
              <img :src="postPerson.image" class="person-avatar" />
              <div class="person-name">{{ postPerson.name }}</div>
            </div>
            <div v-if="index < teacherData.length - 1" class="separator"></div>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div v-if="selectedTeacher" class="teacher-info">
          <div class="teacher-header">
            <img :src="selectedTeacher.image" class="teacher-avatar" />
            <div class="teacher-name-large">{{ selectedTeacher.name }}</div>
          </div>
          <div class="teacher-emails">
            <strong>Почта:</strong> <span>{{ selectedTeacher.email }}</span> <br>
            <strong>Доп. почта:</strong> <span>{{ selectedTeacher.additionalEmail }}</span>
          </div>
          <div class="teacher-communication">
            <strong>Доп. каналы связи:</strong>
            <ul>
              <li>{{ selectedTeacher.contact1 }} (основной)</li>
              <li>{{ selectedTeacher.contact2 }}</li>
            </ul>
          </div>
          <div class="additional-info">
            <strong>Доп. информация:</strong>
            <div>{{ selectedTeacher.additionalInfo }}</div>
          </div>
          <div class="teacher-buttons">
            <button class="button" @click="register">Записаться</button>
            <button class="button" @click="sendMessage">Написать сообщение</button>
          </div>
        </div>
      </div>
    </div>
    <div class="lower-section">
      <div class="select-project">
        <select class="select-box" v-model="selectedOption">
          <option value="project">Проект</option>
          <option value="extracurricular">Внеучебка</option>
        </select>
        <template v-if="selectedOption === 'project'">
          <div class="course-theme">{{ courseThemeDisplay }}</div>
          <div class="hours-info">
            <div class="hours">{{ hours }} часов</div>
            <div class="remaining">(осталось)</div>
          </div>
        </template>
      </div>
      <div class="calendar-container">
        <ScheduleComponent :selectedDate="selectedDate" :eventSettings="eventSettings" :currentView="currentView"
          :readonly="true">
        </ScheduleComponent>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, provide, onMounted } from 'vue';
import axios from 'axios';
import { ScheduleComponent, Day, Week, Month } from '@syncfusion/ej2-vue-schedule';

const teacherName = ref('');
const teacherData = ref([]);
const selectedOption = ref('project');
const courseTheme = ref('Тема курсовой работы длинный текст для заполнения и проверки разметки');
const hours = ref(5);

const parseTeacherDataFromHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const section = doc.querySelector('.persons__section.js-persons-section.current');

  if (!section) {
    console.log('Секция не найдена.');
    return [];
  }

  const persons = section.querySelectorAll('.post.person');
  const personsData = Array.from(persons).map((person) => {
    const idLink = person.querySelector('.link.link_dark.large.b');
    const idHref = idLink ? idLink.getAttribute('href') : '';
    const idMatch = idHref.match(/\/(org\/persons|staff)\/([^/]+)/);
    const type = idMatch ? idMatch[1] : undefined;
    const idOrAlias = idMatch ? idMatch[2] : undefined;
    const name = idLink ? idLink.textContent.trim() : '';
    const fullName = name === "Сахипова Марина Станиславовна" ? `${name} (науч. рук.)` : name;


    let image;
    if (type === 'org/persons') {
      image = idOrAlias ? `https://www.hse.ru/${type}/cimage/${idOrAlias}` : '';
    } else if (type === 'staff') {
      const styleAttr = person.querySelector('.g-pic.person-avatar-small2')?.getAttribute('style');
      const imageUrlMatch = styleAttr ? styleAttr.match(/url\(([^)]+)\)/) : null;
      const imageUrl = imageUrlMatch ? imageUrlMatch[1] : '';
      const imageIdMatch = imageUrl.match(/org\/persons\/cimage\/(\d+)/);
      const imageId = imageIdMatch ? imageIdMatch[1] : '';
      image = imageId ? `https://www.hse.ru/org/persons/cimage/${imageId}` : '';
    }

    return { id: idOrAlias, name: fullName, image };
  });
  return personsData;
};


const fetchTeacherData = async () => {
  try {
    const response = await axios.get('/api/parse-teacher', {
      params: { search_person: teacherName.value }
    });
    const htmlContent = response.data;
    teacherData.value = parseTeacherDataFromHtml(htmlContent);
  } catch (error) {
    console.error('Error fetching teacher data:', error);
  }
};

const courseThemeDisplay = computed(() => {
  return courseTheme.value.length > 63 ? courseTheme.value.substring(0, 60) + '...' : courseTheme.value;
});


const selectedTeacher = ref(null);

const selectTeacher = (teacher) => {
  if (teacher.name === "Сахипова Марина Станиславовна (науч. рук.)") {
    selectedTeacher.value = {
      ...teacher,
      email: "email@example.com",
      additionalEmail: "additional@example.com",
      contact1: "Telegram",
      contact2: "Vk",
      additionalInfo: "ПИШИТЕ МНЕ ПОЖАЛУЙСТА В ТЕЛЕГРАМ!!"
    };
    teacherData.value = [];
    teacherName.value = '';
  } else {
    selectedTeacher.value = null;
  }
};


const register = () => {
  alert("Функция регистрации ещё не реализована.");
};

const sendMessage = () => {
  alert("Функция отправки сообщения ещё не реализована.");
}

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

const eventSettings = computed(() => {
  if (selectedOption.value === 'extracurricular') {
    return { dataSource: [] };
  }
  return {
    dataSource: [
      {
        Id: 1,
        Subject: "Консультация ПИ",
        StartTime: new Date(2024, 3, 6, 10, 0),
        EndTime: new Date(2024, 3, 6, 12, 30),
        IsReadonly: true
      }
    ]
  };
});


const selectedDate = ref(new Date(2024, 3, 6));
const currentView = ref("Month");
provide('schedule', [Day, Week, Month]);
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 98vh;
  width: 98vw;
  border: 2px solid black;
}

.upper-section {
  display: flex;
  flex: 1;
  align-items: flex-start;
  overflow: hidden;
}

.input-box {
  font-size: 24px;
  margin: 7px;
  padding: 5px;
  width: 97%;
  border-radius: 20px;
}

.left-panel {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: left;
}

.right-panel {
  width: 50%;
  height: 100%;
  padding: 10px;
}


.teachers-list {
  display: flex;
  flex-direction: column;
  padding: 5px;
  width: 100%;
}

.post-person-container {
  display: flex;
  flex-direction: column;
}

.post-person {
  display: flex;
  align-items: center;
  margin: 10px;
  font-size: 20px;
}

.person-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
  object-fit: cover;
}

.person-name {
  font-weight: bold;
  flex-grow: 1;
}

.separator {
  height: 2px;
  background-color: #e0e0e0;
  width: 100%;
  margin-top: 2px;
  margin-bottom: 2px;
}

.lower-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 2px solid black;
  background-color: lightgray;
  height: 50%;
  /* Задаем высоту нижней секции */
}

.select-project {
  display: flex;
  align-items: center;
  margin-left: 5px;
  min-height: 50px;
}

.select-box {
  padding: 8px;
  border-radius: 4px;
}

.course-theme {
  margin-left: 10px;
  font-size: 24px;
  white-space: nowrap;
  overflow: hidden;
  font-weight: bold;
  text-overflow: ellipsis;
}

.hours-info {
  margin-left: 80px;
  font-size: 20px;
  display: flex;
  align-items: baseline;
  flex-direction: column;
}

.hours {
  font-weight: bold;
}

.remaining {
  font-size: smaller;
}

.calendar-container {
  margin-top: 20px;
  flex-grow: 1;
}

.vertical-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  height: 100%;
}

.horizontal-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: stretch;
  width: 100%;
}

.teacher-info {
  font-size: 18px;
  display: flex;
  flex-direction: column;
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
  margin-top: 10px;
  font-size: 24px;
}

ul {
  padding-left: 20px;
  list-style-type: disc;
}

.teacher-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.button {
  padding: 10px;
  border: none;
  width: 150px;
  background-color: #0042c4;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.button:hover {
  background-color: #0056b3;
}

.project-date {
  margin-left: 10px;
  font-size: 18px;
  color: #333;
}
</style>