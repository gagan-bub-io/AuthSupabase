<template>
    <div class="flex justify-end items-center p-2">
        <div>
            <FormKit @click="signOut" type="submit" label="Signout" />
        </div>
    </div>

    <h1 class="text-3xl font-bold mb-4 ml-16 mt-24">AI will Generat Todo List</h1>

    <div class="flex items-center ml-16">
        <input type="text" id="todoInput" v-model="promptText" placeholder="enter your prompt......"
            class="px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500" />
        <button @click="generateContent" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">Generate</button>
    </div>
    
    <div class="flex flex-col mr-96 p-5">
        <div v-if="loading" class="flex-shrink-0 w-full max-w-[50%] overflow-hidden">AI Loding......... </div>
        <div v-if="generatedText" class="flex-shrink-0 w-full max-w-[50%] overflow-hidden">
            {{ generatedText }}<br>
            <button @click="generateContent" class="bg-blue-500 text-white px-4 py-2 rounded-r-md mt-4 ml-28">ReGenerate</button>
            <button @click="Add" class="bg-blue-500 text-white px-4 py-2 rounded-r-md ml-1">Add</button>
        </div>
        <span v-if="generatedText" class=" font-bold mt-4 ml-16">Want to enter manually <button @click="navigateTo('/humanToDo')" class="ml-2 text-blue-500">Manual ToDo</button></span>
    </div>



    <!-- Display todo content -->
    <ul class="w-full max-w-2xl float-right focus-within font-medium mr-56" style="position: fixed; right: 0; top: 200px;">
  <h1 class="text-4xl font-bold p-9">Your Tasks</h1>
  <div class="flex justify-between border-b border-gray-950">
    <h1 class="text-lg  text-gray-700 px-4 py-2">Task</h1>
    <h1 class="text-lg  text-gray-700 px-4 py-2">Action</h1>
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
import { GoogleGenerativeAI } from "@google/generative-ai";
const config = useRuntimeConfig();
const genAI = new GoogleGenerativeAI(config.public.apiKey);
const generatedText = ref(null);
const promptText = ref("");

const user = useSupabaseUser();
const supabase = useSupabaseClient();

const loading = ref(false)

const todos = ref([]);
const todo = ref('');

//-----------------AI TODO----------------------
async function generateContent() {
   try{ loading.value=true
    generatedText.value=null
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // const result = await model.generateContent(promptText.value);
    // const response = await result.response;
    // const text = await response.text();
    
    //...
const result = await model.generateContentStream([promptText.value]);

let text = '';
for await (const chunk of result.stream) {
  const chunkText = chunk.text();
  console.log(chunkText);
  text += chunkText;
}
//...

    console.log('text', text);
    console.log('loading.value1', loading.value);
    loading.value=false
    console.log('loading.value2', loading.value);
    generatedText.value = text;
}
catch(error){ console.error('Error fetching data:', error); }
}

const Add = async () => {
    todo.value = generatedText.value
    if (todo.value.trim() !== '') {

        const { data, error } = await supabase
            .from('ToDoTable')
            .insert([{ user_id: user.value.id, Task: todo.value },
            ])
            .select();
        todos.value = data || [];
        //todos.value.push(todo.value.trim());
        todo.value = '';
        showAllTasks()
    }
};


const showAllTasks = async () => {
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