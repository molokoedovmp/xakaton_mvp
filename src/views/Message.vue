<!-- Message.vue -->
<template>
    <div :class="messageClass">
       <p>{{ message.text }}</p>
    </div>
</template>
   
<script>
   export default {
    props: {
       message: Object,
       isMine: Boolean
    },
    computed: {
       messageClass() {
         return this.isMine ? 'message mine' : 'message';
       }
    }
   }
</script>
   
<style scoped>
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
</style>