<template>
   <div class="flex justify-end items-center p-2">
    <div>
      <FormKit @click="signOut" type="submit" label="Signout" />
    </div>
  </div>
  <div class="flex flex-col items-center justify-center min-h-screen">
    <h1 class="text-3xl font-bold mb-4">Todo List</h1>
    <form @submit.prevent="Add" class="mb-4">
      <div class="flex items-center">
        <input type="text" id="todoInput" v-model="todo" class="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500" />
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">Add</button>
      </div>
    </form>
    <ul class="w-full max-w-md">
      <li v-for="(todo, index) in todos" :key="index" class="flex items-center justify-between border border-gray-300 rounded p-2 mb-2">
        <span>{{ todo.Task }}</span> <!-- Display todo content -->
        <button @click="deleteTodo(todo, index)" class="text-red-500 hover:text-red-700">x</button>
      </li>
    </ul>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const user = useSupabaseUser();
const supabase = useSupabaseClient();

const todos = ref([]);
const todo = ref('');

const Add = async () => {
  if (todo.value.trim() !== '') {

    const { data, error } = await supabase
  .from('ToDoTable')
  .insert([ { user_id: user.value.id, Task: todo.value },
  ])
  .select();
  todos.value = data || [];

    //   todos.value.push(todo.value.trim());
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