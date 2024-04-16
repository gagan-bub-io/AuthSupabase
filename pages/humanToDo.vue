<template>
    <div class="flex justify-end items-center p-2">
     <div>
       <FormKit @click="signOut" type="submit" label="Signout" />
     </div>
   </div>

     <h1 class="text-3xl font-bold mb-4 ml-16 mt-24">Todo List</h1>
     <!-- User Add ToDo -->
     <form @submit.prevent="Add" class="mb-4">
       <div class="flex items-center ml-6">
         <input type="text" id="todoInput" placeholder="enter the Task" v-model="todo" class="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500" />
         <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">Add</button>
       </div>
     </form>

     <span class=" font-bold mt-2 ml-16">Want AI to create ToDo<button @click="navigateTo('/aiToDo')" class="ml-2 text-blue-500">AI ToDo</button></span>

     <!-- Display todo content -->
     <ul class="w-full max-w-2xl float-right focus-within font-medium mr-56" style="position: fixed; right: 0; top: 200px;">
  <h1 class="text-4xl font-bold p-9">Your Tasks</h1>
  <div class="flex justify-between border-b border-gray-300">
    <h1 class="text-lg font-semibold text-gray-700 px-4 py-2">Task</h1>
    <h1 class="text-lg font-semibold text-gray-700 px-4 py-2">Action</h1>
  </div>
  <li v-for="(todo, index) in todos" :key="index"
      class="flex items-center justify-between border-b border-gray-300">
      <span class="flex-1 overflow-hidden break-words text-gray-800 px-4 py-2">{{ todo.Task }}</span>
      <button @click="deleteTodo(todo, index)" class="text-gray-500 hover:text-red-700 px-4 py-2">Delete</button>
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