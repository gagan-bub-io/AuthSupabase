<template>
    <div class="flex justify-end items-center p-2">
     <div>
       <FormKit @click="signOut" type="submit" label="Signout" />
     </div>
   </div>

     <h1 class="text-3xl font-bold mb-4">Todo List</h1>
     <!-- User Add ToDo -->
     <form @submit.prevent="Add" class="mb-4">
       <div class="flex items-center">
         <input type="text" id="todoInput" placeholder="enter the Task" v-model="todo" class="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500" />
         <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">Add</button>
       </div>
     </form>

     <span class=" font-bold mt-2">Want AI to create ToDo<button @click="navigateTo('/')" class="ml-2 text-blue-500">AI ToDo</button></span>

     <!-- To showData -->
     <ul class="w-full max-w-md ml-auto mr-96">
  <h1 class="text-4xl font-bold">Your Task's</h1>
  <li v-for="(todo, index) in todos" :key="index" class="flex items-center justify-between border border-gray-300 rounded p-2 mb-2">
    <span class="w-full overflow-hidden break-words mr-4">{{ todo.Task }}</span> <!-- Display todo content -->
    <button @click="deleteTodo(todo, index)" class=" hover:text-red-700 cursor-pointer">x</button>
  </li>
</ul>

 
     
 </template>
 
 <script setup>
 import { ref, onMounted } from 'vue';
 const user = useSupabaseUser();
 const supabase = useSupabaseClient();
 
 const todos = ref([]);
 const todo = ref('');
 const flag = ref(true);
 
 
 
 const Add = async () => {
   if (todo.value.trim() !== '') {
 
     const { data, error } = await supabase
   .from('ToDoTable')
   .insert([ { user_id: user.value.id, Task: todo.value },
   ])
   .select();
   todos.value = data || [];
 
     //todos.value.push(todo.value.trim());
      todo.value = ''; 
      showAllTasks()
   }
 };
 
 
 const showAllTasks=async()=>{
   let { data, error } = await supabase
   .from("ToDoTable")
   .select("*")
   .eq("user_id", user.value.id);
   if (error) {
     console.error('Error fetching todos:', error.message);
   } else {
     console.log('data', data);
     todos.value = data || [];
   }
 };
 await showAllTasks()
 onMounted(showAllTasks);
 
 
 const deleteTodo = async (todo, index) => {
   console.log('todo', todo);
 
 
   const { data, error } = await supabase
   .from('ToDoTable')
   .delete()
   .eq('id', todo.id)
   console.log('data', data);
   todos.value.splice(index, 1);
 };
 
 async function signOut() {
   const { error } = await supabase.auth.signOut();
   if (!error) {
     navigateTo("/login");
   }
 }
 definePageMeta({
   middleware: ["auth"],
 });
 </script>